# Simple Past Tense spec

Primary-One grammar unit teaching the **simple past tense**. Based on Unit 12 (pages 55–61) of the
source workbook (`input/IMG_6919–6922`): a "Let's learn" box + "match each verb to its past tense",
"circle/tick the correct form", "answer with a past-tense verb". This unit **introduces the reusable
matching widget** (used later by the vocabulary units). Seeded generator; distinct questions.

File: `simple-past-tense.html` (copied from `beginning-sounds.html`). Config keys: `match`, `past`, `answer`.

## Teaching block(s)

- **Simple past tense** — shows something that already happened. Many verbs add **-ed** (walk →
  walked); some change completely (eat → ate, go → went).

## Sections

| # | key | heading | primitive | answer kind | pool (size) | default | max |
|---|-----|---------|-----------|-------------|-------------|---------|-----|
| 1 | `match` | Match each verb to its past tense | **matching widget** (custom) | custom marker `markMatch` | verb→past pairs (16) | 5 | 6 |
| 2 | `past` | Choose the past tense | chip-select one | — | sentences (12) | 4 | 10 |
| 3 | `answer` | Answer the question | write-line (**print-only**, parent-graded) | — (no gradable markup) | questions (8) | 4 | 8 |

**Distinctness:** section 2 shuffles its pool, indexed by question number → distinct sentence + correct
chip. The matching widget draws `match` **distinct pairs without replacement**, so its verbs/answers are
unique (it is a single non-`.item` widget, so the dup-scanner does not police it — the generator does).

## New interaction & marking — the matching widget (in-page, reusable)

A tap-to-connect widget: a left column of prompts (`.mleft[data-answer]`) and a right column of shuffled
answers (`.mright[data-val]`), with an SVG overlay (`.mlines`). Tap a left item then a right item to
join them (a line is drawn); each left item stores its chosen partner in `data-conn`.

- **`markMatch`** (passed to `WS.mark({ extras:[markMatch] })`) scores **each left item** 1 point,
  correct iff `data-conn === data-answer`; it paints the boxes and recolours the lines green/red.
- **`window.__wsAutoSolve`** connects every left item to its correct answer and redraws — the verifier's
  `EXTENSION POINT` calls it, so the happy path completes the widget (same convention as the annotation
  widget). Reset is wired through `WS.clearAll(resetMatch)`.
- The widget is **reusable** for the vocabulary matching units (Parents & Young, Places, Occupations,
  People, Homes): only the pair pool and column headings change.

## Verification

- `TARGETS`: `seed=verify&match=4&past=4` → happy **8/8** (4 match points + 4 chip points)
- `DUP_PARAMS`: `match=6&past=8` (each ≤ its pool)
- Expected: `PASS  simple-past-tense  happy 8/8  probe <8  dups 0` (probe drops via the section-2 chip).
- Registration: unit card + module quick-links in `index.html`.
