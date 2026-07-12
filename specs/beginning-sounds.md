# Beginning Sounds spec

The **reference unit** — a complete Primary-One phonics/early-literacy worksheet that also
demonstrates every engine primitive. Copy `beginning-sounds.html` to start a new unit. Not based on a
single workbook page; hand-built to exercise the whole contract.

## Teaching block(s)

Four `WS.teach(...)` blocks, each placed just before the section it teaches ("teach, then practise"):

- **Beginning sounds** — "Every word starts with a sound; say it slowly and listen." + examples
  🐝 bee → b, 🐱 cat → c, 🦆 duck → d.
- **Naming words** — "A naming word tells us the name of a person, animal or thing."
- **Spelling** — "Say the word, listen for each sound, then write it." Notes that some pictures have
  more than one right name (🐰 rabbit / bunny) — motivates `|`-alternatives.
- **Making sentences** — "A sentence begins with a capital letter and ends with a full stop; words go
  in the right order." + example *I see a cat.*

## Sections

| # | key | heading | primitive | answer kind | pool (size) | default | max |
|---|-----|---------|-----------|-------------|-------------|---------|-----|
| 1 | `first` | Write the first letter | typed input | `letter` (custom) | first letters of `WORDS` (12 distinct) | 3 | 12 |
| 2 | `name` | Name the picture | chip-select one | — | `WORDS` (24) | 3 | 20 |
| 3 | `same` | Same first sound | chip-select many | — | letters with ≥2 words: b,c,f,s,t (5) | 3 | 5 |
| 4 | `write` | Write the word | typed input | `text` (+ `|`-alt) | `WRITE` short words (12) | 2 | 12 |
| 5 | `sentence` | Build a sentence | drag-to-order | — | `SENTENCES` (8) | 2 | 8 |

**Distinctness per section:**
- `first` — shuffled list of the 12 distinct first letters, indexed by question number; the pictured
  word for a letter is drawn without replacement (`drawWord` + `firstUsed` set). Signature key is the
  answer letter, so distinct letters ⇒ distinct questions (max 12).
- `name` — `WORDS` shuffled and indexed by question number ⇒ distinct target word (and correct chip)
  per question (max 20 ≤ 24).
- `same` — the 5 pair-letters shuffled and indexed by question number ⇒ distinct correct picture pair;
  the two distractors come from two *different* other letters so exactly one pair shares a sound.
- `write` — `WRITE` shuffled and indexed ⇒ distinct target word (max 12).
- `sentence` — `SENTENCES` shuffled and indexed ⇒ distinct sentence (max 8). Tile values are positions
  `1..n`, so repeated words are safe.

**Custom kind:** `WS.addKind('letter', (v,a) => v.trim().toLowerCase() === a.trim().toLowerCase())`
— single letter, case-insensitive. (`text` would also suffice; kept to demonstrate `addKind`.)

**`|`-alternatives:** section 4 uses `data-answer="rabbit|bunny"` to accept either spelling.

## Verification

- `TARGETS`: `seed=verify&first=3&name=3&same=3&write=2&sentence=2`
- `DUP_PARAMS`: `first=6&name=8&same=5&write=8&sentence=6` (each ≤ pool size)
- Confirmed: `PASS  beginning-sounds  happy 19/19  probe 18/19  dups 0`.

## Notes / decisions

- Words are limited to pictures already bundled in `assets/twemoji/`. To add vocabulary, drop the
  Twemoji SVG (named `<codepoint>.svg`) into that folder and extend `WORDS` / `WRITE`.
- The "write the word" section uses short words (≤ ~5 letters, plus `rabbit`) — realistic for P1 and
  keeps the demo honest; real spelling units should match the workbook's word list.
- This unit is intentionally broad (5 primitives) as a teaching sample; a real unit from a photo will
  usually have fewer, more focused sections.
