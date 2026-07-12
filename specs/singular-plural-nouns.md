# Singular and Plural Nouns spec

Primary-One grammar unit teaching **singular vs plural nouns** — how to make the plural of a noun. A
"Let's learn" box covers the regular rules (add **-s**; add **-es** after s, x, ch, sh; change **y** to
**-ies**) plus a note on special (irregular) plurals. Two exercises: write the plural of a regular noun
(typed) and choose the correct plural of a special noun (chip-select one).

File: `singular-plural-nouns.html` (copied from `subject-verb-agreement.html`). Config keys: `write`, `choose`.

## Teaching block(s)

- **Singular and plural nouns** — a **singular** noun means one; a **plural** noun means more than one.
  Add **-s** (cat → cats); add **-es** after s, x, ch, sh (box → boxes); change **y** to **-ies**
  (baby → babies); some are special (man → men).

## Sections

| # | key | heading | primitive | answer kind | pool (size) | default | max |
|---|-----|---------|-----------|-------------|-------------|---------|-----|
| 1 | `write`  | Write the plural          | typed input             | `text` | singular→plural (18) | 4 | 12 |
| 2 | `choose` | Choose the correct plural | chip-select one `[a\|b]`| —      | one→plural (8)       | 4 | 8  |

**Distinctness:** both shuffle their noun pool and index by the 1-based question number
(`order[(i-1) % order.length]`) → a distinct noun (and correct `data-answer` / chip) per question. In
section 2 the two chips are additionally shuffled per item with the seeded rng, so the correct plural is
not always first; exactly one chip stays `data-ok="1"`. Every `max` ≤ its pool size.

## Notes / decisions

- Pure typed input + chip-select-one — reuses the engine unchanged (no pictures, custom kinds, or
  bespoke widgets). Same clean shape as `subject-verb-agreement.html`.
- Section 1 pool is regular plurals only (spelling rules are learnable); section 2 pool is irregular
  plurals presented as a two-option choice (right vs the tempting `-s` over-generalisation).

## Verification

- `TARGETS`: `seed=verify&write=4&choose=4` → happy **8/8**
- `DUP_PARAMS`: `write=10&choose=8` (each ≤ its pool)
- Expected: `PASS  singular-plural-nouns  happy 8/8  probe <8  dups 0`.
- Registration: unit card + module quick-links in `index.html` (not wired here; verify.js TARGETS/DUP_PARAMS untouched).
