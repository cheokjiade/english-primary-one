# Word Order spec

Primary-One writing unit teaching **word order** — putting jumbled words in the right order to make a
complete sentence, plus the capital-letter/full-stop rule for starting one. Based on Unit 41 (pages
182–187) of the source workbook: "Rearrange the words to form complete sentences" (three pages of word
tiles + a picture, 17 sentences total) and a **LET'S LEARN** box ("A capital letter is used for the
first letter of the first word in a sentence. It is also used for proper nouns. A full stop (.) is used
at the end of a sentence."). Seeded generator; distinct questions per section.

File: `word-order.html` (copied from `beginning-sounds.html`). Config keys: `order`, `capital`.

## Teaching block(s)

- **Building sentences** — put the word tiles in the right order to make a complete sentence
  (`have · a · cat · I` → `I have a cat.`).
- **Capital letters and full stops** — the workbook's LET'S LEARN box, reproduced verbatim: a capital
  letter starts the first word of a sentence and marks proper nouns; a full stop ends a sentence.

## Sections

| # | key | heading | primitive | answer kind | pool (size) | default | max |
|---|-----|---------|-----------|-------------|-------------|---------|-----|
| 1 | `order` | Rearrange the words | drag-to-order | — | 17 book sentences (17) | 6 | 17 |
| 2 | `capital` | Begin with a capital letter | typed input | custom `cap` (case-sensitive) | 17 book sentences (17) | 5 | 17 |

**Distinctness:** each section shuffles its own copy of the 17-sentence pool
(`orderTargets`/`capTargets = shuffle(SENTS)`) and indexes by the 1-based question number
(`pool[(i-1) % pool.length]`) → a distinct sentence per question, guaranteed while `max` (17) ≤ the pool
size (17).

**Why two sections for one workbook exercise:** the book's task is "rearrange tiles" *and* (on pages
186–187) "begin each sentence with a capital letter" — but the book's own tiles already arrive
pre-capitalised (the tile that starts the sentence is already capitalised, e.g. `This`, `We`, `He`,
`My friends`), so dragging tiles into place can't actually *test* the capitalisation rule — the drag
target auto-completes even when the verifier's probe blanks the first typed input, so a unit with only
a drag section could never fail the probe check. Section 2 isolates the rule as its own gradable,
case-sensitive question: the first word is shown lower-cased inside a bracketed jumble, and the child
must retype it with the correct capital.

## Notes / decisions

- **Tile pool (`SENTS`)** is all 17 book sentences, chunked exactly as the book's own word tiles —
  multi-word chunks are kept together (`"Bird Park"`, `"toy blocks"`, `"over there"`, `"Sarah's"`,
  `"my father"`, `"My mother"`, `"I am"`, `"That man"`, `"My friends"`, `"a book"`, `"to draw"`,
  `"to play"`) rather than split into individual dictionary words, matching the book's tiles 1:1.
- **Section 1 (`order`)** is the golden template's `gSentence` pattern (drag/tap-to-order, tile values =
  positions `1..n` so a repeated word is safe) applied to the full 17-sentence pool instead of 8 toy
  sentences; a static `.fullstop` span after the slots mirrors the book's separate "." line. No picture
  — the picture in the book is decorative context, not part of what's being tested (the tiles alone
  determine the answer), so per `AGENTS.md`'s picture guidance ("prefer text wherever the picture is
  decorative rather than the answer") this section stays text-only, like `demonstratives.html` and
  `question-words.html`.
- **Section 2 (`capital`)** registers a custom **case-sensitive** answer kind, `WS.addKind('cap', (v,a)
  => v.trim() === a.trim())` — the built-in `text` kind is case-insensitive and would mark `we` right
  for `We`, defeating the point. The bracketed jumble lower-cases only the first tile; any proper-noun
  tile elsewhere in the sentence keeps its own capital (e.g. `(these / are / Sarah's / parents)`,
  `(we / are / at the / Bird Park)`), so the exercise isolates exactly the "capitalise the first word"
  half of the LET'S LEARN rule (the "capitalise proper nouns" half is demonstrated passively — those
  tiles are already shown correctly capitalised). The child is always copying a word already visible in
  the bracket and fixing one letter, never inventing spelling from memory.
- Both sections draw from the **same** 17-sentence pool via independent shuffles, so the same sentence
  can appear once in each section within one worksheet — that's fine; the duplicate scanner checks
  distinctness *within* a section, not across sections.

## Verification

- `TARGETS`: `seed=verify&order=3&capital=3` → happy **17/17** (order=3 draws two 4-word + one 5-word,
  or similar, sentence at seed `verify`; capital=3 adds 3 more points — exact total depends on which
  sentences the `verify` seed happens to shuffle first, but the driver always reaches full marks)
- `DUP_PARAMS`: `order=10&capital=10` (each ≤ its pool of 17)
- Expected: `PASS  word-order  happy N/N  probe <N/N  dups 0` (probe drops via section 2's first typed
  input — section 1's drag tiles auto-complete even during the probe, so section 2 is what makes the
  probe check meaningful).
- Registration: unit card + module quick-links in `index.html`, `TARGETS`/`DUP_PARAMS` entries in
  `verify/verify.js` (not wired here — engine/verify files untouched per the task contract).
