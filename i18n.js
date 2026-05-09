/**
 * Anstey Apps — Internationalization (i18n) System
 * Supports 16 languages with auto-detection, RTL, and screenshot swapping.
 */
(function() {
  'use strict';

  var LANGS = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'es', name: 'Spanish', native: 'Español' },
    { code: 'fr', name: 'French', native: 'Français' },
    { code: 'de', name: 'German', native: 'Deutsch' },
    { code: 'it', name: 'Italian', native: 'Italiano' },
    { code: 'pt', name: 'Portuguese', native: 'Português' },
    { code: 'cy', name: 'Welsh', native: 'Cymraeg' },
    { code: 'ja', name: 'Japanese', native: '日本語' },
    { code: 'ko', name: 'Korean', native: '한국어' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'ar', name: 'Arabic', native: 'العربية' },
    { code: 'zh', name: 'Chinese', native: '中文' },
    { code: 'pl', name: 'Polish', native: 'Polski' },
    { code: 'es_mx', name: 'Latin American Spanish', native: 'Español (América)' },
    { code: 'pt_br', name: 'Brazilian Portuguese', native: 'Português (Brasil)' },
    { code: 'fr_ca', name: 'Canadian French', native: 'Français (Canada)' }
  ];

  var LANG_CODES = LANGS.map(function(l) { return l.code; });
  var translations = {};
  var currentLang = 'en';
  var basePath = '';

  // Detect base path (works from subfolders like /stroke-sight/)
  function detectBasePath() {
    var scripts = document.querySelectorAll('script[src*="i18n.js"]');
    if (scripts.length > 0) {
      var src = scripts[0].getAttribute('src');
      basePath = src.replace('i18n.js', '');
    }
  }

  // Detect user's preferred language
  function detectLanguage() {
    // 1. Check URL parameter
    var params = new URLSearchParams(window.location.search);
    var urlLang = params.get('lang');
    if (urlLang && LANG_CODES.indexOf(urlLang) >= 0) return urlLang;

    // 2. Check localStorage
    var stored = localStorage.getItem('ansteyapps_lang');
    if (stored && LANG_CODES.indexOf(stored) >= 0) return stored;

    // 3. Check browser language
    var browserLangs = navigator.languages || [navigator.language];
    for (var i = 0; i < browserLangs.length; i++) {
      var bl = browserLangs[i].toLowerCase().replace('-', '_');
      // Check exact match first (e.g. es_mx)
      if (LANG_CODES.indexOf(bl) >= 0) return bl;
      // Check base language (e.g. es)
      var base = bl.split('_')[0];
      if (LANG_CODES.indexOf(base) >= 0) return base;
    }

    return 'en';
  }

  // Load translation file
  function loadTranslation(lang, callback) {
    if (translations[lang]) { callback(translations[lang]); return; }

    var xhr = new XMLHttpRequest();
    xhr.open('GET', basePath + 'translations/' + lang + '.json', true);
    xhr.onload = function() {
      if (xhr.status === 200) {
        try {
          translations[lang] = JSON.parse(xhr.responseText);
          callback(translations[lang]);
        } catch(e) {
          console.warn('i18n: parse error for ' + lang, e);
          callback(null);
        }
      } else {
        console.warn('i18n: failed to load ' + lang + ' (' + xhr.status + ')');
        callback(null);
      }
    };
    xhr.onerror = function() { callback(null); };
    xhr.send();
  }

  // Get a nested key from an object (e.g. "homepage.hero_title_1")
  function getKey(obj, key) {
    var parts = key.split('.');
    var val = obj;
    for (var i = 0; i < parts.length; i++) {
      if (!val) return null;
      val = val[parts[i]];
    }
    return val;
  }

  // Apply translations to the page
  function applyTranslation(data) {
    if (!data) return;

    // Swap text content
    var els = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < els.length; i++) {
      var key = els[i].getAttribute('data-i18n');
      var val = getKey(data, key);
      if (val) {
        if (els[i].tagName === 'INPUT' || els[i].tagName === 'TEXTAREA') {
          els[i].placeholder = val;
        } else {
          els[i].textContent = val;
        }
      }
    }

    // Swap innerHTML (for elements with HTML content)
    var htmlEls = document.querySelectorAll('[data-i18n-html]');
    for (var j = 0; j < htmlEls.length; j++) {
      var hkey = htmlEls[j].getAttribute('data-i18n-html');
      var hval = getKey(data, hkey);
      if (hval) htmlEls[j].innerHTML = hval;
    }

    // Swap screenshot paths
    var imgs = document.querySelectorAll('[data-i18n-src]');
    for (var k = 0; k < imgs.length; k++) {
      var srcTemplate = imgs[k].getAttribute('data-i18n-src');
      imgs[k].src = srcTemplate.replace('{lang}', currentLang);
    }

    // Swap App Store regional URLs (locale -> Apple country code)
    var APP_STORE_COUNTRY = {
      en: 'us', es: 'es', es_mx: 'mx', fr: 'fr', fr_ca: 'ca',
      de: 'de', it: 'it', pt: 'pt', pt_br: 'br', ja: 'jp',
      ko: 'kr', zh: 'us', hi: 'in', ar: 'sa', pl: 'pl', cy: 'gb'
    };
    var hrefs = document.querySelectorAll('[data-i18n-href]');
    for (var h = 0; h < hrefs.length; h++) {
      var hrefTemplate = hrefs[h].getAttribute('data-i18n-href');
      var country = APP_STORE_COUNTRY[currentLang] || 'us';
      hrefs[h].href = hrefTemplate.replace('{country}', country);
    }

    // Google Play regional URLs (hl=lang, gl=country)
    // Welsh / Chinese fall through to en/US since Play has no Welsh and no
    // mainland China store for these apps.
    var PLAY_HL = {
      en: 'en', es: 'es', es_mx: 'es_419', fr: 'fr', fr_ca: 'fr_CA',
      de: 'de', it: 'it', pt: 'pt_PT', pt_br: 'pt_BR', ja: 'ja',
      ko: 'ko', zh: 'zh_CN', hi: 'hi', ar: 'ar', pl: 'pl', cy: 'en'
    };
    var PLAY_GL = {
      en: 'US', es: 'ES', es_mx: 'MX', fr: 'FR', fr_ca: 'CA',
      de: 'DE', it: 'IT', pt: 'PT', pt_br: 'BR', ja: 'JP',
      ko: 'KR', zh: 'US', hi: 'IN', ar: 'SA', pl: 'PL', cy: 'GB'
    };
    var phrefs = document.querySelectorAll('[data-i18n-play-href]');
    for (var ph = 0; ph < phrefs.length; ph++) {
      var pTemplate = phrefs[ph].getAttribute('data-i18n-play-href');
      var hl = PLAY_HL[currentLang] || 'en';
      var gl = PLAY_GL[currentLang] || 'US';
      phrefs[ph].href = pTemplate.replace('{hl}', hl).replace('{gl}', gl);
    }

    // Amazon Appstore regional domain swap (locale -> Amazon TLD)
    // Amazon doesn't have a storefront for every country — fall back to .com
    // for unsupported markets (Welsh, Chinese, Korean, Polish, Arabic).
    var AMAZON_TLD = {
      en: 'com', es: 'es', es_mx: 'com.mx', fr: 'fr', fr_ca: 'ca',
      de: 'de', it: 'it', pt: 'es', pt_br: 'com.br', ja: 'co.jp',
      ko: 'com', zh: 'com', hi: 'in', ar: 'com', pl: 'com', cy: 'co.uk'
    };
    var ahrefs = document.querySelectorAll('[data-i18n-amazon-href]');
    for (var ah = 0; ah < ahrefs.length; ah++) {
      var aTemplate = ahrefs[ah].getAttribute('data-i18n-amazon-href');
      var atld = AMAZON_TLD[currentLang] || 'com';
      ahrefs[ah].href = aTemplate.replace('{tld}', atld);
    }

    // Handle page title
    var titleEl = document.querySelector('[data-i18n-title]');
    if (titleEl) {
      var tkey = titleEl.getAttribute('data-i18n-title');
      var tval = getKey(data, tkey);
      if (tval) document.title = tval;
    }

    // RTL for Arabic
    if (currentLang === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', currentLang.split('_')[0]);
    }

    // Update language selector
    var sel = document.getElementById('lang-select');
    if (sel) sel.value = currentLang;
  }

  // Build the language selector dropdown
  function buildSelector() {
    var existing = document.getElementById('lang-select');
    if (existing) return;

    // Find the nav/header to insert into
    // Prefer .nav-right (sits next to nav links on right edge), then fall back.
    // Note: must query in priority order — querySelector with a list returns
    // the first match in document order, not selector order.
    var nav = document.querySelector('.nav-right')
           || document.querySelector('.nav-links')
           || document.querySelector('nav')
           || document.querySelector('header');
    if (!nav) return;

    var select = document.createElement('select');
    select.id = 'lang-select';
    select.setAttribute('aria-label', 'Choose language');
    select.style.cssText = 'background:rgba(31,79,63,0.08);border:1px solid rgba(31,79,63,0.15);border-radius:8px;padding:6px 10px;font-size:13px;font-family:Inter,sans-serif;color:#2a2a28;cursor:pointer;margin-left:12px;';

    for (var i = 0; i < LANGS.length; i++) {
      var opt = document.createElement('option');
      opt.value = LANGS[i].code;
      opt.textContent = LANGS[i].native;
      if (LANGS[i].code === currentLang) opt.selected = true;
      select.appendChild(opt);
    }

    select.addEventListener('change', function() {
      setLanguage(this.value);
    });

    // Insert at the end of nav
    nav.appendChild(select);
  }

  // Public: set language
  function setLanguage(lang) {
    if (LANG_CODES.indexOf(lang) < 0) lang = 'en';
    currentLang = lang;
    localStorage.setItem('ansteyapps_lang', lang);

    // Update URL without reload
    var url = new URL(window.location);
    url.searchParams.set('lang', lang);
    history.replaceState(null, '', url);

    loadTranslation(lang, applyTranslation);
  }

  // Initialize
  function init() {
    detectBasePath();
    currentLang = detectLanguage();
    buildSelector();

    // Always load English as fallback, then load target
    loadTranslation('en', function(enData) {
      translations['en'] = enData;
      if (currentLang !== 'en') {
        loadTranslation(currentLang, function(data) {
          applyTranslation(data || enData);
        });
      }
      // Don't apply English — the page is already in English by default
    });
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for external use
  window.i18n = {
    setLanguage: setLanguage,
    getLanguage: function() { return currentLang; },
    langs: LANGS
  };
})();
