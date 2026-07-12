# Building a worksheet unit — guide for a human or agent

This project turns a **photo of a workbook page** into a printable, self-marking English
worksheet. This file is the operational guide: read it top-to-bottom before building a unit.
For the engine's internals and the reasoning behind the rules, see
[`specs/conventions.md`](specs/conventions.md).

> **Golden rule:** don't start from a blank file. **Copy `beginning-sounds.html`** and change the
> content. It already wires up everything below correctly.

---

## What you're building

A **unit** is one self-contained HTML page at the repo root (e.g. `beginning-sounds.html`). It:

- shares the engine — `assets/worksheet.js` (global `WS`) and `assets/worksheet.css` — via plain
  `<script src>` / `<link>` tags (so it opens by double-click, `file://`, no server, works offline
  and on GitHub Pages),
- reads settings from the URL (`?seed=…&first=3&…`) so the **same seed + settings always produce the
  same sheet**,
- **teaches first, then practises**: a `WS.teach(...)` lesson block, then generated exercises,
- **marks itself** when the child taps **Submit**, using a generic DOM contract the engine
  understands.

You (the author) never write marking, scoring, printing, or panel code — the engine does that. You
write **generators**: small functions that return HTML strings for one question each.

---

## The photo → unit workflow

**Step 0 — get readable photos.** Phone photos are usually **HEIC**, and iPhone HEICs are *grid-tiled*
(one page is stored as a mosaic of ~60 small HEVC tiles). Most tools — **including `ffmpeg`** — decode
only the *first tile*, silently giving you a useless corner crop that still looks like a (badly-framed)
photo. Convert with **`pillow-heif`**, which assembles the grid and honours EXIF rotation:

```python
# python -m pip install --user pillow-heif pillow
import pillow_heif; from PIL import Image, ImageOps
pillow_heif.register_heif_opener()
im = ImageOps.exif_transpose(Image.open("input/IMG_1234.HEIC")).convert("RGB")
im.thumbnail((2000, 2000)); im.save("input/IMG_1234.jpg", quality=88)   # spreads are ~5712×4284
```

A full page should come out ~3000–5700 px on the long edge; if you get a ~640 px corner-sliver, the
grid wasn't assembled. Two-page spreads photograph as one landscape image — read each half at full size.

1. **Look at the photo.** Identify (a) any *teaching / example* content at the top of the page, and
   (b) each distinct *exercise type* (e.g. "write the first letter", "circle the correct word",
   "match", "put words in order").
2. **Copy `beginning-sounds.html`** to a new file named after the topic, e.g. `naming-words.html`.
   Update the `<title>`, the `<h1>`, the panel `<summary>`, and the footer.
3. **Turn the teaching content into a `WS.teach(title, html)` block** (see *Teaching blocks* below).
4. **Turn every exercise into a section — reproduce them all, none skipped.** Auto-gradable exercises
   become generators using the closest primitive (see *Primitives*); ungradable ones (drawing, open
   writing, crosswords/word-searches) become **print-only, parent-graded** sections (see *Reproduce
   every exercise*). Give each a config key, a panel field, and a `WS.section(...)` call.
5. **Guarantee distinct questions** — draw content without replacement / index a shuffled pool by the
   question number (see *Determinism & no duplicates*). This is a hard, verified requirement.
6. **Register the unit** for verification: add a `TARGETS` entry (and a `DUP_PARAMS` entry) in
   `verify/verify.js`, and add a card in `index.html`.
7. **Write a spec** in `specs/<topic>.md` from `specs/_template.md` (what the sheet covers, section by
   section) — this is the durable record of intent.
8. **Verify:** `cd verify && npm run verify`. It must print `happy N/N`, `probe <N/N`, `dups 0`.

### A prompt you can paste to an agent alongside the photo

