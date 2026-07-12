# People spec

Primary-One **vocabulary** unit teaching the special names we give people by what they do
(a **cyclist**, a **passenger**, a **pedestrian**, a **burglar** …). Copied from
`parents-and-young.html` (the vocab template): the same reusable **matching widget** + a chip-select
"choose" section, with the pair pool, column headings and sentences swapped for people. Seeded
generator; distinct questions.

File: `people.html` (copied verbatim from `parents-and-young.html`). Config keys: `match`, `choose`.

## Teaching block(s)

- **People** — we have special names for people by what they do. Someone who rides a bicycle is a
  **cyclist**; someone who travels on a train is a **passenger**.

## Sections

| # | key | heading | primitive | answer kind | pool (size) | default | max |
|---|-----|---------|-----------|-------------|-------------|---------|-----|
| 1 | `match` | Match each person to what they do | **matching widget** (custom) | custom marker `markMatch` | activity→person pairs (10) | 5 | 6 |
| 2 | `choose` | Choose the person | chip-select one | — | sentences (8) | 4 | 8 |

**Distinctness:** section 2 shuffles its pool, indexed by question number → distinct sentence + correct
chip. The matching widget draws `match` **distinct pairs without replacement**, so its prompts/answers are
unique (it is a single non-`.item` widget, so the dup-scanner does not police it — the generator does).

## Interaction & marking — the matching widget (in-page, reusable)

A tap-to-connect widget (introduced by `simple-past-tense.html`, see `specs/simple-past-tense.md`): a left
column of prompts (`.mleft[data-answer]`) — here **what a person does** — and a right column of shuffled
answers (`.mright[data-val]`) — the **person's name** — with an SVG overlay (`.mlines`). Tap a left item
then a right item to join them (a line is drawn); each left item stores its chosen partner in `data-conn`.

- **`markMatch`** (passed to `WS.mark({ extras:[markMatch] })`) scores **each left item** 1 point,
  correct iff `data-conn === data-answer`; it paints the boxes and recolours the lines green/red.
- **`window.__wsAutoSolve`** connects every left item to its correct answer and redraws — the verifier's
  `EXTENSION POINT` calls it, so the happy path completes the widget. Reset is wired through
  `WS.clearAll(resetMatch)`.
- The widget code (`SVGNS`, `buildMatch`, `lineColor`, `drawMatch`, `wireMatch`, `resetMatch`, `markMatch`,
  `window.__wsAutoSolve`), the `<style>` block, the `gChoose` generator and the wiring block are
  **byte-identical** to the template — only `PAIRS`, `MATCH_HEADS`, the `buildMatch` `<h2>`, the `CHOOSE`
  pool and the section headings/labels changed.

## Verification

- `TARGETS`: `seed=verify&match=4&choose=4` → happy **8/8** (4 match points + 4 chip points)
- `DUP_PARAMS`: `match=6&choose=8` (each ≤ its pool: 10 pairs, 8 sentences)
- Expected: `PASS  people  happy 8/8  probe <8  dups 0` (probe drops via the section-2 chip).
- Registration: **out of scope for this build** — `people.html` is intentionally **not** yet added to
  `verify/verify.js` or `index.html`. When registered, add:
  - `TARGETS`: `{ name: 'people', file: 'people.html', params: 'seed=verify&match=4&choose=4' }`
  - `DUP_PARAMS`: `'people': 'match=6&choose=8'`
