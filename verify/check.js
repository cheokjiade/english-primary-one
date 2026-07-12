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
