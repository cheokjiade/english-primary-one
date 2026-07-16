# Multiple-Choice spec

Primary-One comprehension unit teaching **reading comprehension via multiple-choice questions**: read a
short passage, then choose the correct answer to a question about it from four numbered options. Based on
workbook Unit 39, pages 168–173: three short passages ("Colin and Snowy", "Mother's Birthday", "A Day at
the Beach"), each followed by 5 questions in the book's own format — "Choose the correct answer and write
its number in the brackets" — with options labelled (1)–(4). Source photos: `7004L.jpg`/`7004R.jpg`,
`7005L.jpg`/`7005R.jpg`, `7006L.jpg`/`7006R.jpg` (see `input/`, git-ignored).

File: `multiple-choice.html` (copied from `beginning-sounds.html`). Config key: `mcq`.

## Teaching block(s)

- **Multiple-choice** — "Read the passage carefully. Then answer the questions." (verbatim book
  instruction) + "Choose the correct answer — tap (1), (2), (3) or (4)." with a worked example lifted
  from the book's own pre-filled demo item: *Colin has a ___. (1) kitten **(2) puppy** (3) turtle
  (4) chick → tap (2) puppy.* Sits before the single section.

## Sections

| # | key | heading | primitive | answer kind | pool (size) | default | max |
|---|-----|---------|-----------|-------------|-------------|---------|-----|
| 1 | `mcq` | Choose the correct answer | chip-select one | — | book questions, each bundled with its passage (15) | 5 | 15 |

**Distinctness:** the pool is a flat list of all 15 book questions (5 per passage × 3 passages), each
entry `{ p, q, opts, ans }` (`p` = passage index, `opts` = the book's 4 options in their original order,
`ans` = 0-based index of the correct one). `mcqOrder = shuffle(QUESTIONS.map((_,idx)=>idx))` is a shuffled
permutation of `0..14`, and the generator indexes it by the 1-based question number —
`mcqOrder[(i-1) % mcqOrder.length]` — the same pattern as `nameTargets` in `beginning-sounds.html`. Since
it is a straight permutation, any count up to 15 draws 15 distinct pool entries with no repeats; `max`
and the dup-check count are both capped at the pool size (15).

Each rendered item is self-contained: it shows the relevant passage (verbatim, in a bordered
`.passage-box`, repeated per item — the simplest faithful option per `AGENTS.md`'s "print-only"/compact
guidance, since the shuffled pool interleaves questions from different passages rather than grouping by
passage), then the question with its blank picked out (`.blankmark`), then four `.chip` buttons reading
`(1) …` … `(4) …` in the book's original order — tapping a chip is the digital equivalent of "write its
number in the brackets". `data-ok="1"` marks the one correct chip per item.

## Verification

- `TARGETS` params: `seed=verify&mcq=4` → happy **4/4** (4 chip-block points, one per item)
- `DUP_PARAMS`: `mcq=12` (≤ pool size 15)
- Result: `PASS  multiple-choice  happy 4/4  probe 3/4  dups 0` (probe drops via one skipped correct chip)

## Notes / decisions

- Passage and question wording is taken verbatim from the workbook (`7004L/R.jpg`, `7005L/R.jpg`,
  `7006L/R.jpg`), including all three passages in full and all 15 questions with their original four
  options each. The book's first question of each passage (e.g. "Colin has a ___.") is shown in the
  photos as a pre-filled worked example (`( 2 )`); it is reproduced here as a live, self-marking question
  like the other 14, per "reproduce every exercise" — its answer is also used as the worked example in
  the teaching block.
- Option order is **not** shuffled (unlike e.g. `gName` in `beginning-sounds.html`): the four options for
  each question stay in the book's original (1)–(4) order, since that numbering is the exercise's own
  content ("write its **number**") rather than decoration. Only *which of the 15 questions* appears at
  each position is randomised.
- No new Twemoji assets were needed — this unit is text-only (no picture vocabulary), so no new SVGs were
  added to `assets/twemoji/`. The favicon reuses the site-wide `assets/twemoji/1f4d5.svg`, matching every
  other unit.
- No new answer kind was needed; the section uses the engine's built-in `.chip[data-ok]` matching only
  (no typed inputs, no drag-order).
- Registration (unit card + module quick-link in `index.html`, `TARGETS`/`DUP_PARAMS` in
  `verify/verify.js`) is intentionally **not** done by this change — out of scope per task instructions.
