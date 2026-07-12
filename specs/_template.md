# <Unit title> spec

_One-paragraph description: what this unit teaches, for whom (Primary One), and which workbook page(s)
it is based on. Put the source photo(s) in `input/` (git-ignored)._

## Teaching block(s)

_What the "Let's learn" block(s) say. A rule plus one or two worked examples, mirroring the page.
List each `WS.teach(...)` you'll render and where it sits in the flow._

- **<Lesson title>** — <the rule + example, e.g. "Every word starts with a sound: bee → b">

## Sections

_One row per section. `key` is the config/URL/panel name; `default`/`max` are the counts; `primitive`
is one of: typed input · chip-select one · chip-select many · drag-to-order · custom. `pool` is the
content it draws from (and its size — the section's max must be ≤ this)._

| # | key | heading | primitive | answer kind | pool (size) | default | max |
|---|-----|---------|-----------|-------------|-------------|---------|-----|
| 1 | `<key>` | `<h2 text>` | typed input | text | `<pool>` (N) | 3 | N |
| 2 | … | … | chip-select one | — | … | 3 | … |

_For each section, note how **distinct questions** are guaranteed (shuffled pool indexed by question
number / draw-without-replacement / `balanced`), and any custom answer kind registered via
`WS.addKind`._

## Verification

- `TARGETS` params: `seed=verify&<key>=<n>&…`
- `DUP_PARAMS`: `<key>=<n>&…` (each ≤ its pool size)
- Expected: `happy N/N  probe <N/N  dups 0`

## Notes / decisions

_Anything non-obvious: wording taken verbatim from the workbook, accepted answer alternatives
(`data-answer="a|b"`), pictures added to `assets/twemoji/`, pedagogical choices, known limitations._
