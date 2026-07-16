# Antonyms spec

Primary-One **vocabulary** unit teaching **antonyms** (opposites). Based on **Unit 28** (pages 120–128)
of the source workbook — the book's **biggest** unit, spanning six distinct exercises: a "Let's learn"
box + "match each word to its opposite" (pictures + words) + "give the opposites using the helping
words, then draw the pictures" + "write the opposite of each bold word" (nursery rhymes) + "circle the
opposite of the underlined word" + "read the descriptions and circle the correct picture". All six are
reproduced — none skipped. Seeded generator; distinct questions.

File: `antonyms.html` (matching widget copied verbatim from `homes.html`; print-only draw section
follows the `adjectives.html`/`prepositions.html` pattern). Config keys: `match`, `write`, `draw`,
`rhyme`, `circle`, `pick`.

## Teaching block(s)

- **Antonyms** — an antonym is a word that means the opposite of another word: **hot** ↔ **cold**,
  **fast** ↔ **slow**, **big** ↔ **small**. (Before the match section.)
- **Give the opposite** — write the opposite of the word in bold, using the helping-word bank (dirty,
  narrow, long, short, sad, thin) shown as static word chips. (Before `write`.)
- **On paper ✍️** — "Do this part on the printed sheet — a grown-up marks it." (Before `draw`.)
- **Opposites in rhymes** — these lines are from nursery rhymes; write the opposite of the bold word.
  (Before `rhyme`.)
- **Circle the opposite** — circle the word that means the opposite of the underlined word. (Before
  `circle`.)
- **Choose the opposite** — read about the first thing, choose the word describing the opposite one.
  (Before `pick`.)

## Sections

| # | key | heading | primitive | answer kind | pool (size) | default | max |
|---|-----|---------|-----------|-------------|-------------|---------|-----|
| 1 | `match`  | Match each word to its opposite | **matching widget** (custom) | custom marker `markMatch` | word→opposite pairs (14) | 6 | 10 |
| 2 | `write`  | Write the opposite | typed input | text | helping-word opposite pairs (6) | 3 | 6 |
| 3 | `draw`   | Draw the opposite picture | **print-only** (parent-graded) | — | same 6 pairs, distinct prompts (6) | 3 | 6 |
| 4 | `rhyme`  | Opposites in rhymes | typed input | text (one `\|`-alternative) | nursery-rhyme lines (8) | 4 | 8 |
| 5 | `circle` | Circle the opposite | chip-select one | — | sentences w/ 3 opts (7) | 4 | 7 |
| 6 | `pick`   | Choose the opposite | chip-select one | — | sentence pairs w/ 3 opts (6) | 4 | 6 |

**Distinctness:** the matching widget draws `match` distinct pairs without replacement
(`shuffle(PAIRS).slice(0,count)`, unpoliced by the dup-scanner since it isn't `.item`-based — see
*Reusable bespoke widgets* in `AGENTS.md`). Every other section shuffles its pool once and indexes by
the 1-based question number (`pool[(i-1) % pool.length]`), so each `max` equalling its pool size (6/8/7/6)
still yields zero repeats. `write` and `draw` shuffle **independent copies** of the same 6-pair `OPP6`
pool (two separate `shuffle()` calls), so the two sections are distinct internally and typically diverge
from each other too, though cross-section overlap isn't policed (only within-section, per the hard
contract).

**Answer alternative:** `rhyme` item 8 ("Old Mother Hubbard went to the cupboard.") accepts
`data-answer="young|new"` — old→young (age of a person) or old→new (age of a thing) are both valid
antonyms; the workbook leaves this open.

