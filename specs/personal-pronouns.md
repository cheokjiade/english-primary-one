# Personal Pronouns spec

Primary-One grammar unit teaching **personal pronouns** — that a pronoun takes the place of a noun.
**Subject pronouns** (I, you, he, she, it, we, they) do the action; **object pronouns** (me, you, him,
her, it, us, them) receive the action. A "Let's learn" box + two exercises (choose the subject pronoun ·
choose the object pronoun). Both "choose" exercises are chip-select sections (mirroring `gChoose`).

File: `personal-pronouns.html` (copied from `subject-verb-agreement.html`). Config keys: `subject`, `object`.

## Teaching block(s)

- **Personal pronouns** — a **pronoun** takes the place of a noun. **Subject pronouns** do the action:
  I, you, he, she, it, we, they. **Object pronouns** receive the action: me, you, him, her, it, us, them.

## Sections

| # | key | heading | primitive | answer kind | pool (size) | default | max |
|---|-----|---------|-----------|-------------|-------------|---------|-----|
| 1 | `subject` | Choose the subject pronoun | chip-select one `[He\|She\|It\|We\|They]` | — | sentences (12) | 4 | 12 |
| 2 | `object` | Choose the object pronoun | chip-select one `[him\|her\|it\|us\|them]` | — | sentences (9) | 4 | 9 |

Both sections show the **same 5 chips** on every item (data-ok=1 on the correct one); exactly one
correct chip per block. `subject` chips are `['He','She','It','We','They']`; `object` chips are
`['him','her','it','us','them']`.

**Distinctness:** both shuffle their sentence pool and index by the 1-based question number
(`order[(i-1)%order.length]`) → a distinct sentence (and correct chip) per question. Every `max` ≤ its
pool size (subject 12 = pool 12; object 9 = pool 9).

## Notes / decisions

- Pure chip-select-one in both sections — reuses the engine unchanged (no pictures, custom kinds, or
  bespoke widgets). Same clean shape as `subject-verb-agreement.html`'s `gChoose`, applied twice.
- Object-pronoun items carry a parenthetical hint of the naming word being replaced (e.g. *(Joanne)*)
  so the child knows which noun the object pronoun stands for.

## Verification

- `TARGETS`: `seed=verify&subject=4&object=4` → happy **8/8**
- `DUP_PARAMS`: `subject=10&object=8` (each ≤ its pool)
- Expected: `PASS  personal-pronouns  happy 8/8  probe <8  dups 0`.
- Registration: unit card + module quick-links in `index.html`.
