# Occupations spec

Primary-One vocabulary unit teaching **occupations** — the names of common jobs and the workers who do
them. A "Let's learn" box + "match each job to the worker" + "who am I? (choose the worker)". This unit
**reuses the matching widget** introduced by `simple-past-tense.html` (see AGENTS.md); only the pair pool
and column headings change. Seeded generator; distinct questions.

File: `occupations.html` (copied from `parents-and-young.html`, the vocab template). Config keys: `match`,
`choose`.

## Teaching block(s)

- **Occupations** — an occupation is the work or job a person does. A **baker** bakes bread; a **doctor**
  treats the sick; a **pilot** flies planes.

## Sections

| # | key | heading | primitive | answer kind | pool (size) | default | max |
|---|-----|---------|-----------|-------------|-------------|---------|-----|
| 1 | `match` | Match each job to the worker | **matching widget** (reused) | custom marker `markMatch` | job→worker pairs (10) | 5 | 6 |
| 2 | `choose` | Who am I? | chip-select one | — | sentences (8) | 4 | 8 |

**Distinctness:** section 2 shuffles its pool, indexed by question number → distinct sentence + correct
chip. The matching widget draws `match` **distinct pairs without replacement**, so its jobs/workers are
unique (it is a single non-`.item` widget, so the dup-scanner does not police it — the generator does).
Pair pool: left values (the work done) are all distinct; right values (the workers) are all distinct.

## Reused interaction & marking — the matching widget (in-page)

The tap-to-connect widget is copied **byte-for-byte** from `simple-past-tense.html` /
`parents-and-young.html`: a left column of prompts (`.mleft[data-answer]`) and a right column of shuffled
answers (`.mright[data-val]`), with an SVG overlay (`.mlines`). Tap a left item then a right item to join
them (a line is drawn); each left item stores its chosen partner in `data-conn`.

- **`markMatch`** (passed to `WS.mark({ extras:[markMatch] })`) scores **each left item** 1 point, correct
  iff `data-conn === data-answer`; it paints the boxes and recolours the lines green/red.
- **`window.__wsAutoSolve`** connects every left item to its correct answer and redraws — the verifier's
  `EXTENSION POINT` calls it, so the happy path completes the widget. Reset is wired through
  `WS.clearAll(resetMatch)`.
- Only `PAIRS`, `MATCH_HEADS` (`['Job', 'Worker']`), and the `buildMatch` `<h2>` change for this unit; the
  widget JS (`SVGNS`, `buildMatch`, `lineColor`, `drawMatch`, `wireMatch`, `resetMatch`, `markMatch`,
  `__wsAutoSolve`) is identical to the template.

## Verification

- `TARGETS`: `seed=verify&match=4&choose=4` → happy **8/8** (4 match points + 4 chip points)
- `DUP_PARAMS`: `match=6&choose=8` (each ≤ its pool: match ≤ 10, choose ≤ 8)
- Expected: `PASS  occupations  happy 8/8  probe <8  dups 0` (probe drops via the section-2 chip).
- Registration: unit card + module quick-links in `index.html` (not modified by this task).
