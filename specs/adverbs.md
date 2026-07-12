# Adverbs spec

Primary-One grammar unit teaching **adverbs** (how something is done; many end in **-ly**). Based on
Unit 15 (pages 74–77) of the source workbook (`input/IMG_6929–6931`): a "Let's learn" box + "add -ly",
"tick the most suitable adverb", and "change to an adverb and make a sentence". Seeded generator.

File: `adverbs.html`. Config keys: `makely`, `choose`, `sentence`.

## Teaching block(s)

- **Adverbs** — an adverb tells us **how** something is done; many end in **-ly**: he runs **quickly**,
  she sings **sweetly**.
- **On paper ✍️** — a teach block before the print-only section.

## Sections

| # | key | heading | primitive | answer kind | pool (size) | default | max |
|---|-----|---------|-----------|-------------|-------------|---------|-----|
| 1 | `makely` | Add -ly to make an adverb | typed input | `text` | base→adverb (16) | 4 | 12 |
| 2 | `choose` | Choose the best adverb | chip-select one | — | sentences w/ 3 opts (8) | 4 | 8 |
| 3 | `sentence` | Make a sentence | **print-only** (parent-graded) | — | adverbs to use (6) | 3 | 6 |

**Distinctness:** each section shuffles its pool, indexed by question number → distinct item. Section 3
prints distinct "make a sentence with X" prompts (a `.writeline` per item, no gradable markup).

## Notes / decisions

- Section 1 forms the adverb (`quick → quickly`, `happy → happily`, `gentle → gently`) — a deterministic
  spelling per word, graded by the default case-insensitive `text` kind.
- Section 3 reproduces the workbook's "make a sentence" exercise as a **print-only, parent-graded**
  section (contributes **0** to the auto-score; the child writes on the line, an adult marks it).

## Verification

- `TARGETS`: `seed=verify&makely=4&choose=4&sentence=6` → happy **8/8** (the print-only `sentence=6` scores 0)
- `DUP_PARAMS`: `makely=10&choose=8&sentence=6` (each ≤ its pool)
- Expected: `PASS  adverbs  happy 8/8  probe <8  dups 0`.
- Registration: unit card + module quick-links in `index.html`.
