# Parents and Their Young spec

Primary-One **vocabulary** unit teaching the special names of animal parents and their young. Based on
Unit 21 (pages 94–97) of the source workbook (`input/IMG_6940–6941`): a "Let's learn" box + "match the
young to their parents" + "write the name of the young". This is the **template** for the vocabulary
units — it uses the reusable **matching widget** (see `specs/simple-past-tense.md` and `AGENTS.md`).

File: `parents-and-young.html` (copied from `beginning-sounds.html`). Config keys: `match`, `choose`.

## Teaching block(s)

- **Parents and their young** — animals and their babies have special names: a baby dog is a **puppy**,
  a baby cow is a **calf**, a baby cat is a **kitten**.

## Sections

| # | key | heading | primitive | answer kind | pool (size) | default | max |
|---|-----|---------|-----------|-------------|-------------|---------|-----|
| 1 | `match` | Match each baby animal to its parent | **matching widget** | custom marker `markMatch` | young→parent pairs (12) | 5 | 6 |
| 2 | `choose` | Choose the young animal | chip-select one | — | sentences, 3 opts (10) | 4 | 8 |

**Distinctness:** section 2 shuffles its pool, indexed by question number → distinct sentence + correct
chip. The matching widget draws `match` distinct pairs without replacement (a single non-`.item` widget,
so the generator — not the dup-scanner — guarantees uniqueness).

## Matching widget

Reusable tap-to-connect widget (`buildMatch`/`markMatch`/`window.__wsAutoSolve`), documented in
`specs/simple-past-tense.md` and `AGENTS.md`. Here the left column is the young animal
(`.mleft[data-answer]` = parent) and the right column the shuffled parents. Copy this file to build the
other vocabulary units (occupations, people, places, gender, homes) — swap only `PAIRS`, `CHOOSE`,
`MATCH_HEADS`, headings, and the teach/title strings.

## Verification

- `TARGETS`: `seed=verify&match=4&choose=4` → happy **8/8**
- `DUP_PARAMS`: `match=6&choose=8` (each ≤ its pool)
- Expected: `PASS  parents-and-young  happy 8/8  probe <8  dups 0`.
- Registration: unit card + module quick-links in `index.html`.
