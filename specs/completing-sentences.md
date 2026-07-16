# Completing Sentences spec

Primary-One **writing** unit (workbook unit 42) teaching sentence completion — choosing the correct
word or phrase to finish a sentence, and matching a sentence beginning to the ending that completes it.
Built on `beginning-sounds.html` (chip-select one) and the reusable **matching widget** (see
`homes.html` / `simple-past-tense.html` / AGENTS.md). Seeded generator; distinct questions. Source:
workbook pages 188-195 (photos `7014L/R`-`7017L/R`, git-ignored under `input/`).

File: `completing-sentences.html` (the `gChoose` chip-select-one pattern and the matching-widget
CSS/JS/wiring are copied byte-identical from `homes.html`; only the content data — `CHOOSE`, `PAIRS`,
`MATCH_HEADS` — and the `.mitem` sizing change). Config keys: `choose`, `match`.

## Teaching block(s)

- **Completing sentences** — read the sentence, look at the words or phrases, then choose the one that
  completes it correctly: **Thomas plays with his ___.** → **toy trucks**.
- **Matching sentences** — a sentence has a beginning and an ending; tap the beginning, then tap the
  ending that matches it: **Colin's puppy** → **wags its tail happily.**

## Sections

| # | key | heading | primitive | answer kind | pool (size) | default | max |
|---|-----|---------|-----------|-------------|-------------|---------|-----|
| 1 | `choose` | Choose the correct word or phrase | chip-select one | — | sentences (20) | 4 | 20 |
| 2 | `match` | Match to form complete sentences | **matching widget** (custom) | custom marker `markMatch` | beginning→ending pairs (15) | 5 | 12 |

**Distinctness:** section 1 (`choose`) shuffles its 20-sentence pool and indexes it by question number
(`chooseOrder[(i-1) % chooseOrder.length]`), so no two questions in one render repeat the same sentence
for count ≤ 20; each item's 3 chips (1 correct + 2 distractors) are drawn only from its own workbook
word/phrase box, so distractors always stay thematically faithful to the source page. The matching
widget draws `match` distinct pairs without replacement from the 15-pair pool via
`shuffle(PAIRS).slice(0, count)` (it is a single non-`.item` widget, so the verifier's dup-scanner does
not police it directly — the generator's draw-without-replacement guarantees uniqueness instead, same
as every other matching-widget vocab unit).

## The matching widget (in-page, reusable)

Reused **verbatim** from `homes.html` (see AGENTS.md). A tap-to-connect widget: a left column of
sentence beginnings (`.mleft[data-answer]`) and a right column of shuffled endings
(`.mright[data-val]`), with an SVG overlay (`.mlines`). Tap a left item then a right item to join them
(a line is drawn); each left item stores its chosen partner in `data-conn`.

- **`markMatch`** (passed to `WS.mark({ extras:[markMatch] })`) scores **each left item** 1 point,
  correct iff `data-conn === data-answer`; it paints the boxes and recolours the lines green/red.
- **`window.__wsAutoSolve`** connects every left item to its correct ending and redraws — the
  verifier's `EXTENSION POINT` calls it, so the happy path completes the widget every run (including
  the probe run). Reset is wired through `WS.clearAll(resetMatch)`.
- Only `PAIRS` (sentence beginning → ending) and `MATCH_HEADS` (`['Beginning', 'Ending']`) change from
  the template; the widget CSS/JS/wiring is byte-identical. The `.mitem` box is widened
  (`min-width:150px; max-width:230px`, `font-size:13.5pt`) versus `homes.html` because every pair here
  is a full clause, not a single word.

## Verification

- `TARGETS` params: `seed=verify&choose=4&match=4` → happy **8/8** (4 chip points + 4 match points).
  Because `window.__wsAutoSolve` always fills the matching widget perfectly (even in the probe run),
  `choose` is the section that must be non-zero for the probe to drop a mark — it is (default 4).
- `DUP_PARAMS`: `choose=12&match=10` (each ≤ its pool: 12 ≤ 20 sentences, 10 ≤ 15 pairs).
- Expected: `PASS  completing-sentences  happy 8/8  probe <8  dups 0`.
- Verified standalone with the scratchpad `check-one.js` driver; not added to the hardcoded
  `verify/verify.js` `TARGETS`/`DUP_PARAMS` arrays or to `index.html` by this change — see notes below.

## Notes / decisions

- Wording is verbatim from workbook pages 188-195, including the "Let's" and "Colin's" apostrophes
  (escaped in the JS string literals) and the exclamation marks on "Look at the dark clouds!" and
  "is colourful!" / "is delicious!".
- All 20 `choose` sentences (five word/phrase boxes × four sentences) and all 15 `match` pairs (three
  matching exercises × five pairs) reproduce every exercise on the source pages — none skipped, none
  demoted to print-only, since every exercise here maps cleanly onto an auto-gradable primitive.
- Every `match` pair's ending (`p`) is unique across the full 15-pair pool, so any randomly-drawn subset
  stays unambiguous even though the three source pages (193, 194, 195) are pooled into one flat list —
  matches how `homes.html`/`parents-and-young.html`/etc. pool their own multi-page content.
- No new Twemoji assets were needed — every exercise on these pages is text-only (word/phrase boxes and
  sentence-matching), unlike the picture-chip vocabulary units (`beginning-sounds.html`, `homes.html`).
- `index.html` card and `verify/verify.js` `TARGETS`/`DUP_PARAMS` registration are intentionally left to
  the caller (per this task's file-scope contract) — this change creates only the unit file and this
  spec, matching the deferred-registration pattern already documented in `specs/homes.md`.
