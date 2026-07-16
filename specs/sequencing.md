# Sequencing spec

Primary-One comprehension unit teaching **sequencing** — putting the events of a short story into the
order they happen. Based on **Unit 34** (pages 144–146) of the source workbook: "Arrange the pictures in
the correct sequence. Write **1**, **2** or **3**" (pages 144–145, three-picture stories) and "Write
**'First'**, **'Next'**, **'Then'** or **'Last'**" (page 146, four-picture stories). The workbook
exercises are entirely **picture**-sequencing; this unit adapts them to short **text** steps (see
*Notes* below) so they can be drag/tap-ordered and self-marked.

File: `sequencing.html` (copied from `beginning-sounds.html`). Config keys: `order`, `first`.

## Teaching block(s)

- **Sequencing** — a story happens in an order; show it with numbers (1st, 2nd, 3rd…) or the words
  First/Next/Then/Last. Worked example: Wake up → Get dressed → Eat breakfast.
- **First and last** — the first step happens before everything else; the last step happens right at
  the end. Same worked example, labelled FIRST/LAST.

## Sections

| # | key | heading | primitive | answer kind | pool (size) | default | max |
|---|-----|---------|-----------|-------------|-------------|---------|-----|
| 1 | `order` | Put the steps in order | drag/tap-to-order (`.dorder`) | position match (tile value = step position) | `STORIES` (10) | 5 | 10 |
| 2 | `first` | What happens first or last? | chip-select one | — | `STORIES` (10) | 4 | 10 |

**Distinctness:** both sections shuffle their own copy of the shared `STORIES` pool once, then index it
by the 1-based question number (`pool[(i-1) % pool.length]`) — the same pattern as `gSentence` in the
golden template — so within either section no two questions draw the same story, as long as its count
stays ≤ 10 (the pool size, which is also each section's panel `max`). The two sections draw
*independently*-shuffled copies of the pool (two separate `shuffle(STORIES)` calls), so the same story
may legitimately appear once in `order` and once in `first` on a given seed — only *within*-section
repeats are policed (and forbidden).

## The story pool (`STORIES`)

Ten short stories, each an ordered `steps` array (7 have 3 steps, 3 have 4 steps). Nine are adapted from
the workbook's picture sequences (pages 144–146); one ("Brushing Teeth") is an original story in the
same everyday-routine style, per the brief's "book's plus similar everyday routines" guidance.

| Story | Steps | Workbook source |
|---|---|---|
| A Hen's Eggs | 3 | p.144 #1 — hen lays eggs → eggs hatch into chicks → hen feeds her chicks |
| Swimming Time | 3 | p.144 #2 — puts on swimsuit → swims and plays → dries off with a towel |
| The Banana Peel | 3 | p.144 #3 — eats a banana, drops the peel → steps on it, slips → falls down |
| Going to School | 3 | p.145 #1 — waits at the bus stop → boards the bus → rides to school |
| Growing a Plant | 3 | p.145 #2 — plants a seed → waters it every day → it grows into a tall plant |
| Sports Day | 3 | p.145 #3 — gets ready at the start line → runs the race → wins |
| Brushing Teeth | 3 | original (everyday routine, not in the workbook) |
| Building a Snowman | 4 | p.146 #1 (the workbook's own worked example) — roll a big ball → stack a medium ball → stack a small ball → add hat/face/arms |
| The Birthday Cake | 4 | p.146 #2 — bake → decorate with candles → blow out the candles → cut and eat |
| Bedtime | 4 | p.146 #3 — pyjamas → read a bedtime story → lie down → fall asleep |

Step wording deliberately avoids the words "first/next/then/last/1st/2nd…" — those only ever appear as
the **slot labels** (section 1) or the **question stem** (section 2, "FIRST"/"LAST"), never inside a
shuffled tile or chip, so the child has to reason about the story rather than pattern-match a keyword.

## Layout, not a new interaction

Both sections reuse the two primitives already demonstrated in the golden template
(`beginning-sounds.html`'s `gSentence` for drag/tap-to-order, `gName` for chip-select-one) — no new
marking logic and no `window.__wsAutoSolve` was needed, so `verify/verify.js` needs no `EXTENSION POINT`
driver for this unit. The only new thing is **presentation**: because a step is a whole sentence (not a
single word or picture), the page `<style>` lays the order widget out **vertically**
(`.seq .dsource`/`.dtile`/`.dslots`/`.dslot`) with an ordinal label (`1st`/`2nd`/`3rd`/`4th`) beside each
slot, and stacks the chip options in `first` (`.stepchips`) instead of a row. These rules use two-class
selectors (e.g. `.seq .dtile`), so they out-specificity the shared one-class rules in `worksheet.css`
without editing that file.

## Verification

- `TARGETS` params: `seed=verify&order=3&first=3`
- `DUP_PARAMS`: `order=10&first=10` (both = the pool size)
- Result: `PASS  sequencing  happy 14/14  probe 13/14  dups 0`
- The probe drops exactly one mark via section 2 (`first`). Section `order` is 100% drag/tap-to-order,
  which the verifier's happy/probe driver always places correctly regardless of the probe flag (only
  typed inputs and the *first* correct chip page-wide are deliberately left blank/unclicked in probe
  mode) — `first` is what gives the probe something to drop, per AGENTS.md's probe contract. This is
  why the unit has a chip section at all alongside the order section.

## Notes / decisions

- **Adaptation, not a literal reproduction.** The workbook exercise is entirely picture-based (three or
  four small line drawings per story, arranged left-to-right, with empty boxes to write 1/2/3 or
  First/Next/Then/Last). Per the brief, pictures were converted to short text steps so they work as
  `.dorder` tiles / chip text; each story keeps the workbook's setting and action (hen/eggs, swimming,
  banana peel, bus stop, planting, snowman, cake, bedtime) even though the exact drawn scene can't be
  reproduced pixel-for-pixel.
- **Page 145 #3 ("Sports Day").** The brief's photo summary names five stories across pages 144–145; the
  photos themselves show six three-panel sequences (start line → running → breaking the tape, with
  track-lane markings in all three panels). That sixth sequence was folded in as "Sports Day" so every
  exercise on the page is represented, per AGENTS.md's "reproduce every exercise, none skipped."
- **Emoji are decorative only.** The 🐔🏊🍌🚌🌱🏁🦷⛄🎂🌙 badges before each story are system emoji (the same
  convention as the footer/panel-summary emoji elsewhere in this codebase) — flavour text, not part of
  any answer — so this unit adds no new files under `assets/twemoji/`.
