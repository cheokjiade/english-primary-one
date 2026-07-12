# Subject-Verb Agreement (is, are) spec

Primary-One grammar unit teaching subject-verb agreement for **is / are**. Based on Unit 9 (pages
40–42) of the source workbook (`input/IMG_6912–6913`): a "Let's learn" box + three exercises (circle
is/are · fill is/are · tick is/are). The two "choose" exercises (circle + tick) collapse into one
chip-select section; the fill exercise is a typed section.

File: `subject-verb-agreement.html` (copied from `beginning-sounds.html`). Config keys: `choose`, `fill`.

## Teaching block(s)

- **Subject-verb agreement** — use **is** when the subject is singular (one); use **are** when the
  subject is plural (more than one). *The boy is here / The boys are here.*

## Sections

| # | key | heading | primitive | answer kind | pool (size) | default | max |
|---|-----|---------|-----------|-------------|-------------|---------|-----|
| 1 | `choose` | Choose: is or are | chip-select one `[is\|are]` | — | sentences (17) | 5 | 12 |
| 2 | `fill` | Fill in: is or are | typed input | `text` | sentences (12) | 4 | 10 |

**Distinctness:** both shuffle their sentence pool and index by the 1-based question number → a distinct
sentence (and correct chip / `data-answer`) per question. Every `max` ≤ its pool size.

## Notes / decisions

- Pure typed input + chip-select-one — reuses the engine unchanged (no pictures, custom kinds, or
  bespoke widgets). Same clean shape as `articles.html`.

## Verification

- `TARGETS`: `seed=verify&choose=4&fill=4` → happy **8/8**
- `DUP_PARAMS`: `choose=10&fill=8` (each ≤ its pool)
- Expected: `PASS  subject-verb-agreement  happy 8/8  probe <8  dups 0`.
- Registration: unit card + module quick-links in `index.html`.
