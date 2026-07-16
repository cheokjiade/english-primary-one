# Country, People and Language spec

Primary-One **vocabulary** unit teaching that people in different countries are called by a
different name and speak a different language (Singapore → Singaporeans, Thailand → Thais …).
Based on Unit 26 (pages 113–115) of the source workbook (*Educational Publishing House*, photos
`6975R.jpg`, `6976L.jpg`, `6976R.jpg`): a "Let's learn" box, a "fill in the blanks" flag exercise
(Singapore/Malaysia/Thailand/Philippines/Vietnam), and a "circle the countries, underline the
languages" sentence exercise about six friends (Ella, Budi, David, Li Na, Arjun, Aiko) set at
Racial Harmony Day. Built as a seeded generator: the same `?seed=…` + settings reproduce the sheet
exactly, and each section renders **distinct** questions.

File: `country-people-language.html` (copied from `beginning-sounds.html`). Config keys / URL
params / panel fields / section counts: `people`, `country`, `find`.

**Adaptation from the page:** the workbook shows a picture of each flag next to the fill-in-the-
blank sentence. This repo has no bundled flag SVGs (Twemoji flag sequences aren't in
`assets/twemoji/`), so per `AGENTS.md`'s "prefer text wherever the picture is decorative" guidance,
the flag picture is dropped and the country name is given as text instead. The original two-blank
sentence ("flag of ___" + "people are called ___") is split into two sections that test the same
fact from both directions: `people` (given the country, write the people) and `country` (given the
people or the language, choose the country) — a fuller test of the vocabulary than reproducing the
two blanks together, and avoids needing any flag artwork.

## Teaching block(s)

- **Country, people and language** — "People in different parts of the world live in different
  countries and speak different languages" (the workbook's own Let's Learn line), plus two worked
  examples: Singapore → Singaporeans, Malaysia → Malaysians.
- **Which country?** (before section 2) — one worked example: speaks Hindi → India.
- **Circle and underline** (before section 3) — the instruction restated plus a worked example
  mirroring the workbook's own first (already-answered) item: *Ella is from (France). She speaks
  French and English.*

## Sections

| # | key | heading | primitive | answer kind | pool (size) | default | max |
|---|-----|---------|-----------|-------------|-------------|---------|-----|
| 1 | `people` | Fill in the blanks | typed input | `text` (built-in, case-insensitive) | country facts (11) | 4 | 10 |
| 2 | `country` | Choose the country | chip-select one | — | country facts (11) | 4 | 10 |
| 3 | `find` | Circle the country, underline the language | **annotation widget** (custom, reused from `common-proper-nouns.html`) | custom marker `markFind` | tagged sentences (11) | 3 | 8 |

**Distinctness per section** (every `max` ≤ its pool size):

- `people` — shuffle the `COUNTRIES` pool, index by the 1-based question number → distinct country
  (and therefore distinct `data-answer`) per question.
- `country` — a **separately** shuffled instance of the same `COUNTRIES` pool, indexed the same way
  → distinct target country per question regardless of which clue (`people` or `lang`) is shown;
  `balanced(['people','lang'])` spreads the two clue phrasings across the section instead of an
  independent per-question coin flip.
- `find` — shuffle the sentence pool, take the first `count` (a permutation slice, so always
  distinct) → distinct sentence per `.item`.

## Content pools

**`COUNTRIES`** (country → people → one representative language; `lang` is kept **unique to one
country within this pool** so a "choose the country" clue never has two plausible-correct chips):
Singapore/Singaporeans/Tamil, Malaysia/Malaysians/Malay, Thailand/Thais/Thai,
Philippines/Filipinos/Filipino (rendered "the Philippines" in section 1, matching the workbook),
Vietnam/Vietnamese/Vietnamese, France/French/French, Indonesia/Indonesians/Indonesian,
Australia/Australians/English, China/Chinese/Mandarin, India/Indians/Hindi,
Japan/Japanese/Japanese. **(11.)** Singapore's language fact uses Tamil (rather than English/Malay/
Mandarin, all of which collide with another pool country) specifically so it stays unambiguous —
a deliberate nod to Singapore's four official languages and Racial Harmony Day.

