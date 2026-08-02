// Shared config + helpers for the screenshot generators.
//
// Paths are resolved from env vars so this runs anywhere the two app repos are
// checked out. Override as needed:
//   SS_APP   file:// URL of Stroke Sight's www/app.html   (default below)
//   RW_APP   file:// URL of ReWrite's    www/app.html      (default below)
//   SITE     absolute path to this (ansteyapps) checkout    (default: two dirs up)
//   CHROMIUM path to a Chromium binary. If unset, Playwright's bundled Chromium
//            is used (run `npx playwright install chromium` once).
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
export const SITE = process.env.SITE || resolve(here, '..', '..');
export const SS_APP = process.env.SS_APP || 'file:///workspace/stroke-sight/www/app.html';
export const RW_APP = process.env.RW_APP || 'file:///home/user/rewrite/www/app.html';

// The 16 locales that have screenshot asset folders (data-i18n-src falls ga -> en,
// so ga has no assets of its own).
export const ASSET_LANGS = ['ar','cy','de','en','es','es_mx','fr','fr_ca','hi',
                            'it','ja','ko','pl','pt','pt_br','zh'];
// The homepage hero phones cover all 17 (ga included — it gets its own phone).
export const HERO_LANGS = ['en','cy','ga','de','fr','fr_ca','es','es_mx','it',
                           'pt','pt_br','pl','ja','ko','hi','ar','zh'];
// app-locale -> BCP47, for localised chart date labels in the progress shots.
export const BCP = {en:'en-GB',cy:'cy',ga:'ga',de:'de',fr:'fr',fr_ca:'fr-CA',
  es:'es',es_mx:'es-MX',it:'it',pt:'pt-PT',pt_br:'pt-BR',pl:'pl',ja:'ja',
  ko:'ko',hi:'hi',ar:'ar',zh:'zh'};

export async function launch() {
  const opts = { args: ['--no-sandbox', '--disable-gpu'] };
  if (process.env.CHROMIUM) opts.executablePath = process.env.CHROMIUM;
  return chromium.launch(opts);
}

// Optional CLI lang filter: `node script.mjs de fr` renders only those.
export function pickLangs(all) {
  const args = process.argv.slice(2).filter(a => !a.startsWith('-'));
  return args.length ? args : all;
}

// Seed Stroke Sight with a demo session history (used by the progress shots).
// Runs inside the page; `bcp` gives localised date labels.
export function seedStrokeSight(bcp) {
  const fmt = new Intl.DateTimeFormat(bcp, { day: 'numeric', month: 'short' });
  const lbl = (dd) => fmt.format(new Date(2025, 4, dd));
  const mk = (id, acc, rt, dd) => ({ exerciseId: id, name: id, score: acc*3,
    hits: acc, misses: 100-acc, totalRt: rt*acc, rt, accuracy: acc, level: 1,
    date: new Date(2025,4,dd).toISOString(), dateLabel: lbl(dd), timeLabel: '08:00' });
  window.__ROWS = [mk('anchor',80,600,31),mk('anchor',71,690,30),mk('anchor',66,760,30),
    mk('anchor',58,820,29),mk('reading',72,700,31),mk('reading',62,880,29)];
  window.loadAllSessions = function (cb) { window.sessions = window.__ROWS.slice(); if (cb) cb(); };
  window.sessions = window.__ROWS.slice();
}
