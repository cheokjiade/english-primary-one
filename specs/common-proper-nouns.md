# Common and Proper Nouns spec

Primary-One grammar unit teaching **common vs proper nouns** — that a proper noun is a special name
which begins with a **capital letter**. Based on Unit 1 (pages 1–5) of the source workbook
(*Educational Publishing House*, photos `input/IMG_6891–6894`): a "Let's learn" box plus five
exercises (write the noun / sort common–proper / circle & underline in sentences / fill from a word
box / rewrite with capitals). Built as a seeded generator: the same `?seed=…` + settings reproduce the
sheet exactly, and each section renders **distinct** questions.

File: `common-proper-nouns.html` (copied from `beginning-sounds.html`). Config keys / URL params /
panel fields / section counts: `write`, `sort`, `find`, `blank`, `capital`.

## Teaching block(s)

One `WS.teach(...)` before the exercises (the page's LET'S LEARN):

- **Common and proper nouns** — "A **common noun** is a person, place, animal or thing. A **proper
  noun** is a special name for a common noun, and it **begins with a capital letter**." + worked
  example: *Colin works as a dentist.* → **Colin** = proper noun, **dentist** = common noun.

A short second `WS.teach` may precede section 5 ("A proper noun always starts with a capital letter.").

## Sections

| # | key | heading | primitive | answer kind | pool (size) | default | max |
|---|-----|---------|-----------|-------------|-------------|---------|-----|
| 1 | `write` | Write the naming word | typed input + Twemoji picture | `text` (built-in, `\|`-alt) | common nouns bundled as Twemoji (27) | 4 | 12 |
| 2 | `sort` | Common or proper? | **annotation widget** (custom) | custom marker `markSort` | mixed common+proper nouns (36) | 4 | 12 |
| 3 | `find` | Circle the common noun, underline the proper noun | **annotation widget** (custom) | custom marker `markFind` | tagged sentences (13) | 3 | 8 |
| 4 | `blank` | Fill in the blanks | drag-to-order (linked word box) | built-in slot marking | frame+answer pairs (14) | 4 | 8 |
| 5 | `capital` | Rewrite with capital letters | typed input (full line) | **`capsentence`** (custom kind) | lowercase→Proper sentences (14) | 3 | 8 |

**Distinctness per section** (the verifier fails any section that renders the same question twice
across seeds; every `max` ≤ its pool size):

- `write` — shuffle the noun-picture pool, index by the 1-based question number → distinct word +
  `data-answer` per question. (`rabbit` uses `data-answer="rabbit|bunny"`.)
- `sort` — one widget holding `sort` words drawn **without replacement** from the mixed pool (shuffle,
  take the first N). Distinct words guaranteed by the draw. *Note:* the whole widget is a single
  `.item`, so the dup-scanner cannot check word-uniqueness inside it — the generator owns that.
- `find` — shuffle the sentence pool, index by question number → distinct sentence per `.item`.
- `blank` — shuffle the frame/answer pool, index by question number → distinct sentence **and** answer
  word per slot (answers within a group must be unique so each drag tile is unambiguous).
- `capital` — shuffle the sentence pool, index by question number → distinct sentence + `data-answer`.

## New interactions & marking

This unit adds bespoke pieces; all live **in the page**, not `assets/worksheet.js`.

**Annotation widget (sections 2 & 3).** A toolbar of two "tools" plus tappable word spans:

```
<div class="annot" data-proper="tick|underline">
  <div class="atools no-print">
    <button class="atool" data-mark="circle">⭕ circle (common)</button>
    <button class="atool" data-mark="tick">✓ tick (proper)</button>   <!-- S3: "underline (proper)" -->
  </div>
  <span class="aword" data-type="common">banana</span> …            <!-- data-type: common | proper | none -->
</div>
```

- Interaction: tapping a tool makes it active; tapping a word applies the active tool's mark, and
  tapping the same word again (same tool) clears it — tapping with the other tool switches the mark.
  Marks are CSS classes (`mk-circle` = ring, `mk-tick` = ✓ superscript, `mk-underline`).
- Expected mark per word: `common → circle`, `proper → the widget's data-proper mark`, `none → unmarked`.
- **`markSort`** (section 2) scores **each word** 1 point (all words are nouns). **`markFind`**
  (section 3) scores **each sentence** 1 point, all-or-nothing: every word's applied mark must equal
  its expected mark (including non-nouns left unmarked). Both are passed to
  `WS.mark({ extras:[markSort, markFind] })` and paint `.correct`/`.incorrect` on the words. Reset is
  wired through `WS.clearAll(resetAnnotations)`.

**`capsentence` custom kind (section 5).** Registered with `WS.addKind('capsentence', fn)`; the input
carries `data-kind="capsentence"` and `data-answer` = the fully-corrected sentence (e.g.
`"Singapore is an island."`). Lenient rule — the child's line is right iff:

1. it has the **same words in order** as the answer (compare token-by-token, case-insensitively, after
   stripping leading/trailing punctuation) — spelling counts because they are copying the sentence; and
2. every word that is **capitalised in the answer** is capitalised the same way in the child's line
   (case-sensitive) — this is the proper-noun (and given sentence-initial) capital.

Punctuation and the case of non-capitalised words are ignored. A wrong line shows the corrected
sentence as its `.correction`. (Non-proper first words like *Have* / *My* are already capitalised in
the shown prompt, matching the workbook, so only the proper nouns need fixing.)

