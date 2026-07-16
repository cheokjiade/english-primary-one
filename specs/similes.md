# Similes spec

Primary-One vocabulary unit teaching **similes** — a phrase (starting with "as" or "like") that
compares two different things, e.g. *as brave as a lion*. Based on workbook Unit 31 "Similes",
pages 135-137 (source photos `6986R.jpg`, `6987L.jpg`, `6987R.jpg`, converted from the phone
originals with `pillow-heif`). Copied from `beginning-sounds.html`; two typed-input/chip-select
sections, no bespoke widget needed.

File: `similes.html`. Config keys: `complete`, `choose`.

## Teaching block(s)

- **Similes** (before "Complete the simile") — the definition ("a phrase, starting with 'as' or
  'like', that compares two different things"), a worked example (*My father is as brave as a
  lion*), and two word-bank boxes reproducing the book's helper boxes verbatim: **Animal words**
  (lion, kitten, mouse, bee, lamb — p.135) and **Describing words** (flat, light, loud, sharp,
  cold, easy, sweet, red — p.136).
- **Choose the word** (before "Choose the correct word") — the p.137 instruction ("Tap the word
  that best completes each simile") plus the book's own worked example (*as brave as a lion*).

## Sections

| # | key | heading | primitive | answer kind | pool (size) | default | max |
|---|-----|---------|-----------|-------------|-------------|---------|-----|
| 1 | `complete` | Complete the simile | typed input | text | simile sentences (13) | 6 | 13 |
| 2 | `choose` | Choose the correct word | chip-select one | — | circle-the-word items (8) | 5 | 8 |

**Section 1 (`complete`)** reproduces *both* fill-in-the-blank pages as one pool of 13 full book
sentences, each with its own blank and answer — 5 items from p.135 (adjective given, fill the
**animal noun**: brave→lion, playful→kitten, quiet→mouse, busy→bee, gentle→lamb) and 8 items from
p.136 (noun given, fill the **adjective**: feather→light, ice→cold, cherry→red, needle→sharp,
ABC→easy, honey→sweet, thunder→loud, pancake→flat) — "fill either the adjective or the noun,
following the book" per item, not a single fixed blank position. `COMPLETE` is shuffled and
indexed by 1-based question number (`completeOrder[(i-1) % completeOrder.length]`), so `complete`
renders distinct sentences without replacement up to the full pool of 13.

**Section 2 (`choose`)** reproduces the p.137 "circle the correct word" exercise: each item shows
the book's own 3-word option set (e.g. *bold / brave / bad*) as chips next to a picture of the
named animal, and the child taps the one that completes "As ___ as a/an **animal**." Options are
exactly the book's three choices per item (no generated distractors) so grading matches the
source. `CHOOSE` is shuffled the same way as `COMPLETE`; all 8 animals are distinct, so the pool
(8) is also the section's max.

Both pools' items have distinct correct answers/sentences by construction, so duplicate questions
cannot occur within a section even at the pool's full size.

## Pictures

New Twemoji SVGs fetched (CC-BY 4.0, `jdecked/twemoji@16.0.1`) for animals/objects the p.135-137
pages test that weren't already bundled: `1fab6` (feather), `1f9ca` (ice cube), `1f352` (cherries),
`1faa1` (sewing needle), `1f36f` (honey pot), `26a1` (lightning bolt, for "thunder"), `1f95e`
(pancakes), `1f41c` (ant), `1f422` (turtle, for "tortoise"), `1f99a` (peacock), `1f987` (bat).
Reused already-bundled icons: `1f981` (lion), `1f431` (cat, for "kitten" — no dedicated kitten
emoji exists), `1f42d` (mouse), `1f41d` (bee), `1f411` (ewe, for "lamb"), `1f436` (dog), `1f418`
(elephant). "ABC" (item 10 of `complete`) has no picture — it is inherently textual.

## Verification

- `TARGETS` params: `seed=verify&complete=4&choose=4` → happy **8/8** (4 typed-input points + 4
  chip points).
- `DUP_PARAMS`: `complete=13&choose=8` (both at their full pool size).
- Expected: `PASS  similes  happy 8/8  probe <8  dups 0`.
- Registration: unit card + module quick-links in `index.html`, and the `TARGETS`/`DUP_PARAMS`
  entries in `verify/verify.js`, are pending — out of scope for this task (`index.html` and
  `verify.js` were not touched, per the build contract).

## Notes / decisions

- p.135's item 1 (*My father is as brave as a lion* → lion) and p.137's item 1 (*as (bold, brave,
  bad) as a lion* → brave) are both the book's own **worked examples** (already filled in /
  circled on the page). Both are included as ordinary pool items — like the golden template's
  `gWrite`/`gFirst`, which reuse words shown in the `WS.teach` example — since they are valid
  content and the "already answered" status is only an artefact of print layout, not something
  the generator needs to preserve.
- p.135's item 5 sentence keeps the book's trailing clause verbatim: *"Kathy is as gentle as a
  ___ with her baby cousin."*
- p.136 item 3 ("The baby's cheeks are as ___ as ___ cherry.") is reproduced as "...as a cherry" —
  the indefinite article was faint/ambiguous in the source photo but is grammatically required
  and consistent with the sibling items (*a feather*, *a needle*, *a pancake*).
- No `data-answer` alternatives were added: each blank in `complete` has exactly one book-supplied
  correct word from its word bank, and all 13 correct words are mutually distinct, so there is no
  synonym ambiguity (e.g. "kitten" vs "cat" — the book's word bank specifically supplies "kitten").
- No print-only section was needed: every exercise on pages 135-137 is cleanly auto-gradable
  (typed input / chip-select), unlike some other units that also carry a drawing or open-writing
  task.
