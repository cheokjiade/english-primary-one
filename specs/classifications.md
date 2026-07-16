# Classifications spec

Primary-One **vocabulary** unit teaching **classification** — grouping words together by their shared
features (footwear, fruits, countries, furniture, meat eaters, birds, colours, vegetables, vehicles,
cutlery, festivals, shapes, planets, stationery…). Based on Unit 25 (pages 109–112) of the source
workbook: a "Let's learn" box + "match each set of words with the correct classification" (p.109) +
"write the correct classification for each box" with a crossword puzzle using the same classification
words (pp.110–111) + "colour the words according to their groups" (p.112). Seeded generator; distinct
questions; every exercise on the page is reproduced (the crossword and the colouring task are print-only,
parent-graded, since they can't be auto-marked).

File: `classifications.html` (built from `homes.html` — the matching-widget vocab template — for
Section 1's widget, plus the print-only puzzle pattern from `occupations.html`/`people.html`/
`places.html` for Sections 3–4). Config keys: `match`, `write`, `puzzle`, `groups`.

## Teaching block(s)

- **Classifications** — we classify or group things together according to their similar features or
  qualities. Example: sandals, slippers, boots → **footwear**.
- **Write the classification** — a second short lesson before Section 2, with a worked example (red,
  purple, black → **colours**).
- **On paper ✍️** (×2) — one before Section 3 explaining the crossword-style boxes (with a small static
  demo grid showing p.111's worked example, COLOURS across crossing CUTLERY down), one before Section 4
  reproducing p.112's 5-rule colour legend (planets grey, fruits red, vehicles yellow, furniture green,
  stationery orange).

## Sections

| # | key | heading | primitive | answer kind | pool (size) | default | max |
|---|-----|---------|-----------|-------------|-------------|---------|-----|
| 1 | `match` | Match each set of words with the correct classification | **matching widget** (custom) | custom marker `markMatch` | word-set→classification pairs (6) | 5 | 6 |
| 2 | `write` | Write the correct classification for each box | typed input | text, `\|`-alternatives | classification boxes (8) | 4 | 8 |
| 3 | `puzzle` | Solve the crossword clues | **print-only** (parent-graded) | — | classification boxes (8, shared with §2) | 4 | 8 |
| 4 | `groups` | Colour the words by group | **print-only** (parent-graded) | — | words across 5 groups (18) | 8 | 18 |

**Distinctness:** the matching widget draws `match` distinct pairs without replacement from `PAIRS` (6
sets — it is a single non-`.item` widget, so the dup-scanner does not police it, the generator does).
Sections 2–4 each index an independently-shuffled copy of their pool by the 1-based question number
(`pool[(i-1) % pool.length]`), so every rendered `.item` is distinct as long as its count stays ≤ its
pool size (2 & 3 share the same 8-entry `CATS` pool — by design, since p.110 and p.111 both classify the
same 8 word-boxes — but each section shuffles its own copy independently).

## Section 1 — the matching widget (reused from `homes.html`/`AGENTS.md`)

Reproduces p.109's "Match each set of words with the correct classification" verbatim: 6 word-sets
(e.g. *sandals / slippers / boots*) as the left column (`.mleft[data-answer]`, multi-line via `<br>`),
their 6 classifications (*footwear, fruits, countries, furniture, meat eaters, birds*) shuffled into the
right column (`.mright[data-val]`). Tap-to-connect with an SVG line overlay (`.mlines`); byte-identical
widget code (`SVGNS`, `buildMatch`, `lineColor`, `drawMatch`, `wireMatch`, `resetMatch`, `markMatch`,
`window.__wsAutoSolve`) to `homes.html` — only `PAIRS`, `MATCH_HEADS` (`['Word set', 'Classification']`)
and the heading changed. `markMatch` scores each left item 1 point; `__wsAutoSolve` connects every left
item to its `data-answer` so the verifier's happy path completes the widget.

## Section 2 — write the classification (typed input)

Reproduces p.110's 8 boxes ("Write the correct classification for each box. Use the helping words
provided on the next page.") as typed-input items: the box's 3 member words shown in a `.clsbox`, a
text input graded against the classification. Fair alternatives accepted via `\|`-separated
`data-answer` where the workbook's word has a common synonym (`vehicles|transport`, `cutlery|utensils`,
`vegetables|veggies`, `festivals|celebrations`, `countries|nations`, `colours|colors`); `shapes` and
`fruits` have no added alternative.

