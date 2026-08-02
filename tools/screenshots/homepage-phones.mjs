// Homepage hero phones.
//   Stroke Sight (front phone) — the progress screen, chrome stripped to just the
//     chart card, one per HERO_LANGS locale -> assets/hero/phone_ss_<lang>.png
//   ReWrite (back phone) — the home/exercise list, en + fr only (the back slot
//     only ever resolves to those) -> assets/hero/phone_rw_<lang>.png
//
// Usage:  node homepage-phones.mjs            (all)
//         node homepage-phones.mjs de ja      (just these SS locales)
import { launch, pickLangs, seedStrokeSight, SS_APP, RW_APP, SITE, HERO_LANGS, BCP } from './config.mjs';

const OUT = `${SITE}/assets/hero`;
const VP = { width: 390, height: 844 };
const b = await launch();

// --- Stroke Sight progress phones ---
for (const lang of pickLangs(HERO_LANGS)) {
  const ctx = await b.newContext({ viewport: VP, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  await p.addInitScript((L) => { [`strokeSight_lang:${L}`,'strokeSight_condition:hemianopia',
    'strokeSight_conditionDetail:left','strokeSight_guidanceShown:true',
    'strokeSight_safetyWarningShown:true','strokeSight_progressView:detailed']
    .forEach(kv => { const i = kv.indexOf(':'); localStorage.setItem(kv.slice(0,i), kv.slice(i+1)); }); }, lang);
  await p.goto(SS_APP, { waitUntil: 'load' }); await p.waitForTimeout(600);
  await p.evaluate(seedStrokeSight, BCP[lang] || 'en-GB');
  await p.click('#nav-progress'); await p.waitForTimeout(400);
  // Strip everything except the chart card (title + the small-multiples graphs).
  await p.evaluate(() => {
    const hide = (s) => document.querySelectorAll(s).forEach(e => e.style.display = 'none');
    hide('#progress-view-toggle'); hide('#kpi-row'); hide('#bench-container');
    hide('#recent-sessions-label'); hide('#hist-list'); hide('#personal-details-wrap');
    hide('.email-report-wrap'); hide('#clear-wrap');
    document.querySelectorAll('.multiple-cell').forEach(c => { if (!c.querySelector('svg')) c.style.display = 'none'; });
    const screen = document.querySelector('#screen-progress') || document;
    const h = screen.querySelector('h1,h2'); if (h && !h.closest('#chart-card')) h.style.display = 'none';
    const el = document.querySelector('.multiple-cell');
    if (el) { let sc = el.parentElement; while (sc && sc.scrollHeight <= sc.clientHeight+2) sc = sc.parentElement; if (sc) sc.scrollTop = 0; }
  });
  await p.waitForTimeout(200);
  await p.screenshot({ path: `${OUT}/phone_ss_${lang}.png` });
  console.log('ss phone', lang);
  await ctx.close();
}

// --- ReWrite home phones (en, fr) ---
for (const lang of ['en', 'fr']) {
  const ctx = await b.newContext({ viewport: VP, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  await p.goto(RW_APP, { waitUntil: 'load' }); await p.waitForTimeout(600);
  await p.evaluate((L) => { try { setLanguage(L); } catch (e) {} }, lang); await p.waitForTimeout(600);
  await p.evaluate(() => { const d = document.getElementById('disclaimer'); if (d) d.style.display = 'none';
    const panel = document.getElementById('panelExercises'); if (panel) { let sc = panel; while (sc && sc.scrollHeight <= sc.clientHeight+2) sc = sc.parentElement; if (sc) sc.scrollTop = 0; } window.scrollTo(0,0); });
  await p.waitForTimeout(300);
  await p.screenshot({ path: `${OUT}/phone_rw_${lang}.png` });
  console.log('rw phone', lang);
  await ctx.close();
}

await b.close();
console.log('homepage phones done ->', OUT);
