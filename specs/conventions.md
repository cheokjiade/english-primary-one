# Engine conventions & contract

The deep reference for `assets/worksheet.js` (the global `WS`) and `assets/worksheet.css`. Every unit
shares these two files unchanged and supplies only its own topic `<style>` and question generators.
For the *how-to-build* workflow, read [`../AGENTS.md`](../AGENTS.md) first; this file is the *why*.

**If you change a shared contract here, update `assets/worksheet.*` and re-run the verifier — it
exercises every unit against these rules.**

---

## 1. Loads from `file://` — classic includes only

```html
<link rel="stylesheet" href="assets/worksheet.css">
<script src="assets/worksheet.js"></script>   <!-- NOT type="module" -->
```

Deliberate: classic `<script src>`/`<link>` work when the page is opened straight from disk
(double-click, `file://`). **ES modules / `import` / `fetch()` of local files do _not_ work from
`file://`** (blocked by CORS), so the engine stays a classic global-`WS` script and all assets
(Twemoji SVGs) are local. A page + the `assets/` folder is the unit of deployment — offline and on
GitHub Pages alike.

---

## 2. Determinism — the seeded PRNG

All randomness comes from a string **seed**, so the same seed + settings always produce a
byte-for-byte identical worksheet.

```javascript
const rng = WS.makeRng(cfg.seed);                                   // xmur3(seed) -> mulberry32 stream
const { randInt, pick, shuffle, distinct, balanced } = WS.helpers(rng);
```

`WS.helpers(rng)` returns inclusive `randInt(lo,hi)`, `pick(array)`, Fisher–Yates `shuffle(array)`,
`distinct(k,lo,hi)` (k distinct ints), and `balanced(list)`.

**`balanced(list)` — variant coverage.** Returns `i => variant`, a shuffled round-robin indexed by the
1-based question number, so a section's sub-variants are *spread* across it rather than chosen by an
independent per-question coin-flip (which can omit some for a given seed). Use it whenever a section
renders visually-distinct variants (e.g. two phrasings of a prompt, "circle" vs "tick"). Every
variant appears once the section's count reaches the number of variants.

> **Gotcha:** the RNG is consumed in a fixed order, so *inserting a new `rng()` call anywhere shifts
> every later draw* — the same seed then renders a different sheet. Acceptable (seeds aren't promised
> stable across code versions) but you can't reorder generator calls without changing worksheets.

**Fresh visit → child-friendly seed.** With no `?seed=`, the page picks a random 4–5 letter word
(`WS.randomSeed()`, e.g. `tiger`, `duck`) so each open differs and the seed is easy to read/share;
`WS.wirePanel` then writes it into the address bar with `history.replaceState`, so the sheet stays
reproducible/bookmarkable on refresh.