> Here is a photo of a Primary-One English workbook page. Build a new unit in this repo following
> `AGENTS.md`. Specifically:
> 0. If the source photos are HEIC, convert them to JPG first with `pillow-heif` (`ffmpeg` decodes
>    only one tile of the grid — see *Step 0* above).
> 1. Copy `beginning-sounds.html` to `<topic>.html` and update the title/heading/panel/footer.
> 2. Extract the lesson/example at the top of the page into a `WS.teach(...)` block.
> 3. Reproduce EVERY exercise on the page — none skipped. Write a generator for each using the closest
>    primitive (typed input / chip-select-one / chip-select-many / drag-to-order / matching), one config
>    key + panel field + `WS.section(...)` call each. If an exercise can't be auto-graded (drawing, open
>    writing, a crossword/word-search), include it as a print-only, parent-graded section instead of
>    dropping it. Reproduce the wording of the instructions faithfully.
> 4. Make every section produce **distinct** questions across its count (draw without replacement).
> 5. Add a `TARGETS` + `DUP_PARAMS` entry in `verify/verify.js` and a card in `index.html`.
> 6. Write `specs/<topic>.md` from the template.
> 7. Run `cd verify && npm run verify` and fix anything until it prints `happy N/N  probe <N/N  dups 0`.
> Do not edit `assets/worksheet.js` or `assets/worksheet.css` unless a genuinely new interaction is
> needed; prefer `WS.addKind` and per-page `<style>`.

---

## Anatomy of a unit (what's in `beginning-sounds.html`)

```
<head> … <link rel="stylesheet" href="assets/worksheet.css"> + a page <style> for topic-only bits </head>
<body>
  <details class="panel no-print" id="ws-panel" open> … one <label>/<input id="f-KEY"> per section … </details>
  <div class="score" id="score"></div>
  <h1>Title</h1> <div class="meta-line" id="meta"></div>
  <div class="name-row">…</div>
  <div id="sheet"></div>            ← everything renders here
  <script src="assets/worksheet.js"></script>
  <script>
    const cfg = { seed: WS.Q.get('seed')||WS.randomSeed(), KEY: WS.clamp(WS.toInt(WS.Q.get('KEY'),3),0,MAX), … };
    const rng = WS.makeRng(cfg.seed);
    const { randInt, pick, shuffle, distinct, balanced } = WS.helpers(rng);
    // …data pools + generator functions gFoo(i) that return HTML strings…
    let html = '';
    html += WS.teach('Lesson title', '…lesson html…');
    html += WS.section('Section heading', cfg.KEY, gFoo);
    document.getElementById('sheet').innerHTML = html;
    WS.wireChips(); WS.enableDragOrder();   // call the ones your primitives need
    WS.wirePanel(cfg, ['KEY', …], { mark: () => WS.mark(), clear: () => WS.clearAll() });
  </script>
</body>
```

Each config **KEY** maps 1:1 to: a URL param, a panel field `#f-KEY`, a section count, and a
generator. A section whose count is `0` renders nothing.

---

## Primitives (pick the closest one per exercise)

| Exercise on the page | Primitive | Markup you emit |
|---|---|---|
| Write a letter/word/answer | **typed input** | `<input class="gradable" data-answer="cat" …>` (default `text` kind) |
| Choose ONE correct option | **chip-select one** | `<div class="sel-block" data-mode="one"><div class="chips"><button class="chip" data-ok="1|0">…</button>…</div></div>` |
| Choose TWO+/all that apply | **chip-select many** | same, `data-mode="many"`; mark every correct chip `data-ok="1"` |
| Match A→B (tap the match) | **chip-select one**, one block per left-hand item | see `gMatch` pattern in the maths repo / `gName` here |
| Put items in order | **drag / tap-to-order** | a `.dorder` with `.dsource` `.dtile[data-val]` tiles + `.dslots` `.dslot[data-answer]` boxes; call `WS.enableDragOrder()` |

All four are graded automatically by `WS.mark()`. Chips and order-slots are one point each; a
chip-block is all-or-nothing.

### Answer kinds (how a typed input is judged)

