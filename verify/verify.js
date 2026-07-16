/*
 * Browser-driven verifier for the English worksheet generators.
 *
 * For each unit it loads the page in a real browser, fills every answer from its data-answer,
 * clicks the correct chips, places order tiles, presses Submit and reads the score. It asserts:
 *   - happy path  -> full marks (right === total), no console errors
 *   - probe       -> a deliberate fault (first input left blank) drops the score below full marks
 *   - dup gate    -> across 3 seeds, no section renders the same question twice (>=2/3 seeds = fail)
 *
 * The driver only knows the SUBJECT-AGNOSTIC contract: input.gradable[data-answer],
 * .chip[data-ok], and drag-order .dslot[data-answer] / .dtile[data-val]. Teaching blocks (.teach)
 * are ignored automatically. If you add a unit with a bespoke interaction (its own clickable widget),
 * add a driver for it in the marked EXTENSION POINT below.
 *
 * Run:  cd verify && npm install && npm run verify
 * Chrome/Edge is auto-detected; override with CHROME_PATH=/path/to/chrome.
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

// One entry per unit. `params` are the marking-run settings (small counts, a bit of every section).
const TARGETS = [
  { name: 'beginning-sounds', file: 'beginning-sounds.html',
    params: 'seed=verify&first=3&name=3&same=3&write=2&sentence=2' },
  { name: 'common-proper-nouns', file: 'common-proper-nouns.html',
    params: 'seed=verify&write=3&sort=3&find=3&blank=3&capital=3' },
  { name: 'articles', file: 'articles.html',
    params: 'seed=verify&aan=4&article=4' },
  { name: 'subject-verb-agreement', file: 'subject-verb-agreement.html',
    params: 'seed=verify&choose=4&fill=4' },
  { name: 'conjunctions', file: 'conjunctions.html',
    params: 'seed=verify&fill=4&choose=4' },
  { name: 'simple-present-tense', file: 'simple-present-tense.html',
    params: 'seed=verify&choose=4&form=4' },
  { name: 'present-continuous-tense', file: 'present-continuous-tense.html',
    params: 'seed=verify&ing=4&isare=4' },
  { name: 'singular-plural-nouns', file: 'singular-plural-nouns.html',
    params: 'seed=verify&write=4&choose=4' },
  { name: 'countable-uncountable-nouns', file: 'countable-uncountable-nouns.html',
    params: 'seed=verify&much=4&few=4' },
  { name: 'personal-pronouns', file: 'personal-pronouns.html',
    params: 'seed=verify&subject=4&object=4' },
  { name: 'possessive-pronouns', file: 'possessive-pronouns.html',
    params: 'seed=verify&adjective=4&pronoun=4' },
  { name: 'simple-past-tense', file: 'simple-past-tense.html',
    params: 'seed=verify&match=4&past=4' },
  { name: 'question-words', file: 'question-words.html',
    params: 'seed=verify&choose=4&pick=4' },
  { name: 'demonstratives', file: 'demonstratives.html',
    params: 'seed=verify&singular=4&plural=4' },
  { name: 'parents-and-young', file: 'parents-and-young.html',
    params: 'seed=verify&match=4&choose=4' },
  { name: 'occupations', file: 'occupations.html',
    params: 'seed=verify&match=4&choose=4' },
  { name: 'people', file: 'people.html',
    params: 'seed=verify&match=4&choose=4' },
  { name: 'gender', file: 'gender.html',
    params: 'seed=verify&match=4&choose=4' },
  { name: 'homes', file: 'homes.html',
    params: 'seed=verify&match=4&choose=4' },
  { name: 'places', file: 'places.html',
    params: 'seed=verify&match=4&choose=4' },
  { name: 'adjectives', file: 'adjectives.html',
    params: 'seed=verify&find=4&fit=4&draw=6' },
  { name: 'adverbs', file: 'adverbs.html',
    params: 'seed=verify&makely=4&choose=4&sentence=6' },
  { name: 'prepositions', file: 'prepositions.html',
    params: 'seed=verify&time=4&place=4&draw=6' },
  { name: 'sounds', file: 'sounds.html',
    params: 'seed=verify&fill=3&match=3&choose=3&riddle=3&object=3' },
  { name: 'collective-nouns', file: 'collective-nouns.html',
    params: 'seed=verify&tick=4&circle=4' },
  { name: 'classifications', file: 'classifications.html',
    params: 'seed=verify&match=4&write=4&puzzle=4&groups=4' },
  { name: 'country-people-language', file: 'country-people-language.html',
    params: 'seed=verify&people=4&country=4&find=3' },
  { name: 'synonyms', file: 'synonyms.html',
    params: 'seed=verify&match=4&choose=4' },
  { name: 'antonyms', file: 'antonyms.html',
    params: 'seed=verify&match=4&write=3&draw=3&rhyme=3&circle=3&pick=3' },
  { name: 'word-substitutions', file: 'word-substitutions.html',
    params: 'seed=verify&replace=4&write=4' },
  { name: 'homonyms', file: 'homonyms.html',
    params: 'seed=verify&tick=4&fix=4' },
  { name: 'similes', file: 'similes.html',
    params: 'seed=verify&complete=4&choose=4' },
  { name: 'information-gathering', file: 'information-gathering.html',
    params: 'seed=verify&who=4&pets=3' },
  { name: 'classifying', file: 'classifying.html',
    params: 'seed=verify&match=4&sort=4' },
  { name: 'sequencing', file: 'sequencing.html',
    params: 'seed=verify&order=3&first=3' },
  { name: 'following-instructions', file: 'following-instructions.html',
    params: 'seed=verify&check=5&draw=6' },
  { name: 'inferring', file: 'inferring.html',
    params: 'seed=verify&infer=4&truth=4' },
  { name: 'graphic-stimulus', file: 'graphic-stimulus.html',
    params: 'seed=verify&notice=4&poster=4&scene=4' },
  { name: 'sentence-cloze', file: 'sentence-cloze.html',
    params: 'seed=verify&answer=4&cloze=4' },
  { name: 'multiple-choice', file: 'multiple-choice.html',
    params: 'seed=verify&mcq=4' },
  { name: 'open-ended', file: 'open-ended.html',
    params: 'seed=verify&answer=4&think=3' },
  { name: 'word-order', file: 'word-order.html',
    params: 'seed=verify&order=3&capital=3' },
  { name: 'completing-sentences', file: 'completing-sentences.html',
    params: 'seed=verify&choose=4&match=4' },
];

// Higher per-section counts used ONLY for duplicate detection — each kept <= its content-pool size,
// so a healthy generator can render them all distinct. Falls back to the marking params if absent.
const DUP_PARAMS = {
  'beginning-sounds': 'first=6&name=8&same=5&write=8&sentence=6',
  'common-proper-nouns': 'write=8&sort=10&find=8&blank=8&capital=8',
  'articles': 'aan=10&article=8',
  'subject-verb-agreement': 'choose=10&fill=8',
  'conjunctions': 'fill=10&choose=8',
  'simple-present-tense': 'choose=10&form=8',
  'present-continuous-tense': 'ing=10&isare=8',
  'singular-plural-nouns': 'write=10&choose=8',
  'countable-uncountable-nouns': 'much=8&few=8',
  'personal-pronouns': 'subject=10&object=8',
  'possessive-pronouns': 'adjective=8&pronoun=8',
  'simple-past-tense': 'match=6&past=8',
  'question-words': 'choose=10&pick=8',
  'demonstratives': 'singular=10&plural=8',
  'parents-and-young': 'match=6&choose=8',
  'occupations': 'match=6&choose=8',
  'people': 'match=6&choose=8',
  'gender': 'match=6&choose=8',
  'homes': 'match=6&choose=8',
  'places': 'match=6&choose=8',
  'adjectives': 'find=10&fit=10&draw=6',
  'adverbs': 'makely=10&choose=8&sentence=6',
  'prepositions': 'time=10&place=8&draw=6',
  'sounds': 'fill=8&match=8&choose=8&riddle=8&object=6',
  'collective-nouns': 'tick=13&circle=13',
  'classifications': 'match=6&write=8&puzzle=8&groups=18',
  'country-people-language': 'people=10&country=10&find=8',
  'synonyms': 'match=8&choose=10',
  'antonyms': 'match=10&write=6&draw=6&rhyme=8&circle=7&pick=6',
  'word-substitutions': 'replace=9&write=8',
  'homonyms': 'tick=12&fix=6',
  'similes': 'complete=13&choose=8',
  'information-gathering': 'who=5&pets=4',
  'classifying': 'match=9&sort=18',
  'sequencing': 'order=10&first=10',
  'following-instructions': 'check=8&draw=6',
  'inferring': 'infer=10&truth=10',
  'graphic-stimulus': 'notice=12&poster=12&scene=16',
  'sentence-cloze': 'answer=16&cloze=23',
  'multiple-choice': 'mcq=12',
  'open-ended': 'answer=12&think=6',
  'word-order': 'order=10&capital=10',
  'completing-sentences': 'choose=20&match=12',
};

// Launch installed Chrome/Edge without downloading a browser.
async function launch() {
  const tries = [];
  if (process.env.CHROME_PATH) tries.push({ executablePath: process.env.CHROME_PATH });
  tries.push({ channel: 'chrome' }, { channel: 'msedge' });
  for (const p of [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ]) if (fs.existsSync(p)) tries.push({ executablePath: p });

  let last;
  for (const opt of tries) {
    try { return await chromium.launch({ headless: true, ...opt }); }
    catch (e) { last = e; }
  }
  throw new Error('No Chrome/Edge found. Set CHROME_PATH. Last error: ' + (last && last.message));
}

// In-page: group every question by its section heading and return a signature per question.
// The signature captures what makes a question distinct — its prompt text, correct answers,
// selected-chip contents, and order tiles — so we can spot two identical questions in a section.
// It scans only `#sheet` h2/.item, so `.teach` blocks never count as questions.
function sectionSignatures() {
  const out = {};
  let cur = '(top)';
  const root = document.getElementById('sheet') || document.body;
  root.querySelectorAll('h2, .item').forEach(el => {
    if (el.tagName === 'H2') { cur = el.textContent.replace(/\s+/g, ' ').trim(); return; }
    const grab = (sel, f) => [...el.querySelectorAll(sel)].map(f).sort();
    const sig = [
      el.textContent.replace(/\s+/g, ' ').trim().replace(/^\d+\.\s*/, ''),
      grab('[data-answer]', x => x.getAttribute('data-answer')).join(','),
      grab('.chip[data-ok="1"]', c => c.innerHTML.replace(/\s+/g, '')).join('|'),
      grab('.dtile[data-val]', x => x.getAttribute('data-val')).join(','),
    ].join(' ## ');
    (out[cur] = out[cur] || []).push(sig);
  });
  return out;
}

