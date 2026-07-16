# Sentence Cloze spec

Primary-One comprehension unit (Unit 38, workbook pages 158–167). Six short passages — a bookshop
trip (Jenny), a swimming pool outing (Aryan), a birthday bicycle (Bryan), an aquarium visit (Peter &
Paul), a library habit (Sarah), a playground afternoon (Ai-Ling, Tom & Sue), and two cousins
(Samantha & Kelly) — each followed by the book's own comprehension task: "Circle/Tick/Underline the
correct answers" or "Fill in the blanks with the helping words below" (one page has no word bank and
instead asks the child to fill blanks with "suitable words from the passage"). Source photos:
`6998L/R`–`7003L/R` (pages 158–167), converted from the workbook scans in `input/` (git-ignored).

## Teaching block(s)

- **Read, then answer** — read the passage in the box, read the question, tap the correct answer.
  Worked example: *Peter and Paul are ___. (friends, cousins, brothers) → brothers.*
- **Fill in the blank** — read the sentence and the helping words, pick the word that fits, type it
  in the blank. Worked example: *Helping words: swimming pool, trunks. Aryan and his parents are at
  the ___. → swimming pool.*

## Sections

| # | key | heading | primitive | answer kind | pool (size) | default | max |
|---|-----|---------|-----------|-------------|-------------|---------|-----|
| 1 | `answer` | Circle the correct answer | chip-select one (3 options) | — | Q&A pairs over 3 short passages (16) | 5 | 16 |
| 2 | `cloze` | Fill in the blank | typed input | `text` (`\|`-alternates for 2 items) | cloze sentences over 4 short passages (23) | 6 | 23 |

**Section 1 (`answer`).** Each pool entry pairs one of three verbatim passages (bookshop / aquarium /
library) with ONE question the book asks about it, rendered as a compact bordered `.passage-box` plus
a 3-chip `data-mode="one"` block. The book's bookshop Q1 circles two blanks in a single sentence
("Jenny and her (father/mother/aunt) are at a (toy shop/market/bookshop)."); it is split into two
independent, non-leaking questions ("Jenny and her ___ are at a bookshop." / "They are at a ___.") so
every item still asks exactly one thing — this is why the pool is 16 rather than the book's 15
numbered questions. **Distinctness:** `shuffle(ANSWER_QA)` indexed by the 1-based question number
(`answerOrder[(i-1) % answerOrder.length]`), so `max=16` exactly saturates the pool. Option order is
reshuffled per render; the 3 options are always the book's own (no invented distractors).

**Section 2 (`cloze`).** Each pool entry is one cloze sentence plus either the book's own "helping
words" bank for that passage (Aryan's pool, Bryan's, or the playground's — all shown in full so the
item is self-contained) or, for the one bank-less exercise (Samantha & Kelly, "fill in with suitable
words from the passage"), the short source passage itself. Two workbook blank-pairs that share one
flowing sentence — and would otherwise be genuinely ambiguous read in isolation against a shared word
bank (Bryan's "It is a shiny blue ___" / "Bryan loves his new ___", both plausibly "bicycle" *or*
"present" without the book's "use each word once" ordering; the playground's "the three ___ go to the
___") — are kept combined as one two-input item rather than force-split, so the book's 6+7+7+5=25
numbered blanks become 23 pool *items* (two items hold 2 inputs each). **Distinctness:**
`shuffle(CLOZE)` indexed the same way as Section 1; `max=23` exactly saturates the pool.
`data-answer="children|neighbours"` and `data-answer="hide-and-seek|hide and seek"` accept a
defensible alternate spelling/reading (`|`-alternates, per AGENTS.md).

## Verification

- `TARGETS` params: `seed=verify&answer=4&cloze=4`
- `DUP_PARAMS`: `answer=16&cloze=23` (both equal to their pool size)
- Expected: `happy 8/8  probe <8  dups 0` (4 chip-blocks + at least 4 typed inputs at these params;
  the two 2-input cloze items push the exact total up when drawn)

## Notes / decisions

- All three "answer" passages and all four "cloze" passages/word-banks are reproduced **verbatim**
  from the workbook (including the British "favourite", the curly-quote-free `'glad'` scare-quotes,
  and Bryan's word bank listing "bicycle" twice). Only the question/sentence *stems* are lightly
  adapted from the book's own connected prose where necessary for a standalone item (e.g. "They are
  at a ___." instead of repeating "Jenny and her mother are at a ___." right after the sibling item
  that asks who "her mother" is) — see the two "Distinctness" notes above for the two combined items.
- No pictures were added: every exercise in this unit is text-only reading comprehension (unlike the
  vocabulary units), so per AGENTS.md's "prefer text wherever the picture is decorative" this unit
  adds no new `assets/twemoji/*.svg`; the favicon reuses the existing `1f4d5.svg` (book), matching the
  sibling comprehension unit `multiple-choice.html` (Unit 39, the very next page range in the book).
- Styling (`.passage-box`, `.qline`, `.blankmark`) intentionally mirrors `multiple-choice.html` (the
  adjacent Unit 39) for a consistent look across the workbook's "comprehension" family; `.bank` (the
  helping-words box) is new to this unit.
- No print-only sections: every exercise on pages 158–167 maps cleanly to chip-select-one or typed
  input, so the whole unit is self-marking.
