// Product-page "see it in action" strip shots, per ASSET_LANGS locale.
//   Stroke Sight -> stroke-sight-screenshots/<lang>/{exercise,progress,langpick}.png
//   ReWrite      -> rewrite-screenshots/<lang>/{exercise,dark,langpick}.png
//
// exercise (SS) = Anchor & Scan mid-play: we start the exercise and screenshot the
//   instant a live target is on the field (detected by reading the canvas pixels).
// langpick is language-neutral (shows every language), so it is rendered once and
//   copied into every locale folder.
//
// Usage:  node product-strip.mjs           (all)
//         node product-strip.mjs de ar     (just these; pickers still refreshed)
import { copyFile } from 'node:fs/promises';
import { launch, pickLangs, seedStrokeSight, SS_APP, RW_APP, SITE, ASSET_LANGS, BCP } from './config.mjs';

const SS_OUT = `${SITE}/stroke-sight-screenshots`;
const RW_OUT = `${SITE}/rewrite-screenshots`;
const VP = { width: 430, height: 932 };   // matches the existing strip assets (DPR3)
const b = await launch();
const langs = pickLangs(ASSET_LANGS);

for (const lang of langs) {
  // Stroke Sight — Anchor & Scan mid-play
  {
    const ctx = await b.newContext({ viewport: VP, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
    const p = await ctx.newPage();
    await p.addInitScript((L) => { [`strokeSight_lang:${L}`,'strokeSight_condition:hemianopia',
      'strokeSight_conditionDetail:left','strokeSight_guidanceShown:true','strokeSight_safetyWarningShown:true']
      .forEach(kv => { const i = kv.indexOf(':'); localStorage.setItem(kv.slice(0,i), kv.slice(i+1)); }); }, lang);
    await p.goto(SS_APP, { waitUntil: 'load' }); await p.waitForTimeout(650);
    await p.locator('.ex-grid .ex-card:not(.exercise-card-hidden)').first().click();
    await p.waitForTimeout(400);
    await p.locator('#ex-startbtn').click();
    await p.waitForFunction(() => {           // wait for a green target on the dark field
      const cv = document.querySelector('.canvas-wrap canvas'); if (!cv) return false;
      let d; try { d = cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data; } catch (e) { return false; }
      let n = 0; for (let i = 0; i < d.length; i += 16) { const r=d[i],g=d[i+1],bl=d[i+2];
        if (g>110 && g>r+25 && g>bl+25) { n++; if (n>60) return true; } } return false;
    }, { timeout: 6000, polling: 40 }).catch(() => {});
    await p.screenshot({ path: `${SS_OUT}/${lang}/exercise.png` }); await ctx.close();
  }
  // Stroke Sight — progress (dual-axis, seeded data)
  {
    const ctx = await b.newContext({ viewport: VP, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
    const p = await ctx.newPage();
    await p.addInitScript((L) => { [`strokeSight_lang:${L}`,'strokeSight_condition:hemianopia',
      'strokeSight_conditionDetail:left','strokeSight_guidanceShown:true',
      'strokeSight_safetyWarningShown:true','strokeSight_progressView:detailed']
      .forEach(kv => { const i = kv.indexOf(':'); localStorage.setItem(kv.slice(0,i), kv.slice(i+1)); }); }, lang);
    await p.goto(SS_APP, { waitUntil: 'load' }); await p.waitForTimeout(600);
    await p.evaluate(seedStrokeSight, BCP[lang] || 'en-GB');
    await p.click('#nav-progress'); await p.waitForTimeout(400);
    await p.evaluate(() => { document.querySelectorAll('.multiple-cell').forEach(c => { if (!c.querySelector('svg')) c.style.display = 'none'; });
      const el = document.querySelector('.multiple-cell'); if (el) { let sc = el.parentElement; while (sc && sc.scrollHeight <= sc.clientHeight+2) sc = sc.parentElement; if (sc) sc.scrollTop = 0; } });
    await p.waitForTimeout(200);
    await p.screenshot({ path: `${SS_OUT}/${lang}/progress.png` }); await ctx.close();
  }
  // ReWrite — clean letter tracing (guide + stroke numbers, hint hidden)
  {
    const ctx = await b.newContext({ viewport: VP, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
    const p = await ctx.newPage();
    await p.goto(RW_APP, { waitUntil: 'load' }); await p.waitForTimeout(550);
    await p.evaluate((L) => { try { setLanguage(L); } catch (e) {} }, lang); await p.waitForTimeout(400);
    await p.evaluate(() => { try { startExerciseType('letters'); } catch (e) {} }); await p.waitForTimeout(650);
    await p.evaluate(() => { const h = document.getElementById('canvasHint'); if (h) h.style.display = 'none'; });
    await p.waitForTimeout(150);
    await p.screenshot({ path: `${RW_OUT}/${lang}/exercise.png` }); await ctx.close();
  }
  // ReWrite — home in dark mode
  {
    const ctx = await b.newContext({ viewport: VP, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
    const p = await ctx.newPage();
    await p.goto(RW_APP, { waitUntil: 'load' }); await p.waitForTimeout(550);
    await p.evaluate((L) => { try { setLanguage(L); } catch (e) {} }, lang); await p.waitForTimeout(400);
    await p.evaluate(() => { const t = document.getElementById('themeToggle'); if (t) t.click(); });
    await p.waitForTimeout(300); await p.evaluate(() => window.scrollTo(0,0));
    await p.screenshot({ path: `${RW_OUT}/${lang}/dark.png` }); await ctx.close();
  }
  console.log('strip', lang);
}

// --- Language pickers (neutral): render once, copy into every locale folder ---
const first = langs[0];
{ // Stroke Sight picker (#langpick is hidden until first run; force it visible)
  const ctx = await b.newContext({ viewport: VP, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  await p.goto(SS_APP, { waitUntil: 'load' }); await p.waitForTimeout(700);
  await p.evaluate(() => { const e = document.getElementById('langpick'); if (e) { e.style.display = 'flex'; e.scrollTop = 0; } });
  await p.waitForTimeout(300);
  await p.screenshot({ path: `${SS_OUT}/${first}/langpick.png` }); await ctx.close();
}
{ // ReWrite picker (#langOverlay shows on load before a language is chosen)
  const ctx = await b.newContext({ viewport: VP, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  await p.goto(RW_APP, { waitUntil: 'load' }); await p.waitForTimeout(800);
  await p.screenshot({ path: `${RW_OUT}/${first}/langpick.png` }); await ctx.close();
}
for (const lang of ASSET_LANGS) {
  if (lang === first) continue;
  await copyFile(`${SS_OUT}/${first}/langpick.png`, `${SS_OUT}/${lang}/langpick.png`);
  await copyFile(`${RW_OUT}/${first}/langpick.png`, `${RW_OUT}/${lang}/langpick.png`);
}
console.log('pickers copied to all locales');

await b.close();
console.log('product strip done');