**Verifier auto-solve hook.** Because the annotation widgets expose no `input.gradable`/`.chip`, the
generic driver can't complete them. The page defines `window.__wsAutoSolve = () => { …set every
.aword to its expected mark… }`; the verifier's `EXTENSION POINT` calls
`await page.evaluate(() => window.__wsAutoSolve && window.__wsAutoSolve())` before pressing Submit.
This is a reusable convention for any future unit with a bespoke widget. Sections 1 (text), 4
(drag-order) and 5 (`capsentence` input) are already driven by the generic contract.

## Content pools (initial)

- **write** (common noun → Twemoji codepoint): book 1f4d5, pencil 270f, crayon 1f58d, apple 1f34e,
  cat 1f431, car 1f697, duck 1f986, fish 1f41f, star 2b50, boat 26f5, egg 1f95a, bee 1f41d,
  bird 1f426, rabbit 1f430 (alt *bunny*), frog 1f438, cake 1f370, balloon 1f388, house 1f3e0,
  flag 1f6a9, truck 1f69a, butterfly 1f98b, leaf 1f343, cloud 2601, shell 1f41a, bag 1f45d,
  box 1f4e6, cookie 1f36a. **(27 — all already bundled; no new SVGs.)**
- **sort** — commons: banana, apple, chair, park, boat, bear, cat, garden, playground, ruler, book,
  pencil, baby, ice cream, bird, ball, flower, shoe (18); propers: Mount Everest, Mr Tan, Olivia,
  China, Liam, Japan, Mount Fuji, Yellow River, Singapore, Eric Carle, Australia, Amy, Sue, Tim,
  John, Pam, India, Ben Wong (18). **(36 total.)**
- **find** (sentence → tagged nouns): "Sue borrows books from the library." (Sue=proper; books,
  library=common) · "John plays football and basketball." (John=proper; football, basketball=common) ·
  "Evan and his brother live in Australia." (Evan, Australia=proper; brother=common) · "Lilian likes
  apples and oranges." (Lilian=proper; apples, oranges=common) · "Pam cycles in the park." (Pam=proper;
  park=common) · "Tim reads a book." (Tim=proper; book=common) · "Amy sews beautiful dresses."
  (Amy=proper; dresses=common) · "My friend lives in Japan." (Japan=proper; friend=common) · "Sara
  plays with a ball." (Sara=proper; ball=common) · "We visited China." (China=proper) · "The dog runs
  in the garden." (dog, garden=common — no proper) · "Ben feeds the cat." (Ben=proper; cat=common) ·
  "Nina paints a flower." (Nina=proper; flower=common). **(13.)**
- **blank** (frame `___` → answer): "My sister colours with her ___." (crayons) · "There are many ___
  in the zoo." (animals) · "My brother takes a ___ to school." (bus) · "Uncle Samy comes from ___."
  (India) · "Hens lay ___." (eggs) · "A ___ makes honey." (bee) · "This ___ belongs to me." (bicycle) ·
  "___ wrote the book." (Eric Carle) · "A ___ barks loudly." (dog) · "The ___ flies in the sky."
  (bird) · "I write with a ___." (pencil) · "We keep books on the ___." (shelf) · "The ___ swims in
  the pond." (fish) · "My ___ has four legs." (table). **(14.)**
- **capital** (shown lowercase → `data-answer`): "singapore is an island." → Singapore is an island. ·
  "Have you been to china?" → Have you been to China? · "mr tan teaches english." → Mr Tan teaches
  English. · "My uncle lives in japan." → My uncle lives in Japan. · "lily is my best friend." → Lily
  is my best friend. · "My name is ben wong." → My name is Ben Wong. · "amy lives in australia." → Amy
  lives in Australia. · "We climbed mount fuji." → We climbed Mount Fuji. · "sara visited india." →
  Sara visited India. · "My friend liam is from china." → My friend Liam is from China. · "tim likes
  eric carle." → Tim likes Eric Carle. · "We swam in the yellow river." → We swam in the Yellow River. ·
  "john plays with ben." → John plays with Ben. · "Is olivia your sister?" → Is Olivia your sister?
  **(14.)**

## Verification

- `TARGETS` params: `seed=verify&write=3&sort=3&find=3&blank=3&capital=3` → happy **15/15**
  (3 inputs + 3 words + 3 sentences + 3 slots + 3 lines).
- `DUP_PARAMS`: `write=8&sort=10&find=8&blank=8&capital=8` (each ≤ its pool size).
- Expected: `PASS  common-proper-nouns  happy 15/15  probe <15/15  dups 0`.
- Verifier change: add the `TARGETS`/`DUP_PARAMS` entries **and** the `window.__wsAutoSolve` call at
  the `EXTENSION POINT`.
- Registration: add a unit **card in `index.html`** linking to `common-proper-nouns.html`.

## Notes / decisions

- **Adaptations from the page:** exercise A's *letter-tracing* of proper nouns is represented by
  section 5 (capitals) rather than literal handwriting; exercise C keeps **both** annotations (circle
  + underline) via the annotation widget; the rocket picture in exercise B is rendered as a plain word
  cluster (no Twemoji equivalent for the line-art rocket).
- **Why a `capsentence` kind, not whole-string match:** the built-in `text` kind is case-insensitive,
  so it can't grade capitals; a strict full-string match is brittle for P1 (punctuation/spacing). The
  kind checks words-in-order + required capitals only.
- **`sort` widget distinctness** is generator-guaranteed (draw without replacement), not
  verifier-guaranteed, because the widget is a single `.item`.
- **Pictures:** section 1 uses only already-bundled Twemoji; no new SVGs expected. If vocabulary is
  extended later, drop the `<codepoint>.svg` into `assets/twemoji/` (keep CC-BY attribution).
- **Proper-noun edge:** multi-word names (Mr Tan, Yellow River, Eric Carle, Ben Wong, Mount Fuji) test
  capitalising *each* word; the `capsentence` rule enforces every capitalised token independently.