**Distinct questions is a hard contract.** The verifier fails any section that renders the same
question twice across seeds. Draw content **without replacement** (a shuffled pool indexed by the
question number, or a `used` `Set`), and keep each section's `max`/dup-count **≤ its pool size**. See
[`../AGENTS.md`](../AGENTS.md#determinism--no-duplicates-the-hard-contract).

---

## 3. Configuration & the control panel

Config is read from `location.search` via `WS.Q` and clamped with `WS.clamp` / `WS.toInt`:

```javascript
const cfg = { seed: WS.Q.get('seed') || WS.randomSeed(),
              first: WS.clamp(WS.toInt(WS.Q.get('first'), 3), 0, 12), /* … */ };
```

The panel is a collapsible `<details class="panel no-print" id="ws-panel" open>` with a `<summary>`
title. `WS.wirePanel(cfg, keys, {mark, clear})`:

- fills the `f-<key>` fields from `cfg` (checkbox keys use `.checked`),
- wires **Generate** (rebuild query + reload), **🎲 Random seed**, **Submit**, **Clear**, **Print**,
- writes the generated seed to the URL if `?seed=` was absent,
- **collapses the panel on phones** (`window.innerWidth < 700`) so it doesn't fill the screen,
- activates **tooltips**: any panel `<label data-tip="…">` shows its text on hover / tap.

A section whose count is `0` renders nothing (heading omitted). `WS.section(title, count, fn)` is the
scaffold that loops `fn(1..count)` under an `<h2>`.

---

## 4. The marking contract

The shared interface the verifier depends on. `WS.mark(opts)` tallies and writes
`Score: R / T (P%)` to `#score` (the verifier reads `/Score:\s*(\d+)\s*\/\s*(\d+)/`).

**(a) Typed inputs** — class `gradable`, correct value in `data-answer`, optional `data-kind`
(default `text`):

```html
<input class="gradable" data-answer="cat" type="text">                    <!-- text (default) -->
<input class="gradable" data-answer="rabbit|bunny" type="text">           <!-- text: any alternative -->
<input class="gradable" data-kind="letter" data-answer="b" type="text">   <!-- custom kind -->
```

`text` is case-insensitive and whitespace-collapsed; a `|`-separated `data-answer` accepts any
alternative. Register more kinds with `WS.addKind(name, (value, answer) => bool)`. `num` (digits or
number-words 0–25) is also built in for counting questions.

**(b) Tappable chips** — `.sel-block` (or `.match-block`) containing `.chip[data-ok]` buttons.
`WS.wireChips()` makes `data-mode="one"` blocks behave like radios and `many`/`match-block` like
checkboxes. Each block is **one** point, all-or-nothing: `.correct` (selected & right), `.incorrect`
(selected & wrong), `.missed` (unselected & should be).

**(c) Drag / tap-to-order** — a `.dorder` block with draggable `.dtile[data-val]` tiles in a
`.dsource` pool and `.dslot[data-answer]` drop boxes. `WS.enableDragOrder()` wires both tap-to-place
and pointer drag (mouse + touch, no library, `file://`-safe). Each slot is one point, correct iff it
holds the tile whose `data-val` equals its `data-answer`. Using **positions** (`1..n`) as tile values
lets a sentence repeat a word safely.

**(d) Custom markers** — pass `extras: [fn, …]` to `WS.mark`, where each `fn` returns `{total, right}`
and paints itself; use `skip: inp => …` to exclude inputs the extras handle.

---

## 5. Teaching blocks

`WS.teach(title, html)` returns a `.teach` callout rendered before/among exercises. It carries **no
gradable markup** (marking ignores it) and is **not** an `.item` (the duplicate scanner ignores it),
but it **does print** — it is the lesson. `title` is HTML-escaped; `html` is raw. This is the
"teach, then practise" pattern: emit a `WS.teach(...)` then the section it teaches.

---

## 6. Printing

`worksheet.css`'s `@media print` hides everything `.no-print` (panel, buttons, score, tooltip),
resets `.correct`/`.incorrect` to ink black and hides `.correction` spans (so a sheet marked on
screen prints clean), neutralises chip colours, and uses `@page { size: A4 }` with
`page-break-inside: avoid` per `.item` and per `.teach`. The visual language is a children's
worksheet — Comic Sans / Century Gothic, large rounded type, black-and-white-friendly — not a web
dashboard.

---

## 7. Assets

Icons are **Twemoji** (CC-BY 4.0), one SVG per icon named by Unicode codepoint under
`assets/twemoji/`, referenced as `assets/twemoji/<codepoint>.svg`. **No CDN, no system-emoji
fallback** — pages must work offline and OS emoji render differently per device. UI emoji
(🎲 ✅ 🖨️ 📘) are system glyphs, not bundled, and never appear on the printable worksheet.

---

## When you add a unit

1. Copy `beginning-sounds.html`; keep only page-specific `<style>`/`<script>`.
2. Build `cfg` from `WS.Q`/`clamp`/`toInt` (seed defaults to `WS.randomSeed()`).
3. Teach with `WS.teach`; practise with the marking contract — `gradable` inputs (+ `WS.addKind` for
   new answer types), `.sel-block` chips, `.dorder` tiles, `extras`/`skip` for anything bespoke. Call
   `WS.wireChips()` / `WS.enableDragOrder()` as needed, then `WS.wirePanel(...)`.
4. Ensure **distinct questions** per section (draw without replacement; count ≤ pool size).
5. Add a spec here (from `_template.md`), a `TARGETS` + `DUP_PARAMS` entry in `verify/verify.js`, and
   a card in `index.html`. Run the verifier.
