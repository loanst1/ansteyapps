// Store screenshot factory: 15 locales x (7 iPhone + 7 iPad) per app for Apple,
// 7 Play phone shots + feature graphic per locale, captions localised.
import { chromium } from 'playwright';
import fs from 'node:fs';
import { execSync } from 'node:child_process';
const SF = '/tmp/claude-0/-home-user-rewrite/01b50ffa-460e-559b-90e5-1438578feb22/scratchpad/store-frames';
const SS_URL = 'http://localhost:8776/app.html';
const RW_URL = 'http://localhost:8792/app.html';
const SS_HARNESS = 'http://localhost:8777/app.html';
const RW_HARNESS = 'http://localhost:8793/app.html';

// Apple locale -> [app lang, Play locale]
const LOCS = {
  'en-GB': ['en','en-GB'], 'ar-SA': ['ar','ar'], 'zh-Hans': ['zh','zh-CN'], 'hi': ['hi','hi-IN'],
  'es-ES': ['es','es-ES'], 'es-MX': ['es_mx','es-419'], 'fr-FR': ['fr','fr-FR'], 'fr-CA': ['fr_ca','fr-CA'],
  'de-DE': ['de','de-DE'], 'it': ['it','it-IT'], 'ja': ['ja','ja-JP'], 'ko': ['ko','ko-KR'],
  'pl': ['pl','pl-PL'], 'pt-BR': ['pt_br','pt-BR'], 'pt-PT': ['pt','pt-PT'],
};
const FAM = l => ({es_mx:'es', fr_ca:'fr'}[l] || l);

