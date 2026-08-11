// StarLetters — shared audio + settings engine.
// Warmth phrases + phoneme clips are pre-recorded via Gemini 2.5 Pro TTS (Sulafat).
// Everything else falls back to Web Speech.
//
// Fixes vs prior version:
//   • playClip actually uses the pre-loaded cache instead of throwing it away
//   • speakLetter uses the phoneme clip when available; only falls back to
//     Web Speech (which says the LETTER NAME, wrong for phonics) as last resort
//   • Explicit Welsh detection: pick a cy-* voice or emit a warning icon instead
//     of silently reading Welsh text with an English voice

(function () {
  // ---- Warmth clips ------------------------------------------------------
  const CLIPS = {
    hello:        'audio/hello.mp3',
    well_done:    'audio/well_done.mp3',
    fantastic:    'audio/fantastic.mp3',
    try_again:    'audio/try_again.mp3',
    perfect:      'audio/perfect.mp3',
    level_up:     'audio/level_up.mp3',
    ready:        'audio/ready.mp3',
    trace_letter: 'audio/trace_letter.mp3',
    find_letter:  'audio/find_letter.mp3',
    great_job:    'audio/great_job.mp3'
  };

  const audioCache = {};
  // Paths we've learned are missing/broken — future calls short-circuit
  // straight to the fallback instead of failing silently.
  const badPaths = new Set();
  // In-flight paths whose availability we don't know yet. Prevents duplicate
  // fallback fires while the browser is still loading a clip.
  const pendingPaths = new Set();

  function loadClip(path) {
    if (audioCache[path]) return audioCache[path];
    const a = new Audio(path);
    a.preload = 'auto';
    a.addEventListener('error', () => {
      badPaths.add(path);
      pendingPaths.delete(path);
    }, { once: true });
    a.addEventListener('canplaythrough', () => {
      pendingPaths.delete(path);
    }, { once: true });
    audioCache[path] = a;
    pendingPaths.add(path);
    return a;
  }
  Object.values(CLIPS).forEach(loadClip);

  // Core play routine — attempts to play `path`, and invokes `onFail` exactly
  // once if the clip is known missing, fails to load, or the play() promise
  // rejects. This is what fixes the silent-failure bug: the caller no longer
  // has to guess from `.error` (which is set async).
  function _attemptPlay(path, opts = {}) {
    const { onFail, volume = 0.95 } = opts;
    if (!path) { if (onFail) onFail(); return null; }
    if (badPaths.has(path)) { if (onFail) onFail(); return null; }

    const cached = loadClip(path);
    // If a prior attempt has already flagged this element, short-circuit.
    if (cached.error) {
      badPaths.add(path);
      if (onFail) onFail();
      return null;
    }

    const el = cached.cloneNode();
    el.volume = volume;

    let failed = false;
    const markFail = () => {
      if (failed) return;
      failed = true;
      badPaths.add(path);
      if (onFail) onFail();
    };
    el.addEventListener('error', markFail, { once: true });

    const p = el.play();
    if (p && typeof p.catch === 'function') {
      p.catch(() => markFail());
    }
    return el;
  }

  function playPath(path, volume = 0.95) {
    return _attemptPlay(path, { volume });
  }

  function playClip(key) {
    if (!CLIPS[key]) return false;
    _attemptPlay(CLIPS[key]);
    return true;
  }

  // ---- Phoneme clips (from strokes.js's phoneme map paths) --------------
  // The curriculum data stores audio like 'en/a' or 'cy/ch'. Convert to real
  // path here (audio/en/a.mp3).
  //
  // Returns true if a playback attempt was made — but real success is signalled
  // by the *absence* of the fallback firing. Pass `opts.fallback` so a Web
  // Speech (or next-path) call fires if the clip turns out to be missing.
  function playPhoneme(audioKey, opts = {}) {
    if (!audioKey) {
      if (opts.fallback) opts.fallback();
      return false;
    }
    const path = `audio/${audioKey}.mp3`;
    if (badPaths.has(path)) {
      if (opts.fallback) opts.fallback();
      return false;
    }
    _attemptPlay(path, { onFail: opts.fallback });
    return true;
  }

  // Play a sequence of phoneme clips with a gap between each. Used for blending.
  // Waits for each clip's actual 'ended' event before starting the next —
  // eliminates clip overlap when a phoneme runs longer than the old fixed 700ms.
  async function playSequence(audioKeys, gapMs = 220, opts = {}) {
    const MAX_CLIP_MS = 3000; // safety cap so a stuck clip can't hang the sequence
    for (const key of audioKeys) {
      const path = `audio/${key}.mp3`;
      await new Promise(resolve => {
        let done = false;
        const finish = () => { if (done) return; done = true; resolve(); };
        const el = _attemptPlay(path, { onFail: () => setTimeout(finish, 300) });
        if (!el) { finish(); return; }
        el.addEventListener('ended', finish, { once: true });
        el.addEventListener('error', () => setTimeout(finish, 200), { once: true });
        setTimeout(finish, MAX_CLIP_MS);
      });
      if (gapMs > 0) await new Promise(r => setTimeout(r, gapMs));
    }
  }

  // Play the full example word (not phoneme) — used on the Meet step so the
  // child hears the whole word ("sun") after they've heard the sound (/s/).
  // Falls back to Web Speech in the appropriate language.
  function playWord(phonemeInfo, opts = {}) {
    const speakFallback = () => {
      if (phonemeInfo && phonemeInfo.word) speak(phonemeInfo.word, opts);
    };
    if (!phonemeInfo) { speakFallback(); return true; }

    // Build ordered list of candidate paths. First the explicit wordAudio,
    // then a language-derived words/ path, then a language-derived blends/
    // path. Web Speech is the last resort. This recovers cases where the
    // curriculum map omits wordAudio but a matching clip exists on disk.
    const norm = phonemeInfo.word
      ? phonemeInfo.word.toLowerCase()
          .replace(/[êâôŵŷéàèîùûäöüß]/g,
            m => ({'ê':'e','â':'a','ô':'o','ŵ':'w','ŷ':'y','é':'e','à':'a','è':'e','î':'i','ù':'u','û':'u','ä':'a','ö':'o','ü':'u','ß':'ss'}[m]))
          .replace(/[^a-z0-9]/g, '')  // strip hyphens etc — 'yo-yo' → 'yoyo'
      : null;
    const lang = opts.lang || 'en';
    const candidates = [];
    if (phonemeInfo.wordAudio) candidates.push(`audio/${phonemeInfo.wordAudio}.mp3`);
    if (norm) {
      candidates.push(`audio/${lang}/words/${norm}.mp3`);
      candidates.push(`audio/${lang}/blends/${norm}.mp3`);
    }

    const tryNext = (i) => {
      if (i >= candidates.length) { speakFallback(); return; }
      const path = candidates[i];
      if (badPaths.has(path)) { tryNext(i + 1); return; }
      _attemptPlay(path, { onFail: () => tryNext(i + 1) });
    };
    tryNext(0);
    return true;
  }

  // ---- Web Speech fallback ---------------------------------------------
  const speechSupported = 'speechSynthesis' in window;

  function getVoices() {
    if (!speechSupported) return [];
    // Support all the curriculum languages: en, cy, de, fr.
    return window.speechSynthesis.getVoices().filter(v =>
      v.lang && (v.lang.startsWith('en') || v.lang.startsWith('cy') || v.lang.startsWith('de') || v.lang.startsWith('fr'))
    );
  }

  function hasWelshVoice() {
    return getVoices().some(v => v.lang && v.lang.startsWith('cy'));
  }

  function pickBestVoice(langHint) {
    const voices = getVoices();
    const savedName = localStorage.getItem('sl_voice');
    if (savedName) {
      const saved = voices.find(v => v.name === savedName);
      if (saved) return saved;
    }
    if (langHint && langHint !== 'en') {
      const match = voices.find(v => v.lang && v.lang.startsWith(langHint));
      if (match) return match;
      // No native voice available for this language — return null so caller can decide
      return null;
    }
    const kidNames = ['Samantha','Karen','Moira','Fiona','Serena','Kate','Susan','Ava','Sonia','Amelie'];
    for (const n of kidNames) {
      const m = voices.find(v => v.name.includes(n));
      if (m) return m;
    }
    const ukFemale = voices.find(v => v.lang === 'en-GB' && /female|Kate|Susan|Serena|Karen/i.test(v.name));
    if (ukFemale) return ukFemale;
    const anyUK = voices.find(v => v.lang === 'en-GB');
    if (anyUK) return anyUK;
    return voices.find(v => v.lang && v.lang.startsWith('en')) || voices[0] || null;
  }

  function speak(text, opts = {}) {
    if (!speechSupported) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const voice = pickBestVoice(opts.lang);
    if (voice) u.voice = voice;
    u.rate  = opts.rate  ?? 0.82;
    u.pitch = opts.pitch ?? 1.25;
    u.volume = 1;
    if (opts.lang) {
      const langMap = { cy:'cy-GB', en:'en-GB', de:'de-DE', fr:'fr-FR' };
      u.lang = langMap[opts.lang] || 'en-GB';
    }
    window.speechSynthesis.speak(u);
  }

  // Speak a letter, preferring the phoneme clip. Used everywhere the
  // reading/game code wants the *sound* of a letter, not its name.
  function speakLetter(letter, phonemeInfo, opts = {}) {
    const speakFallback = () => {
      // Speak the sound + word (better than the letter name) in the right
      // language. The rate is slowed down for individual sounds.
      if (phonemeInfo && (phonemeInfo.word || phonemeInfo.sfx)) {
        const parts = [phonemeInfo.sfx || letter, phonemeInfo.word].filter(Boolean);
        speak(parts.join('. '), opts);
        return;
      }
      speak(letter, opts);
    };
    if (phonemeInfo && phonemeInfo.audio) {
      playPhoneme(phonemeInfo.audio, { fallback: speakFallback });
      return;
    }
    speakFallback();
  }

  // ---- Settings store --------------------------------------------------
  const store = {
    get curriculum () { return localStorage.getItem('sl_curriculum') || 'england'; },
    set curriculum (v) { localStorage.setItem('sl_curriculum', v); },

    get language () { return localStorage.getItem('sl_language') || 'en'; },
    set language (v) { localStorage.setItem('sl_language', v); },

    get theme () { return localStorage.getItem('sl_theme') || 'space'; },
    set theme (v) { localStorage.setItem('sl_theme', v); },

    get dyslexicFont () { return localStorage.getItem('sl_dysfont') === '1'; },
    set dyslexicFont (v) { localStorage.setItem('sl_dysfont', v ? '1' : '0'); },

    get reducedMotion () { return localStorage.getItem('sl_reduced_motion') === '1'; },
    set reducedMotion (v) { localStorage.setItem('sl_reduced_motion', v ? '1' : '0'); },

    // ALN accessibility toggles
    get highContrast () { return localStorage.getItem('sl_high_contrast') === '1'; },
    set highContrast (v) { localStorage.setItem('sl_high_contrast', v ? '1' : '0'); },

    // Target size (1 = normal, 1.25 = large, 1.5 = extra-large) — scales tap targets
    get targetSize () { return parseFloat(localStorage.getItem('sl_target_size') || '1'); },
    set targetSize (v) { localStorage.setItem('sl_target_size', String(v)); },

    // Switch access (allow spacebar / single-switch to advance)
    get switchAccess () { return localStorage.getItem('sl_switch_access') === '1'; },
    set switchAccess (v) { localStorage.setItem('sl_switch_access', v ? '1' : '0'); },

    get rocketColour () { return localStorage.getItem('sl_rocket_colour') || 'yellow'; },
    set rocketColour (v) { localStorage.setItem('sl_rocket_colour', v); },

    get stars () { return parseInt(localStorage.getItem('sl_stars') || '0', 10); },
    set stars (v) { localStorage.setItem('sl_stars', String(v)); },

    get level () { return parseInt(localStorage.getItem('sl_level') || '1', 10); },
    set level (v) { localStorage.setItem('sl_level', String(v)); },

    get voiceName () { return localStorage.getItem('sl_voice') || ''; },
    set voiceName (v) { localStorage.setItem('sl_voice', v); },

    // Per-letter progress: { letter: { attempts, sumScore, lastScore } }
    getProgress() {
      try { return JSON.parse(localStorage.getItem('sl_progress') || '{}'); }
      catch { return {}; }
    },
    recordAttempt(letter, score) {
      const p = this.getProgress();
      const e = p[letter] || { attempts: 0, sumScore: 0, lastScore: 0 };
      e.attempts += 1;
      e.sumScore += score;
      e.lastScore = score;
      p[letter] = e;
      localStorage.setItem('sl_progress', JSON.stringify(p));
    },
    resetProgress() { localStorage.removeItem('sl_progress'); }
  };

  // ---- UI language strings ---------------------------------------------
  // Minimal i18n for the child-facing UI. Missing keys fall back to English.
  const STRINGS = {
    en: {
      home_title:'StarLetters', home_sub:'Learn to read and write — through your hand',
      start_lesson:'Start today’s lesson', main_badge:'MAIN', free_practice:'Free practice',
      letter_hunt:'Letter hunt', sound_library:'Sound library', handwriting:'Handwriting',
      meet:'Meet', sound:'Sound', blend:'Blend', write:'Write', star:'Star',
      hear_it:'Hear it', guide:'Guide', clear:'Clear', check:'Check',
      continue:'Continue', try_again:'Try again', do_it_again:'Do it again', next_lesson:'Next lesson',
      home:'Home', back:'Back', lesson:'Lesson', of:'of',
      good_work:'Good work', great:'Great!', keep_going:'Keep going',
      lesson_complete:'Lesson complete', settings:'Settings',
      insight_title:'Practice insight', insight_none:'No pattern yet — keep playing to unlock insights.',
      insight_prefix:'Worth practising:'
    },
    cy: {
      home_title:'StarLetters', home_sub:'Dysgu darllen ac ysgrifennu — gyda’ch llaw',
      start_lesson:'Dechrau gwers heddiw', main_badge:'PRIF', free_practice:'Ymarfer rhydd',
      letter_hunt:'Helfa llythrennau', sound_library:'Llyfrgell sŵn', handwriting:'Ysgrifennu',
      meet:'Cwrdd', sound:'Sŵn', blend:'Cymysgu', write:'Ysgrifennu', star:'Seren',
      hear_it:'Clyw', guide:'Arwain', clear:'Clirio', check:'Gwirio',
      continue:'Ymlaen', try_again:'Eto', do_it_again:'Eto', next_lesson:'Nesaf',
      home:'Cartref', back:'Yn ôl', lesson:'Gwers', of:'o',
      good_work:'Da iawn', great:'Gwych!', keep_going:'Dal ati',
      lesson_complete:'Gwers wedi’i chwblhau', settings:'Gosodiadau',
      insight_title:'Awgrym ymarfer', insight_none:'Dim patrwm eto — dal ati.',
      insight_prefix:'Gwerth ymarfer:'
    },
    de: {
      home_title:'StarLetters', home_sub:'Lesen und schreiben lernen — mit deiner Hand',
      start_lesson:'Heutige Lektion starten', main_badge:'HAUPT', free_practice:'Frei üben',
      letter_hunt:'Buchstabenjagd', sound_library:'Lautbibliothek', handwriting:'Schreiben',
      meet:'Kennen', sound:'Laut', blend:'Zusammen', write:'Schreiben', star:'Stern',
      hear_it:'Hör zu', guide:'Führen', clear:'Löschen', check:'Prüfen',
      continue:'Weiter', try_again:'Nochmal', do_it_again:'Nochmal', next_lesson:'Nächste',
      home:'Startseite', back:'Zurück', lesson:'Lektion', of:'von',
      good_work:'Gut gemacht', great:'Toll!', keep_going:'Weiter so',
      lesson_complete:'Lektion fertig', settings:'Einstellungen',
      insight_title:'Übungshinweis', insight_none:'Noch kein Muster — spiel weiter.',
      insight_prefix:'Lohnt sich zu üben:'
    },
    fr: {
      home_title:'StarLetters', home_sub:'Apprendre à lire et à écrire — avec ta main',
      start_lesson:'Commencer la leçon', main_badge:'PRINCIPAL', free_practice:'Jeu libre',
      letter_hunt:'Chasse aux lettres', sound_library:'Bibliothèque de sons', handwriting:'Écriture',
      meet:'Rencontre', sound:'Son', blend:'Assembler', write:'Écrire', star:'Étoile',
      hear_it:'Écoute', guide:'Guide', clear:'Effacer', check:'Vérifier',
      continue:'Continuer', try_again:'Encore', do_it_again:'Encore', next_lesson:'Suivant',
      home:'Accueil', back:'Retour', lesson:'Leçon', of:'sur',
      good_work:'Bon travail', great:'Super !', keep_going:'Continue',
      lesson_complete:'Leçon terminée', settings:'Réglages',
      insight_title:'Astuce d’entraînement', insight_none:'Pas encore de modèle — continue à jouer.',
      insight_prefix:'À travailler :'
    }
  };

  function t(key) {
    const lang = store.language || 'en';
    const bag = STRINGS[lang] || STRINGS.en;
    return bag[key] || STRINGS.en[key] || key;
  }

  window.StarAudio = {
    playClip,
    playPhoneme,
    playSequence,
    playWord,
    speak,
    speakLetter,
    getVoices,
    hasWelshVoice
  };
  window.StarI18n = { t, STRINGS };
  window.StarSettings = store;
})();
