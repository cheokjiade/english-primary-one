# Common and Proper Nouns Unit — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `common-proper-nouns.html` — a seeded, self-marking Primary-One worksheet for Unit 1 (common vs proper nouns), reproducing all five workbook exercises and passing the verifier at `happy 15/15  probe <15  dups 0`.

**Architecture:** One static HTML page copied from `beginning-sounds.html`, sharing `assets/worksheet.js` (`WS`) and `assets/worksheet.css` via classic `<script src>`/`<link>` (file://-safe). Five sections, each a seeded generator drawing distinct questions from a pool. Sections 1 (typed), 4 (drag-order) and 5 (typed, custom `capsentence` kind) use the built-in marking contract; sections 2 & 3 use a bespoke in-page **annotation widget** (circle/tick/underline) graded by custom `extras` markers and auto-completed in the verifier via a `window.__wsAutoSolve` hook.

**Tech Stack:** Vanilla JS + HTML + CSS (no build). Verifier: `playwright-core` driving installed Chrome/Edge headless.

## Global Constraints

- Classic includes only — `<script src="assets/worksheet.js">` (NOT `type="module"`), `<link>` for CSS. No `import`/`fetch` of local files (breaks under `file://`).
- Do NOT edit `assets/worksheet.js` or `assets/worksheet.css`. All new interactions live in the page's own `<style>`/`<script>` (per `specs/conventions.md`).
- All randomness flows from `WS.makeRng(cfg.seed)` via `WS.helpers(rng)`. Never call `Math.random()` in generators.
- Every section renders **distinct** questions across its count; each `max` and each `DUP_PARAMS` count ≤ its pool size.
- Pictures: Twemoji SVGs already bundled under `assets/twemoji/`, referenced by codepoint. No new SVGs are expected for this unit.
- Spec of record: `specs/common-proper-nouns.md`. Config keys: `write`, `sort`, `find`, `blank`, `capital`.
- Work on a branch `feature/common-proper-nouns` (repo default branch is `master`). Commit after each task.

---

### Task 1: Scaffold the unit + dev check harness

**Files:**
- Create: `common-proper-nouns.html`
- Create: `verify/check.js`

**Interfaces:**
- Produces: a loadable page with `#sheet`, `#score`, the panel (fields `f-write/f-sort/f-find/f-blank/f-capital`), `cfg` (keys `write,sort,find,blank,capital`), `rng` + destructured `{ shuffle, pick }`, picture helpers `TW/img/pic`, and a `render()`/wiring block. `verify/check.js` drives one URL (fills inputs, clicks `data-ok` chips, places drag tiles, calls `window.__wsAutoSolve`, submits) and prints `score: … | errors: …`.

- [ ] **Step 1: Create the page from the reference unit**

Create `common-proper-nouns.html`. Start from `beginning-sounds.html`'s structure. Head + panel + body skeleton:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Common and Proper Nouns — Primary One English</title>
<link rel="stylesheet" href="assets/worksheet.css">
<style>
  .qrow { display:flex; align-items:center; gap:18px; flex-wrap:wrap; }
  img.pic { width:64px; height:64px; }
  input.ans { font:inherit; text-align:center; border:none; border-bottom:2px solid var(--ink); background:transparent; color:var(--ink); width:60px; }
  input.ans.word { width:150px; }
  /* annotation widget (sections 2 & 3) */
  .atools { display:flex; gap:8px; margin:6px 0 12px; flex-wrap:wrap; }
  .atool { font-family:Verdana,sans-serif; font-size:11pt; padding:5px 12px; border:2px solid #888; border-radius:8px; background:#fff; cursor:pointer; font-weight:bold; }
  .atool.active { background:#dbeafe; border-color:var(--accent); }
  .awords { line-height:2.4; }
  .aword { display:inline-block; padding:2px 7px; margin:3px 3px; font-size:16pt; cursor:pointer; border:2px solid transparent; position:relative; }
  .aword.mk-circle { border:2.5px solid #1d4ed8; border-radius:50%; }
  .aword.mk-underline { border-bottom:3px solid #1d4ed8; }
  .aword.mk-tick::after { content:'✓'; color:#1d4ed8; font-weight:bold; position:absolute; top:-11px; right:-3px; font-size:13pt; }
  .aword.correct { background:#bbf7d0; } .aword.incorrect { background:#fecaca; }
  /* section 4 word box */
  .wordbox { font-weight:bold; font-family:Verdana,sans-serif; font-size:12pt; margin:4px 0; }
  /* section 5 capital lines */
  .caprow { display:block; margin-top:4px; }
  .shown { color:#555; }
  input.capline { display:block; width:100%; max-width:520px; font:inherit; border:none; border-bottom:2px solid var(--ink); background:transparent; color:var(--ink); margin-top:4px; }
  @media print { .aword.correct, .aword.incorrect { background:#fff; } }
</style>
</head>
<body>
<details class="panel no-print" id="ws-panel" open>
  <summary>🔠 Common &amp; Proper Nouns — options</summary>
  <div class="panel-body">
    <div class="backlink"><a href="index.html">&larr; All worksheets</a></div>
    <div class="fields">
      <label data-tip="A word or number. The same seed always makes the same sheet; leave blank for a random one.">Seed <input type="text" id="f-seed" placeholder="random"></label>
      <label data-tip="Look at the picture and write the naming (common) noun.">Write noun <input type="number" id="f-write" min="0" max="12"></label>
      <label data-tip="Pick a tool, then tap each word: circle the common nouns, tick the proper nouns.">Sort <input type="number" id="f-sort" min="0" max="12"></label>
      <label data-tip="In each sentence, circle the common nouns and underline the proper nouns.">Find <input type="number" id="f-find" min="0" max="8"></label>
      <label data-tip="Drag the words from the box into the right blanks.">Fill blanks <input type="number" id="f-blank" min="0" max="8"></label>
      <label data-tip="Rewrite each sentence with capital letters for the proper nouns.">Capitals <input type="number" id="f-capital" min="0" max="8"></label>
    </div>
    <div class="btns">
      <button class="go" id="b-apply">Generate</button>
      <button id="b-random">🎲 Random seed</button>
      <button class="primary" id="b-submit">✅ Submit &amp; Mark</button>
      <button id="b-reset">Clear answers</button>
      <button id="b-print">🖨️ Print</button>
    </div>
    <div class="hint">Type words (capitals matter only in the last section); tap words to mark them; drag word tiles into blanks. Same seed + settings = same worksheet.</div>
  </div>
</details>
<div class="score" id="score"></div>
<h1>Common and Proper Nouns</h1>
<div class="meta-line" id="meta"></div>
<div class="name-row"><div>Name: <span></span></div><div>Date: <span></span></div></div>
<div id="sheet"></div>
<div class="footer">Great work! 🔠⭐</div>

<script src="assets/worksheet.js"></script>
<script>
"use strict";
const cfg = { seed: WS.Q.get('seed') || WS.randomSeed(),
  write:   WS.clamp(WS.toInt(WS.Q.get('write'),   4), 0, 12),
  sort:    WS.clamp(WS.toInt(WS.Q.get('sort'),    4), 0, 12),
  find:    WS.clamp(WS.toInt(WS.Q.get('find'),    3), 0, 8),
  blank:   WS.clamp(WS.toInt(WS.Q.get('blank'),   4), 0, 8),
  capital: WS.clamp(WS.toInt(WS.Q.get('capital'), 3), 0, 8) };

const rng = WS.makeRng(cfg.seed);
const { randInt, pick, shuffle, distinct, balanced } = WS.helpers(rng);

const TW  = cp => 'assets/twemoji/' + cp + '.svg';
const img = cp => '<img class="obj" src="' + TW(cp) + '" alt="">';
const pic = cp => '<img class="pic" src="' + TW(cp) + '" alt="">';

/* ---- sheet assembly (each later task appends its section here) ---- */
let html = '';
html += WS.teach('Common and proper nouns',
  'A <b>common noun</b> is a person, place, animal or thing.<br>'
  + 'A <b>proper noun</b> is a special name for a common noun, and it begins with a <b>capital letter</b>.<br>'
  + '<span class="ex"><u>Colin</u> works as a <b>dentist</b>. → <b>Colin</b> = proper noun, <b>dentist</b> = common noun</span>');
/* SLOT:write */
/* SLOT:sort */
/* SLOT:find */
/* SLOT:blank */
/* SLOT:capital */

document.getElementById('sheet').innerHTML = html;
document.getElementById('meta').textContent = 'seed: ' + cfg.seed + '  •  Primary One English • common & proper nouns';

/* ---- wiring (extended by later tasks) ---- */
WS.wirePanel(cfg, ['write','sort','find','blank','capital'], {
  mark:  () => WS.mark(),
  clear: () => WS.clearAll(),
});
</script>
</body>
</html>
```

- [ ] **Step 2: Create the dev check harness**

Create `verify/check.js`:

```js
// Dev helper: drive one URL of a unit and print the marked score + console errors.
// Usage:  cd verify && node check.js "seed=verify&write=3&sort=0&find=0&blank=0&capital=0"
const { chromium } = require('playwright-core');
const path = require('path');
(async () => {
  const params = process.argv[2] || 'seed=verify&write=3&sort=3&find=3&blank=3&capital=3';
  const file = process.argv[3] || 'common-proper-nouns.html';
  const abs = path.resolve(__dirname, '..', file).replace(/\\/g, '/');
  let browser;
  for (const opt of [{channel:'chrome'},{channel:'msedge'}]) { try { browser = await chromium.launch({ headless:true, ...opt }); break; } catch(e){} }
  if (!browser) { console.error('No Chrome/Edge found'); process.exit(1); }
  const pg = await browser.newPage(); const errs = [];
  pg.on('pageerror', e => errs.push('pageerror: ' + e.message));
  pg.on('console', m => { if (m.type()==='error') errs.push('console: ' + m.text()); });
  await pg.goto('file:///' + abs + '?' + params, { waitUntil:'load' });
  await pg.waitForSelector('#sheet', { timeout:8000 });
  for (const inp of await pg.$$('input.gradable')) { const a = await inp.getAttribute('data-answer'); if (a != null) await inp.fill(a.split('|')[0]); }
  for (const c of await pg.$$('.chip[data-ok="1"]')) await c.click();
  for (const o of await pg.$$('.dorder')) { for (const s of await o.$$('.dslot')) { const a = await s.getAttribute('data-answer'); const t = await o.$('.dsource .dtile[data-val="' + a + '"]'); if (t) { await t.click(); await s.click(); } } }
  await pg.evaluate(() => window.__wsAutoSolve && window.__wsAutoSolve());
  await pg.click('#b-submit'); await pg.waitForTimeout(200);
  const txt = (await pg.textContent('#score')) || '';
  console.log('score:', txt.trim(), '| errors:', errs.length ? errs.join(' ; ') : 'none');
  await browser.close();
})().catch(e => { console.error('ERR', e); process.exit(1); });
```

- [ ] **Step 3: Verify the skeleton loads with no errors**

Run: `cd verify && node check.js "seed=verify&write=0&sort=0&find=0&blank=0&capital=0"`
Expected: `score: Score: 0 / 0 (0%) … | errors: none` (teach block only; no gradable items yet).

- [ ] **Step 4: Commit**

```bash
git checkout -b feature/common-proper-nouns
git add common-proper-nouns.html verify/check.js
git commit -m "feat(unit): scaffold common-proper-nouns page + dev check harness"
```

---

### Task 2: Section 1 — Write the naming word (typed input + Twemoji)

**Files:** Modify: `common-proper-nouns.html` (append generator + section line).

**Interfaces:**
- Consumes: `cfg.write`, `shuffle`, `pic`, `WS.section`.
- Produces: `gWrite(i)` returning an `.item` with a picture + `input.ans.word.gradable[data-answer]` (default `text` kind, `|`-alternatives).

- [ ] **Step 1: Add the pool + generator** (in the `<script>`, above the sheet-assembly block)

```js
const WRITE = [
  {cp:'1f4d5',w:'book'},{cp:'270f',w:'pencil'},{cp:'1f58d',w:'crayon'},{cp:'1f34e',w:'apple'},
  {cp:'1f431',w:'cat'},{cp:'1f697',w:'car'},{cp:'1f986',w:'duck'},{cp:'1f41f',w:'fish'},
  {cp:'2b50',w:'star'},{cp:'26f5',w:'boat'},{cp:'1f95a',w:'egg'},{cp:'1f41d',w:'bee'},
  {cp:'1f426',w:'bird'},{cp:'1f430',w:'rabbit',alt:'bunny'},{cp:'1f438',w:'frog'},{cp:'1f370',w:'cake'},
  {cp:'1f388',w:'balloon'},{cp:'1f3e0',w:'house'},{cp:'1f6a9',w:'flag'},{cp:'1f69a',w:'truck'},
  {cp:'1f98b',w:'butterfly'},{cp:'1f343',w:'leaf'},{cp:'2601',w:'cloud'},{cp:'1f41a',w:'shell'},
  {cp:'1f45d',w:'bag'},{cp:'1f4e6',w:'box'},{cp:'1f36a',w:'cookie'},
];
const writeOrder = shuffle(WRITE);
function gWrite(i){
  const t = writeOrder[(i-1) % writeOrder.length];
  const ans = t.alt ? t.w + '|' + t.alt : t.w;
  return '<div class="item"><span class="label">'+i+'.</span> Write the naming word for the picture.'
    + '<div class="qrow">' + pic(t.cp)
    + '<span class="field"><input class="ans word gradable" data-answer="'+ans+'" type="text" autocomplete="off"></span>'
    + '</div></div>';
}
```

- [ ] **Step 2: Fill the write slot** — replace the `/* SLOT:write */` marker with:

```js
html += WS.section('Write the naming word', cfg.write, gWrite);
```

- [ ] **Step 3: Test the section**

Run: `cd verify && node check.js "seed=verify&write=5&sort=0&find=0&blank=0&capital=0"`
Expected: `score: Score: 5 / 5 (100%) … | errors: none`.

- [ ] **Step 4: Verify each `assets/twemoji/<cp>.svg` exists** (all should already be bundled)

Run: `ls assets/twemoji/ | tr -d '\r' | sort > /tmp/have.txt; for cp in 1f4d5 270f 1f58d 1f34e 1f431 1f697 1f986 1f41f 2b50 26f5 1f95a 1f41d 1f426 1f430 1f438 1f370 1f388 1f3e0 1f6a9 1f69a 1f98b 1f343 2601 1f41a 1f45d 1f4e6 1f36a; do grep -q "^$cp.svg$" /tmp/have.txt || echo "MISSING $cp"; done`
Expected: no `MISSING` lines. (If any prints, remove that word from `WRITE` or add its Twemoji SVG per `README.md`.)

- [ ] **Step 5: Commit**

```bash
git add common-proper-nouns.html
git commit -m "feat(unit): section 1 — write the naming word (typed + pictures)"
```

---

### Task 3: Section 5 — Rewrite with capital letters (`capsentence` custom kind)

**Files:** Modify: `common-proper-nouns.html`.

**Interfaces:**
- Consumes: `cfg.capital`, `shuffle`, `WS.section`, `WS.addKind`.
- Produces: `gCapital(i)` returning an `.item` with `input.capline.gradable[data-kind="capsentence"][data-answer]`; registers the `capsentence` kind.

- [ ] **Step 1: Register the custom kind** (in the `<script>`, near the top after `helpers`)

```js
// case-sensitive sentence rewrite: same words in order (spelling counts; punctuation & non-capital
// word case ignored) AND every word capitalised in the answer is capitalised the same way.
WS.addKind('capsentence', function(v, a){
  const strip = w => w.replace(/^[^A-Za-z]+|[^A-Za-z]+$/g, '');
  const av = String(a).trim().split(/\s+/).map(strip).filter(Boolean);
  const vv = String(v || '').trim().split(/\s+/).map(strip).filter(Boolean);
  if (av.length !== vv.length) return false;
  for (let i = 0; i < av.length; i++) {
    if (av[i].toLowerCase() !== vv[i].toLowerCase()) return false;
    if (/^[A-Z]/.test(av[i]) && av[i] !== vv[i]) return false;
  }
  return true;
});
```

- [ ] **Step 2: Add the pool + generator**

```js
const CAPS = [
  {s:'singapore is an island.',        a:'Singapore is an island.'},
  {s:'Have you been to china?',        a:'Have you been to China?'},
  {s:'mr tan teaches english.',        a:'Mr Tan teaches English.'},
  {s:'My uncle lives in japan.',       a:'My uncle lives in Japan.'},
  {s:'lily is my best friend.',        a:'Lily is my best friend.'},
  {s:'My name is ben wong.',           a:'My name is Ben Wong.'},
  {s:'amy lives in australia.',        a:'Amy lives in Australia.'},
  {s:'We climbed mount fuji.',         a:'We climbed Mount Fuji.'},
  {s:'sara visited india.',            a:'Sara visited India.'},
  {s:'My friend liam is from china.',  a:'My friend Liam is from China.'},
  {s:'tim likes eric carle.',          a:'Tim likes Eric Carle.'},
  {s:'We swam in the yellow river.',   a:'We swam in the Yellow River.'},
  {s:'john plays with ben.',           a:'John plays with Ben.'},
  {s:'Is olivia your sister?',         a:'Is Olivia your sister?'},
];
const capOrder = shuffle(CAPS);
function gCapital(i){
  const t = capOrder[(i-1) % capOrder.length];
  return '<div class="item"><span class="label">'+i+'.</span> Rewrite the sentence with a capital letter for each proper noun.'
    + '<div class="caprow"><span class="shown">'+t.s+'</span>'
    + '<input class="capline gradable" data-kind="capsentence" data-answer="'+t.a+'" type="text" autocomplete="off"></div></div>';
}
```

- [ ] **Step 3: Fill the capital slot (with its teach block)** — replace the `/* SLOT:capital */` marker with:

```js
html += WS.teach('Capital letters', 'A proper noun always begins with a <b>capital letter</b>. Read each sentence and write it correctly.');
html += WS.section('Rewrite with capital letters', cfg.capital, gCapital);
```

- [ ] **Step 4: Test full-marks path**

Run: `cd verify && node check.js "seed=verify&write=0&sort=0&find=0&blank=0&capital=5"`
Expected: `score: Score: 5 / 5 (100%) … | errors: none`.

- [ ] **Step 5: Test that lowercase is marked wrong** (proves case-sensitivity)

Run:
```bash
cd verify && node -e "const {chromium}=require('playwright-core');const path=require('path');(async()=>{const abs=path.resolve('..','common-proper-nouns.html').replace(/\\\\/g,'/');let b;for(const o of [{channel:'chrome'},{channel:'msedge'}]){try{b=await chromium.launch({headless:true,...o});break}catch(e){}}const p=await b.newPage();await p.goto('file:///'+abs+'?seed=verify&write=0&sort=0&find=0&blank=0&capital=3');await p.waitForSelector('input.capline');const ins=await p.\$\$('input.capline');for(const i of ins){const a=await i.getAttribute('data-answer');await i.fill(a.toLowerCase());}await p.click('#b-submit');await p.waitForTimeout(200);console.log(await p.textContent('#score'));await b.close()})()"
```
Expected: score shows `0 / 3` (all-lowercase rewrites are wrong).

- [ ] **Step 6: Commit**

```bash
git add common-proper-nouns.html
git commit -m "feat(unit): section 5 — rewrite with capital letters (capsentence kind)"
```

---

### Task 4: Section 4 — Fill in the blanks (linked drag word-box)

**Files:** Modify: `common-proper-nouns.html`.

**Interfaces:**
- Consumes: `cfg.blank`, `shuffle`, `WS.enableDragOrder`.
- Produces: `buildBlank(count)` returning an `<h2>` + one `.dorder` (shared `.dsource` of `.dtile[data-val]` + one `.dslot[data-answer]` per sentence, each inside an `.item`).

- [ ] **Step 1: Add the pool + section builder**

```js
const BLANK = [
  {s:'My sister colours with her ___.', a:'crayons'},
  {s:'There are many ___ in the zoo.',  a:'animals'},
  {s:'My brother takes a ___ to school.', a:'bus'},
  {s:'Uncle Samy comes from ___.',      a:'India'},
  {s:'Hens lay ___.',                   a:'eggs'},
  {s:'A ___ makes honey.',              a:'bee'},
  {s:'This ___ belongs to me.',         a:'bicycle'},
  {s:'___ wrote the book.',             a:'Eric Carle'},
  {s:'A ___ barks loudly.',             a:'dog'},
  {s:'The ___ flies in the sky.',       a:'bird'},
  {s:'I write with a ___.',             a:'pencil'},
  {s:'We keep books on the ___.',       a:'shelf'},
  {s:'The ___ swims in the pond.',      a:'fish'},
  {s:'My ___ has four legs.',           a:'table'},
];
function buildBlank(count){
  if (count <= 0) return '';
  const chosen = shuffle(BLANK).slice(0, count);            // distinct frames + distinct answers
  const src = shuffle(chosen.map(c => c.a)).map(w => '<div class="dtile" data-val="'+w+'">'+w+'</div>').join('');
  const rows = chosen.map((c, k) => {
    const parts = c.s.split('___');
    return '<div class="item"><span class="label">'+(k+1)+'.</span> '
      + parts[0] + '<span class="dslot" data-answer="'+c.a+'"></span>' + parts[1] + '</div>';
  }).join('');
  return '<h2>Fill in the blanks</h2>'
    + '<div class="dorder"><div class="wordbox">Word box — drag each word into a blank:</div>'
    + '<div class="dsource">'+src+'</div>' + rows + '</div>';
}
```

- [ ] **Step 2: Fill the blank slot** — replace the `/* SLOT:blank */` marker with:

```js
html += buildBlank(cfg.blank);
```

- [ ] **Step 3: Enable drag-order wiring** — in the wiring block, before `WS.wirePanel(...)`, add:

```js
WS.enableDragOrder();
```

- [ ] **Step 4: Test**

Run: `cd verify && node check.js "seed=verify&write=0&sort=0&find=0&blank=5&capital=0"`
Expected: `score: Score: 5 / 5 (100%) … | errors: none`.

- [ ] **Step 5: Commit**

```bash
git add common-proper-nouns.html
git commit -m "feat(unit): section 4 — fill in the blanks (linked drag word-box)"
```

---

### Task 5: Annotation widget infrastructure (toolbar, wiring, markers, auto-solve)

**Files:** Modify: `common-proper-nouns.html`.

**Interfaces:**
- Consumes: `WS.mark`, `WS.clearAll`.
- Produces: `toolbar(properMark)`, `words(list)`, `wireAnnot()`, `applyMarkClass(w)`, `expectedMark(w)`, `resetAnnotations()`, `markSort()`, `markFind()`, `window.__wsAutoSolve`. Markers scope to `#sec-sort .aword` (per word) and `#sec-find .item` (per sentence). Consumed by Tasks 6 & 7.

- [ ] **Step 1: Add the widget helpers** (in the `<script>`, above sheet assembly)

```js
/* ---- annotation widget (sections 2 & 3): pick a tool, tap words to mark, tap again to clear ---- */
function toolbar(properMark){
  const properLabel = properMark === 'tick' ? '✓ tick (proper noun)' : '＿ underline (proper noun)';
  return '<div class="atools no-print">'
    + '<button type="button" class="atool" data-mark="circle">⭕ circle (common noun)</button>'
    + '<button type="button" class="atool" data-mark="'+properMark+'">'+properLabel+'</button></div>';
}
function words(list){
  return '<span class="awords">'
    + list.map(w => '<span class="aword" data-type="'+w.type+'">'+w.t+'</span>').join(' ')
    + '</span>';
}
function applyMarkClass(w){
  w.classList.remove('mk-circle','mk-tick','mk-underline');
  if (w.dataset.mark) w.classList.add('mk-' + w.dataset.mark);
}
function expectedMark(w){
  const a = w.closest('.annot');
  const t = w.dataset.type;
  return t === 'common' ? 'circle' : (t === 'proper' ? a.dataset.proper : '');
}
function wireAnnot(){
  document.querySelectorAll('.annot').forEach(a => {
    const tools = a.querySelectorAll('.atool');
    if (!tools.length) return;
    let active = tools[0].dataset.mark; tools[0].classList.add('active');
    tools.forEach(btn => btn.addEventListener('click', () => {
      active = btn.dataset.mark; tools.forEach(b => b.classList.toggle('active', b === btn));
    }));
    a.querySelectorAll('.aword').forEach(w => w.addEventListener('click', () => {
      w.dataset.mark = (w.dataset.mark || '') === active ? '' : active;
      applyMarkClass(w);
    }));
  });
}
function resetAnnotations(){
  document.querySelectorAll('.aword').forEach(w => { w.dataset.mark = ''; w.classList.remove('mk-circle','mk-tick','mk-underline','correct','incorrect'); });
}
window.__wsAutoSolve = function(){
  document.querySelectorAll('.aword').forEach(w => { w.dataset.mark = expectedMark(w); applyMarkClass(w); });
};
/* markers passed to WS.mark({extras:[...]}) */
function markSort(){ let total = 0, right = 0;
  document.querySelectorAll('#sec-sort .aword').forEach(w => { total++;
    const ok = (w.dataset.mark || '') === expectedMark(w);
    w.classList.remove('correct','incorrect'); w.classList.add(ok ? 'correct' : 'incorrect'); if (ok) right++; });
  return { total, right };
}
function markFind(){ let total = 0, right = 0;
  document.querySelectorAll('#sec-find .item').forEach(row => { total++; let ok = true;
    row.querySelectorAll('.aword').forEach(w => { const good = (w.dataset.mark || '') === expectedMark(w);
      w.classList.remove('correct','incorrect'); w.classList.add(good ? 'correct' : 'incorrect'); if (!good) ok = false; });
    if (ok) right++; });
  return { total, right };
}
```

- [ ] **Step 2: Wire the widget + custom markers** — update the wiring block: add `wireAnnot();` before `WS.wirePanel(...)`, and change the `mark`/`clear` handlers:

```js
wireAnnot();
WS.enableDragOrder();
WS.wirePanel(cfg, ['write','sort','find','blank','capital'], {
  mark:  () => WS.mark({ extras: [markSort, markFind] }),
  clear: () => WS.clearAll(resetAnnotations),
});
```

- [ ] **Step 3: Sanity check — page still loads, no sort/find sections yet**

Run: `cd verify && node check.js "seed=verify&write=2&sort=0&find=0&blank=0&capital=2"`
Expected: `score: Score: 4 / 4 (100%) … | errors: none` (markers find no `.aword`, return 0/0; no crash).

- [ ] **Step 4: Commit**

```bash
git add common-proper-nouns.html
git commit -m "feat(unit): annotation widget infra (toolbar, markers, __wsAutoSolve)"
```

---

### Task 6: Section 2 — Common or proper? (annotation widget, per-word)

**Files:** Modify: `common-proper-nouns.html`.

**Interfaces:**
- Consumes: `cfg.sort`, `shuffle`, `toolbar`, `words`, `markSort` (scopes `#sec-sort`).
- Produces: `buildSort(count)` returning `<h2>` + `#sec-sort.annot[data-proper="tick"]`.

- [ ] **Step 1: Add the pool + builder**

```js
const SORTPOOL = [
  {t:'banana',type:'common'},{t:'apple',type:'common'},{t:'chair',type:'common'},{t:'park',type:'common'},
  {t:'boat',type:'common'},{t:'bear',type:'common'},{t:'cat',type:'common'},{t:'garden',type:'common'},
  {t:'playground',type:'common'},{t:'ruler',type:'common'},{t:'book',type:'common'},{t:'pencil',type:'common'},
  {t:'baby',type:'common'},{t:'ice cream',type:'common'},{t:'bird',type:'common'},{t:'ball',type:'common'},
  {t:'flower',type:'common'},{t:'shoe',type:'common'},
  {t:'Mount Everest',type:'proper'},{t:'Mr Tan',type:'proper'},{t:'Olivia',type:'proper'},{t:'China',type:'proper'},
  {t:'Liam',type:'proper'},{t:'Japan',type:'proper'},{t:'Mount Fuji',type:'proper'},{t:'Yellow River',type:'proper'},
  {t:'Singapore',type:'proper'},{t:'Eric Carle',type:'proper'},{t:'Australia',type:'proper'},{t:'Amy',type:'proper'},
  {t:'Sue',type:'proper'},{t:'Tim',type:'proper'},{t:'John',type:'proper'},{t:'Pam',type:'proper'},
  {t:'India',type:'proper'},{t:'Ben Wong',type:'proper'},
];
function buildSort(count){
  if (count <= 0) return '';
  const chosen = shuffle(SORTPOOL).slice(0, count);   // distinct words, drawn without replacement
  return '<h2>Common or proper?</h2>'
    + '<div id="sec-sort" class="annot" data-proper="tick">'
    + '<p class="shown no-print">Circle the common nouns. Put a tick on the proper nouns.</p>'
    + toolbar('tick') + '<div class="awords-wrap">' + words(chosen) + '</div></div>';
}
```

- [ ] **Step 2: Fill the sort slot** — replace the `/* SLOT:sort */` marker with:

```js
html += buildSort(cfg.sort);
```

- [ ] **Step 3: Test** (auto-solve marks each word to its type)

Run: `cd verify && node check.js "seed=verify&write=0&sort=6&find=0&blank=0&capital=0"`
Expected: `score: Score: 6 / 6 (100%) … | errors: none`.

- [ ] **Step 4: Commit**

```bash
git add common-proper-nouns.html
git commit -m "feat(unit): section 2 — common or proper (annotation widget)"
```

---

### Task 7: Section 3 — Circle common, underline proper (annotation widget, per-sentence)

**Files:** Modify: `common-proper-nouns.html`.

**Interfaces:**
- Consumes: `cfg.find`, `shuffle`, `toolbar`, `words`, `markFind` (scopes `#sec-find .item`).
- Produces: `buildFind(count)` returning `<h2>` + `#sec-find.annot[data-proper="underline"]` with one `.item` per sentence.

- [ ] **Step 1: Add the pool + builder**

```js
// each sentence: words tagged common | proper | none (none = leave unmarked)
const FIND = [
  [['Sue','proper'],['borrows','none'],['books','common'],['from','none'],['the','none'],['library','common']],
  [['John','proper'],['plays','none'],['football','common'],['and','none'],['basketball','common']],
  [['Evan','proper'],['and','none'],['his','none'],['brother','common'],['live','none'],['in','none'],['Australia','proper']],
  [['Lilian','proper'],['likes','none'],['apples','common'],['and','none'],['oranges','common']],
  [['Pam','proper'],['cycles','none'],['in','none'],['the','none'],['park','common']],
  [['Tim','proper'],['reads','none'],['a','none'],['book','common']],
  [['Amy','proper'],['sews','none'],['beautiful','none'],['dresses','common']],
  [['My','none'],['friend','common'],['lives','none'],['in','none'],['Japan','proper']],
  [['Sara','proper'],['plays','none'],['with','none'],['a','none'],['ball','common']],
  [['We','none'],['visited','none'],['China','proper']],
  [['The','none'],['dog','common'],['runs','none'],['in','none'],['the','none'],['garden','common']],
  [['Ben','proper'],['feeds','none'],['the','none'],['cat','common']],
  [['Nina','proper'],['paints','none'],['a','none'],['flower','common']],
];
function buildFind(count){
  if (count <= 0) return '';
  const chosen = shuffle(FIND).slice(0, count);
  const rows = chosen.map((sent, k) => {
    const list = sent.map(([t, type]) => ({ t, type }));
    return '<div class="item"><span class="label">'+(k+1)+'.</span> ' + words(list) + '</div>';
  }).join('');
  return '<h2>Circle the common noun, underline the proper noun</h2>'
    + '<div id="sec-find" class="annot" data-proper="underline">' + toolbar('underline') + rows + '</div>';
}
```

- [ ] **Step 2: Fill the find slot** — replace the `/* SLOT:find */` marker with:

```js
html += buildFind(cfg.find);
```

- [ ] **Step 3: Test**

Run: `cd verify && node check.js "seed=verify&write=0&sort=0&find=5&blank=0&capital=0"`
Expected: `score: Score: 5 / 5 (100%) … | errors: none`.

- [ ] **Step 4: Full-unit smoke test**

Run: `cd verify && node check.js "seed=verify&write=3&sort=3&find=3&blank=3&capital=3"`
Expected: `score: Score: 15 / 15 (100%) … | errors: none`.

- [ ] **Step 5: Commit**

```bash
git add common-proper-nouns.html
git commit -m "feat(unit): section 3 — circle common, underline proper (annotation widget)"
```

---

### Task 8: Register with the verifier + full acceptance gate

**Files:** Modify: `verify/verify.js`.

**Interfaces:**
- Consumes: the unit page + `window.__wsAutoSolve`.
- Produces: a `TARGETS` entry, a `DUP_PARAMS` entry, and an `EXTENSION POINT` auto-solve call. Acceptance: `PASS  common-proper-nouns  happy 15/15  probe <15  dups 0`.

- [ ] **Step 1: Add the TARGETS entry** — in `verify/verify.js`, inside the `TARGETS` array, after the `beginning-sounds` entry:

```js
  { name: 'common-proper-nouns', file: 'common-proper-nouns.html',
    params: 'seed=verify&write=3&sort=3&find=3&blank=3&capital=3' },
```

- [ ] **Step 2: Add the DUP_PARAMS entry** — inside the `DUP_PARAMS` object:

```js
  'common-proper-nouns': 'write=8&sort=10&find=8&blank=8&capital=8',
```

- [ ] **Step 3: Add the auto-solve call at the EXTENSION POINT** — in `drive()`, replace the line

```js
  // ---- EXTENSION POINT: add drivers for any bespoke widgets a new unit introduces ----
```

with:

```js
  // ---- EXTENSION POINT: bespoke widgets expose window.__wsAutoSolve to place their correct answers ----
  await page.evaluate(() => window.__wsAutoSolve && window.__wsAutoSolve());
```

- [ ] **Step 4: Run the full verifier (acceptance gate)**

Run: `cd verify && npm run verify`
Expected output includes:
```
PASS  beginning-sounds    happy 19/19  probe 18/19  dups 0
PASS  common-proper-nouns happy 15/15  probe <15/15  dups 0
All verifiers PASSED
```
(`probe` prints the actual dropped score, e.g. `14/15`.) If `dups` fails on a section, its pool is too small for the `DUP_PARAMS` count — lower the count or extend the pool in `specs/common-proper-nouns.md` and the page.

- [ ] **Step 5: Commit**

```bash
git add verify/verify.js
git commit -m "test(verify): register common-proper-nouns + __wsAutoSolve extension point"
```

---

### Task 9: Landing-page card + final review

**Files:** Modify: `index.html`.

**Interfaces:**
- Consumes: nothing. Produces: a card linking to `common-proper-nouns.html`.

- [ ] **Step 1: Inspect the existing card markup**

Run: `grep -n "beginning-sounds.html" index.html`
Then read the surrounding card block so the new card matches its exact structure/classes.

- [ ] **Step 2: Add a matching card + module quick-links** for `common-proper-nouns.html` (copy the beginning-sounds card block, change the `href` to `common-proper-nouns.html`, the title to "Common and Proper Nouns", and the blurb to "Sort common vs proper nouns, fill blanks, and fix capital letters."). Keep identical classes/structure. Inside (or beneath) the card, add five **module quick-links** — the same file with section counts preset, so each is a short single-skill sheet:

```html
<div class="modules no-print">
  <a href="common-proper-nouns.html?write=8&sort=0&find=0&blank=0&capital=0">Write the noun</a>
  <a href="common-proper-nouns.html?write=0&sort=10&find=0&blank=0&capital=0">Common or proper?</a>
  <a href="common-proper-nouns.html?write=0&sort=0&find=8&blank=0&capital=0">Circle &amp; underline</a>
  <a href="common-proper-nouns.html?write=0&sort=0&find=0&blank=8&capital=0">Fill in the blanks</a>
  <a href="common-proper-nouns.html?write=0&sort=0&find=0&blank=0&capital=8">Capital letters</a>
</div>
```

Add a small style for `.modules a` (e.g. reuse the page's link styling) if the landing page doesn't already have suitable link styling — match existing conventions.

- [ ] **Step 3: Verify the link resolves**

Run: `test -f common-proper-nouns.html && grep -c "common-proper-nouns.html" index.html`
Expected: prints `1` (or more), file exists.

- [ ] **Step 4: Re-run the full verifier (nothing regressed)**

Run: `cd verify && npm run verify`
Expected: `All verifiers PASSED`.

- [ ] **Step 5: Visual spot-check** (optional but recommended)

Run: `cd verify && node check.js "seed=tiger&write=4&sort=6&find=4&blank=4&capital=4"`
Expected: `score: Score: 22 / 22 (100%) … | errors: none`. Open `common-proper-nouns.html?seed=tiger` in a browser and confirm all five sections render and mark correctly.

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat(unit): add common-proper-nouns card to index"
```

---

## Self-Review

**Spec coverage** (against `specs/common-proper-nouns.md`):
- Teach block(s) → Task 1 (main) + Task 3 (capitals). ✓
- Section 1 `write` (typed + Twemoji) → Task 2. ✓
- Section 2 `sort` (annotation, per-word) → Tasks 5 + 6. ✓
- Section 3 `find` (annotation, per-sentence) → Tasks 5 + 7. ✓
- Section 4 `blank` (linked drag word-box) → Task 4. ✓
- Section 5 `capital` (`capsentence` kind) → Task 3. ✓
- `window.__wsAutoSolve` hook + verifier driver → Tasks 5 + 8. ✓
- `TARGETS`/`DUP_PARAMS` (happy 15/15, dups 0) → Task 8. ✓
- `index.html` card → Task 9. ✓
- Distinctness (draw-without-replacement / shuffle-index) → built into every generator/builder. ✓
- Pool sizes (write 27, sort 36, find 13, blank 14, capital 14) all ≥ their `max`/`DUP` counts. ✓

**Placeholder scan:** no TBD/TODO; every code step shows complete code; every test step shows the command + expected output. ✓

**Type/name consistency:** `cfg` keys `write/sort/find/blank/capital` used identically in config, panel, generators, `WS.section`/`build*` calls, and verifier params. `expectedMark`/`applyMarkClass`/`markSort`/`markFind`/`resetAnnotations`/`__wsAutoSolve` defined in Task 5 and consumed unchanged in Tasks 6–8. `.dslot[data-answer]`/`.dtile[data-val]` match the engine contract. ✓

**Ordering note:** Task 1 lays down five ordered slot markers (`/* SLOT:write|sort|find|blank|capital */`); each later task fills its own slot, so the final sheet order is the pedagogical 1→5: teach → write → sort → find → blank → capital(+its teach) — independent of the order the tasks run in. The first `input.gradable` is a `write` input (Task 2), so the verifier probe still drops the score.
