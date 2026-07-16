# Graphic Stimulus spec

Primary-One **comprehension** unit teaching how to read a notice, a poster, or a short picture scene
and answer questions about it — Yes/No, True/False, and choose-the-correct-word. Based on workbook
pp.152-157 (unit 37, "Graphic Stimulus"): the "Reserved Seating" notice + a playground scene (p.152-153),
the "Blue Cafe's Special Promotion" poster (p.154-155), and a rainy-day scene + a hawker-centre scene
(p.156-157). Source photos: `6995L/R.jpg`, `6996L/R.jpg`, `6997L/R.jpg` (see `input/`, git-ignored).

Per AGENTS.md's ADAPTATION guidance: notices/posters are text-and-layout, so they are reproduced as
styled HTML boxes (a bordered signboard / a poster with a banner, price rows and opening hours). The
photo *scenes* (playground, rainy day, hawker centre) are not photographs the engine can render, so each
is reproduced as a short 3-5 sentence "look and read" description that a Primary One child can read,
authored to make every question's answer unambiguous. Each of the 3 sections rotates **two or three
stimuli** — the workbook's original plus 1-2 same-spirit extras (a "Library Rules" notice, a "Greenwood
School's Fun Fair" poster) — so a section's full question count still renders distinct questions. Every
question item is prefixed with a small `stimref` badge naming which stimulus it is about (e.g. "🪧
Reserved Seating"), and all of a section's stimuli are displayed together (in the `WS.teach` block) right
above that section's questions, so the child can look up at the right one while answering.

File: `graphic-stimulus.html` (copied from `beginning-sounds.html`, the reference template). Config
keys: `notice`, `poster`, `scene`. All three sections are **chip-select one** — no typed inputs, no
matching widget, no drag-order, no print-only content.

## Teaching block(s)

- **Notices** — a notice tells people the rules or information for a place; read it, then tap Yes/No.
  Shown together with both notice boxes (Reserved Seating, Library Rules), right before "Read the notice".
- **Posters** — a poster tells people about an event or a special offer; read it, then tap the correct
  answer. Shown together with both poster boxes (Blue Cafe, Fun Fair), right before "Read the poster".
- **Picture scenes** — read the scene, then tap True/False or the correct word. Shown together with all
  three scene boxes (playground, rainy day, hawker centre), right before "Look and answer".

## Sections

| # | key | heading | primitive | answer kind | pool (size) | default | max |
|---|-----|---------|-----------|-------------|-------------|---------|-----|
| 1 | `notice` | Read the notice | chip-select one (Yes/No) | — | Yes/No statements about 2 notices (12) | 4 | 12 |
| 2 | `poster` | Read the poster | chip-select one (3 options) | — | fill-the-blank sentences about 2 posters (12) | 4 | 12 |
| 3 | `scene`  | Look and answer | chip-select one (True/False, or 2-word pick) | — | statements/sentences about 3 scenes (16) | 5 | 16 |

**Stimuli:**
- `notice`: **Reserved Seating** (workbook, verbatim pictograms: on crutches, pregnant woman, carrying a
  baby, injured leg) + **Library Rules** (extra: keep your voice down, no food or drinks, return books on
  time, no running).
- `poster`: **Blue Cafe's Special Promotion** (workbook, verbatim: lemonade BOGOF, cheeseburger $2, fries
  $1/box, 10am-8pm, Mondays only) + **Greenwood School's Fun Fair** (extra, parallel structure: game booth
  2 tickets, popcorn $1/box, face painting $3, 9am-5pm, Saturday only).
- `scene`: **At the Playground** (workbook, True/False x6) + **A Rainy Day** (workbook, True/False x5) +
  **At the Hawker Centre** (workbook, choose-the-word x5).

**Distinctness:** each section builds one flat pool array (`NOTICE_Q` / `POSTER_Q` / `SCENE_Q`) tagging
every question with which stimulus it belongs to, shuffles the pool once (`shuffle(...)`), and indexes it
by the 1-based question number `(i-1) % pool.length`. Because each section's configured `max` equals its
pool's exact size, `(i-1)` never wraps around within one render, so every rendered question maps to a
distinct pool entry — and every pool entry's wording is authored to be unique. Chip *display* order is
re-shuffled per question (`shuffle(opts)`), but distinctness is carried by the question text, not chip
order. `scene` mixes two response shapes (True/False and a 2-word pick) inside one pool/section — both
render through the same chip-select-one primitive, just with different chip labels.

## Verification

- `TARGETS` params: `seed=verify&notice=4&poster=4&scene=4` → happy **12/12**
- `DUP_PARAMS`: `notice=12&poster=12&scene=16` (each equal to its pool size — the hardest stress test)
- Expected: `PASS  graphic-stimulus  happy 12/12  probe <12  dups 0`

## Notes / decisions

- **No typed inputs.** Every exercise in this unit is a closed-choice read-and-tap task (Yes/No,
  True/False, tick-the-answer, circle-the-word), so the whole unit is chip-select-one; there was no
  natural typed-input exercise on the source pages to reproduce.
- **Reserved Seating Q6** was originally two sentences on the page ("An old lady cannot stand for long.
  She can take the seat.") — kept as one two-sentence statement (rather than merged into one sentence) to
  stay verbatim.
- **Scene answers are authored, not photographed.** Since the playground/rainy-day/hawker-centre scenes
  are reproduced as written descriptions (not images — see AGENTS.md ADAPTATION), the descriptions were
  written so every question's answer is unambiguous from the text: e.g. the hawker-centre description
  explicitly says customers "wait patiently" (not busy) while "the hawkers are busy cooking and serving",
  so "The ___ are very busy" (customers/hawkers) resolves cleanly to *hawkers*; the playground description
  places two girls "nearby" so "the boy is playing alone" resolves to *False* (a few children are present)
  while still describing him climbing solo.
- **Pictograms** for Reserved Seating and the poster items use new Twemoji SVGs fetched into
  `assets/twemoji/`: `1fa7c` (crutch), `1f930` (pregnant woman), `1f476` (baby), `1fa79` (adhesive
  bandage), `1f92b` (shushing face), `1f6ab` (no entry sign), `1f964` (cup with straw, for lemonade),
  `1f354` (hamburger), `1f35f` (fries), `1f3ab` (ticket), `1f37f` (popcorn), `1f3a8` (artist palette).
  Reuses the already-bundled `1f4d5` (book) for the Library Rules "return books" line.
- **Favicon** follows the repo-wide convention of every other unit (`assets/twemoji/1f4d5.svg`), not a
  custom 🪧 icon — the 🪧 emoji only appears as a literal system glyph (panel summary, footer, and the
  index.html card emoji, which this task does not modify).
- Registration (index.html card + module quick-links, verify/verify.js `TARGETS`/`DUP_PARAMS`) is
  intentionally **not** included in this unit's files — per this task's hard contract, those shared files
  are updated by the coordinating process from the returned block, not by this unit's own commit.
