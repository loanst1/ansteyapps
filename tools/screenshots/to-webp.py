#!/usr/bin/env python3
"""Convert freshly-rendered screenshot PNGs to WebP and drop the PNG source.

Playwright renders PNGs; the marketing site references WebP (≈60% smaller at the
same visible quality). Run this once after regenerating screenshots so the two
stay in step:

    python3 to-webp.py            # convert everything the generators produced
    python3 to-webp.py fr ar      # only these locales' per-language screenshots

Scope: assets/hero, assets/tablets, and the per-language screenshot subdirs
(stroke-sight-screenshots/<lang>/, rewrite-screenshots/<lang>/). Root-level
screenshot PNGs are left alone — they back the og:image tags, and some social
scrapers still don't accept WebP.

Requires Pillow with WebP support:  pip install Pillow
"""
import os, sys, glob
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.environ.get('SITE') or os.path.normpath(os.path.join(HERE, '..', '..'))
QUALITY = int(os.environ.get('WEBP_QUALITY', '85'))
locales = sys.argv[1:]  # optional filter for per-language screenshots

def collect():
    pngs = []
    pngs += glob.glob(os.path.join(SITE, 'assets', 'hero', '*.png'))
    pngs += glob.glob(os.path.join(SITE, 'assets', 'tablets', '*.png'))
    for d in ('stroke-sight-screenshots', 'rewrite-screenshots'):
        if locales:
            for lang in locales:
                pngs += glob.glob(os.path.join(SITE, d, lang, '*.png'))
        else:
            pngs += glob.glob(os.path.join(SITE, d, '*', '*.png'))
    return pngs

saved = 0; n = 0
for p in collect():
    out = p[:-4] + '.webp'
    Image.open(p).convert('RGBA').save(out, 'WEBP', quality=QUALITY, method=6)
    saved += os.path.getsize(p) - os.path.getsize(out)
    os.remove(p)  # PNG is an intermediate; the site serves the WebP
    n += 1

print(f'converted {n} PNG -> WebP (quality {QUALITY}), removed PNG sources')
print(f'saved ~{saved/1_048_576:.1f} MB')
