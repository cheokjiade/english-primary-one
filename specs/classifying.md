# Classifying spec

Primary-One **comprehension** unit teaching **classifying / sorting** — grouping words that share
something in common under the right category name. Based on workbook pages 141-143 (unit 33,
"CLASSIFYING"): "Match each set of words to the correct group" (pages 141-142) and "Sort out the
words. Write them under the correct heading" (page 143).

File: `classifying.html` (copied from `beginning-sounds.html` for the page skeleton; the matching
widget is copied byte-identical in logic from `homes.html` — only `PAIRS`, `MATCH_HEADS`, and the
`.mitem.mset` width/font override for multi-word sets change). Config keys: `match`, `sort`.

## Teaching block(s)

- **Classifying and sorting** — words that are alike belong in the same group, e.g. *hockey,
  football, tennis, swimming* are all **sports**; *roses, hibiscus, lilies, orchids* are all
  **flowers**. Sits before the matching section.
- **Sorting words** — every word belongs under a heading; read the word and tap its heading, e.g.
  *bee* is an **insect**, but *pencil* is a piece of **stationery**. Sits before the sort section.

## Sections

| # | key | heading | primitive | answer kind | pool (size) | default | max |
|---|-----|---------|-----------|-------------|-------------|---------|-----|
| 1 | `match` | Match each set of words to the correct group | **matching widget** (custom) | custom marker `markMatch` | word-set → group pairs (9) | 6 | 9 |
| 2 | `sort` | Sort the words under the correct heading | chip-select one | — | words with heading + distractor (18) | 8 | 18 |

**Distinctness:** section 2 (`gSort`) shuffles its 18-word pool and indexes it by question number, so
each word appears at most once per sheet; the two heading chips it offers (correct + one distractor)
are re-shuffled per question. The matching widget draws `match` distinct set→group pairs without
replacement from the 9-pair pool (`shuffle(PAIRS).slice(0, count)`); like the other vocabulary units
it renders as a single non-`.item` widget, so the dup-scanner does not police it directly — the
generator's without-replacement draw guarantees distinctness instead (see `homes.md` for the same
note).

## The matching widget (in-page, reusable)

Reused **verbatim** (CSS/JS/wiring) from `homes.html` / `parents-and-young.html` (see AGENTS.md). A
tap-to-connect widget: a left column of prompts (`.mleft[data-answer]` = the word sets, joined with
" · ") and a right column of shuffled answers (`.mright[data-val]` = the group names), with an SVG
overlay (`.mlines`). Tap a left item then a right item to join them; each left item stores its chosen
partner in `data-conn`.

- **`markMatch`** (passed to `WS.mark({ extras:[markMatch] })`) scores **each left item** 1 point,
  correct iff `data-conn === data-answer`; it paints the boxes and recolours the lines green/red.
- **`window.__wsAutoSolve`** connects every left item to its correct group and redraws — the
  verifier's `EXTENSION POINT` calls it, so the happy path completes the widget (and the probe run,
  since the widget always auto-solves fully correct — see Verification below).
- Only `PAIRS` (word-set → group) and `MATCH_HEADS` (`['Words', 'Group']`) change from the template.
  Because each left item here is a 4-word set (not a single word), a page-local override
  (`.mitem.mset`) shrinks the font and caps the width so the set wraps onto a few lines inside the
  button, and `.match`'s `max-width`/`gap` are widened slightly versus `homes.html` — this is a
  page-`<style>` addition only, `worksheet.css` is untouched.

## Sort section — design note

Page 143 asks the child to **write** each of 18 words under one of six printed headings (Cutlery,
Insects, Clothes, Food, Utensils, Stationery). To make this self-marking, `gSort` keeps the wording
("sort ... under the correct heading") but turns it into **chip-select one**: show the word, offer its
correct heading plus a distractor drawn from a fixed opposing pair, and the child taps the right one.
The three pairs (chosen so no word is plausibly correct under both offered headings):

- Cutlery ↔ Insects (knife, spoon, fork / ladybird, butterfly, bee)
- Clothes ↔ Food (T-shirt, jeans, blouse / rice, bread, noodles)
- Utensils ↔ Stationery (wok, pan, pot / paper, pencil, ink)

All 18 words and all 6 headings from the photographed page are reproduced; none were dropped.

## Verification

- `TARGETS` params: `seed=verify&match=4&sort=4` → happy **8/8** (4 match points + 4 chip points)
- `DUP_PARAMS`: `match=9&sort=18` (each = its full pool size)
- Expected: `PASS  classifying  happy N/N  probe <N/N  dups 0` — probe drops via the skipped first
  `sort` chip (the matching widget is auto-solved every run, happy and probe alike, so it never drops
  the probe score by itself — same as every other matching-widget vocab unit).
- Scope note: like the other matching-widget vocabulary units, `classifying` is documented here but
  **not** added to the hardcoded `verify/verify.js` `TARGETS` array, and `index.html` registration is
  left untouched — both are updated centrally (see the unit's return block).

## Notes / decisions

- Wording taken verbatim where gradable: the match section's heading is "Match each set of words to
  the correct group" (workbook pages 141-142, exact instruction text). The sort section's heading
  paraphrases "Write them under the correct heading" as "Sort the words under the correct heading"
  since the interaction is tap-to-choose, not handwriting.
- All 9 set→group facts and all 18 sortable words come directly from the photographed pages (141:
  stationery/sports/weather/flowers; 142: tools/occupations/animals/feelings/places; 143: the
  Cutlery/Insects/Clothes/Food/Utensils/Stationery word bank) — none invented, none dropped.
- No new `assets/twemoji/` SVGs were added: the source page is pure text (word lists and group/heading
  labels, no pictures), so the sheet stays text-only, consistent with AGENTS.md's preference for text
  over decorative pictures when the picture isn't the answer.
- Sibling unit `classifications` (unit 25, vocabulary) is a different unit built separately; this file
  and `classifying.html` do not touch its files.