const CAP = {
 ss: {
  en: ['Eight exercises for vision after stroke','Practise scanning into your lost side','Built around your condition','Watch your progress build','A one-tap report for your therapist','Sound, difficulty and colour — tuned to you','In 19 languages, including Welsh and Twi'],
  de: ['Acht Übungen für das Sehen nach dem Schlaganfall','Üben Sie das Blicken in Ihre betroffene Seite','Auf Ihre Diagnose zugeschnitten','Sehen Sie Ihren Fortschritt wachsen','Ein Therapeutenbericht mit einem Tipp','Ton, Schwierigkeit und Farben — ganz nach Ihnen','In 19 Sprachen, darunter Walisisch und Twi'],
  es: ['Ocho ejercicios para la visión tras un ictus','Practica escanear hacia tu lado perdido','Adaptado a tu condición','Mira crecer tu progreso','Informe para tu terapeuta con un toque','Sonido, dificultad y color — a tu medida','En 19 idiomas, incluidos galés y twi'],
  fr: ['Huit exercices pour la vision après un AVC','Entraînez le regard vers votre côté atteint','Conçu autour de votre condition','Regardez vos progrès grandir','Un rapport pour votre thérapeute en un geste','Son, difficulté et couleurs — réglés pour vous','En 19 langues, dont le gallois et le twi'],
  it: ["Otto esercizi per la vista dopo l'ictus",'Allena lo sguardo verso il lato perso','Costruito attorno alla tua condizione','Guarda crescere i tuoi progressi','Un report per il terapista con un tocco','Suono, difficoltà e colori — su misura per te','In 19 lingue, tra cui gallese e twi'],
  pt: ['Oito exercícios para a visão após o AVC','Treine o olhar para o seu lado perdido','Construído à volta da sua condição','Veja o seu progresso crescer','Relatório para o terapeuta com um toque','Som, dificuldade e cores — à sua medida','Em 19 línguas, incluindo galês e twi'],
  pt_br: ['Oito exercícios para a visão após o AVC','Treine o olhar para o seu lado perdido','Construído em torno da sua condição','Veja seu progresso crescer','Relatório para o terapeuta em um toque','Som, dificuldade e cores — do seu jeito','Em 19 idiomas, incluindo galês e twi'],
  pl: ['Osiem ćwiczeń wzroku po udarze','Ćwicz spoglądanie w utraconą stronę','Dopasowany do Twojego schorzenia','Patrz, jak rosną Twoje postępy','Raport dla terapeuty jednym dotknięciem','Dźwięk, trudność i kolory — pod Ciebie','W 19 językach, w tym walijskim i twi'],
  ja: ['脳卒中後の視覚のための8つのエクササイズ','見えない側へのスキャンを練習','あなたの症状に合わせて設計','積み重なる進歩を実感','ワンタップでセラピスト向けレポート','音・難易度・色をあなた好みに','ウェールズ語・トウィ語を含む19言語に対応'],
  ko: ['뇌졸중 후 시야를 위한 8가지 운동','보이지 않는 쪽으로 시선 옮기기 연습','내 증상에 맞춘 훈련','쌓여가는 진전을 확인하세요','원탭으로 치료사 리포트 생성','소리·난이도·색상을 내게 맞게','웨일스어와 트위어 포함 19개 언어'],
  hi: ['स्ट्रोक के बाद दृष्टि के लिए आठ अभ्यास','अपनी खोई हुई ओर देखने का अभ्यास करें','आपकी स्थिति के अनुसार बना','अपनी प्रगति बढ़ते देखें','एक टैप में थेरेपिस्ट के लिए रिपोर्ट','ध्वनि, कठिनाई और रंग — आपके अनुसार','वेल्श और त्वी सहित 19 भाषाओं में'],
  ar: ['ثمانية تمارين للبصر بعد السكتة الدماغية','تدرّب على المسح نحو جانبك المفقود','مصمّم حول حالتك','شاهد تقدّمك ينمو','تقرير لمعالجك بلمسة واحدة','الصوت والصعوبة والألوان — كما يناسبك','بـ 19 لغة، من بينها الويلزية والتوي'],
  zh: ['脑卒中后视觉训练的八项练习','练习向缺损一侧扫视','围绕你的症状而设计','看着进步一点点累积','一键生成治疗师报告','声音、难度与颜色——由你调节','支持19种语言，包括威尔士语和特威语'],
 },
 rw: {
  en: ['Relearn handwriting, one stroke at a time','From letters to words to full sentences',"BIG Practice for Parkinson's micrographia",'Feedback that encourages, never a cold score','Practise the words that matter to you','A one-tap report for your therapist','19 languages, each with true stroke order'],
  de: ['Schreiben neu lernen — Strich für Strich','Von Buchstaben zu Wörtern zu ganzen Sätzen','GROSS-Übungen für die Parkinson-Mikrographie','Feedback, das ermutigt — nie eine kalte Note','Üben Sie die Wörter, die Ihnen wichtig sind','Ein Therapeutenbericht mit einem Tipp','19 Sprachen, jede mit echter Strichfolge'],
  es: ['Reaprende a escribir, trazo a trazo','De letras a palabras y frases completas','Práctica GRANDE para la micrografía del Parkinson','Comentarios que animan, nunca una nota fría','Practica las palabras que te importan','Informe para tu terapeuta con un toque','19 idiomas, cada uno con su orden de trazos'],
  fr: ["Réapprenez l'écriture, trait après trait",'Des lettres aux mots, puis aux phrases','Pratique GRAND pour la micrographie de Parkinson','Des retours qui encouragent, jamais de note froide','Entraînez les mots qui comptent pour vous','Un rapport pour votre thérapeute en un geste','19 langues, chacune avec son ordre des tracés'],
  it: ['Reimpara a scrivere, un tratto alla volta','Dalle lettere alle parole alle frasi','Pratica GRANDE per la micrografia del Parkinson','Feedback che incoraggia, mai un voto freddo','Esercita le parole che contano per te','Un report per il terapista con un tocco','19 lingue, ognuna con il giusto ordine dei tratti'],
  pt: ['Reaprenda a escrever, traço a traço','De letras a palavras a frases completas','Prática GRANDE para a micrografia de Parkinson','Feedback que encoraja, nunca uma nota fria','Pratique as palavras que importam para si','Relatório para o terapeuta com um toque','19 línguas, cada uma com a ordem certa dos traços'],
  pt_br: ['Reaprenda a escrever, traço a traço','De letras a palavras a frases completas','Prática GRANDE para a micrografia de Parkinson','Feedback que encoraja, nunca uma nota fria','Pratique as palavras que importam para você','Relatório para o terapeuta em um toque','19 idiomas, cada um com a ordem certa dos traços'],
  pl: ['Naucz się pisać na nowo, kreska po kresce','Od liter przez słowa po całe zdania','DUŻE pisanie przy mikrografii w Parkinsonie','Feedback, który zachęca — nigdy zimna ocena','Ćwicz słowa, które są dla Ciebie ważne','Raport dla terapeuty jednym dotknięciem','19 języków, każdy z prawdziwą kolejnością kresek'],
  ja: ['一画ずつ、書くことをもう一度','文字から単語、そして文へ','小字症のための「大きく書く練習」','冷たい点数ではなく、励ますフィードバック','あなたにとって大切な言葉を練習','ワンタップでセラピスト向けレポート','19言語、それぞれ正しい書き順で'],
  ko: ['한 획씩, 다시 배우는 손글씨','글자에서 단어, 그리고 문장으로','소자증을 위한 크게 쓰기 연습','차가운 점수가 아닌, 격려하는 피드백','나에게 소중한 단어를 연습하세요','원탭으로 치료사 리포트 생성','19개 언어, 저마다 정확한 획순으로'],
  hi: ['एक-एक स्ट्रोक से लिखना फिर सीखें','अक्षरों से शब्द, फिर पूरे वाक्य','पार्किंसन माइक्रोग्राफिया के लिए BIG अभ्यास','उत्साह बढ़ाने वाला फ़ीडबैक, ठंडा स्कोर नहीं','वे शब्द लिखें जो आपके लिए मायने रखते हैं','एक टैप में थेरेपिस्ट के लिए रिपोर्ट','19 भाषाएँ, हर एक सही स्ट्रोक-क्रम के साथ'],
  ar: ['تعلّم الكتابة من جديد، حركة بحركة','من الحروف إلى الكلمات إلى جمل كاملة','تمرين الكتابة الكبيرة لصِغَر الخط في باركنسون','ملاحظات تشجّع — لا درجات باردة','تدرّب على الكلمات المهمة لك','تقرير لمعالجك بلمسة واحدة','19 لغة، لكلٍّ منها ترتيب حركاتها الصحيح'],
  zh: ['一笔一画，重新学会书写','从字母到词语，再到完整句子','针对帕金森写字过小的大字练习','鼓励式反馈，而非冰冷的分数','练习对你重要的词语','一键生成治疗师报告','19种语言，每种都有正确笔顺'],
 },
};
const BRAND = { ss: { name: 'Stroke Sight', icon: 'ss-icon.png', accent: '#1a4a3a', bg: '#f7f2e9' },
                rw: { name: 'ReWrite', icon: 'rw-icon.png', accent: '#9c4a26', bg: '#faf4ec' } };