- **`text`** (default) — case-insensitive, whitespace-collapsed. A **`|`-separated `data-answer`
  accepts any alternative**: `data-answer="rabbit|bunny"` marks either right. Use this for synonyms,
  British/American spellings, "a"/"an", etc.
- **`num`** — digits or number-words 0–25 (for the occasional counting question).
- **Custom** — register your own with `WS.addKind('name', (value, answer) => boolean)` and put
  `data-kind="name"` on the input. The example adds `letter` (single letter, case-insensitive).
  Ideas: `startsWith`, `contains`, a phonics matcher, "ignore trailing punctuation".
- **Case matters?** `text` and `letter` are **case-insensitive**, so they mark `singapore` right for
  `Singapore`. For capitalisation exercises (proper nouns, "rewrite using capital letters for proper
  nouns"), register a case-sensitive kind — `WS.addKind('cap', (v,a) => v.trim() === a.trim())` — and
  put `data-kind="cap"` on the input.

---

## Reproduce every exercise — print-only for the ungradable ones

**Never drop an exercise.** Reproduce every task on the workbook page. If it maps to a primitive, make it
self-marking. If it genuinely can't be auto-graded — a drawing, open-ended writing, a crossword or
word-search — include it as a **print-only, parent-graded** section: it prints for the child to do by
hand, a grown-up marks it, and it carries **no** `.gradable` / `.chip` / `.dslot` markup, so the
auto-marker ignores it (exactly like a `WS.teach` block). Prefer a faithful gradable adaptation when one
exists, but a print-only section always beats omitting the exercise.

| On the page | Auto-gradable? | Do this |
|---|---|---|
| "Read and draw…", "Draw the missing item" | no | **print-only**: prompt + an empty `.drawbox` to draw in |
| "Make a sentence…", "Ask a question…", "Answer the question…" | no (open) | **print-only**: prompt + a `.writeline` to write on |
| Crossword / word-search / spelling-riddle grid | no | **print-only**: hand-reproduce the grid + its clues / word-list |
| Trace the letters / copy the word | no | **print-only**: the word in a light outline to trace |
| "Read the passage, then circle…" | partly | passage as print-only; make the circling a chip section if clean |
| "Circle the noun **and** underline the verb" | yes | the annotation widget (two tools), or two chip-blocks |
| "Match A → B" (verb→past, young→parent) | yes | the matching widget |

**Print-only section markup.** Give it a config key + count and render it with `WS.section(...)` like any
section, but emit plain `.item`s with no gradable markup — a heading, the prompt, a `✍️` badge, and a
blank space; draw items from a pool so they stay **distinct** across the count (the duplicate scanner
still scans `.item`s):

```javascript
html += WS.teach('On paper ✍️', 'Do these on the printed sheet — a grown-up marks them.');
html += WS.section('Draw the picture', cfg.draw, i => {
  const t = DRAW[(i-1) % DRAW.length];                         // distinct prompt per item
  return '<div class="item"><span class="label">'+i+'.</span> Draw <b>'+t+'</b>.'
       + '<div class="drawbox"></div></div>';                  // .drawbox = bordered empty box (page <style>)
});
```

A print-only section contributes **0** to the score, so it does **not** change the `happy N/N`
expectation — you may still list its key in the verify params (it renders, the verifier only checks that
the gradable items reach full marks with a clean console). Keep its `max`/dup-count ≤ its prompt pool so
distinctness holds.

**Reusable bespoke widgets (copy one instead of inventing).** Two custom interactions already exist:
the **annotation widget** (`common-proper-nouns.html` — pick a tool, tap words to circle/tick/underline)
and the **matching widget** (`simple-past-tense.html` — tap-to-connect two columns, drawn with SVG
lines). Both follow one contract: a custom marker passed via `WS.mark({ extras:[fn] })` (each returns
`{total, right}` and paints itself), reset wired through `WS.clearAll(resetFn)`, and a page-level
**`window.__wsAutoSolve()`** that fills in the correct answers. The verifier's `EXTENSION POINT` calls
`window.__wsAutoSolve()`, so the happy path can complete *any* bespoke widget with no verifier change.
The matching widget is the one to copy for vocabulary units (young→parent, place→description, job→clue).

---

## Teaching blocks

`WS.teach(title, html)` returns a styled **"Let's learn"** callout. Put one before a section (or a few
across the sheet). It is **not** an exercise: it has no gradable markup, so marking ignores it, and it
is not an `.item`, so the duplicate scanner ignores it. It **does print** — it's the lesson.

```javascript
html += WS.teach('Beginning sounds',
  'Every word starts with a <span class="sound">sound</span>.<br>' +
  '<span class="ex">' + img('1f41d') + ' <b>bee</b> → <span class="sound">b</span></span>');
```

`title` is escaped; `html` is raw (put pictures, `<b>`, `<br>` in it). Keep lessons short and concrete
— a rule plus one or two worked examples, mirroring the workbook page.

---

## Determinism & no duplicates (the hard contract)

All randomness flows from `cfg.seed` through `WS.makeRng`, so a seed reproduces a sheet exactly.
Two rules follow:

1. **Never reorder or insert `rng()` calls casually.** The stream is consumed in order; inserting a
   draw shifts every later one, changing the sheet for a given seed. (That's acceptable across code
   versions — seeds aren't promised stable forever — but know that it happens.)
2. **Every section must render distinct questions.** The verifier loads each unit across 3 seeds and
   **fails any section that renders the same question twice**. Achieve distinctness by:
   - indexing a **shuffled pool by the 1-based question number**: `pool[(i-1) % pool.length]`
     (see `nameTargets`, `firstLetters`, `sentTargets` in the example), and/or
   - **drawing without replacement** with a `used` `Set` (see `drawWord`), and/or
   - `WS.helpers(rng).balanced(list)` — a shuffled round-robin `i => variant` that guarantees every
     variant appears once the count reaches the list length. Use it for cosmetic variants (e.g. two
     phrasings of a prompt).
   Keep each section's `max` (and its `DUP_PARAMS` count) **≤ its content-pool size**, or distinctness
   is impossible and the gate will (correctly) fail.

---

## Pictures

Icons are **Twemoji** SVGs (CC-BY 4.0) bundled under `assets/twemoji/`, referenced by Unicode
codepoint: `assets/twemoji/1f431.svg` = 🐱. No CDN, no system emoji (they render differently per
device and wouldn't print reliably). To use an icon not yet bundled, download its Twemoji SVG into
that folder named `<codepoint>.svg` and keep the CC-BY attribution (see `README.md`). Emoji used only
as on-screen UI (🎲 ✅ 🖨️ 📘) are system glyphs and never appear on the printed worksheet.

Reality check: real workbook pages lean on many **specific** pictures (particular animals, objects,
occupations) that Twemoji only partly covers, and some page art (a labelled rocket, an owl full of
answer boxes) has no icon equivalent at all. Budget to add a few SVGs per unit for the pictures the
question actually *tests*, and prefer **text** wherever the picture is decorative rather than the answer.

---

## Verify before you're done

```
cd verify && npm install     # first time only (installs playwright-core, uses your local Chrome/Edge)
npm run verify
```

Expected: `PASS  <unit>  happy N/N  probe <N/N  dups 0` and `All verifiers PASSED`. What it checks:

- **happy** — auto-fills every input from `data-answer`, taps every `data-ok="1"` chip, places order
  tiles, submits; requires full marks and **no console errors**.
- **probe** — leaves the first input blank; requires the score to drop (proves marking discriminates).
- **dups** — the distinct-questions gate above.

If a unit adds a **bespoke interaction** (its own clickable widget beyond the four primitives), add a
driver for it at the `EXTENSION POINT` in `verify/verify.js` so the happy path can complete it.
```
