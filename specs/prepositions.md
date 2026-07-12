# Prepositions spec

Primary-One grammar unit teaching **prepositions** of **time** (in, on, at) and **place** (in, on,
under, above, beside, between). Two fill-in-the-blank exercises become chip-select-one sections — each
sentence carries a `___` blank and three options, exactly one correct — and a final "read and draw"
task, which a screen cannot self-mark, is reproduced as a **print-only, parent-graded** section (a
drawing prompt + an empty box, per AGENTS.md). Seeded generator; distinct questions.

File: `prepositions.html` (copied from `adjectives.html`). Config keys: `time`, `place`, `draw`.

## Teaching block(s)

- **Prepositions** — a preposition tells us **when** (in, on, at) or **where** (in, on, under, above,
  beside, between) something is. Use **at** for a time, **on** for a day or date, and **in** for a
  month or a longer time. (Rendered before section 1.)
- **On paper ✍️** — a short print-only note before the draw section: "Do this last part on the printed
  sheet — a grown-up marks it." (Same second `WS.teach` as the template.)

## Sections

| # | key | heading | primitive | answer kind | pool (size) | default | max |
|---|-----|---------|-----------|-------------|-------------|---------|-----|
| 1 | `time`  | in, on or at?                | chip-select one `[in\|on\|at]`            | — | sentences (12) | 4 | 12 |
| 2 | `place` | Where is it?                 | chip-select one `[in\|on\|under\|above\|beside]` | — | sentences (8) | 4 | 8 |
| 3 | `draw`  | Read and draw the missing item | **print-only** (parent-graded) | none (not marked) | draw prompts (6) | 3 | 6 |

**Distinctness:** each section shuffles its pool once (`const order = shuffle(POOL)`) and indexes by the
1-based question number (`order[(i-1)%order.length]`) → a distinct sentence/prompt (and, for the chip
sections, a distinct correct chip) per question. Every `max` ≤ its pool size (12 / 8 / 6), so every
question in a section is unique. Sections 1 and 2 render like the template's `gFit`: the sentence's
`___` becomes a `.blankmark`, followed by the shuffled option chips; the correct chip label equals the
pool item's `a`, so exactly one chip carries `data-ok="1"` per block.

## Print-only section (per AGENTS.md)

Section 3 is the ungradable "read and draw" task reproduced faithfully rather than dropped. It emits
plain `.item`s — a numbered prompt (`Draw <b>…</b>.`) plus an empty `.drawbox` — with **no**
`.gradable` / `.chip` / `.dslot` markup, so the auto-marker ignores it (like a `WS.teach` block). It
contributes **0** to the score, so it does not change the `happy N/N` expectation; the duplicate scanner
still scans its `.item`s, so its `max`/count is kept ≤ its 6-prompt pool. The child draws each scene on
the printout and a grown-up marks it.

## Verification

- `TARGETS`: `seed=verify&time=4&place=4&draw=6` → happy **8/8** (4 time chips + 4 place chips; the 6
  draw items are print-only and score 0).
- `DUP_PARAMS`: `time=10&place=8&draw=6` (each ≤ its pool of 12 / 8 / 6).
- Expected: `PASS  prepositions  happy 8/8  probe <8  dups 0` (probe drops via a section-1 chip).
- Registration: unit card + module quick-links in `index.html` (not wired here — engine/verify files untouched).

## Notes / decisions

- Two pure chip-select-one sections + one print-only draw section — the same shape as `adjectives.html`
  (its `gFit` chip generator reused for both graded sections; its `gDraw` print-only generator reused
  verbatim). No pictures, custom answer kinds, or bespoke widgets.
- Time vs. place is encoded in the sentence wording, which is what makes the workbook's picture-based
  "where is it?" exercise gradable on screen.