const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox','--disable-gpu'] });
const log = m => { fs.appendFileSync(`${SF}/factory.log`, m + '\n'); console.log(m); };
fs.mkdirSync(`${SF}/rawloc`, { recursive: true });
fs.mkdirSync(`${SF}/final`, { recursive: true });

async function ctxPage(viewport, dpr) {
  const ctx = await b.newContext({ viewport, deviceScaleFactor: dpr, isMobile: true, hasTouch: true });
  return { ctx, p: await ctx.newPage() };
}
async function ssBoot(p, lang, extra = {}) {
  await p.addInitScript((cfg) => { Object.entries({ strokeSight_lang: cfg.lang, strokesight_activated: '1',
    strokeSight_condition: cfg.cond || 'hemianopia', strokeSight_conditionDetail: cfg.det || 'left',
    strokeSight_guidanceShown: 'true', strokeSight_safetyWarningShown: 'true',
    ...(cfg.pv ? { strokeSight_progressView: cfg.pv } : {}) }).forEach(([k, v]) => localStorage.setItem(k, v)); }, { lang, ...extra });
  await p.goto(SS_URL, { waitUntil: 'load' }); await p.waitForTimeout(750);
}
async function rwBoot(p, lang) {
  await p.goto(RW_URL, { waitUntil: 'load' }); await p.waitForTimeout(600);
  await p.evaluate((L) => { try { setLanguage(L); } catch (e) {} }, lang); await p.waitForTimeout(450);
}
const seedSS = () => {
  const mk = (id, acc, rt, dd) => ({ exerciseId: id, name: id, score: acc*3, hits: acc, misses: 100-acc,
    totalRt: rt*acc, rt, accuracy: acc, level: 1, date: new Date(2026, 6, dd).toISOString(), dateLabel: `${dd} Jul`, timeLabel: '08:00' });
  window.sessions = [mk('anchor',82,590,31),mk('anchor',71,690,30),mk('anchor',66,760,28),mk('anchor',58,820,26),
    mk('reading',74,680,31),mk('reading',62,880,27),mk('tracker',69,720,30),mk('tracker',55,900,25)];
  window.loadAllSessions = function (cb) { if (cb) cb(); };
};

