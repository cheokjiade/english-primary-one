# Word Substitutions spec

Primary-One vocabulary unit teaching **word substitution** — using one word to take the place of a
wordy phrase. Based on Unit 29 (pages 129–131) of the source workbook: a "Let's learn" box + two
exercise types (replace the underlined words in a sentence · write the word for a short meaning),
each with its own helping-word bank. Built as a seeded generator; each section renders distinct
questions. Source photos: `6983R.jpg` (p.129), `6984L.jpg`/`6984R.jpg` (p.130–131).

File: `word-substitutions.html` (copied from `beginning-sounds.html`). Config keys: `replace`, `write`.

## Teaching block(s)

- **Word substitutions** — "We can use one word to substitute (take the place of) a group of words,
  to make a sentence shorter", worked example *I am <u>by myself</u> at home. → I am **alone** at
  home.*, then the p.129 helping-word bank (yesterday, returned, audience, screamed, annually,
  neighbours, exit, quiet, alone). Sits before the "Replace the underlined words" section.
- **More word substitutions** — "A short phrase can often be replaced by one word too", worked
  example *at the back → **behind***, then the p.131 helping-word bank (accompany, shout, whisper,
  parents, soon, many, behind, entrance). Sits before the "Write the word" section.

## Sections

| # | key | heading | primitive | answer kind | pool (size) | default | max |
|---|-----|---------|-----------|-------------|-------------|---------|-----|
| 1 | `replace` | Replace the underlined words | typed input | `text` | sentences, p.129–130 (9) | 6 | 9 |
| 2 | `write` | Write the word | typed input | `text` | meanings, p.131 (8) | 5 | 8 |

Every sentence/meaning + its helping word from both workbook pages is reproduced (9 + 8 = 17 items
total, including the worked example from each page, which is also a live pool entry — not only shown
in the teach block).

**Distinctness:** both sections shuffle their pool once (`shuffle(REPLACE)` / `shuffle(WRITE)`) and
index by the 1-based question number, `pool[(i-1) % pool.length]` — a full permutation, so a count up
to the pool size always renders that many distinct questions with no repeats. `max` on each panel
field/URL param is clamped to the pool size (9 and 8), so distinctness holds for every reachable
setting.

## Verification

- `TARGETS` params: `seed=verify&replace=4&write=4`
- `DUP_PARAMS`: `replace=9&write=8` (each = its pool size)
- Expected: `happy 8/8  probe <8/8  dups 0`

## Notes / decisions

- Sentence wording, meanings, and helping words are verbatim from the workbook (British/Singapore
  spelling kept as-is, e.g. `neighbours`; no American-spelling alternative added since the word bank
  gives the exact spelling to copy).
- Section 1 reproduces the workbook's two-line layout per question: the original sentence with the
  wordy phrase `<u>underlined</u>`, then a second line with the gapped restatement and the answer
  box (e.g. "Please <u>do not make any noise</u> in the library." → "Please be ___ in the library.")
  — the gapped line is not always a pure substring swap (e.g. "Please be ___" inserts "be"), matching
  the workbook exactly.
- Both sections are plain typed input (default `text` kind, case-insensitive) — no new answer kind,
  no bespoke widget; the engine is reused unchanged. No new Twemoji assets were needed (purely a
  words-and-sentences unit, like `conjunctions.html`/`articles.html`).
- Registration (done by the caller, not this file): unit card + module quick-links in `index.html`,
  and a `TARGETS`/`DUP_PARAMS` entry in `verify/verify.js`.
