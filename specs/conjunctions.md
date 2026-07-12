# Conjunctions (and, but, or) spec

Primary-One grammar unit teaching the conjunctions **and / but / or**. Based on Unit 16 (pages 78–80)
of the source workbook (`input/IMG_6932–6933`): a "Let's learn" box + two exercise types (fill
and/but/or · circle and/but/or). Built as a seeded generator; each section renders distinct questions.

File: `conjunctions.html` (copied from `beginning-sounds.html`). Config keys: `fill`, `choose`.

## Teaching block(s)

- **Conjunctions: and, but, or** — joining words that connect ideas. **and** = things that go together;
  **but** = a contrast; **or** = a choice.

## Sections

| # | key | heading | primitive | answer kind | pool (size) | default | max |
|---|-----|---------|-----------|-------------|-------------|---------|-----|
| 1 | `fill` | Fill in: and, but or or | typed input | `text` | sentences (13) | 5 | 12 |
| 2 | `choose` | Choose the joining word | chip-select one `[and\|but\|or]` | — | sentences (11) | 4 | 8 |

**Distinctness:** both shuffle their sentence pool and index by the 1-based question number → a distinct
sentence (and correct chip / `data-answer`) per question. Every `max` ≤ its pool size.

## Notes / decisions

- Pure typed input + chip-select-one — reuses the engine unchanged. Some sentences accept only one
  natural conjunction; ambiguous cases were avoided in the pool so a single answer is defensible.

## Verification

- `TARGETS`: `seed=verify&fill=4&choose=4` → happy **8/8**
- `DUP_PARAMS`: `fill=10&choose=8` (each ≤ its pool)
- Expected: `PASS  conjunctions  happy 8/8  probe <8  dups 0`.
- Registration: unit card + module quick-links in `index.html`.
