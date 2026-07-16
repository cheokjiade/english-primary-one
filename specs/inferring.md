# Inferring spec

Primary-One **comprehension** unit (workbook unit 36) teaching one-step inference: reading a sentence
(or a tiny scene) and figuring out something that is not stated outright. Based on workbook pp.149-151
— *"Read the sentences. Put a tick in the correct box."* (father drives to work, Peter helps an old man,
Samantha likes to read, a round cake, a long-sleeved blouse, Alvin's heavy bag) and *"Look at the
pictures. Tick the correct sentences."* (thermometer → sick, empty plate → enjoyed lunch, Sue and the
dog → afraid, Tim's medal → won the race, children at a rainy window → indoors). Source photos in
`input/` (git-ignored).

File: `inferring.html` (copied from `beginning-sounds.html`). Config keys: `infer`, `truth`.

## Adaptation note (picture → text)

The whole source page is pick-the-picture (three picture options per sentence on pp.149-150; two
candidate sentences per picture on p.151). There is no Twemoji equivalent for the specific scene art
(an old man falling, a boy bent under a heavy bag, children at a rainy window, a medal-winner…), so
every picture item was rewritten as a one-step inference **in words**, in two shapes:

- **`infer`** — the clue sentence plus a `"___"` blank, three candidate completions (1 correct + 2
  distractors), e.g. *"My father drives to work every day. He goes to work by ___."* → car / bus / taxi.
- **`truth`** — a tiny scene description standing in for the picture, two candidate sentences; pick the
  one that is true, e.g. *"Mei lies in bed with a thermometer in her mouth."* → *She is sick.* / *She is
  well.*

Six of the twelve `infer` items and six of the twelve `truth` items are lifted straight from the
workbook (the six tick-the-picture sentences; the five tick-the-sentence scenes plus one same-spirit
extra); the rest are original items in the same spirit, so each pool reaches 12.

## Teaching block(s)

Two `WS.teach(...)` blocks, each placed just before the section it teaches ("teach, then practise"):

- **Inferring** — "A sentence does not always tell us everything. Read the clue carefully, then use it
  to figure out the answer." + examples *My father drives to work every day.* → He goes by **car**. /
  *Alvin bends under his school bag.* → His bag is **heavy**.
- **Is it true?** — "Look at what is happening, then tap the sentence that tells the truth about it." +
  example *Mei lies in bed with a thermometer in her mouth.* → **She is sick.** (not *She is well.*)

## Sections

| # | key | heading | primitive | answer kind | pool (size) | default | max |
|---|-----|---------|-----------|-------------|-------------|---------|-----|
| 1 | `infer` | Read the clue. What can you tell? | chip-select one | — | `INFER` clue+blank sentences (12) | 4 | 12 |
| 2 | `truth` | Look at what happens. Tick the true sentence. | chip-select one | — | `TRUTH` scene descriptions (12) | 4 | 12 |

**Distinctness:**
- `infer` — `INFER` shuffled once, indexed by question number ⇒ distinct clue sentence per question
  (max 12 = pool size). Each entry carries its own 3 options (1 correct + 2 fixed distractors); only
  their on-screen order is reshuffled per render.
- `truth` — `TRUTH` shuffled once, indexed by question number ⇒ distinct scene per question (max 12 =
  pool size). Each entry carries its own 2 options; only their on-screen order is reshuffled per render.

Both sections use the "per-item options" chip pattern (`gChoose` in `people.html` / `occupations.html` /
`parents-and-young.html`): a pool entry carries its own `opts` array and correct answer `a`, rather than
drawing distractors from a shared vocabulary pool — the distractors are bespoke to each clue/scene so
they read naturally (`car`/`bus`/`taxi` for a "goes to work by ___" clue; `She is sick.`/`She is well.`
for the thermometer scene).

## Verification

- `TARGETS` params: `seed=verify&infer=4&truth=4` → happy **8/8** (4 + 4 chip points)
- `DUP_PARAMS`: `infer=10&truth=10` (each ≤ its pool of 12)
- Confirmed: `PASS  inferring  happy 8/8  probe 7/8  dups 0` (via
  `node check-one.js inferring.html "seed=verify&infer=4&truth=4" "infer=10&truth=10"`).
- Registration: **out of scope for this build** — `inferring.html` is intentionally **not** yet added to
  `verify/verify.js` or `index.html`. When registered, add:
  - `TARGETS`: `{ name: 'inferring', file: 'inferring.html', params: 'seed=verify&infer=4&truth=4' }`
  - `DUP_PARAMS`: `'inferring': 'infer=10&truth=10'`
  - an `index.html` card, tag `unit 36 · comprehension`, emoji 💡, with "Practice one skill" module
    links `inferring.html?infer=10&truth=0` (Infer it) and `inferring.html?infer=0&truth=10` (True or
    not).

## Notes / decisions

- No new Twemoji assets were added: both sections are fully text-based by design (the adaptation trades
  each picture for wording), matching AGENTS.md's steer to "prefer text wherever the picture is
  decorative rather than the answer" — here the picture *was* the answer, so it became the option text
  instead. The favicon stays the shared generic book icon (`assets/twemoji/1f4d5.svg`), same as every
  other unit.
- `truth` chips are laid out in a vertical stack (`.chips.stack`, page-local style) rather than the
  default wrapped row, since its options are full sentences rather than single words — mirrors the
  workbook's stacked tick-boxes and stays readable at print width.
- Wording is paraphrased rather than copied verbatim for the picture-based items (the workbook has no
  exact sentence for a picture option), but each preserves the workbook's intended correct answer.
- Distractors were written to be clearly false given the clue/scene (not merely "different"), e.g. a
  hungry, loudly-crying baby's distractors are `full`/`asleep` rather than near-miss feelings — keeps
  the one-step inference unambiguous for a Primary-One reader.