## Section 3 — solve the crossword clues (PRINT-ONLY, parent-graded)

Reproduces p.111 ("Now use the words to solve the crossword puzzle") without claiming pixel-exact grid
geometry from the source photo (which is partly obscured/rotated) — instead, each of the 8 classification
words becomes its own crossword-style clue: the same word-set text as Section 2, a cosmetic **Across**/
**Down** badge (`WS.helpers(rng).balanced(['Across','Down'])`, spread evenly per AGENTS.md), and a row of
letter boxes (`.xrow` / `.xbox`) sized to the answer's length with the **first letter given** — the same
"crossword adapted to boxes" technique already established by `people.html`/`places.html`. A small static
`xgridDemo()` (fixed, not seed-dependent) precedes the clues inside the teach block: it hand-reproduces
p.111's own worked example, **COLOURS** fully filled in across crossing **CUTLERY** (first letter given)
down, verified to share the letter "L" at the intersection (colours[2] = cutlery[3] = 'L') — a genuine,
correctly-interlocking 2-word fragment of the source crossword, not just decoration. No `.gradable`/
`.chip`/`.dslot` markup anywhere in this section, so it is invisible to the marker and contributes 0 to
the score; it still renders distinct `.item`s (one per clue) for the duplicate scanner.

## Section 4 — colour the words by group (PRINT-ONLY, parent-graded)

Reproduces p.112 ("The words below can be classified into 5 groups... colour them according to their
groups"): the 5-rule colour legend (planets→grey, fruits→red, vehicles→yellow, furniture→green,
stationery→orange) is reproduced verbatim in the preceding `WS.teach` block (not per-word, so the child
must still work out each word's group from the legend, same as the workbook); the 18 scattered words
themselves (Earth, Jupiter, Mars, grape, banana, papaya, orange, car, truck, van, bus, chair, table, bed,
cupboard, paper, pencil, pen — exactly p.112's word list) are drawn from the pool as individual `.item`
tiles (`.groupword`, lettered `display:inline-flex` so they wrap into a word-grid like the source page)
each with a blank `.colordot` circle for the child to colour by hand. No gradable markup; contributes 0
to the score.

## Verification

- `TARGETS` params: `seed=verify&match=4&write=4&puzzle=4&groups=4` → happy **8/8** (4 match points + 4
  write points; `puzzle`/`groups` are print-only and contribute 0)
- `DUP_PARAMS`: `match=6&write=8&puzzle=8&groups=18` (each = its pool size)
- Expected: `PASS  classifications  happy 8/8  probe <8  dups 0` (probe drops via Section 2's first typed
  input; the matching widget is auto-solved every run via `window.__wsAutoSolve`).
- Registration: unit card + module quick-links in `index.html`, plus a `TARGETS`/`DUP_PARAMS` entry in
  `verify/verify.js` — both left to the caller per this build's scope (this file only adds
  `classifications.html` + this spec).

## Notes / decisions

- Sections 2 and 3 intentionally share the same 8-entry classification pool (`CATS`) — p.110 and p.111
  test the *same* 8 words in the source workbook (the word bank atop p.111 is literally p.110's 8
  answers), so showing both by default reproduces that continuity rather than duplicating content by
  accident. Each section shuffles its own independent copy of the pool, so their order/selection differs
  per render.
- "meat eaters" (p.109's classification for lion/tiger/cheetah) and "festivals" (Hari Raya/Deepavali/
  Christmas) are reproduced verbatim from the workbook, including the British spelling ("colours",
  "classification") used throughout the source.
- The crossword's exact cell geometry could not be fully resolved from the source photo (rotated,
  partly shadowed); rather than guess and risk an inconsistent grid, Section 3 uses the repo's
  established "crossword adapted to boxes" pattern (`people.html`/`places.html`) for the graded/printable
  clue list, plus one hand-verified, genuinely-interlocking 2-word fragment (`xgridDemo`) reproducing the
  workbook's own given example for visual fidelity.
