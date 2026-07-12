# Countable and Uncountable Nouns spec

Primary-One grammar unit teaching **countable vs uncountable nouns** through the quantifiers that go
with them. Countable nouns (books, apples) take **many** / **a few**; uncountable nouns (water, sugar)
take **much** / **a little**. A "Let's learn" box + two exercises: choose **many / much** (chip-select
one), and choose **a few / a little** (chip-select one).

File: `countable-uncountable-nouns.html` (copied from `subject-verb-agreement.html`). Config keys: `much`, `few`.

## Teaching block(s)

- **Countable and uncountable nouns** — countable nouns can be counted (books, apples), so they use
  **many** and **a few**; uncountable nouns cannot be counted (water, sugar), so they use **much** and
  **a little**.

## Sections

| # | key | heading | primitive | answer kind | pool (size) | default | max |
|---|-----|---------|-----------|-------------|-------------|---------|-----|
| 1 | `much` | many or much? | chip-select one `[many\|much]` | — | sentences (12) | 4 | 10 |
| 2 | `few` | a few or a little? | chip-select one `[a few\|a little]` | — | sentences (10) | 4 | 8 |

**Distinctness:** both shuffle their sentence pool and index by the 1-based question number → a distinct
sentence (and correct chip) per question. Every `max` ≤ its pool size.

## Notes / decisions

- Pure chip-select-one in both sections — reuses the engine unchanged (no pictures, custom kinds, or
  bespoke widgets). Same clean shape as `subject-verb-agreement.html`.
- Section 1 stores `{s, a}`; countable noun → **many**, uncountable noun → **much**.
- Section 2 stores `{s, a}`; countable noun → **a few**, uncountable noun → **a little**. Chip labels
  contain spaces ("a few", "a little") — the correct chip's label equals `t.a` exactly.

## Verification

- `TARGETS`: `seed=verify&much=4&few=4` → happy **8/8**
- `DUP_PARAMS`: `much=8&few=8` (each ≤ its pool)
- Expected: `PASS  countable-uncountable-nouns  happy 8/8  probe <8  dups 0`.
- Registration: unit card + module quick-links in `index.html`.
