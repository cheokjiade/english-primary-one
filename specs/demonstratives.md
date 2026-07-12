# Demonstrative Pronouns spec

Primary-One grammar unit teaching the demonstrative pronouns **this / that / these / those**. The
source workbook shows near/far with a **picture**; a screen worksheet cannot self-mark a picture, so
each sentence instead carries a **text proximity clue** ("next to me", "in my hand" = near · "far
away", "over there" = far). The clue makes exactly one demonstrative correct, so every item is
self-marking. Both workbook exercises (this/that · these/those) become chip-select-one sections.

File: `demonstratives.html` (copied from `subject-verb-agreement.html`). Config keys: `singular`, `plural`.

## Teaching block(s)

- **Demonstrative pronouns** — they point to things. Use **this** (one, near) and **that** (one, far);
  use **these** (many, near) and **those** (many, far).

## Sections

| # | key | heading | primitive | answer kind | pool (size) | default | max |
|---|-----|---------|-----------|-------------|-------------|---------|-----|
| 1 | `singular` | this or that?   | chip-select one `[This\|That]`   | — | sentences (12) | 4 | 12 |
| 2 | `plural`   | these or those? | chip-select one `[These\|Those]` | — | sentences (12) | 4 | 8  |

**Distinctness:** each section shuffles its sentence pool once (`const order = shuffle(POOL)`) and
indexes by the 1-based question number (`order[(i-1)%order.length]`) → a distinct sentence (and correct
chip) per question. Every `max` ≤ its pool size (12), so every question in a section is unique.

The correct chip label equals the pool item's `a` exactly and case-sensitively — `This` / `That` in
section 1, `These` / `Those` in section 2 — so `data-ok="1"` lands on exactly one chip per block.

## Notes / decisions

- Pure chip-select-one in both sections — reuses the engine unchanged (no pictures, custom kinds, or
  bespoke widgets). Same clean shape as the chip section of `subject-verb-agreement.html`.
- Proximity is encoded in the sentence wording rather than an image, which is what makes the picture-
  based workbook exercise gradable on screen.

## Verification

- `TARGETS`: `seed=verify&singular=4&plural=4` → happy **8/8**
- `DUP_PARAMS`: `singular=10&plural=8` (each ≤ its pool of 12)
- Expected: `PASS  demonstratives  happy 8/8  probe <8  dups 0`.
- Registration: unit card + module quick-links in `index.html` (not wired here — engine/verify files untouched).
