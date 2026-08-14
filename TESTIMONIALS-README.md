# Testimonials pipeline

Both product pages (`/rewrite/` and `/stroke-sight/`, root + `en/` + the 17
locale directories — 38 pages in total) carry a **hidden** "What people say"
section:

```html
<section id="testimonials" style="display:none">
  <div class="container">
    <div class="testimonials-placeholder">
      <h2 data-i18n="common.testimonials_title">What people say</h2>
    </div>
    <div class="testimonial-list"></div>
  </div>
</section>
```

The heading is already translated in every page (baked text + the
`common.testimonials_title` key in `translations/*.json`). The section ships
hidden because there are no usable quotes yet. **Never unhide a page's section
while its `.testimonial-list` is empty, and never invent quotes.**

## `testimonials/harvested.json`

Flat JSON array, starts empty (`[]`). A daily automation appends one object per
harvested quote:

```json
{
  "id": "appstore-gb-2026-08-14-1",
  "app": "rewrite",
  "source": "App Store",
  "country": "United Kingdom",
  "initial": "L.",
  "date": "2026-08-14",
  "original_locale": "en",
  "quote": {
    "en": "Original quote text.",
    "de": "Übersetzter Zitattext.",
    "fr": "Texte de citation traduit."
  },
  "approved": false
}
```

Field notes:

- `id` — stable unique string; used for de-duplication on re-harvest.
- `app` — `"rewrite"` or `"stroke-sight"`; decides which pages the quote may
  appear on.
- `source` — store or channel as displayed: `"App Store"`, `"Google Play"`,
  `"Amazon Appstore"`, `"Email"`.
- `country` — English country name; page renderers may localise it.
- `initial` — reviewer's initial(s) with a trailing full stop (`"L."`,
  `"M.K."`). Never a full name.
- `original_locale` — the locale the quote was written in (one of the 18 site
  locale codes: `en`, `ar`, `cy`, `da`, `de`, `es`, `es_mx`, `fr`, `fr_ca`,
  `ga`, `hi`, `it`, `ja`, `ko`, `pl`, `pt`, `pt_br`, `zh`).
- `quote` — map of locale code to quote text. The `original_locale` entry is
  the verbatim quote; other entries are translations and may be added
  incrementally. A page uses its own locale's text when present, otherwise
  falls back to `en`, otherwise the `original_locale` text.
- `approved` — the automation appends with `false`; only quotes flipped to
  `true` by a human are ever rendered.

## Rendering rules for the automation

For each page whose locale has at least one `approved` quote for that app:

1. Append items inside `.testimonial-list`, using the template kept in the HTML
   comment directly above each section:

   ```html
   <figure class="testimonial">
     <blockquote>&#8220;Quote text in this page's language.&#8221;</blockquote>
     <figcaption>L., App Store, United Kingdom
       <span class="testimonial-translated">(translated)</span></figcaption>
   </figure>
   ```

2. Attribution format is exactly `Initial., Store, Country`. Append the
   `(translated)` span (localised if desired) only when the rendered quote text
   is **not** in the quote's `original_locale`.
3. Remove `style="display:none"` from that page's `<section id="testimonials">`
   only after at least one item has been inserted.
4. Item CSS (`.testimonial`, `.testimonial-list`, `.testimonial-translated`)
   is already present in every product page's stylesheet.
