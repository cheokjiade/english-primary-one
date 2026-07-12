# Present Continuous Tense spec

Primary-One grammar unit teaching the **present continuous tense** — an action happening *now*, formed
with **is / are + verb + -ing** (*He is running. They are playing.*). A "Let's learn" box + two
exercises: build the **-ing** form of a verb (typed), and choose **is / are** to match the subject
(chip-select one).

File: `present-continuous-tense.html` (copied from `subject-verb-agreement.html`). Config keys: `ing`, `isare`.

## Teaching block(s)

- **Present continuous tense** — shows an action happening **now**. Use **is** or **are** + the verb +
  **-ing**. *He is running. They are playing.*

## Sections

| # | key | heading | primitive | answer kind | pool (size) | default | max |
|---|-----|---------|-----------|-------------|-------------|---------|-----|
| 1 | `ing`   | Add -ing to the verb | typed input | `text` | verbs base→-ing (17) | 4 | 10 |
| 2 | `isare` | is or are? | chip-select one `[is\|are]` | — | sentences (14) | 4 | 10 |

**Distinctness:** both shuffle their pool and index by the 1-based question number → a distinct verb (and
`data-answer` -ing form) / sentence (and correct chip) per question. Every `max` ≤ its pool size.

## Notes / decisions

- Pure typed input + chip-select-one — reuses the engine unchanged (no pictures, custom kinds, or
  bespoke widgets). Same clean shape as `subject-verb-agreement.html`.
- Section 1 stores `{base, ing}` and grades the typed `-ing` form (case-insensitive `text` kind). The
  pool mixes plain add-`-ing` (play→playing), double-consonant (run→running), and drop-`e`
  (write→writing) so the spelling patterns all appear.
- Section 2 stores `{s, a}`; singular subject → **is**, plural subject → **are**.

## Verification

- `TARGETS`: `seed=verify&ing=4&isare=4` → happy **8/8**
- `DUP_PARAMS`: `ing=10&isare=8` (each ≤ its pool)
- Expected: `PASS  present-continuous-tense  happy 8/8  probe <8  dups 0`.
- Registration: unit card + module quick-links in `index.html`.
