# Open-Ended spec

Primary-One comprehension unit teaching **open-ended reading comprehension**: read a short passage,
then fill in a scaffolded answer in your own words (no options to pick from — unlike
`multiple-choice.html`, unit 39). Based on workbook Unit 40, pages 174–181: four short passages —
"Ben's Grandfather", "Olivia's Birthday", "Jonathan" (a younger brother), "Kathleen" (a cousin who
loves ballet) — each paired with the book's own instructions "Read the passage carefully. Then answer
the questions." / "Read the questions and fill in the answers.", using scaffolded sentence starters
("He is ___.") plus, for Jonathan, one genuinely open "What do you think...?" question. Source photos:
`7007L.jpg`/`7007R.jpg`, `7008L.jpg`/`7008R.jpg`, `7009L.jpg`/`7009R.jpg`, `7010L.jpg`/`7010R.jpg` (see
`input/`, git-ignored).

File: `open-ended.html` (copied from `beginning-sounds.html`). Config keys: `answer`, `think`.

## Teaching block(s)

- **Open-ended comprehension** — "Read the passage carefully. Then fill in the answer — the words you
  need are in the box." + a worked example lifted from the grandfather passage: *Passage: "He is 74
  years old." Question: How old is he? Answer: He is **74**.* Sits before the `answer` section.
- **On paper ✍️** — the standard print-only lead-in ("Do this last part on the printed sheet — a
  grown-up marks it...") before the `think` section, matching `adverbs.html`/`adjectives.html`/
  `prepositions.html`.

## Sections

| # | key | heading | primitive | answer kind | pool (size) | default | max |
|---|-----|---------|-----------|-------------|-------------|---------|-----|
| 1 | `answer` | Read the questions. Fill in the answers. | typed input | `text` (18 items) / `num` (1 item) | scaffolded Q&A across 4 passages (19) | 6 | 12 |
| 2 | `think` | What do you think? | **print-only** (parent-graded) | — | open prompts across 4 passages (6) | 3 | 6 |

**Distinctness:** both sections shuffle their pool (`shuffle(ANSWER)` / `shuffle(THINK)`) and index it by
the 1-based question number — `pool[(i-1) % pool.length]` — the same pattern as `nameTargets` in
`beginning-sounds.html`. Since each is a straight permutation, any count up to the pool size draws that
many distinct entries with no repeats.

Each `answer` item is **self-contained**: a short quoted excerpt (`.excerpt`, a bordered box styled like
`multiple-choice.html`'s `.passage-box` but sized as a single sentence rather than the full passage,
since the pool interleaves all four stories rather than grouping by passage), the question in a bold
`.qline`, then the book's own scaffold sentence with the blank as a `gradable` input (`tpl` marks the
blank with a `"{}"` placeholder, split at render time). One item (`Olivia received {} presents.`) uses
`data-kind="num"` so both `3` and `three` are accepted (built-in `num` kind).

Each `think` item is a passage label (`<i>Source:</i>`) + an open prompt + two `.writeline`s (matching
the two ruled lines the book itself gives these open questions) — no gradable markup, so it scores 0 and
is invisible to the duplicate scanner's *answer*-signature concerns beyond its own text.

## Verification

- `TARGETS` params: `seed=verify&answer=4&think=3` → happy **4/4** (the print-only `think=3` scores 0)
- `DUP_PARAMS`: `answer=12&think=6` (each ≤ its pool)
- Result: `PASS  open-ended  happy 4/4  probe 3/4  dups 0`

## Notes / decisions

- **Full reproduction, not just the suggested subset.** All 20 of the book's numbered questions (5 per
  passage × 4 passages) are represented: 19 as short-answer `answer` items (Kathleen's "Where does she
  want to perform?" splits into two scaffolds — "on the stage" / "in other countries" — since the book
  sentence states both facts separately) and Jonathan's literal "What do you think Jonathan likes to do
  in his free time?" as the seed of the `think` pool. The `think` pool then extends that same open-ended
  style to the other three passages (2 for Olivia, 1 each for the grandfather and Kathleen) so every
  passage gets at least one genuinely open question, matching the pool the task requested (~6).
- Two of Olivia's book questions ("What decorations were on the cake?", "What does the phrase 'cried out
  with delight' tell us?") could have gone either way; decorations stayed a short-answer `answer` item
  (it's a direct textual copy — "pictures of animals and five candles" — from the excerpt shown), while
  the delight-phrase question became the seed for an open `think` prompt ("How do you think Olivia felt
  when she saw her birthday cake?") since it is an inference with no single fixed wording.
- Answer alternatives use `data-answer="a|b|c"` liberally for synonyms/short vs. full forms (e.g.
  `the horse|horse|horses`, `soft toy bunny|grey bunny|the grey bunny|bunny`) so a child isn't marked
  wrong for a reasonable rephrasing of the excerpt shown.
- Grading stays the default case-insensitive `text` kind throughout, including for the proper nouns
  (`Kitty`, `Jon`, `Jonni`) — this unit is a comprehension exercise, not a capitalisation drill (see
  `common-proper-nouns.html`'s `cap` kind for that different concern), so a lowercase answer is accepted.
- No new Twemoji assets were needed — this unit is text-only (no picture vocabulary), so no new SVGs were
  added to `assets/twemoji/`. The favicon reuses the site-wide `assets/twemoji/1f4d5.svg`, matching every
  other unit. Emoji in the panel/footer/teach-title (💬 ✍️) are plain UI text glyphs, same convention as
  every other print-only unit.
- No new answer kind was registered; the section uses the engine's built-in `text` (default) and `num`
  kinds only.
- Registration (unit card + module quick-links in `index.html`, `TARGETS`/`DUP_PARAMS` in
  `verify/verify.js`) is intentionally **not** done by this change — out of scope per task instructions.
