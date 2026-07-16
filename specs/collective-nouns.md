# Collective Nouns spec

Primary-One vocabulary unit teaching **collective nouns** — the special word for a whole group of
animals, people or things (a *flock* of sheep, a *class* of pupils). Based on Unit 24 (pages 107–108)
of the source workbook: a "Let's learn" box, "Tick the correct collective nouns" (a table of 3 word
options per sentence), and "Circle the correct collective nouns" (word options in parentheses inside a
sentence). Seeded generator; distinct questions. Source photos: `6972R.jpg` (p.107), `6973L.jpg` (p.108).

File: `collective-nouns.html` (copied from `beginning-sounds.html`). Config keys: `tick`, `circle`.

## Teaching block(s)

- **Collective nouns** — a collective noun is a word for a whole group of animals, people or things:
  a **flock** of sheep; a **class** of pupils. Mirrors the workbook's "Collective nouns refer to groups
  of animals, people or things."

## Sections

_Both sections draw from one shared pool of 13 collective-noun facts (`FACTS`), each with the exact
sentence + 3-word option set printed in the workbook. They are independently shuffled per section, so a
section's max (13) equals the pool size._

| # | key | heading | primitive | answer kind | pool (size) | default | max |
|---|-----|---------|-----------|-------------|-------------|---------|-----|
| 1 | `tick` | Tick the correct collective nouns | chip-select one | — | `FACTS` (13) | 5 | 13 |
| 2 | `circle` | Circle the correct collective nouns | chip-select one | — | `FACTS` (13) | 8 | 13 |

**Distinctness:** each section shuffles its own copy of `FACTS` (`shuffle(FACTS)`), indexed by question
number `(i-1) % pool.length` — a fresh permutation per section, so every question within a section is
guaranteed distinct once the count reaches 13 (the pool size). The two sections may repeat the same fact
*across* each other (e.g. "flock of sheep" could appear in both `tick` and `circle` on a given seed) —
that's fine; the duplicate scanner only checks for repeats **within** a section (grouped by `<h2>`).

**Visual styling (per-page `<style>`, not the shared engine):** both sections use the identical
`.sel-block[data-mode="one"]` / `.chip[data-ok]` contract, styled two ways to echo the book:
- `tick` (`.ticklist`) — chips stacked in a vertical column, each with a small checkbox square
  (`.box`) that shows a check mark when `.selected`, echoing the workbook's tick-table.
- `circle` (`.circlerow`) — chips laid out inline in a parenthesised, comma-separated row —
  `( flock, bunch, litter )` — echoing the workbook's "circle the word in parentheses" style.

No new Twemoji assets were added: every question is a fill-in-the-blank sentence, so the words carry the
answer, not a picture (per `AGENTS.md`'s "prefer text wherever the picture is decorative rather than the
answer") — the same choice made by the other chip-only sections in this repo (e.g. `adjectives.html`'s
`fit`, `homes.html`'s `choose`).

## Verification

- `TARGETS` params: `seed=verify&tick=4&circle=4` → happy **8/8** (4 tick-chip points + 4 circle-chip
  points, one point per block)
- `DUP_PARAMS`: `tick=13&circle=13` (both at the pool size — every fact appears exactly once per section)
- Expected: `PASS  collective-nouns  happy 8/8  probe <8  dups 0`
- Registration: unit card + module quick-links in `index.html`, `TARGETS`/`DUP_PARAMS` entry in
  `verify/verify.js` — pending (out of scope for this task; neither file was touched).

## Notes / decisions

- All 13 facts and their exact 3-word option sets are taken verbatim from the workbook (5 from the
  "tick" page, 8 from the "circle" page) — no invented collective nouns (e.g. no "bunch of keys").
- Sentence wording is reproduced faithfully, including the book's "A/An ___ of soldiers is marching."
  (kept as printed rather than resolved to "An", since the blank is filled by one of three words —
  *gang*, *group*, *army* — that take different articles).
- Item-level text does not repeat the section instruction ("Tick the correct collective noun(s)") —
  that appears once as the `<h2>` from `WS.section(...)`, matching the established pattern in
  `adjectives.html` (`gFit`) and `homes.html` (`gChoose`).