**`FIND`** (sentence, tokenised into `{t, type}` words — `type`: `country` | `language` | `none` —
plus inert `{p}` punctuation tokens that render as plain text, never a clickable/gradable `.aword`):
the workbook's own six friends — Ella/France/French+English, Budi/Indonesia/Indonesian,
David/Australia/English, Li Na/China/Mandarin+English, Arjun/India/Hindi, Aiko/Japan/Japanese
(Racial Harmony Day) — plus five more in the same style, one per flag-exercise country not already
covered: Wei Jie/Singapore/English+Malay, Iman/Malaysia/Malay, Nok/Thailand/Thai,
Marco/(the) Philippines/Filipino, Mai/Vietnam/Vietnamese. **(11.)**

## Interaction & marking — the annotation widget (reused from `common-proper-nouns.html`)

A toolbar of two **fixed** tools (this unit doesn't need a switchable "which mark" like
`common-proper-nouns`'s tick-vs-underline) plus tappable word spans:

```
<div id="sec-find" class="annot">
  <div class="atools no-print">
    <button class="atool" data-mark="circle">⭕ circle (country)</button>
    <button class="atool" data-mark="underline">＿ underline (language)</button>
  </div>
  <span class="aword" data-type="country">France</span> …    <!-- data-type: country | language | none -->
</div>
```

- Interaction, marks-as-CSS-classes, and the tap-to-toggle behaviour are byte-identical to
  `common-proper-nouns.html`'s widget (`applyMarkClass`, `wireAnnot`).
- **`markFind`** scores **each sentence** (`.item`) 1 point, all-or-nothing: every word's applied
  mark must equal its expected mark (`country → circle`, `language → underline`, `none →
  unmarked`), including names/other proper nouns (e.g. *Racial Harmony Day*) that must stay
  unmarked. Passed to `WS.mark({ extras:[markFind] })`; reset via `WS.clearAll(resetAnnotations)`.
- **`window.__wsAutoSolve`** sets every `#sec-find .aword` to its expected mark — the verifier's
  `EXTENSION POINT` calls it unconditionally (including during the probe run), so the find section
  always completes correctly; the probe's score drop comes from the blanked first `people` input
  and the skipped first correct `country` chip instead.
- Both `resetAnnotations` and `__wsAutoSolve` are scoped to `#sec-find .aword` (not a bare
  document-wide `.aword` query as in the two-section original) since this unit has only one
  annotation section and the teach-block examples reuse plain `<b>`/`<u>` tags rather than
  `.aword` spans, so there is nothing else for a global selector to (mis)match — but scoping is
  cheap insurance regardless.
- Punctuation handling: `findWords()` renders `{p:'.'}`/`{p:'!'}` tokens as plain `<span
  class="punct">` text glued to the previous word (no leading space, so "France." reads tight),
  never wrapped in `.aword` — so periods are inert for both the click handler and the marker.

## Verification

- `TARGETS` params: `seed=verify&people=4&country=4&find=3` → happy **11/11** (4 typed inputs + 4
  chip blocks + 3 sentence points).
- `DUP_PARAMS`: `people=10&country=10&find=8` (each ≤ its pool size of 11).
- Expected: `PASS  country-people-language  happy 11/11  probe <11/11  dups 0`.
- Registration: add to `verify/verify.js` (`TARGETS` + `DUP_PARAMS`) and a card in `index.html`.

## Notes / decisions

- **No flag images.** No Twemoji flag-sequence SVGs are bundled in this repo; per `AGENTS.md`
  ("prefer text wherever the picture is decorative rather than the answer"), the country name is
  given as text. See the adaptation note above the Sections table for how this reshaped the layout
  into two directions of the same fact instead of one two-blank sentence.
- **Case-insensitive answers.** `people`'s `data-answer` uses the default `text` kind, so
  `singaporeans` marks right for `Singaporeans` — Primary One children aren't expected to get
  capitalisation of demonyms right by rote; capitalisation is taught in `common-proper-nouns.html`.
- **"the Philippines."** The workbook prints "This is the flag of **the** ______" only for the
  Philippines item; `COUNTRIES` marks it with `article:true` and section 1 prepends "the" outside
  the bolded country name. The `find` sentence for Marco also writes "from the Philippines" with
  "the" tagged `none` (unmarked), matching how articles are already treated as `none` in
  `common-proper-nouns.html`'s own `FIND` pool.
- **Invented names (Wei Jie, Iman, Nok, Marco, Mai).** Not in the source photos; added only to pad
  the `find` pool to 11 sentences (needed so `find`'s max/DUP count of 8 stays safely under the
  pool size) using the same "X is from Y. (S)he speaks Z." pattern as the workbook's own six.
