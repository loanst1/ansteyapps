// Product-page tablet showcase shots (iPad landscape + Android/Fire portrait).
//   Stroke Sight: ss_ipad_<lang>.png (progress), ss_android_<lang>.png (exercises)
//   ReWrite:      rw_ipad_<lang>.png (letter tracing), rw_android_<lang>.png (home)
// Output -> assets/tablets/. One set per ASSET_LANGS locale.
//
// Usage:  node tablets.mjs            (all)
//         node tablets.mjs de ar      (just these)
import { launch, pickLangs, seedStrokeSight, SS_APP, RW_APP, SITE, ASSET_LANGS, BCP } from './config.mjs';

const OUT = `${SITE}/assets/tablets`;
const iPadL = { width: 1194, height: 834 };   // 11" iPad landscape
const tabP  = { width: 800,  height: 1180 };  // 10" Android/Fire portrait
const b = await launch();

for (const lang of pickLangs(ASSET_LANGS)) {
  // Stroke Sight — progress (iPad landscape, chrome stripped)
  {
    const ctx = await b.newContext({ viewport: iPadL, deviceScaleFactor: 2, isMobile: false, hasTouch: true });
    const p = await ctx.newPage();
    await p.addInitScript((L) => { [`strokeSight_lang:${L}`,'strokeSight_condition:hemianopia',
      'strokeSight_conditionDetail:left','strokeSight_guidanceShown:true',
      'strokeSight_safetyWarningShown:true','strokeSight_progressView:detailed']
      .forEach(kv => { const i = kv.indexOf(':'); localStorage.setItem(kv.slice(0,i), kv.slice(i+1)); }); }, lang);
    await p.goto(SS_APP, { waitUntil: 'load' }); await p.waitForTimeout(550);
    await p.evaluate(seedStrokeSight, BCP[lang] || 'en-GB');
    await p.click('#nav-progress'); await p.waitForTimeout(350);
    await p.evaluate(() => { const hide = (s) => document.querySelectorAll(s).forEach(e => e.style.display = 'none');
      hide('#progress-view-toggle'); hide('#bench-container'); hide('#recent-sessions-label');
      hide('#hist-list'); hide('#personal-details-wrap'); hide('.email-report-wrap'); hide('#clear-wrap');
      document.querySelectorAll('.multiple-cell').forEach(c => { if (!c.querySelector('svg')) c.style.display = 'none'; });
      const el = document.querySelector('.multiple-cell'); if (el) { let sc = el.parentElement; while (sc && sc.scrollHeight <= sc.clientHeight+2) sc = sc.parentElement; if (sc) sc.scrollTop = 0; } });
    await p.waitForTimeout(200);
    await p.screenshot({ path: `${OUT}/ss_ipad_${lang}.png` }); await ctx.close();
  }
  // Stroke Sight — exercises home (Android portrait)
  {
    const ctx = await b.newContext({ viewport: tabP, deviceScaleFactor: 2, isMobile: false, hasTouch: true });
    const p = await ctx.newPage();
    await p.addInitScript((L) => { [`strokeSight_lang:${L}`,'strokeSight_condition:hemianopia',
      'strokeSight_conditionDetail:left','strokeSight_guidanceShown:true','strokeSight_safetyWarningShown:true']
      .forEach(kv => { const i = kv.indexOf(':'); localStorage.setItem(kv.slice(0,i), kv.slice(i+1)); }); }, lang);
    await p.goto(SS_APP, { waitUntil: 'load' }); await p.waitForTimeout(650);
    await p.screenshot({ path: `${OUT}/ss_android_${lang}.png` }); await ctx.close();
  }
  // ReWrite — letter tracing (iPad landscape)
  {
    const ctx = await b.newContext({ viewport: iPadL, deviceScaleFactor: 2, isMobile: false, hasTouch: true });
    const p = await ctx.newPage();
    await p.goto(RW_APP, { waitUntil: 'load' }); await p.waitForTimeout(600);
    await p.evaluate((L) => { try { setLanguage(L); } catch (e) {} }, lang); await p.waitForTimeout(450);
    await p.evaluate(() => { try { startExerciseType('letters'); } catch (e) {} }); await p.waitForTimeout(650);
    await p.screenshot({ path: `${OUT}/rw_ipad_${lang}.png` }); await ctx.close();
  }
  // ReWrite — home (Android portrait)
  {
    const ctx = await b.newContext({ viewport: tabP, deviceScaleFactor: 2, isMobile: false, hasTouch: true });
    const p = await ctx.newPage();
    await p.goto(RW_APP, { waitUntil: 'load' }); await p.waitForTimeout(600);
    await p.evaluate((L) => { try { setLanguage(L); } catch (e) {} }, lang); await p.waitForTimeout(550);
    await p.screenshot({ path: `${OUT}/rw_android_${lang}.png` }); await ctx.close();
  }
  console.log('tablets', lang);
}

await b.close();
console.log('tablets done ->', OUT);
