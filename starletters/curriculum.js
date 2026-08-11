// StarLetters curriculum data — scope, sequence, and decodable content.
// Curriculum names are softened to remove trademarked scheme names.
// This encodes ORDER of teaching, digraphs, and decodable words per phase.

(function () {
  // ----- English phoneme reference (used by all English variants) --------
  // 44 phonemes covering the English SSP core.
  const P = {
    // Set 1: s, a, t, p
    s: { sfx: 's',   word: 'sun',     emoji: '☀️',  audio: 'en/s' },
    a: { sfx: 'a',   word: 'ant',     emoji: '🐜',  audio: 'en/a' },
    t: { sfx: 't',   word: 'tap',     emoji: '🚰',  audio: 'en/t' },
    p: { sfx: 'p',   word: 'pig',     emoji: '🐷',  audio: 'en/p' },
    // Set 2: i, n, m, d
    i: { sfx: 'i',   word: 'igloo',   emoji: '🧊',  audio: 'en/i' },
    n: { sfx: 'n',   word: 'nest',    emoji: '🪺',  audio: 'en/n' },
    m: { sfx: 'm',   word: 'moon',    emoji: '🌙',  audio: 'en/m' },
    d: { sfx: 'd',   word: 'dog',     emoji: '🐶',  audio: 'en/d' },
    // Set 3: g, o, c, k
    g: { sfx: 'g',   word: 'goat',    emoji: '🐐',  audio: 'en/g' },
    o: { sfx: 'o',   word: 'octopus', emoji: '🐙',  audio: 'en/o' },
    c: { sfx: 'k',   word: 'cat',     emoji: '🐱',  audio: 'en/c' },
    k: { sfx: 'k',   word: 'kite',    emoji: '🪁',  audio: 'en/k' },
    // Set 4: ck, e, u, r
    e: { sfx: 'e',   word: 'egg',     emoji: '🥚',  audio: 'en/e' },
    u: { sfx: 'u',   word: 'umbrella',emoji: '☂️',  audio: 'en/u' },
    r: { sfx: 'r',   word: 'rabbit',  emoji: '🐰',  audio: 'en/r' },
    // Set 5: h, b, f, ff, l, ll, ss
    h: { sfx: 'h',   word: 'hat',     emoji: '🎩',  audio: 'en/h' },
    b: { sfx: 'b',   word: 'bat',     emoji: '🦇',  audio: 'en/b' },
    f: { sfx: 'f',   word: 'fish',    emoji: '🐟',  audio: 'en/f' },
    l: { sfx: 'l',   word: 'lion',    emoji: '🦁',  audio: 'en/l' },
    // Rest of alphabet
    j: { sfx: 'j',   word: 'jam',     emoji: '🍯',  audio: 'en/j' },
    v: { sfx: 'v',   word: 'van',     emoji: '🚐',  audio: 'en/v' },
    w: { sfx: 'w',   word: 'web',     emoji: '🕸️',  audio: 'en/w' },
    x: { sfx: 'ks',  word: 'box',     emoji: '📦',  audio: 'en/x' },
    y: { sfx: 'y',   word: 'yo-yo',   emoji: '🪀',  audio: 'en/y' },
    z: { sfx: 'z',   word: 'zebra',   emoji: '🦓',  audio: 'en/z' },
    q: { sfx: 'kw',  word: 'queen',   emoji: '👑',  audio: 'en/q' },
    // Digraphs
    sh: { sfx: 'sh', word: 'shell',  emoji: '🐚', audio: 'en/sh' },
    ch: { sfx: 'ch', word: 'chip',   emoji: '🍟', audio: 'en/ch' },
    th: { sfx: 'th', word: 'thumb',  emoji: '👍', audio: 'en/th' },
    ng: { sfx: 'ng', word: 'ring',   emoji: '💍', audio: 'en/ng' },
    ck: { sfx: 'k',  word: 'kick',   emoji: '⚽', audio: 'en/ck' },
    qu: { sfx: 'kw', word: 'queen',  emoji: '👑', audio: 'en/qu' }
  };

  // ----- Welsh phoneme reference (Cymraeg) -------------------------------
  const W = {
    a:  { sfx: 'a',  word: 'afal',      emoji: '🍎', audio: 'cy/a'  },
    b:  { sfx: 'b',  word: 'bag',       emoji: '🎒', audio: 'cy/b'  },
    c:  { sfx: 'c',  word: 'cath',      emoji: '🐱', audio: 'cy/c'  },
    ch: { sfx: 'ch', word: 'chwech',    emoji: '6️⃣', audio: 'cy/ch' },
    d:  { sfx: 'd',  word: 'dŵr',       emoji: '💧', audio: 'cy/d'  },
    dd: { sfx: 'dd', word: 'dydd',      emoji: '📅', audio: 'cy/dd' },
    e:  { sfx: 'e',  word: 'elin',      emoji: '🫱', audio: 'cy/e'  },
    f:  { sfx: 'v',  word: 'fioled',    emoji: '💜', audio: 'cy/f'  },
    ff: { sfx: 'ff', word: 'ffôn',      emoji: '📞', audio: 'cy/ff' },
    g:  { sfx: 'g',  word: 'gardd',     emoji: '🌷', audio: 'cy/g'  },
    ng: { sfx: 'ng', word: 'angel',     emoji: '👼', audio: 'cy/ng' },
    h:  { sfx: 'h',  word: 'het',       emoji: '🎩', audio: 'cy/h'  },
    // 'iâr' historically begins with consonantal /j/, so it's a poor beacon
    // word for the vowel /i(ː)/. Swap to 'ci' (dog) — an unambiguous CV word
    // whose 'i' clearly says the target long vowel.
    i:  { sfx: 'ee', word: 'ci',        emoji: '🐶', audio: 'cy/i'  },
    j:  { sfx: 'j',  word: 'jam',       emoji: '🍯', audio: 'cy/j'  },
    l:  { sfx: 'l',  word: 'lolipop',   emoji: '🍭', audio: 'cy/l'  },
    ll: { sfx: 'll', word: 'llaw',      emoji: '🖐️', audio: 'cy/ll' },
    m:  { sfx: 'm',  word: 'mam',       emoji: '👩', audio: 'cy/m'  },
    n:  { sfx: 'n',  word: 'nain',      emoji: '👵', audio: 'cy/n'  },
    o:  { sfx: 'o',  word: 'oren',      emoji: '🍊', audio: 'cy/o'  },
    p:  { sfx: 'p',  word: 'pêl',       emoji: '⚽', audio: 'cy/p'  },
    ph: { sfx: 'ff', word: 'phaser',    emoji: '🔦', audio: 'cy/ph' },
    // r example was rhosyn — that's actually an /rh/ word. Use 'ras' (race) which
    // is a genuine /r/ word.
    r:  { sfx: 'r',  word: 'ras',       emoji: '🏃', audio: 'cy/r'  },
    rh: { sfx: 'rh', word: 'rhaff',     emoji: '🪢', audio: 'cy/rh' },
    s:  { sfx: 's',  word: 'seren',     emoji: '⭐', audio: 'cy/s'  },
    t:  { sfx: 't',  word: 'tad',       emoji: '👨', audio: 'cy/t'  },
    th: { sfx: 'th', word: 'thermos',   emoji: '🧴', audio: 'cy/th' },
    u:  { sfx: 'ee', word: 'un',        emoji: '1️⃣', audio: 'cy/u'  },
    w:  { sfx: 'oo', word: 'wy',        emoji: '🥚', audio: 'cy/w'  },
    y:  { sfx: 'uh', word: 'ynys',      emoji: '🏝️', audio: 'cy/y'  }
  };

  // ---- Curricula with proper phase order ----
  // Reference: UK Department for Education systematic synthetic phonics guidance
  // (public policy). No proprietary scheme names are used anywhere.
  window.StarCurriculums = [
    {
      code: 'england', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      name: 'England · SSP phase order',
      desc: 'The standard synthetic-phonics phase order used across English state schools.',
      phases: [
        { name: 'Phase 2a', letters: ['s','a','t','p'],           blends: ['at','as','sat','pat','sap','tap'] },
        { name: 'Phase 2b', letters: ['i','n','m','d'],           blends: ['it','in','an','and','sit','pin','pan','tin','tan','man','din','mat','dad'] },
        { name: 'Phase 2c', letters: ['g','o','c','k'],           blends: ['got','on','no','can','cot','cop','kit','kid','pot','dog'] },
        { name: 'Phase 2d', letters: ['e','u','r'],               blends: ['red','get','ten','pen','up','pup','run','rat','rip','rug','sun'] }, // (England) f is only introduced in 2e, so no 'fun' here.
        { name: 'Phase 2e', letters: ['h','b','f','l'],           blends: ['bag','big','bat','fat','fun','log','let','him','has','hop','lip'] },
        { name: 'Phase 3',  letters: ['j','v','w','x','y','z','qu'], blends: ['jam','van','wag','box','yes','zip'] },
        { name: 'Phase 3d', letters: ['sh','ch','th','ng','ck'],   blends: ['ship','chin','thin','king','sang','kick','sock','duck'] }
      ]
    },
    {
      code: 'scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
      name: 'Scotland · Curriculum for Excellence',
      desc: 'CfE Early Level phonics with Scottish keywords.',
      phases: [
        { name: 'Early A', letters: ['s','a','t','p','i','n'],    blends: ['sat','pin','tan','nip','ant'] },
        { name: 'Early B', letters: ['m','d','g','o','c','k'],    blends: ['dog','can','mat','got','kit'] }, // was 'god' — replaced with the phonics-standard CVC 'got'.
        { name: 'Early C', letters: ['e','u','r','h','b','f','l'],blends: ['red','bug','fun','let','hop'] },
        { name: 'Early D', letters: ['j','v','w','x','y','z','qu'], blends: ['jog','wet','yes','fox'] },
        { name: 'Digraphs',letters: ['sh','ch','th','ng','ck'],   blends: ['fish','chip','thin','sing','kick'] }
      ]
    },
    {
      code: 'wales', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
      name: 'Wales · Bilingual English phonics',
      desc: 'English SSP order with Welsh cultural word examples.',
      phases: [
        { name: 'Phase 2a', letters: ['s','a','t','p'],           blends: ['at','sat','tap'] },
        { name: 'Phase 2b', letters: ['i','n','m','d'],           blends: ['it','man','din','dad'] },
        { name: 'Phase 2c', letters: ['g','o','c','k'],           blends: ['dog','can','kit'] },
        { name: 'Phase 2d', letters: ['e','u','r'],               blends: ['red','run','pen','pup','ten','up'] }, // Wales: f isn't introduced until Phase 2e, so 'fun' removed.
        { name: 'Phase 2e', letters: ['h','b','f','l'],           blends: ['big','fat','lip'] },
        { name: 'Phase 3',  letters: ['j','v','w','x','y','z','qu'],blends: ['jam','box','yes'] },
        { name: 'Digraphs', letters: ['sh','ch','th','ng','ck'],   blends: ['ship','chin','thin','ring','kick'] }
      ]
    },
    {
      code: 'nireland', flag: '🇬🇧',
      name: 'Northern Ireland · Action-sounds order',
      desc: 'The s-a-t-i-p-n order taught in most NI schools with actions and sounds.',
      // s-a-t-i-p-n order with action-linked sounds, common in NI schools.
      phases: [
        { name: 'Group 1', letters: ['s','a','t','i','p','n'],    blends: ['sat','pin','tin','pit','an','it'] },
        { name: 'Group 2', letters: ['c','k','e','h','r','m','d'],blends: ['cat','red','hat','mad','him'] },
        { name: 'Group 3', letters: ['g','o','u','l','f','b'],    blends: ['dog','bug','fun','log','bag'] },
        { name: 'Group 4', letters: ['j','v','w','x','y','z','qu'], blends: ['jog','yes','box','win'] },
        { name: 'Digraphs',letters: ['sh','ch','th','ng','ck'],   blends: ['ship','chin','thin','sing','kick'] }
      ]
    },
    {
      code: 'welsh', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
      name: 'Cymraeg · Welsh-medium phonic order',
      desc: 'The vowel-first sequence used in Welsh-medium (cyfrwng Cymraeg) primary schools.',
      welsh: true,
      lang: 'cy',
      phases: [
        { name: 'Cam 1 · Llafariaid',   letters: ['a','e','i','o','u','w','y'],  blends: ['ai','ei','oi'] },
        { name: 'Cam 2 · Cytseiniaid A',letters: ['s','m','n','t','p','l','h'],  blends: ['sam','mam','ti','ni','pump'] },
        // Cam 3: only pre-Cam-4 letters. Removed cath (th) and gardd (dd) — both
        // require digraphs the child hasn't met yet. They now appear in Cam 4.
        { name: 'Cam 3 · Cytseiniaid B',letters: ['c','d','b','g','r','f'],      blends: ['bag','dad','mam','cig','car','pêl'] },
        // Cam 4 digraphs. j moved out — it's a borrowed letter, not a digraph.
        // cath and gardd now decodable here because th & dd are taught.
        { name: 'Cam 4 · Deugraffau',   letters: ['ff','ll','dd','ch','th'],     blends: ['ffôn','llaw','dydd','cath','gardd','thema'] },
        // Cam 5: special / borrowed characters. j belongs here.
        { name: 'Cam 5 · Nodweddion Arbennig', letters: ['rh','ng','ph','j'],     blends: ['rhaff','angel','phaser','jam'] }
      ]
    },
    // ============ Ireland ============
    {
      code: 'ireland', flag: '🇮🇪',
      name: 'Ireland · Aistear-aligned English phonics',
      desc: 'Play-based synthetic-phonics order used in most Republic of Ireland primary schools.',
      lang: 'en',
      phases: [
        { name: 'Sounds 1', letters: ['s','a','t','i','p','n'],        blends: ['sat','pin','tin','pit','an','it','sip','tap'] },
        { name: 'Sounds 2', letters: ['c','k','e','h','r','m','d'],    blends: ['cat','red','hat','mad','him','ken'] },
        { name: 'Sounds 3', letters: ['g','o','u','l','f','b'],        blends: ['dog','bug','fun','log','bag','fog'] },
        { name: 'Sounds 4', letters: ['j','v','w','x','y','z','qu'],   blends: ['jog','yes','box','win','zip'] },
        { name: 'Digraphs', letters: ['sh','ch','th','ng'],            blends: ['ship','chin','thin','sing'] }
      ]
    },
    // ============ Germany (Deutschland) ============
    {
      code: 'germany', flag: '🇩🇪',
      name: 'Deutschland · Fibel-Reihenfolge',
      desc: 'Standard Anlaut-Reihenfolge, wie sie in Grundschulen in Deutschland verwendet wird.',
      lang: 'de',
      phases: [
        // 'ala' isn't a German word; 'lama' uses only taught letters (m,a,l,o,e).
        { name: 'Stufe 1', letters: ['m','a','l','o','e'],        blends: ['mama','oma','lama'] },
        // was ['tim','ist','ist','nase'] — dedupe 'ist', add clean CVC/CVCC.
        { name: 'Stufe 2', letters: ['t','i','s','r','n'],        blends: ['tim','ist','stern','nase','insel'] },
        // 'fisch/dach/haus' preview sch/ch/au (Stufe 5). Replaced with words
        // built from letters already taught by Stufe 3 (u,w,f,d,h + earlier).
        { name: 'Stufe 3', letters: ['u','w','f','d','h'],        blends: ['uns','wir','wald','hund','wind'] },
        { name: 'Stufe 4', letters: ['k','b','z','g','p'],        blends: ['katze','ball','zebra','gans','papa'] },
        { name: 'Stufe 5 · Digraphen', letters: ['sch','ei','ch','au','eu'], blends: ['schule','ei','ich','auto','eule'] }
      ]
    },
    // ============ France ============
    {
      code: 'france', flag: '🇫🇷',
      name: 'France · Méthode syllabique',
      desc: "L'ordre d'apprentissage syllabique des sons utilisé au CP dans les écoles françaises.",
      lang: 'fr',
      phases: [
        // 'ou' is Étape 5 — removed from vowels list to avoid previewing.
        { name: 'Étape 1 · Voyelles',   letters: ['a','i','o','u','e'],  blends: ['ai','oi'] },
        // was ['la','ma','ta','papa','maman'] — 't' arrives Étape 3, 'an' arrives Étape 5.
        { name: 'Étape 2 · Consonnes 1',letters: ['l','r','m','s','p'],  blends: ['la','ma','ami','papa','sale'] },
        // was ['nid','vu','fée','avant'] — 'avant' has 'an' (Étape 5); 'fée'
        // carries diacritic é without dedicated audio. Replaced with clean CVC.
        { name: 'Étape 3 · Consonnes 2',letters: ['n','t','d','f','v'],  blends: ['nid','vu','vif','dent','fin'] },
        // was ['bébé','café','gâteau','joue','hibou'] — diacritic-heavy or
        // preview 'ou'. Replaced with taught-letter-only words.
        { name: 'Étape 4 · Consonnes 3',letters: ['b','c','g','j','h'],  blends: ['bal','cap','gare','jade','banal'] },
        { name: 'Étape 5 · Digrammes',  letters: ['ch','ou','on','an','in'], blends: ['chat','loup','pont','maman','lapin'] }
      ]
    },
    // Bilingual mode: registered here so it appears on every page's picker,
    // not just the one that happens to load lessons.js. Actual card content
    // lives in lessons.js (BilingualLessons). Phases stay empty because the
    // lesson set is a fixed, hand-authored comparison sequence.
    {
      code: 'bilingual', flag: '🌐',
      name: 'Bilingual · English + Cymraeg',
      desc: 'Teach both orthographies side by side. Same letter, two sounds — the way Welsh-medium households actually learn.',
      phases: []
    }
  ];

  // ----- German phoneme reference (Deutsch) ------------------------------
  const D = {
    a:  { sfx: 'a',  word: 'Affe',    emoji: '🐒', audio: 'de/a', wordAudio: 'de/words/affe' },
    b:  { sfx: 'b',  word: 'Ball',    emoji: '⚽', audio: 'de/b', wordAudio: 'de/words/ball' },
    // 'Clown' is /kl/, not /ts/. When German 'c' surfaces on its own it's
    // usually /ts/ before e/i (Cent, Cäsar). Use 'Cent' — an everyday word
    // whose 'c' unambiguously says /ts/.
    c:  { sfx: 'ts', word: 'Cent',    emoji: '💰', audio: 'de/c', wordAudio: 'de/words/cent' },
    // Dach previews 'ch' (Stufe 5). Use 'Dose' — taught letters only.
    d:  { sfx: 'd',  word: 'Dose',    emoji: '🎁', audio: 'de/d', wordAudio: 'de/words/dose' },
    e:  { sfx: 'e',  word: 'Elefant', emoji: '🐘', audio: 'de/e', wordAudio: 'de/words/elefant' },
    // Fisch previews 'sch' (Stufe 5). Use 'Fee' — taught letters only.
    f:  { sfx: 'f',  word: 'Fee',     emoji: '🧚', audio: 'de/f', wordAudio: 'de/words/fee' },
    g:  { sfx: 'g',  word: 'Gans',    emoji: '🪿', audio: 'de/g', wordAudio: 'de/words/gans' },
    // Haus previews 'au' (Stufe 5). Use 'Hund' — taught letters only.
    h:  { sfx: 'h',  word: 'Hund',    emoji: '🐕', audio: 'de/h', wordAudio: 'de/words/hund' },
    i:  { sfx: 'i',  word: 'Igel',    emoji: '🦔', audio: 'de/i', wordAudio: 'de/words/igel' },
    j:  { sfx: 'y',  word: 'Junge',   emoji: '👦', audio: 'de/j', wordAudio: 'de/words/junge' },
    k:  { sfx: 'k',  word: 'Katze',   emoji: '🐱', audio: 'de/k', wordAudio: 'de/words/katze' },
    l:  { sfx: 'l',  word: 'Lampe',   emoji: '💡', audio: 'de/l', wordAudio: 'de/words/lampe' },
    m:  { sfx: 'm',  word: 'Maus',    emoji: '🐭', audio: 'de/m', wordAudio: 'de/words/maus' },
    n:  { sfx: 'n',  word: 'Nase',    emoji: '👃', audio: 'de/n', wordAudio: 'de/words/nase' },
    o:  { sfx: 'o',  word: 'Ohr',     emoji: '👂', audio: 'de/o', wordAudio: 'de/words/ohr' },
    p:  { sfx: 'p',  word: 'Pferd',   emoji: '🐎', audio: 'de/p', wordAudio: 'de/words/pferd' },
    r:  { sfx: 'r',  word: 'Rose',    emoji: '🌹', audio: 'de/r', wordAudio: 'de/words/rose' },
    s:  { sfx: 's',  word: 'Sonne',   emoji: '☀️', audio: 'de/s', wordAudio: 'de/words/sonne' },
    t:  { sfx: 't',  word: 'Tisch',   emoji: '🪑', audio: 'de/t', wordAudio: 'de/words/tisch' },
    u:  { sfx: 'u',  word: 'Uhr',     emoji: '🕓', audio: 'de/u', wordAudio: 'de/words/uhr' },
    v:  { sfx: 'f',  word: 'Vogel',   emoji: '🐦', audio: 'de/v', wordAudio: 'de/words/vogel' },
    w:  { sfx: 'v',  word: 'Wasser',  emoji: '💧', audio: 'de/w', wordAudio: 'de/words/wasser' },
    x:  { sfx: 'ks', word: 'Xylophon',emoji: '🎹', audio: 'de/x', wordAudio: 'de/words/xylophon' },
    y:  { sfx: 'y',  word: 'Yacht',   emoji: '⛵', audio: 'de/y', wordAudio: 'de/words/yacht' },
    z:  { sfx: 'ts', word: 'Zebra',   emoji: '🦓', audio: 'de/z', wordAudio: 'de/words/zebra' },
    sch:{ sfx: 'sh', word: 'Schule',  emoji: '🏫', audio: 'de/sch', wordAudio: 'de/words/schule' },
    // 'Chemie' isn't age-5 vocabulary. 'Buch' (book) is common and gives the
    // clearest velar /x/ realisation of German <ch> after a back vowel.
    ch: { sfx: 'ch', word: 'Buch',    emoji: '📖', audio: 'de/ch',  wordAudio: 'de/words/buch' },
    ei: { sfx: 'ai', word: 'Ei',      emoji: '🥚', audio: 'de/ei',  wordAudio: 'de/words/ei' },
    // wordAudio was pointing at the phoneme clip (au/eu) not the example word.
    au: { sfx: 'au', word: 'Auto',    emoji: '🚗', audio: 'de/au',  wordAudio: 'de/words/auto' },
    eu: { sfx: 'oy', word: 'Eule',    emoji: '🦉', audio: 'de/eu',  wordAudio: 'de/words/eule' }
  };

  // ----- French phoneme reference (Français) -----------------------------
  const F = {
    a:  { sfx: 'a',  word: 'ami',     emoji: '👫', audio: 'fr/a', wordAudio: 'fr/words/ami' },
    b:  { sfx: 'b',  word: 'ballon',  emoji: '🎈', audio: 'fr/b', wordAudio: 'fr/words/ballon' },
    // Decodability fixes (reviewer audit):
    // - 'chat' begins with the 'ch' digraph /ʃ/, not /k/ → use 'carotte'.
    // - 'dent' ends in nasal /ɑ̃/ that isn't a taught grapheme → use 'dodo'.
    c:  { sfx: 'k',  word: 'carotte', emoji: '🥕', audio: 'fr/c', wordAudio: 'fr/words/carotte' },
    d:  { sfx: 'd',  word: 'dodo',    emoji: '😴', audio: 'fr/d', wordAudio: 'fr/words/dodo' },
    e:  { sfx: 'e',  word: 'école',  emoji: '🏫', audio: 'fr/e', wordAudio: 'fr/words/ecole' },
    f:  { sfx: 'f',  word: 'fleur',   emoji: '🌷', audio: 'fr/f', wordAudio: 'fr/words/fleur' },
    g:  { sfx: 'g',  word: 'gâteau',  emoji: '🍰', audio: 'fr/g', wordAudio: 'fr/words/gateau' },
    h:  { sfx: '',   word: 'hibou',   emoji: '🦉', audio: 'fr/h', wordAudio: 'fr/words/hibou' },
    i:  { sfx: 'i',  word: 'igloo',   emoji: '🧊', audio: 'fr/i', wordAudio: 'fr/words/igloo' },
    j:  { sfx: 'zh', word: 'jouet',   emoji: '🧸', audio: 'fr/j', wordAudio: 'fr/words/jouet' },
    k:  { sfx: 'k',  word: 'koala',   emoji: '🐨', audio: 'fr/k', wordAudio: 'fr/words/koala' },
    l:  { sfx: 'l',  word: 'livre',   emoji: '📘', audio: 'fr/l', wordAudio: 'fr/words/livre' },
    m:  { sfx: 'm',  word: 'maison',  emoji: '🏠', audio: 'fr/m', wordAudio: 'fr/words/maison' },
    n:  { sfx: 'n',  word: 'nid',     emoji: '🪹', audio: 'fr/n', wordAudio: 'fr/words/nid' },
    o:  { sfx: 'o',  word: 'orange',  emoji: '🍊', audio: 'fr/o', wordAudio: 'fr/words/orange' },
    p:  { sfx: 'p',  word: 'papa',    emoji: '👨', audio: 'fr/p', wordAudio: 'fr/words/papa' },
    // 'reine' has non-taught 'ei' → use 'rat'. 'soleil' has non-taught 'eil'
    // → use 'sac'. Both are clean, high-frequency CVC/CV words.
    r:  { sfx: 'r',  word: 'rat',     emoji: '🐀', audio: 'fr/r', wordAudio: 'fr/words/rat' },
    s:  { sfx: 's',  word: 'sac',     emoji: '🎒', audio: 'fr/s', wordAudio: 'fr/words/sac' },
    t:  { sfx: 't',  word: 'tortue',  emoji: '🐢', audio: 'fr/t', wordAudio: 'fr/words/tortue' },
    u:  { sfx: 'u',  word: 'une',     emoji: '1️⃣', audio: 'fr/u', wordAudio: 'fr/words/une' },
    v:  { sfx: 'v',  word: 'vache',   emoji: '🐄', audio: 'fr/v', wordAudio: 'fr/words/vache' },
    w:  { sfx: 'v',  word: 'wagon',   emoji: '🚃', audio: 'fr/w', wordAudio: 'fr/words/wagon' },
    x:  { sfx: 'ks', word: 'xylophone',emoji:'🎹', audio: 'fr/x', wordAudio: 'fr/words/xylophone' },
    y:  { sfx: 'i',  word: 'yaourt',  emoji: '🍧', audio: 'fr/y', wordAudio: 'fr/words/yaourt' },
    z:  { sfx: 'z',  word: 'zèbre',   emoji: '🦓', audio: 'fr/z', wordAudio: 'fr/words/zebre' },
    // Every digraph wordAudio was pointing at its phoneme clip, not the
    // example word displayed on the card. Repointed so Meet plays the word.
    ch: { sfx: 'sh', word: 'chat',    emoji: '🐱', audio: 'fr/ch', wordAudio: 'fr/words/chat' },
    ou: { sfx: 'oo', word: 'loup',    emoji: '🐺', audio: 'fr/ou', wordAudio: 'fr/words/loup' },
    on: { sfx: 'on', word: 'pont',    emoji: '🌉', audio: 'fr/on', wordAudio: 'fr/words/pont' },
    an: { sfx: 'an', word: 'maman',   emoji: '👩', audio: 'fr/an', wordAudio: 'fr/words/maman' },
    in: { sfx: 'in', word: 'lapin',   emoji: '🐇', audio: 'fr/in', wordAudio: 'fr/words/lapin' }
  };

  // Also attach a wordAudio hint to English + Welsh entries so the Meet step can play the example word.
  for (const k of Object.keys(P)) {
    P[k].wordAudio = 'en/words/' + P[k].word.replace(/-/g, '').toLowerCase();
  }
  for (const k of Object.keys(W)) {
    W[k].wordAudio = 'cy/words/' + W[k].word
      .replace(/ê/g,'e').replace(/â/g,'a').replace(/ô/g,'o').replace(/ŵ/g,'w').replace(/ŷ/g,'y').replace(/é/g,'e').toLowerCase();
  }

  // Curriculum → phoneme map lookup
  function phonicsMap(code) {
    if (code === 'welsh') return W;
    if (code === 'germany') return D;
    if (code === 'france') return F;
    return P;
  }

  // Returns { letters:[], blends:[] } filtered by the user's current level.
  // Each level unlocks the next phase. Level 1 = Phase 1 only; Level 2 = phases 1-2; etc.
  window.getCurriculum = function () {
    const code = (window.StarSettings && window.StarSettings.curriculum) || 'england';
    return window.StarCurriculums.find(c => c.code === code) || window.StarCurriculums[0];
  };
  window.getPhonemeMap = function () {
    return phonicsMap((window.StarSettings && window.StarSettings.curriculum) || 'england');
  };
  window.getPhonics = function () { return window.getPhonemeMap(); };

  // Ordered list of letters/digraphs available up to the child's current level.
  // Level 1 unlocks Phase 1 only; each further level unlocks the next phase.
  window.getUnlockedLetters = function () {
    const c = window.getCurriculum();
    // Bilingual mode has no phases (hand-authored lesson set). Derive a
    // sensible letter list from the BilingualLessons content when present,
    // otherwise fall back to the base English alphabet + Welsh digraphs.
    if (c && c.code === 'bilingual') {
      const set = new Set();
      const src = (window.BilingualLessons || []);
      src.forEach(L => {
        if (L && L.g) set.add(String(L.g).toLowerCase());
        if (L && L.en && L.en.g) set.add(String(L.en.g).toLowerCase());
        if (L && L.cy && L.cy.g) set.add(String(L.cy.g).toLowerCase());
      });
      if (set.size) return Array.from(set);
      return ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','ch','dd','ff','ll','ng','ph','rh','th'];
    }
    const lvl = Math.max(1, (window.StarSettings && window.StarSettings.level) || 1);
    const unlocked = [];
    (c.phases || []).slice(0, lvl).forEach(ph => (ph.letters || []).forEach(l => unlocked.push(l)));
    return unlocked;
  };

  // All letters, ordered by phase (used for progress views).
  window.getAllOrdered = function () {
    const c = window.getCurriculum();
    if (c && c.code === 'bilingual') {
      // Alphabet view for bilingual mode: same synthetic list as unlocked.
      return window.getUnlockedLetters();
    }
    const all = [];
    (c.phases || []).forEach(ph => (ph.letters || []).forEach(l => all.push(l)));
    return all;
  };

  // Full alphabet fallback for reading tab display (all letters shown, but flagged as locked/unlocked)
  window.getAlphabet = function () {
    return window.getAllOrdered();
  };

  // Decodable words up to current level.
  window.getUnlockedWords = function () {
    const c = window.getCurriculum();
    if (c && c.code === 'bilingual') {
      // Pull the recorded example words from BilingualLessons so free
      // practice on the bilingual curriculum never renders a blank grid.
      const set = new Set();
      const src = (window.BilingualLessons || []);
      src.forEach(L => {
        if (L && L.word) set.add(String(L.word).toLowerCase());
        if (L && L.en && L.en.word) set.add(String(L.en.word).toLowerCase());
        if (L && L.cy && L.cy.word) set.add(String(L.cy.word).toLowerCase());
      });
      if (set.size) return Array.from(set);
      return ['cat','mam','sat','sut','pin','pen'];
    }
    const lvl = Math.max(1, (window.StarSettings && window.StarSettings.level) || 1);
    const words = [];
    (c.phases || []).slice(0, lvl).forEach(ph => (ph.blends || []).forEach(w => words.push(w)));
    return words;
  };

  // Given a written word, return its phoneme breakdown from current phoneme map.
  // Handles digraphs greedily (ch, sh, th, ng, ll, ff, dd, ph, rh + qu).
  window.segmentWord = function (word) {
    const map = window.getPhonemeMap();
    const digraphs = Object.keys(map).filter(k => k.length === 2 || k.length === 3);
    const w = word.toLowerCase();
    const result = [];
    let i = 0;
    while (i < w.length) {
      let matched = null;
      // Try longest digraph first
      for (const d of digraphs.sort((a,b) => b.length - a.length)) {
        if (w.slice(i, i + d.length) === d) { matched = d; break; }
      }
      if (matched) { result.push(matched); i += matched.length; }
      else { result.push(w[i]); i++; }
    }
    return result;
  };

  // ---- Ansteyapps language options (storefront translations) ----
  window.StarLangs = [
    { code: 'en', label: 'English',    flag: '🇬🇧' },
    { code: 'cy', label: 'Cymraeg',    flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
    { code: 'de', label: 'Deutsch',    flag: '🇩🇪' },
    { code: 'fr', label: 'Français',   flag: '🇫🇷' },
    { code: 'es', label: 'Español',    flag: '🇪🇸' },
    { code: 'it', label: 'Italiano',   flag: '🇮🇹' },
    { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
    { code: 'pt', label: 'Português',  flag: '🇵🇹' },
    { code: 'pl', label: 'Polski',     flag: '🇵🇱' },
    { code: 'sv', label: 'Svenska',    flag: '🇸🇪' }
  ];
})();
