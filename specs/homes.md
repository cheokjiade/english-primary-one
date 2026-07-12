# Homes (animal homes) spec

Primary-One **vocabulary** unit teaching **animal homes** — the special name for where each animal
lives (a dog's *kennel*, a bird's *nest*, a bee's *hive*). Built on the reusable **matching widget**
first introduced by `simple-past-tense.html`: a "Let's learn" box + "match each animal to its home" +
"choose the home". Seeded generator; distinct questions.

File: `homes.html` (copied verbatim from `parents-and-young.html`, the vocab template — only the content
strings, `PAIRS` and `CHOOSE` change; the matching-widget CSS/JS/wiring stays byte-identical). Config
keys: `match`, `choose`.

## Teaching block(s)

- **Animal homes** — animals live in different homes with special names. A **dog** lives in a
  **kennel**; a **bird** lives in a **nest**; a **bee** lives in a **hive**.

## Sections

| # | key | heading | primitive | answer kind | pool (size) | default | max |
|---|-----|---------|-----------|-------------|-------------|---------|-----|
| 1 | `match` | Match each animal to its home | **matching widget** (custom) | custom marker `markMatch` | animal→home pairs (10) | 5 | 6 |
| 2 | `choose` | Choose the home | chip-select one | — | sentences (8) | 4 | 8 |

**Distinctness:** section 2 shuffles its pool, indexed by question number → distinct sentence + correct
chip. The matching widget draws `match` **distinct pairs without replacement**, so its animals/homes are
unique (it is a single non-`.item` widget, so the dup-scanner does not police it — the generator does).

## The matching widget (in-page, reusable)

Reused **verbatim** from `parents-and-young.html` / `simple-past-tense.html` (see AGENTS.md). A
tap-to-connect widget: a left column of prompts (`.mleft[data-answer]` = the animals) and a right column
of shuffled answers (`.mright[data-val]` = the homes), with an SVG overlay (`.mlines`). Tap a left item
then a right item to join them (a line is drawn); each left item stores its chosen partner in `data-conn`.

- **`markMatch`** (passed to `WS.mark({ extras:[markMatch] })`) scores **each left item** 1 point,
  correct iff `data-conn === data-answer`; it paints the boxes and recolours the lines green/red.
- **`window.__wsAutoSolve`** connects every left item to its correct home and redraws — the verifier's
  `EXTENSION POINT` calls it, so the happy path completes the widget. Reset is wired through
  `WS.clearAll(resetMatch)`.
- Only `PAIRS` (animal→home) and `MATCH_HEADS` (`['Animal', 'Home']`) change from the template; the
  widget CSS/JS/wiring is byte-identical.

## Verification

- `TARGETS`: `seed=verify&match=4&choose=4` → happy **8/8** (4 match points + 4 chip points)
- `DUP_PARAMS`: `match=6&choose=8` (each ≤ its pool: 6 ≤ 10 pairs, 8 ≤ 8 sentences)
- Expected: `PASS  homes  happy 8/8  probe <8  dups 0` (probe drops via the skipped section-2 chip; the
  matching widget is auto-solved every run).
- Scope note: like the other matching-widget vocab units, `homes` is documented here but **not** added to
  the hardcoded `verify/verify.js` TARGETS array, and `index.html` registration is left untouched.
