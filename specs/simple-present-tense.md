# Simple Present Tense spec

Primary-One grammar unit teaching the **simple present tense** (add -s for a singular subject; plain
verb for I / you / plural). Based on Unit 10 (pages 43–49) of the source workbook
(`input/IMG_6913–6916`): a "Let's learn" box + verb-form exercises (choose the form · fill the correct
form). The picture-based "circle the verb in the sentence" exercise is not reproduced (it identifies a
word rather than choosing a form). Seeded generator; distinct questions per section.

File: `simple-present-tense.html` (copied from `beginning-sounds.html`). Config keys: `choose`, `form`.

## Teaching block(s)

- **Simple present tense** — shows something that happens often, or a fact. Add **-s** when the subject
  is one (he/she/it or a single noun): *The cat runs.* Use the plain verb for I, you, or more than one:
  *The cats run.*

## Sections

| # | key | heading | primitive | answer kind | pool (size) | default | max |
|---|-----|---------|-----------|-------------|-------------|---------|-----|
| 1 | `choose` | Choose the correct verb | chip-select one `[base\|base+s]` | — | sentences (16) | 5 | 12 |
| 2 | `form` | Write the verb correctly | typed input | `text` | sentences (12) | 4 | 10 |

**Distinctness:** both shuffle their sentence pool and index by the 1-based question number → a distinct
sentence (and correct chip / `data-answer`) per question. Every `max` ≤ its pool size.

## Notes / decisions

- The correct form is fully **text-determined** by the subject (singular → +s; I/you/plural → base), so
  no pictures are needed. Section 2 shows the base verb as a grey hint and expects the correctly-formed
  verb (`lays`, `watches`, `flies`, …) — a spelling that is deterministic per verb.
- Pure typed input + chip-select-one — reuses the engine unchanged.

## Verification

- `TARGETS`: `seed=verify&choose=4&form=4` → happy **8/8**
- `DUP_PARAMS`: `choose=10&form=8` (each ≤ its pool)
- Expected: `PASS  simple-present-tense  happy 8/8  probe <8  dups 0`.
- Registration: unit card + module quick-links in `index.html`.