async function captureSet(app, lang, vpName, vp, dpr) {
  const out = n => `${SF}/rawloc/${app}-${lang}-${vpName}-${n}.png`;
  if (fs.existsSync(out(7))) { log(`skip captures ${app} ${lang} ${vpName}`); return; }
  if (app === 'ss') {
    { const { ctx, p } = await ctxPage(vp, dpr); await ssBoot(p, lang);
      await p.evaluate(() => { const g = document.querySelector('.ex-grid'); if (g) { g.scrollIntoView({ block: 'start' }); window.scrollBy(0, -210); } });
      await p.waitForTimeout(250); await p.screenshot({ path: out(1) }); await ctx.close(); }
    { const { ctx, p } = await ctxPage(vp, dpr); await ssBoot(p, lang);
      await p.locator('.ex-grid .ex-card:not(.exercise-card-hidden)').first().click(); await p.waitForTimeout(500);
      await p.screenshot({ path: out(2) }); await ctx.close(); }
    { const { ctx, p } = await ctxPage(vp, dpr); await ssBoot(p, lang, { cond: 'scotoma', det: 'central' });
      await p.evaluate(() => { const h = [...document.querySelectorAll('h3,div')].find(e => /WHAT|условие|visual/i.test('') ); 
        const card = document.querySelector('.ex-grid'); window.scrollTo(0, 0);
        const cond = [...document.querySelectorAll('*')].find(e => e.className && String(e.className).includes('condition'));
        if (cond) cond.scrollIntoView({ block: 'start' }); });
      await p.waitForTimeout(300); await p.screenshot({ path: out(3) }); await ctx.close(); }
    { const { ctx, p } = await ctxPage(vp, dpr); await ssBoot(p, lang, { pv: 'simple' });
      await p.evaluate(seedSS); await p.click('#nav-progress'); await p.waitForTimeout(650);
      await p.screenshot({ path: out(4) }); await ctx.close(); }
    { const { ctx, p } = await ctxPage(vp, dpr); await ssBoot(p, lang);
      await p.click('#nav-settings'); await p.waitForTimeout(500);
      await p.screenshot({ path: out(6) }); await ctx.close(); }
    { const { ctx, p } = await ctxPage(vp, dpr); await ssBoot(p, lang);
      await p.evaluate(() => { const e = document.getElementById('langpick'); if (e) { e.style.display = 'flex'; e.scrollTop = 0; } });
      await p.waitForTimeout(300); await p.screenshot({ path: out(7) }); await ctx.close(); }
  } else {
    const start = async (p, type) => { await p.evaluate((t) => { try { startExerciseType(t); } catch (e) {} }, type);
      await p.waitForTimeout(700); await p.evaluate(() => { const h = document.getElementById('canvasHint'); if (h) h.style.display = 'none'; }); };
    { const { ctx, p } = await ctxPage(vp, dpr); await rwBoot(p, lang); await start(p, 'letters'); await p.screenshot({ path: out(1) }); await ctx.close(); }
    { const { ctx, p } = await ctxPage(vp, dpr); await rwBoot(p, lang); await start(p, 'sentences'); await p.screenshot({ path: out(2) }); await ctx.close(); }
    { const { ctx, p } = await ctxPage(vp, dpr); await rwBoot(p, lang); await start(p, 'bigpractice'); await p.screenshot({ path: out(3) }); await ctx.close(); }
    { const { ctx, p } = await ctxPage(vp, dpr); await rwBoot(p, lang); await start(p, 'letters');
      const box = await p.locator('#drawCanvas').boundingBox();
      const x0 = box.x + box.width * 0.30, y0 = box.y + box.height * 0.55;
      await p.mouse.move(x0, y0); await p.mouse.down();
      for (let i = 1; i <= 10; i++) await p.mouse.move(x0 + (box.width*0.4*i)/10, y0 + Math.sin(i/2)*box.height*0.18, { steps: 2 });
      await p.mouse.up(); await p.locator('#submitBtn').click(); await p.waitForTimeout(600);
      await p.screenshot({ path: out(4) }); await ctx.close(); }
    { const { ctx, p } = await ctxPage(vp, dpr); await rwBoot(p, lang);
      await p.evaluate(() => { try { openMyPractice(); } catch (e) {} }); await p.waitForTimeout(600);
      await p.screenshot({ path: out(5) }); await ctx.close(); }
    { const { ctx, p } = await ctxPage(vp, dpr); await p.goto(RW_URL, { waitUntil: 'load' }); await p.waitForTimeout(900);
      await p.screenshot({ path: out(7) }); await ctx.close(); }
  }
  log(`captured ${app} ${lang} ${vpName}`);
}

