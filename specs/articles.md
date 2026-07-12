# Articles (a, an, the) spec

Primary-One grammar unit teaching the articles **a / an / the**. Based on Unit 4 (pages 13–15) of the
source workbook (`input/IMG_6898–6899`): a "Let's learn" box (a before a consonant sound, an before a
vowel sound, the for a specific/known noun, plus the *u*-as-"you" exception) and two exercises. Built as
a seeded generator; each section renders distinct questions.

File: `articles.html` (copied from `beginning-sounds.html`). Config keys: `aan`, `article`.

## Teaching block(s)

- **Articles: a, an, the** — use **a** before a consonant sound (a book); **an** before a vowel sound
  a/e/i/o/u (an apple); **the** for a specific/known noun (the sun). Tip: when **u** sounds like "you",
  use **a** — a uniform, a unicorn.

## Sections

| # | key | heading | primitive | answer kind | pool (size) | default | max |
|---|-----|---------|-----------|-------------|-------------|---------|-----|
| 1 | `aan` | a or an? | typed input | `text` | words tagged a/an (42) | 6 | 12 |
| 2 | `article` | Choose the correct article | chip-select one `[a\|an\|the]` | — | sentences (14) | 5 | 10 |

**Distinctness:** both sections shuffle their pool and index by the 1-based question number → a distinct
word / sentence (and `data-answer` / correct chip) per question. Every `max` ≤ its pool size.

## Notes / decisions

- Section 1 decides a/an by beginning **sound**, including the tricky *u*-words: **an** uncle, **an**
  umbrella (vowel sound) vs **a** uniform, **a** unicorn, **a** ukelele ("you" sound).
- Section 2's correct chip is matched **case-insensitively**, so a sentence-initial "The …" maps to the
  lowercase `the` chip.
- No pictures, no custom answer-kinds, no bespoke widgets — pure typed input + chip-select-one, so this
  unit reuses the engine unchanged (the cleanest possible unit).

## Verification

- `TARGETS`: `seed=verify&aan=4&article=4` → happy **8/8**
- `DUP_PARAMS`: `aan=10&article=8` (each ≤ its pool)
- Confirmed: `PASS  articles  happy 8/8  probe 7/8  dups 0`.
- Registration: unit card + module quick-links in `index.html`.