async function drive(page, url, probe) {
  const errs = [];
  page.on('pageerror', e => errs.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForSelector('input.gradable, .chip', { timeout: 15000 });

  // typed inputs — fill from data-answer (first of any |-separated alternatives)
  const inputs = await page.$$('input.gradable');
  for (let i = 0; i < inputs.length; i++) {
    if (probe && i === 0) continue;                 // leave the first input blank in the probe
    const a = await inputs[i].getAttribute('data-answer');
    if (a != null) await inputs[i].fill(a.split('|')[0]);
  }
  // tappable chips — click every chip that should be selected
  // (probe: leave the FIRST correct chip unclicked, so all-chip units — no typed input to blank — still fault)
  let skipChip = probe;
  for (const c of await page.$$('.chip[data-ok]')) {
    if ((await c.getAttribute('data-ok')) === '1') {
      if (skipChip) { skipChip = false; continue; }
      await c.click();
    }
  }
  // drag / tap-to-order — tap the matching tile, then its slot
  for (const order of await page.$$('.dorder')) {
    for (const slot of await order.$$('.dslot')) {
      const ans = await slot.getAttribute('data-answer');
      const tile = await order.$(`.dsource .dtile[data-val="${ans}"]`);
      if (tile) { await tile.click(); await slot.click(); }
    }
  }
  // ---- EXTENSION POINT: bespoke widgets expose window.__wsAutoSolve to place their correct answers ----
  await page.evaluate(() => window.__wsAutoSolve && window.__wsAutoSolve());

  await page.click('#b-submit');
  await page.waitForTimeout(250);
  const txt = (await page.textContent('#score')) || '';
  const m = txt.match(/Score:\s*(\d+)\s*\/\s*(\d+)/);
  return { right: m ? +m[1] : -1, total: m ? +m[2] : -1, errs, txt: txt.trim() };
}

// Load a unit across several seeds and report sections that render duplicate questions.
// A section is a real (systemic) defect only if duplicates recur in >=2 of 3 seeds — a single
// coincidental collision in one seed is noted but not failed.
async function dupScan(ctx, t) {
  const params = DUP_PARAMS[t.name] || t.params.replace(/seed=\w+&?/, '');
  const seeds = ['dupaa', 'dupbb', 'dupcc'];
  const perSeed = [];
  for (const s of seeds) {
    const abs = path.resolve(__dirname, '..', t.file).replace(/\\/g, '/');
    const pg = await ctx.newPage();
    await pg.goto('file:///' + abs + '?seed=' + s + '&' + params, { waitUntil: 'load' });
    await pg.waitForSelector('#sheet .item, #sheet .chip', { timeout: 15000 }).catch(() => {});
    const sigs = await pg.evaluate(sectionSignatures);
    await pg.close();
    const dups = {};
    for (const sec of Object.keys(sigs)) {
      const counts = {};
      sigs[sec].forEach(x => { counts[x] = (counts[x] || 0) + 1; });
      const repeated = Object.entries(counts).filter(([, n]) => n > 1);
      if (repeated.length) dups[sec] = Math.max(...repeated.map(([, n]) => n));
    }
    perSeed.push(dups);
  }
  const sections = new Set(perSeed.flatMap(d => Object.keys(d)));
  const findings = [...sections].map(sec => ({
    section: sec,
    seedsWith: perSeed.filter(d => d[sec]).length,
    exampleCount: Math.max(...perSeed.map(d => d[sec] || 0)),
  })).sort((a, b) => b.seedsWith - a.seedsWith);
  return { findings, fail: findings.some(f => f.seedsWith >= 2) };
}

(async () => {
  const browser = await launch();
  const out = path.resolve(__dirname, 'out');
  fs.mkdirSync(out, { recursive: true });
  let allPass = true;

  for (const t of TARGETS) {
    const abs = path.resolve(__dirname, '..', t.file).replace(/\\/g, '/');
    const url = 'file:///' + abs + '?' + t.params;
    const ctx = await browser.newContext({ viewport: { width: 900, height: 1400 }, deviceScaleFactor: 2 });

    const p1 = await ctx.newPage();
    const happy = await drive(p1, url, false);
    await p1.screenshot({ path: path.join(out, t.name + '.png'), fullPage: true });
    const p2 = await ctx.newPage();
    const probe = await drive(p2, url, true);
    const dup = await dupScan(ctx, t);
    await ctx.close();

    const happyOK = happy.total > 0 && happy.right === happy.total && happy.errs.length === 0;
    const probeOK = probe.total > 0 && probe.right < probe.total;
    const pass = happyOK && probeOK && !dup.fail;
    allPass = allPass && pass;

    const systemic = dup.findings.filter(f => f.seedsWith >= 2);
    console.log(
      `${pass ? 'PASS' : 'FAIL'}  ${t.name.padEnd(18)} ` +
      `happy ${happy.right}/${happy.total}  probe ${probe.right}/${probe.total}  dups ${systemic.length}` +
      (happy.errs.length ? '  ERRORS: ' + happy.errs.join(' ; ') : '')
    );
    for (const f of dup.findings) {
      if (f.seedsWith < 2) continue;                   // one-off coincidences aren't worth the noise
      console.log(`        DUP  "${f.section}" — identical question x${f.exampleCount} (${f.seedsWith}/3 seeds)`);
    }
  }

  await browser.close();
  console.log(allPass ? '\nAll verifiers PASSED' : '\nSome verifiers FAILED');
  process.exit(allPass ? 0 : 1);
})().catch(e => { console.error('VERIFY ERROR:', e); process.exit(1); });
