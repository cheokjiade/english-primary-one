# Possessive Adjectives and Pronouns spec

Primary-One grammar unit teaching **possessive adjectives** (my, your, his, her, our, their, its) and
**possessive pronouns** (mine, yours, his, hers, ours, theirs). Built as a seeded generator; each
section renders distinct questions from a shuffled sentence pool.

File: `possessive-pronouns.html` (copied from `subject-verb-agreement.html`). Config keys: `adjective`,
`pronoun`.

## Teaching block(s)

- **Possessive words** — a **possessive adjective** comes **before** a noun (*my doll, your bicycle*);
  a **possessive pronoun** stands **alone** (*This doll is hers*).

## Sections

| # | key | heading | primitive | answer kind | pool (size) | default | max |
|---|-----|---------|-----------|-------------|-------------|---------|-----|
| 1 | `adjective` | Write the possessive adjective | typed input | `text` | sentences (10) | 4 | 10 |
| 2 | `pronoun` | Write the possessive pronoun | typed input | `text` | sentences (10) | 4 | 10 |

**Distinctness:** both shuffle their sentence pool and index by the 1-based question number → a distinct
sentence (and correct `data-answer`) per question. Every `max` ≤ its pool size (10).

## Notes / decisions

- Pure typed input — no chips, no custom kinds, no bespoke widgets — so it reuses the engine unchanged
  (`WS.wirePanel` only; no `WS.wireChips()`). Same clean shape as `articles.html`.
- Answers are graded by the default case-insensitive `text` kind, so `hers`/`Hers` both mark correct.
  The input has no `maxlength` (answers run up to six letters, e.g. `theirs`).
- `his` is intentionally used as both a possessive adjective (Section 1) and a possessive pronoun
  (Section 2) — it is the one form that is identical for both, which is correct usage.

## Verification

- `TARGETS`: `seed=verify&adjective=4&pronoun=4` → happy **8/8**
- `DUP_PARAMS`: `adjective=8&pronoun=8` (each ≤ its pool)
- Expected: `PASS  possessive-pronouns  happy 8/8  probe <8  dups 0`.
- Registration: unit card + module quick-links in `index.html`.
