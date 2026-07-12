# Adjectives spec

Primary-One grammar unit teaching **adjectives** (describing words). Based on Unit 13 (pages 61–63) of
the source workbook (`input/IMG_6924–6925`): a "Let's learn" box + "underline the adjective", "circle
the adjective / fill from box", and "read and draw the pictures". Seeded generator; distinct questions.

File: `adjectives.html`. Config keys: `find`, `fit`, `draw`.

## Teaching block(s)

- **Adjectives** — an adjective describes a noun; it tells us more about it: a **big** house, a **red**
  apple, a **sunny** day.
- **On paper ✍️** — a second teach block before the print-only section, telling the child a grown-up
  marks that part.

## Sections

| # | key | heading | primitive | answer kind | pool (size) | default | max |
|---|-----|---------|-----------|-------------|-------------|---------|-----|
| 1 | `find` | Which word is the adjective? | chip-select one | — | sentences w/ 3 opts (12) | 4 | 12 |
| 2 | `fit` | Choose the best adjective | chip-select one | — | sentences w/ 3 opts (12) | 4 | 12 |
| 3 | `draw` | Read and draw the picture | **print-only** (parent-graded) | — | draw prompts (6) | 3 | 6 |

**Distinctness:** each section shuffles its pool, indexed by question number → distinct item. Section 3
prints distinct draw prompts (a `.drawbox` per item, no gradable markup — see *Reproduce every exercise*
in `AGENTS.md`).

## Notes / decisions

- Section 3 reproduces the workbook's "read and draw" exercise as a **print-only, parent-graded** section
  (no `.gradable`/`.chip` markup → contributes **0** to the auto-score; the child draws in the box and an
  adult marks it). It renders during verification but does not change the `happy 8/8` expectation.

## Verification

- `TARGETS`: `seed=verify&find=4&fit=4&draw=6` → happy **8/8** (the print-only `draw=6` scores 0)
- `DUP_PARAMS`: `find=10&fit=10&draw=6` (each ≤ its pool)
- Expected: `PASS  adjectives  happy 8/8  probe <8  dups 0`.
- Registration: unit card + module quick-links in `index.html`.
