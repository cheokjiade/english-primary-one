# Sounds spec

Primary-One **vocabulary** unit teaching **sounds** — the special words used to describe the sounds
animals and objects make (a duck *quacks*, a lion *roars*, a clock goes *tick tock*). Based on workbook
Unit 23, pages 100-106: "What sounds do these animals make?" (fill-in), "Match the animals to the sounds
they make" (matching), "Choose the correct words" (two-blank cloze with pictures), "Read the animal
riddles" (riddle → animal), and "Sounds made by objects" (fill-in). Source photos: `6969L/R.jpg` (100-101),
`6970L/R.jpg` (102-103), `6971L/R.jpg` (104-105), `6972L.jpg` (106).

File: `sounds.html` (copied from `homes.html`, the vocab template, for the matching widget; adds two
typed-input fill sections and a picture-riddle chip section). Config keys: `fill`, `match`, `choose`,
`riddle`, `object`.

## Teaching block(s)

- **Animal sounds** (before `fill`) — "Different animals make different sounds. Words have been given
  to describe these sounds. What sounds do these animals make? Fill in the blanks with these helping
  words," plus the page-100 word bank (bark, squeak, croak, snort, crow, roar, chatter, quack) and a
  worked example (duck → I quack.).
- **Sounds made by objects** (before `object`) — "Sounds made by objects can also be described. Fill in
  the blanks with these helping words," plus the page-106 word bank (pitter patter, choo choo, tick tock,
  jingle jangle, zoom zoom, ding dong).
- `choose` and `riddle` reproduce their page instruction as a plain (non-gradable, non-`.item`)
  `<p class="instr">` line rather than a second "Let's learn" callout, since the workbook gives them a
  plain instruction, not a lesson box.

## Sections

| # | key | heading | primitive | answer kind | pool (size) | default | max |
|---|-----|---------|-----------|-------------|-------------|---------|-----|
| 1 | `fill` | What sound does each animal make? | typed input | text | animal→sound pairs (8) | 5 | 8 |
| 2 | `match` | Match the animal to the sound it makes | **matching widget** (custom) | custom marker `markMatch` | animal→sound-verb pairs (8) | 6 | 8 |
| 3 | `choose` | Choose the correct words | chip-select one (**two** blocks per item) | — | animal name+sound items (8) | 5 | 8 |
| 4 | `riddle` | Read the animal riddles | chip-select one (picture chips) | — | riddles (8) | 5 | 8 |
| 5 | `object` | What sound does each object make? | typed input (**two** inputs per item) | text | object sentences (6) | 4 | 6 |

**Distinctness:**
- `fill` shuffles its 8 animal→sound pairs and indexes by `(i-1) % 8`; the visible sentence text is
  identical across items ("I ___.") but each `data-answer` is distinct, which is what the dup-scanner and
  the marker key off — same pattern as `gFirst` in `beginning-sounds.html`.
- `match` draws `match` distinct pairs **without replacement** from the 8-pair pool (`shuffle(PAIRS).slice(0,count)`).
  Like all matching-widget units, it renders `.mitem`, not `.item`, so the dup-scanner's `#sheet .item`
  scan does not see it — distinctness is guaranteed by the generator, not policed by the verifier.
- `choose` shuffles its 8 items; the sentence frame is identical per item but the two correct chips
  (animal name + sound) are unique per animal, so the dup signature (which includes `.chip[data-ok="1"]`
  contents) differs across all 8.
- `riddle` shuffles its 8 riddles; the riddle wording itself is unique per item, so distinctness holds
  independent of the chip contents. Distractor chips are drawn from the other 7 riddles' pictures.
- `object` shuffles its 6 sentences; both the sentence text and the two `data-answer`s are unique per item.

**Custom answer kinds:** none needed — every accepted answer is a single unambiguous word (or word pair)
taken directly from the workbook's helping-word banks, so the default case-insensitive `text` kind is
sufficient; no `|`-alternatives were required.

## The matching widget (in-page, reusable)

Reused from `homes.html` / `simple-past-tense.html` (see AGENTS.md), unchanged except `PAIRS` and
`MATCH_HEADS` (`['Animal', 'Sound']`). Tap an animal on the left, then its sound on the right, to connect
them (an SVG line is drawn); `markMatch` scores each left item 1 point (`data-conn === data-answer`), and
`window.__wsAutoSolve` connects every pair correctly so the verifier's happy path completes it.

## Pictures

Sections `fill`, `choose` and `riddle` use pictures as the actual tested content (the child must recognise
the animal to answer), so 16 animal codepoints are used; 11 were not yet bundled and were added this unit:

- Added: rooster `1f413`, pig `1f437`, monkey `1f435`, mouse `1f42d`, lion `1f981`, dog `1f436`,
  cow `1f42e`, hen `1f414`, elephant `1f418`, sheep `1f411`, horse `1f434` (all downloaded from the
  bundled Twemoji CDN mirror per AGENTS.md, CC-BY 4.0).
- Reused (already bundled): duck `1f986`, frog `1f438`, bird `1f426`, bee `1f41d`, cat `1f431`.
- `match` is text-only (animal/sound words), exactly as printed on page 101, so it needs no pictures.
- `object` is text-only — the object (train, aeroplane, clock, door, rain, coins) is already named in the
  sentence, so a picture would be decorative rather than tested content (AGENTS.md: prefer text when the
  picture is decorative).

## Notes / decisions

- `choose` reproduces the workbook's **two blanks per item** ("This is a ___." / "It ___.") as two
  independent `.sel-block` chip groups inside one `.item`, each with its own bracketed options taken
  verbatim from the page (e.g. item 1: `(hen, bird, duck)` / `(clucks, mews, quacks)`). Item 7 (elephant)
  keeps the book's literal "This is a/an ___." wording.
- `riddle` adapts the book's riddle-to-picture matching (drawn connecting lines across two rows) into a
  chip-select-one: the riddle text is shown, then 3 picture chips (the correct animal + 2 distractors)
  drawn from the other riddles' animals.
- `object` reproduces each sentence's exact punctuation between its two blanks (space for "jingle jangle",
  comma for most, a dash for "pitter - patter"), as printed.
- Wording (word banks, sentences, riddles, bracket options) is taken verbatim from workbook pages 100-106.

## Verification

- `TARGETS` params: `seed=verify&fill=3&match=3&choose=3&riddle=3&object=3`
- `DUP_PARAMS`: `fill=8&match=8&choose=8&riddle=8&object=6` (each equal to its pool size)
- Result: `PASS  sounds  happy 21/21  probe 20/21  dups 0` (see Verification run below).
