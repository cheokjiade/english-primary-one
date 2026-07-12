# Gender (Male and Female) spec

Primary-One vocabulary unit teaching **gender** — the **male** (masculine) and **female**
(feminine) forms of common nouns. Copied verbatim from `parents-and-young.html` (the vocabulary
template): the reusable **matching widget** + a chip-select "choose" section, with only the pair
pool, the choose pool, the headings and the teaching text swapped. Seeded generator; distinct
questions.

File: `gender.html` (copied from `parents-and-young.html`). Config keys: `match`, `choose`.

## Teaching block(s)

- **Gender — male and female** — some nouns have a **male** (masculine) and a **female**
  (feminine) form: a **boy** and a **girl**; a **king** and a **queen**; an **uncle** and an **aunt**.

## Sections

| # | key | heading | primitive | answer kind | pool (size) | default | max |
|---|-----|---------|-----------|-------------|-------------|---------|-----|
| 1 | `match` | Match the male to the female | **matching widget** (reused) | custom marker `markMatch` | male→female pairs (10) | 5 | 6 |
| 2 | `choose` | Choose the female word | chip-select one | — | sentences (8) | 4 | 8 |

**Distinctness:** section 2 shuffles its pool, indexed by question number → distinct sentence + correct
chip (8 items, so `choose=8` stays 0-dup). The matching widget draws `match` **distinct pairs without
replacement**, so its male prompts and female answers are unique (it is a single non-`.item` widget, so
the dup-scanner does not police it — the generator does). The PAIRS left (male) and right (female)
columns are also mutually distinct, so each pairing has a single unambiguous solution.

## Matching widget (reused, not re-introduced)

Same tap-to-connect widget introduced by `simple-past-tense.html` and carried by the vocabulary
template: a left column of prompts (`.mleft[data-answer]`), a right column of shuffled answers
(`.mright[data-val]`), an SVG overlay (`.mlines`); tap a left item then a right item to join them, and
each left item stores its chosen partner in `data-conn`. This unit only swaps the pool (`PAIRS`,
male→female), the column heads (`MATCH_HEADS = ['Male', 'Female']`) and the `<h2>`; the widget JS
(`drawMatch`, `wireMatch`, `resetMatch`, `markMatch`, `window.__wsAutoSolve`, and the body of
`buildMatch` apart from its `<h2>` heading) is **byte-identical** to the template.

- **`markMatch`** (passed to `WS.mark({ extras:[markMatch] })`) scores **each left item** 1 point,
  correct iff `data-conn === data-answer`; it paints the boxes and recolours the lines green/red.
- **`window.__wsAutoSolve`** connects every left item to its correct answer and redraws — the verifier's
  happy path calls it to complete the widget. Reset flows through `WS.clearAll(resetMatch)`.

## Verification

- `TARGETS`: `seed=verify&match=4&choose=4` → happy **8/8** (4 match points + 4 chip points)
- `DUP_PARAMS`: `match=6&choose=8` (each ≤ its pool: 10 pairs, 8 sentences)
- Expected: `PASS  gender  happy 8/8  probe <8  dups 0` (probe drops via the section-2 chip).
- Registration: unit card + module quick-link in `index.html` — pending (out of scope for this task;
  `index.html` and `verify.js` were not touched).
