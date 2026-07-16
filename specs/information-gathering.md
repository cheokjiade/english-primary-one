# Information Gathering spec

Primary One English, unit 32 (workbook pp.138–140, "Information Gathering"). Teaches reading a short
set of clue sentences about three named people or pets and working out **who is who** — some facts are
given directly, others only by **elimination** (the name nobody has been matched to yet). Source photos
in `input/` (git-ignored): `6988L.jpg`/`6988R.jpg` (pp.138–139, three girls / three clowns) and
`6989L.jpg` (p.140, three dogs).

**Adaptation from the book.** The workbook shows three unlabelled drawings (children/clowns/dogs) next
to clue sentences and asks the child to write each name under/in its picture. This worksheet has no
picture to label, so each scenario's clue set is told entirely in **text** (including an opening
sentence naming all three entities, which the book leaves implicit in the picture) and the child
answers one **"who/which…?" question per scenario** by tapping the correct name — a chip-select-one
block. The book's own three scenarios (girls, clowns, dogs) are reproduced faithfully; five more
scenarios in the same spirit (a queue, coloured caps, held party items, cats' coats, rabbits compared
by size, ducks' ribbons) extend each section's pool so counts stay distinct.

## Teaching block(s)

- **Be an information detective! 🕵️** — before the `who` section. Explains that some clues name someone
  directly, others only by elimination (crossing off names already used). Worked example: a 3-runner
  race (Zara 1st, Yusuf right after Zara → Wen must be last), answer shown inline. Uses fresh names not
  reused anywhere in the graded pools, so it teaches the technique without spoiling a scored item.
- **Now try it with pets! 🐾** — short transition before the `pets` section: the same elimination trick
  works for animals.

## Sections

| # | key | heading | primitive | answer kind | pool (size) | default | max |
|---|-----|---------|-----------|-------------|-------------|---------|-----|
| 1 | `who` | `Who is it?` | chip-select one | — | `WHO` scenarios (5) | 3 | 5 |
| 2 | `pets` | `Whose pet is it?` | chip-select one | — | `PETS` scenarios (4) | 2 | 4 |

Each item ("Case N") renders one full scenario: an intro sentence naming the three people/pets, two
clue sentences, a question, and 3 name chips (shuffled) with exactly one `data-ok="1"`. Distinctness is
guaranteed by indexing a **shuffled pool by the question number** — `whoOrder[(i-1) % whoOrder.length]`
/ `petOrder[(i-1) % petOrder.length]` — with each section's `max` clamped to its pool length (5 and 4
respectively), so no seed can wrap the pool and repeat a scenario. Because every scenario's clue text
and question differ, item text is unique even before considering chip order.

No custom answer kind is registered — both sections are pure chip-select-one, marked entirely by the
engine's built-in chip logic.

## Verification

- `TARGETS` params: `seed=verify&who=4&pets=3`
- `DUP_PARAMS`: `who=5&pets=4` (equal to each pool size — the strongest distinctness stress test)
- Expected: `happy 7/7  probe <7/7  dups 0`

## Notes / decisions

- Wording is taken verbatim from the workbook where it survives the picture→text adaptation ("Mary has
  long, straight hair.", "Jane is between Mary and Sue." → "stands between"; "Barry is a happy clown. He
  has a wide smile."; "Bobo has some balloons for the children."; "Patch has a brown patch on its left
  eye." → "over one eye" (dropped "left" — there is no picture to disambiguate left/right without a
  drawing, so the clue was trimmed to the fact the text form can actually test); "Snowy has long, soft
  fur. You can't even see its eyes!").
- The book's closing question for the clowns/dogs ("Which one is Bobby?" / "Which one is Brownie?") is
  reproduced as an **elimination** question phrased as "does not have [trait A] and does not have
  [trait B]?" — naming the trait pair rather than the name itself, so the chip choices (which include
  the answer's own name as one of three options) don't give the answer away in the question text.
- Every scenario was checked by hand to have exactly **one** logically valid answer from its two clues
  (no ambiguity): direct lookup (girls' "middle", cats' coats, ducks' ribbons), elimination (clowns,
  dogs, triplets' caps, party items), and a transitive size chain (rabbits: Coco > Bella > Daisy).
- All 9 scenarios use disjoint name sets (no name reused across scenarios within a section, nor with the
  teaching block's worked example) so nothing on the sheet is confusable with anything else.
- No new Twemoji assets were added — the exercise is text/clue based (per the task's adaptation note),
  so pictures would be decorative at best; the grey `.clue` box mirrors the workbook's clue-sentence
  panel instead.
