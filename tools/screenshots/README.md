# Screenshot generators

Every app screenshot on the marketing site is a **static PNG rendered from the
real apps**. When either app's UI changes (a new exercise, a restyle, a font
swap), these regenerate the whole set so the site never drifts out of date.

There are ~180 images across three surfaces, all produced here:

| Script | Renders | Output |
| --- | --- | --- |
| `homepage-phones.mjs` | Homepage hero phones — Stroke Sight progress (17 locales) + ReWrite home (en, fr) | `assets/hero/` |
| `tablets.mjs` | Product-page tablet showcase — SS & RW on iPad (landscape) + Android/Fire (portrait), 16 locales | `assets/tablets/` |
| `product-strip.mjs` | Product-page strip — SS {in-play exercise, progress, picker}, RW {tracing, dark, picker}, 16 locales | `stroke-sight-screenshots/<lang>/`, `rewrite-screenshots/<lang>/` |

## Prerequisites

You need local checkouts of **both app repos** (`stroke-sight` and `rewrite`)
plus this site repo, and Node + Playwright.

```bash
cd tools/screenshots
npm install
npx playwright install chromium      # unless you point CHROMIUM at an existing binary
```

## Configuration (env vars)

Paths are resolved from the environment so this runs anywhere. Defaults assume
the layout used in CI/dev; override whatever differs:

| Var | Meaning | Default |
| --- | --- | --- |
| `SS_APP` | `file://` URL of Stroke Sight's `www/app.html` | `file:///workspace/stroke-sight/www/app.html` |
| `RW_APP` | `file://` URL of ReWrite's `www/app.html` | `file:///home/user/rewrite/www/app.html` |
| `SITE` | absolute path to this checkout | auto (two dirs up from this folder) |
| `CHROMIUM` | path to a Chromium binary | Playwright's bundled Chromium |

Example:

```bash
SS_APP="file://$HOME/code/stroke-sight/www/app.html" \
RW_APP="file://$HOME/code/rewrite/www/app.html" \
npm run all
```

## Running

```bash
npm run phones     # or: node homepage-phones.mjs
npm run tablets
npm run strip
npm run all        # all three in sequence
```

Each script takes an optional locale filter, handy for re-doing one language:

```bash
node product-strip.mjs de ar      # just German + Arabic (pickers always refresh)
node tablets.mjs fr
```

After running, review the diff and commit the changed PNGs.

## When to run it

Run it by hand whenever an app changes in a way that shows on screen — a new
exercise, a restyle, a font swap, the progress screen. Regenerate, review the
PNG diff, commit. (There's intentionally no scheduled automation; it's a
30-second command when you actually need it.)

## Notes / gotchas

- **In-play exercise shot (`product-strip.mjs`).** Stroke Sight's Anchor & Scan
  target appears and disappears on a timer, so the script starts the exercise
  and screenshots the moment a live target is detected by reading the canvas
  pixels (bright green on the dark field). If a locale ever comes out with an
  empty field, just re-run that locale.
- **Language pickers are neutral** (they show every language regardless of the
  current one), so they're rendered once and copied into all 16 locale folders.
  Stroke Sight's picker (`#langpick`) is hidden until first run, so the script
  force-shows it; ReWrite's (`#langOverlay`) shows on load.
- **`ga` (Irish)** has no screenshot folder — the site's `data-i18n-src` falls it
  back to `en`. The homepage hero phones *do* include `ga` (it gets its own
  phone), which is why `HERO_LANGS` is 17 and `ASSET_LANGS` is 16.
- **RTL + non-Latin** render natively (Arabic mirrors, ReWrite traces the
  locale's own script), so the shots are genuinely localised, not English with
  translated captions.
- Device pixel ratios match what the site expects: hero phones and tablets at
  DPR2, the product strip at DPR3 (to match the pre-existing assets).