**Content adaptation notes:**
- `write`/`draw` pool (`OPP6`) comes from pages 122–123 ("Give the opposites of the words in bold. Use
  the helping words. Then draw the pictures in the space provided."): tall/short tree, thick/thin book,
  clean/dirty towel, happy/sad face, short/long ruler, wide/narrow road.
- `rhyme` item 5 (Wee Willie Winkie) is trimmed from the workbook's full couplet — which bolds **both**
  "upstairs" *and* "downstairs" in the same line (two blanks in the book) — to a single clause bolding
  only "upstairs", so the answer word "downstairs" is not itself printed in the question text (that
  would let a child copy it instead of reasoning about the opposite).
- `pick` adapts the picture-choice pages (127–128: small/big present, clean cup/dirty bowl, strong
  Tom/weak brother, full box/empty basket, heavy/light books, opens/closes) into text: one clause states
  a fact about the first thing, the second clause blanks the antonym describing the second thing, with
  two distractor words pulled from other pairs in the pool.

## The matching widget (in-page, reusable)

Reused **verbatim** from `homes.html` / `simple-past-tense.html` (see `AGENTS.md`). A tap-to-connect
widget: a left column of prompts (`.mleft[data-answer]` = words) and a right column of shuffled answers
(`.mright[data-val]` = their opposites), with an SVG overlay (`.mlines`). Tap a left item then a right
item to join them (a line is drawn); each left item stores its chosen partner in `data-conn`.

- **`markMatch`** (passed to `WS.mark({ extras:[markMatch] })`) scores **each left item** 1 point,
  correct iff `data-conn === data-answer`; it paints the boxes and recolours the lines green/red.
- **`window.__wsAutoSolve`** connects every left item to its correct opposite and redraws — the
  verifier's `EXTENSION POINT` calls it, so the happy path completes the widget regardless of probe.
  Reset is wired through `WS.clearAll(resetMatch)`.
- Only `PAIRS` (word→opposite) and `MATCH_HEADS` (`['Word', 'Opposite']`) change from the template; the
  widget CSS/JS/wiring is byte-identical to `homes.html`.

## Print-only section (`draw`, per AGENTS.md)

Section 3 reproduces the workbook's "draw the picture" half of the page-122 exercise, which a screen
cannot self-mark. It emits plain `.item`s — "The *noun* is **bold**. Draw a **opposite** *noun*." plus an
empty `.drawbox` — with **no** `.gradable`/`.chip`/`.dslot` markup, so the auto-marker ignores it (like a
`WS.teach` block) and it contributes **0** to the score (does not change the `happy N/N` expectation).
The duplicate scanner still scans its `.item`s, so its `max`/count is kept ≤ its 6-prompt pool.

## Verification

- `TARGETS`: `seed=verify&match=4&write=3&draw=3&rhyme=3&circle=3&pick=3` → happy **16/16**
  (4 match points + 3 write + 3 rhyme + 3 circle + 3 pick; the 3 draw items are print-only and score 0).
- `DUP_PARAMS`: `match=10&write=6&draw=6&rhyme=8&circle=7&pick=6` (each ≤ its pool of 14/6/6/8/7/6).
- Verified: `PASS  antonyms  happy 16/16  probe 14/16  dups 0` via
  `node check-one.js antonyms.html "seed=verify&match=4&write=3&draw=3&rhyme=3&circle=3&pick=3" "match=10&write=6&draw=6&rhyme=8&circle=7&pick=6"`.
  Probe drops 2 points (the first typed input across the page, in `write`, is left blank; the first
  correct chip across the page, in `circle`, is left unclicked) — the matching widget is auto-solved
  every run regardless of probe, consistent with the other matching-widget vocab units.
- Registration: unit card + module quick-links in `index.html`; `TARGETS`/`DUP_PARAMS` entries in
  `verify/verify.js` (not wired here — engine/verify files untouched per this unit's build contract).

## Notes / decisions

- Six exercises, six config keys — the book's biggest unit, and every exercise is reproduced (none
  dropped): matching widget, typed input with a helping-word bank, print-only drawing, typed input over
  nursery-rhyme couplets, chip-select-one over underlined words, and chip-select-one adapted from a
  picture-choice page.
- The matching section is **text-only** (word ↔ word), matching the established convention for this
  repo's vocabulary units (`homes.html`, `gender.html`, `parents-and-young.html`, …) even though the
  workbook's page 120 shows pictures for 5 of the 14 pairs — the picture is decorative there (the tested
  content is the word pair), so no new Twemoji SVGs were added.
- No custom answer kind was needed — all typed inputs use the default `text` kind (case-insensitive,
  `\|`-separated alternatives).