async function reportPage(app, lang) {
  const out = `${SF}/rawloc/${app}-${lang}-report.png`;
  if (fs.existsSync(out)) return;
  const url = app === 'ss' ? SS_HARNESS : RW_HARNESS;
  const { ctx, p } = await ctxPage({ width: 430, height: 932 }, 2);
  await p.addInitScript((L) => { try { localStorage.setItem('strokeSight_lang', L); localStorage.setItem('rewrite_lang', L); } catch (e) {} }, lang);
  await p.goto(url, { waitUntil: 'load' }); await p.waitForTimeout(2500);
  if (app === 'ss') {
    await p.evaluate(() => { window.__ssSetSessions([
      { exerciseId: 'anchor', date: '2026-08-01T10:00:00Z', score: 250, accuracy: 86, rt: 599, hits: 43, misses: 7 },
      { exerciseId: 'anchor', date: '2026-05-31T11:00:00Z', score: 91,  accuracy: 55, rt: 990, hits: 22, misses: 18 },
      { exerciseId: 'anchor', date: '2026-05-31T10:00:00Z', score: 146, accuracy: 62, rt: 720, hits: 31, misses: 19 },
      { exerciseId: 'anchor', date: '2026-05-29T10:00:00Z', score: 235, accuracy: 78, rt: 850, hits: 39, misses: 11 },
      { exerciseId: 'reading', date: '2026-07-20T10:00:00Z', score: 180, accuracy: 74, rt: 810, hits: 37, misses: 13 },
      { exerciseId: 'reading', date: '2026-06-10T10:00:00Z', score: 120, accuracy: 61, rt: 950, hits: 28, misses: 18 } ]); });
  } else {
    await p.evaluate(() => { const mk = (date, avg, scores, type) => ({ date, averageScore: avg, count: scores.length, type,
      exercises: scores.map(s => ({ score: s, type })) });
      window.__rwSetSessions([ mk('2026-06-01T09:00:00Z', 56, [50,55,60,58,52,61,54,58], 'letters'),
        mk('2026-07-15T10:00:00Z', 64, [60,66,62,70,64,60,66,64], 'letters') ]); });
  }
  const dl = p.waitForEvent('download', { timeout: 60000 });
  await p.evaluate((fn) => window[fn](), app === 'ss' ? '__ssGenPDF' : '__rwGenPDF');
  const d = await dl; const pdf = `${SF}/rawloc/${app}-${lang}.pdf`;
  await d.saveAs(pdf); await ctx.close();
  execSync(`pdftoppm -png -r 170 -f 1 -l 1 "${pdf}" "${SF}/rawloc/${app}-${lang}-rp"`);
  fs.renameSync(`${SF}/rawloc/${app}-${lang}-rp-1.png`, out);
  log(`report ${app} ${lang}`);
}

async function compose(page, canvas, dpr, brand, cap, imgPath, kind, outPath) {
  const q = new URLSearchParams({ name: brand.name, icon: brand.icon, accent: brand.accent, bg: brand.bg,
    img: imgPath.replace(SF + '/', ''), cap, kind });
  await page.setViewportSize(canvas);
  await page.goto(`file://${SF}/compose2.html?${q}`, { waitUntil: 'load' });
  await page.waitForTimeout(220);
  await page.screenshot({ path: outPath });
}

