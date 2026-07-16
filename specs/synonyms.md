# Synonyms spec

Primary-One **vocabulary** unit teaching **synonyms** — words with the same (or a similar) meaning.
Based on workbook Unit 27, pages 116–119: "Circle a suitable synonym to replace each word in bold"
(pages 116–117) and the kite-strings / word-pair matching pages "Look for the two words with the same
meaning" and "Pair the two words with the same meaning" (pages 118–119). Copied from `homes.html` (the
vocabulary template): the reusable **matching widget** + a chip-select "choose" section, with only the
pair pool, the choose pool, the headings and the teaching text swapped. Seeded generator; distinct
questions. Source photos: `6977L/R.jpg` (pp.116–117), `6978L/R.jpg` (pp.118–119).

File: `synonyms.html` (copied from `homes.html`). Config keys: `match`, `choose`.

## Teaching block(s)

- **Synonyms** — a synonym is a word that has the same (or a similar) meaning as another word, with
  three worked examples: **big** → huge, **close** → near, **quick** → fast.

## Sections

| # | key | heading | primitive | answer kind | pool (size) | default | max |
|---|-----|---------|-----------|-------------|-------------|---------|-----|
| 1 | `match` | Match each word to its synonym | **matching widget** (reused) | custom marker `markMatch` | word→synonym pairs (12) | 5 | 8 |
| 2 | `choose` | Choose the synonym | chip-select one | — | sentences (12) | 4 | 10 |

**Distinctness:** section 2 shuffles its 12-sentence pool, indexed by question number → distinct
sentence + correct chip (`choose` stays ≤12 so it never repeats). The matching widget draws `match`
**distinct pairs without replacement** from the 12-pair pool (it is a single non-`.item` widget, so the
dup-scanner does not police it — the generator does, same as every other vocab unit).

**Pair-pool uniqueness (why two pairs are flipped):** the source has two "big" synonym pairs (kite page:
big/large; pair-list page: big/huge) and two "small" pairs (kite page: small/little; pair-list page:
small/tiny). Left-hand values in `PAIRS` must be pairwise distinct — otherwise a render could draw both
"big" pairs at once and show two identical left-hand kites with two different correct answers, an
unsolvable ambiguity. `PAIRS` keeps `big→large` and `small→little` as given and flips the pair-list's
duplicates to `huge→big` and `tiny→small` (same synonym relationship, just read the other way), so all
12 left values and all 12 right values are unique across the whole pool.

## The matching widget (in-page, reusable)

Reused **verbatim** from `homes.html` / `parents-and-young.html` / `simple-past-tense.html` (see
AGENTS.md). A tap-to-connect widget: a left column of prompts (`.mleft[data-answer]` = the words) and a
right column of shuffled answers (`.mright[data-val]` = the synonyms), with an SVG overlay (`.mlines`).
Tap a left item then a right item to join them (a line is drawn); each left item stores its chosen
partner in `data-conn`.

- **`markMatch`** (passed to `WS.mark({ extras:[markMatch] })`) scores **each left item** 1 point,
  correct iff `data-conn === data-answer`; it paints the boxes and recolours the lines green/red.
- **`window.__wsAutoSolve`** connects every left item to its correct synonym and redraws — the
  verifier's `EXTENSION POINT` calls it, so the happy path (and the probe) always completes the widget.
  Reset is wired through `WS.clearAll(resetMatch)`.
- Only `PAIRS` (word→synonym) and `MATCH_HEADS` (`['Word', 'Synonym']`) change from the template; the
  widget CSS/JS/wiring is byte-identical.

## Choose section — bold word, not a blank

Unlike the blanked-sentence `CHOOSE` pattern used by the other vocab units (`data-answer` style
`___`), this section reproduces the workbook's own presentation: each sentence keeps its wording intact
and the tested word is wrapped in `<span class="bw">` (a highlighter-style background, underlined
instead in print) rather than replaced by a blank — matching the instruction "Circle a suitable synonym
to replace each word in bold". The three bracketed choices per item (e.g. "We ran to the (top, foot,
down) of the hill.") become the three chips, one correct.

## Verification

- `TARGETS` params: `seed=verify&match=4&choose=4` → happy **8/8** (4 match points + 4 chip points)
- `DUP_PARAMS`: `match=8&choose=10` (each ≤ its pool: 8 ≤ 12 pairs, 10 ≤ 12 sentences)
- Expected: `PASS  synonyms  happy 8/8  probe <8  dups 0` (probe drops via the skipped section-2 chip —
  there are no typed inputs on this page, and the matching widget is auto-solved every run, so `choose`
  is the section that must exercise the probe fault).
- Scope note: like the other matching-widget vocab units, `synonyms` is documented here but **not**
  added to the hardcoded `verify/verify.js` TARGETS array, and `index.html` registration is left
  untouched (out of scope for this task).

## Notes / decisions

- Wording taken verbatim from the workbook for all 12 `CHOOSE` sentences and their bracketed options
  (e.g. item 5 "Willis is afraid of rats." → shy / sad / **scared**; item 11 "In the story, the king is
  evil." → sly / rude / **wicked**). Distractors deliberately cross-reference each other in the source
  (e.g. "evil" is a distractor for item 4's "sly", and "sly" is a distractor for item 11's "evil") —
  kept as-is.
- No pictures were added: every exercise on both source pages is purely word-based (the elephant/king/
  boy illustrations on pp.116–117 are decorative, not the tested content), consistent with the other
  text-only vocabulary units (e.g. `gender.html`).
- No print-only section: both source pages (pp.116–119) are fully auto-gradable (circle-the-synonym,
  match-the-pairs), so nothing needed a parent-graded fallback.
