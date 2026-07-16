# Homonyms spec

Primary-One vocabulary unit teaching **homonyms** — words that sound the same but have different
meanings (and usually different spellings), e.g. **blew**/**blue**, **pair**/**pear**. Based on workbook
Unit 30, pages 132–134: a "Let's learn" box, "Tick the correct homonyms" (12 sentences), and "The
underlined words are incorrect — write the correct homonyms" (6 sentences). Source photos: `6985L.jpg`,
`6985R.jpg`, `6986L.jpg` (see `input/`, git-ignored).

File: `homonyms.html` (copied from `beginning-sounds.html`). Config keys: `tick`, `fix`.

## Teaching block(s)

- **Homonyms** — homonyms are words that have the same sound (pronunciation) but different meanings
  (and often different spellings): **blew** (the wind blew) vs **blue** (a colour). Sits before the
  "Tick the correct homonym" section.
- **Spot the mistake** — sometimes the wrong homonym sneaks into a sentence; read the sentence, look at
  the bold word, and write the homonym that should be there instead: Molly has long **hare** → **hair**.
  Sits before the "Fix the homonym" section.

## Sections

| # | key | heading | primitive | answer kind | pool (size) | default | max |
|---|-----|---------|-----------|-------------|-------------|---------|-----|
| 1 | `tick` | Tick the correct homonym | chip-select one | — | sentences with a two-word choice (12) | 5 | 12 |
| 2 | `fix`  | Fix the homonym | typed input | text | sentences with a bold wrong homonym (6) | 4 | 6 |

**Distinctness:** both sections shuffle their pool once (`tickOrder`, `fixOrder`) and index it by the
1-based question number (`pool[(i-1) % pool.length]`), the same pattern as `nameTargets` in
`beginning-sounds.html`. Every pool entry has a unique sentence, so the section is guaranteed distinct up
to the pool size; `max`/`DUP_PARAMS` are set to exactly the pool size (12 and 6) for the strongest test.

- **Section 1 (`tick`)** — each pool entry is `{ pre, post, correct, wrong }`; the generator renders
  `pre` + a `___` blank marker + `post` as the sentence, then a `.sel-block[data-mode="one"]` with the
  two words as chips in randomised order (`data-ok="1"` on the correct spelling). All 12 sentences from
  the workbook page (items 1–12 on pp.132–133) are reproduced verbatim.
- **Section 2 (`fix`)** — each pool entry is `{ pre, wrong, post, answer, cp[, many] }`; the generator
  bolds+underlines the wrong homonym inline, then a `.qrow` shows a Twemoji picture and a
  `input.gradable` (default `text` kind, case-insensitive) for the corrected spelling. All 6 sentences
  from page 134 are reproduced verbatim (`hare→hair`, `fir→fur`, `pair→pear`, `see→sea`, `ate→eight`,
  `son→sun`). The `ate→eight` item shows **eight** small truck icons (reusing the existing
  `assets/twemoji/1f69a.svg`) instead of one, echoing the workbook's grid of 8 toy lorries as a visual
  count hint.

Homonym pairs are spelling-critical (e.g. `blew` vs `blue`), but the two answer-kind checks used here
(`.chip[data-ok]` exact match and the engine's default case-insensitive `text` kind) both compare full
strings, so `blew` and `blue` never satisfy each other by accident — the default `text` kind is fine
without a custom answer kind.

## Verification

- `TARGETS` params: `seed=verify&tick=4&fix=4` → happy **8/8** (4 chip-block points + 4 typed-input
  points)
- `DUP_PARAMS`: `tick=12&fix=6` (each equal to its pool size)
- Result: `PASS  homonyms  happy 8/8  probe 6/8  dups 0` (probe drops via both a blanked input and a
  skipped correct chip)

## Notes / decisions

- Wording is taken verbatim from the workbook (`6985L.jpg`, `6985R.jpg`, `6986L.jpg`), including the
  "cheep, cheep" vs "cheap, cheap" chick-sound pair (item 4 on p.132).
- New Twemoji SVGs added to `assets/twemoji/` (CC-BY 4.0, from `jdecked/twemoji@16.0.1`): `1f471.svg`
  (person: blond hair — for hare→hair), `1f439.svg` (hamster — for fir→fur), `1f350.svg` (pear — for
  pair→pear), `1f30a.svg` (water wave — for see→sea), `2600.svg` (sun — for son→sun). The `ate→eight`
  item reuses the already-bundled `1f69a.svg` (truck), repeated 8 times.
- Section 1 ("tick") deliberately stays picture-free — only 2 of the workbook's 12 sentences carry an
  illustration and it is decorative there, not the answer, per AGENTS.md's "prefer text wherever the
  picture is decorative rather than the answer."
- No new answer kind was needed; both sections use the engine's built-in matching (`data-ok` chips,
  default `text` input kind).
- Registration (unit card + module quick-links in `index.html`, `TARGETS`/`DUP_PARAMS` in
  `verify/verify.js`) is intentionally **not** done by this change — out of scope per task instructions.
