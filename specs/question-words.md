# Question Words spec

Primary-One grammar unit teaching **question words** — the words we use to ask questions: *what*
(a thing), *where* (a place), *who* (a person), *when* (a time), *which* (a choice), *whose* (who owns
it), *why* (a reason). A "Let's learn" box + two "choose the question word" exercises. The workbook's
open-ended "ask a question" exercise is dropped (it is not machine-gradable); the gradable "choose the
question word" exercise is kept and split across two pools. Seeded generator; distinct questions per
section.

File: `question-words.html` (copied from `simple-present-tense.html`). Config keys: `choose`, `pick`.

## Teaching block(s)

- **Question words** — We use question words to ask questions: **what** (a thing), **where** (a place),
  **who** (a person), **when** (a time), **which** (a choice), **whose** (who owns it), **why**
  (a reason).

## Sections

| # | key | heading | primitive | answer kind | pool (size) | default | max |
|---|-----|---------|-----------|-------------|-------------|---------|-----|
| 1 | `choose` | Choose the question word | chip-select one (3 opts) | — | sentences (12) | 4 | 12 |
| 2 | `pick` | Which question word fits? | chip-select one (3 opts) | — | sentences (10) | 4 | 8 |

**Distinctness:** both shuffle their sentence pool and index by the 1-based question number → a distinct
sentence (and correct chip) per question. Every `max` ≤ its pool size (12 and 10).

## Notes / decisions

- Both sections are **chip-select-one**. Each item stores its **own** `opts` array of **three**
  question words; the generator marks `data-ok="1"` on the single chip whose option `=== t.a`
  (case-sensitive) and `data-ok="0"` on the other two → exactly one correct chip per item.
- The correct question word is fully **text-determined** by the sentence, so no pictures are needed.
- Reuses the engine unchanged (`WS.section`, `WS.teach`, `WS.wireChips`, `WS.wirePanel`).

## Verification

- `TARGETS`: `seed=verify&choose=4&pick=4` → happy **8/8**
- `DUP_PARAMS`: `choose=10&pick=8` (each ≤ its pool)
- Expected: `PASS  question-words  happy 8/8  probe <8  dups 0`.
- Registration: unit card + module quick-links in `index.html`.