// main loop
const composeCtxs = {};
async function getComposer(dpr) {
  if (!composeCtxs[dpr]) {
    const ctx = await b.newContext({ viewport: { width: 440, height: 956 }, deviceScaleFactor: dpr });
    composeCtxs[dpr] = await ctx.newPage();
  }
  return composeCtxs[dpr];
}

for (const [aloc, [lang, ploc]] of Object.entries(LOCS)) {
  for (const app of ['ss','rw']) {
    const fam = FAM(lang);
    const caps = CAP[app][fam];
    const brand = BRAND[app];
    await captureSet(app, lang, 'ph', { width: 430, height: 932 }, 3);
    await captureSet(app, lang, 'tb', { width: 1024, height: 1366 }, 2);
    await reportPage(app, lang);
    const repSlot = app === 'ss' ? 5 : 6;
    for (const [vpName, canvas, dpr, tag] of [['ph', { width: 440, height: 956 }, 3, 'APP_IPHONE_67'], ['tb', { width: 1024, height: 1366 }, 2, 'APP_IPAD_PRO_3GEN_129']]) {
      const pg = await getComposer(dpr === 3 ? 3 : 2);
      for (let n = 1; n <= 7; n++) {
        const outDir = `${SF}/final/${app}/apple/${aloc}`;
        fs.mkdirSync(outDir, { recursive: true });
        const outPath = `${outDir}/${n-1}_${tag}_${n-1}.png`;
        if (fs.existsSync(outPath)) continue;
        const isRep = n === repSlot;
        const rawN = app === 'ss' ? { 1:1, 2:2, 3:3, 4:4, 5:'report', 6:6, 7:7 }[n] : { 1:1, 2:2, 3:3, 4:4, 5:5, 6:'report', 7:7 }[n];
        const img = isRep ? `${SF}/rawloc/${app}-${lang}-report.png` : `${SF}/rawloc/${app}-${lang}-${vpName}-${rawN}.png`;
        if (!fs.existsSync(img)) { log(`MISSING RAW ${img}`); continue; }
        await compose(pg, canvas, dpr, brand, caps[n-1], img, isRep ? 'page' : (vpName === 'tb' ? 'tablet' : 'shot'), outPath);
      }
    }
    // Play phone set (1080x2160 = exactly 2:1) + feature graphic
    { const pg = await getComposer(2);
      const outDir = `${SF}/final/${app}/google/${ploc}`;
      fs.mkdirSync(outDir + '/phoneScreenshots', { recursive: true });
      for (let n = 1; n <= 7; n++) {
        const outPath = `${outDir}/phoneScreenshots/${n}.png`;
        if (fs.existsSync(outPath)) continue;
        const isRep = n === repSlot;
        const rawN = app === 'ss' ? { 1:1, 2:2, 3:3, 4:4, 5:'report', 6:6, 7:7 }[n] : { 1:1, 2:2, 3:3, 4:4, 5:5, 6:'report', 7:7 }[n];
        const img = isRep ? `${SF}/rawloc/${app}-${lang}-report.png` : `${SF}/rawloc/${app}-${lang}-ph-${rawN}.png`;
        if (!fs.existsSync(img)) { log(`MISSING RAW ${img}`); continue; }
        await compose(pg, { width: 540, height: 1080 }, 2, brand, caps[n-1], img, isRep ? 'page' : 'shot', outPath);
      }
      const fg = `${outDir}/featureGraphic.png`;
      if (!fs.existsSync(fg)) {
        const q = new URLSearchParams({ name: brand.name, icon: brand.icon, accent: brand.accent, bg: brand.bg, cap: caps[0], kind: 'feature' });
        await pg.setViewportSize({ width: 512, height: 250 });
        await pg.goto(`file://${SF}/compose2.html?${q}`, { waitUntil: 'load' });
        await pg.waitForTimeout(220);
        await pg.screenshot({ path: fg });
      }
    }
    log(`DONE ${app} ${aloc}`);
  }
}
await b.close();
log('FACTORY COMPLETE');
