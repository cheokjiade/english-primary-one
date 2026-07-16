# Following Instructions spec

Primary-One **comprehension** unit teaching careful reading of written instructions — noticing *how
many*, *what colour*, and *who*/*what* an instruction refers to. Based on Unit 35 (pages 147–148) of the
source workbook: "Read the sentences and follow the instructions" over two picture scenes (a family at
the beach; John's seventh birthday party), each followed by 3–4 numbered drawing/colouring instructions.
The drawing itself can't be auto-marked, so it is reproduced faithfully as a **print-only, parent-graded**
section (per AGENTS.md); a new **auto-gradable** comprehension-check section (chip-select-one) tests
whether the child read the same instructions correctly, so the unit still marks itself.

File: `following-instructions.html` (copied from `prepositions.html`). Config keys: `check`, `draw`.

## Teaching block(s)

- **Following instructions** — an instruction tells you exactly what to do; read it twice before you
  start and look for a number, a colour, and who/what it's for. Example: "He is seven years old. Draw
  the correct number of candles." → count carefully and draw 7, not 5 or 8. (Rendered before section 1.)
- **On paper ✍️** — a short print-only note before the draw section: read the sentences on the printed
  sheet and follow the instructions; a grown-up marks that part. (Same second `WS.teach` as the template.)

## Sections

| # | key | heading | primitive | answer kind | pool (size) | default | max |
|---|-----|---------|-----------|-------------|-------------|---------|-----|
| 1 | `check` | Read carefully and answer | chip-select one | — | comprehension Qs (8) | 5 | 8 |
| 2 | `draw`  | Read the sentences and follow the instructions | **print-only** (parent-graded) | none (not marked) | scene scenarios (6) | 3 | 6 |

**Distinctness:** both sections shuffle their pool once (`const order = shuffle(POOL)`) and index by the
1-based question number (`order[(i-1)%order.length]`), so every rendered question/scenario is unique as
long as the count stays ≤ the pool size (8 / 6). The `check` pool is written as its own self-contained
`given`/`q`/`opts` text (so each question stands alone without needing the draw section to be visible),
but it covers the **same six scenarios** as `draw` — the beach family and John's birthday (verbatim from
the workbook) plus four original scenarios in the same style (Christmas tree, apple tree, fish bowl,
farm).

## Print-only section (`draw`, per AGENTS.md)

Reproduces the workbook's "read the sentences and follow the instructions" task, which requires drawing
and colouring and can't be auto-marked. Each `.item` renders a short italic scene description (`.scene`)
plus a numbered `<ol class="instrlist">` of the exact instruction sentences ("Draw…"/"Colour…", faithful
wording — the first two scenarios are verbatim from the workbook) and one big `.drawbox` for the child to
add everything to the scene. It carries **no** `.gradable`/`.chip`/`.dslot` markup, so `WS.mark()` ignores
it (like a `WS.teach` block) and it contributes **0** to the score; the duplicate scanner still scans its
`.item`s (hence the pool/max discipline above). Signposted by the "Draw ✍️" panel label and the "On paper
✍️" teach block, matching every other print-only section in the repo (`adjectives.html`,
`prepositions.html`, `adverbs.html`, …).

## Verification

- `TARGETS`: `seed=verify&check=5&draw=6` → happy **5/5** (5 chip points; the 6 draw items are
  print-only and score 0).
- `DUP_PARAMS`: `check=8&draw=6` (each ≤ its pool of 8 / 6).
- Expected: `PASS  following-instructions  happy 5/5  probe <5  dups 0` (probe drops via the skipped
  first correct chip).
- Also spot-checked directly with `seed=verify&check=3&draw=3` via `check-one.js` → happy 3/3, probe <3,
  dups 0.
- Registration: unit card (tag `unit 35 · comprehension`, emoji 📋) + module quick-links in
  `index.html`, and a `TARGETS`/`DUP_PARAMS` entry in `verify/verify.js` (not wired here — engine/verify
  files untouched by this change; see AGENTS.md).

## Notes / decisions

- No pictures/Twemoji needed — like `prepositions.html`/`adjectives.html`, the exercise is entirely
  text-based (the workbook's illustration is stood in for by the italic scene sentence in the draw
  section).
- `check` reuses the standard chip-select-one pattern (`gFind`/`gFit` shape from the template units) with
  per-item options, so no new answer kind or bespoke widget is needed — the whole unit has zero typed
  inputs.
- Two of the six `draw` scenarios (beach family; John's 7th birthday) are verbatim from the workbook
  (pages 147–148); the other four (Christmas tree, apple tree, fish bowl, farm) are original scenarios
  written in the same "scene + 4 numbered instructions" shape so the section has a full 6-item pool.
