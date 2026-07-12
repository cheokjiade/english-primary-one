# Places spec

Primary-One **vocabulary** unit teaching **places** — the special name for each place and what people do
there (we watch films at the *cinema*, borrow books at the *library*, see fish at the *aquarium*). Built
on the reusable **matching widget** first introduced by `simple-past-tense.html`: a "Let's learn" box +
"match each place to what you do there" + "choose the place". Seeded generator; distinct questions.

File: `places.html` (copied verbatim from `parents-and-young.html`, the vocab template — only the content
strings, `PAIRS` and `CHOOSE` change; the matching-widget CSS/JS/wiring stays byte-identical). Config
keys: `match`, `choose`.

## Teaching block(s)

- **Places** — places have special names for what they are used for. We watch films at the **cinema**,
  borrow books at the **library**, and see fish at the **aquarium**.

## Sections

| # | key | heading | primitive | answer kind | pool (size) | default | max |
|---|-----|---------|-----------|-------------|-------------|---------|-----|
| 1 | `match` | Match each place to what you do there | **matching widget** (reused) | custom marker `markMatch` | activity→place pairs (10) | 5 | 6 |
| 2 | `choose` | Choose the place | chip-select one | — | sentences (8) | 4 | 8 |

**Distinctness:** section 2 shuffles its pool, indexed by question number → distinct sentence + correct
chip. The matching widget draws `match` **distinct pairs without replacement**, so its activities/places
are unique (it is a single non-`.item` widget, so the dup-scanner does not police it — the generator
does). Pair pool: left values (what you do) are all distinct; right values (the places) are all distinct.

## Reused interaction & marking — the matching widget (in-page)

The tap-to-connect widget is copied **byte-for-byte** from `parents-and-young.html` /
`simple-past-tense.html` (see AGENTS.md): a left column of prompts (`.mleft[data-answer]` = what you do)
and a right column of shuffled answers (`.mright[data-val]` = the places), with an SVG overlay
(`.mlines`). Tap a left item then a right item to join them (a line is drawn); each left item stores its
chosen partner in `data-conn`.

- **`markMatch`** (passed to `WS.mark({ extras:[markMatch] })`) scores **each left item** 1 point, correct
  iff `data-conn === data-answer`; it paints the boxes and recolours the lines green/red.
- **`window.__wsAutoSolve`** connects every left item to its correct place and redraws — the verifier's
  `EXTENSION POINT` calls it, so the happy path completes the widget. Reset is wired through
  `WS.clearAll(resetMatch)`.
- Only `PAIRS` (activity→place), `MATCH_HEADS` (`['You go there to…', 'The place']`), and the `buildMatch`
  `<h2>` change for this unit; the widget JS (`SVGNS`, `buildMatch`, `lineColor`, `drawMatch`, `wireMatch`,
  `resetMatch`, `markMatch`, `__wsAutoSolve`) is identical to the template.

## Verification

- `TARGETS`: `seed=verify&match=4&choose=4` → happy **8/8** (4 match points + 4 chip points)
- `DUP_PARAMS`: `match=6&choose=8` (each ≤ its pool: 6 ≤ 10 pairs, 8 ≤ 8 sentences)
- Expected: `PASS  places  happy 8/8  probe <8  dups 0` (probe drops via the section-2 chip; the matching
  widget is auto-solved every run).
- Scope note: like the other matching-widget vocab units, `places` is documented here but **not** added to
  the hardcoded `verify/verify.js` TARGETS array, and `index.html` registration is left untouched.
