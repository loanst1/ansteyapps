/* lessons.js — StarLetters lesson sets
 * Each lesson closes the loop: Meet → Sound → Blend → Write → Star.
 * A lesson is a { grapheme, exampleWord, emoji } — or a bilingual contrast card
 * { bilingual: true, grapheme, en: {…}, cy: {…} } that teaches the same letter
 * with two orthographies side by side.
 */

const LessonSets = {
  england: [
    { g:'s', word:'sat', emoji:'😺' },
    { g:'a', word:'am',  emoji:'🍎' },
    { g:'t', word:'top', emoji:'🎩' },
    { g:'p', word:'pat', emoji:'🐶' },
    { g:'i', word:'in',  emoji:'🏠' },
    { g:'n', word:'nap', emoji:'😴' },
    { g:'m', word:'mat', emoji:'🧎' },
    { g:'d', word:'dad', emoji:'👨' },
    { g:'g', word:'got', emoji:'🎁' },
    { g:'o', word:'on',  emoji:'🔛' },
    { g:'c', word:'cat', emoji:'🐱' },
    { g:'k', word:'kit', emoji:'🧰' },
    { g:'ck',word:'kick',emoji:'⚽'  },
    { g:'e', word:'egg', emoji:'🥚' },
    { g:'u', word:'up',  emoji:'⬆️' },
    { g:'r', word:'run', emoji:'🏃' },
    { g:'h', word:'hop', emoji:'🐰' },
    { g:'b', word:'bat', emoji:'🦇' },
    { g:'f', word:'fun', emoji:'🎉' },
    { g:'l', word:'log', emoji:'🪵' },
    { g:'j', word:'jam', emoji:'🍓' },
    { g:'v', word:'van', emoji:'🚐' },
    { g:'w', word:'wet', emoji:'💧' },
    { g:'x', word:'box', emoji:'📦' },
    { g:'y', word:'yes', emoji:'👍' },
    { g:'z', word:'zip', emoji:'🤐' },
    { g:'ch',word:'chip',emoji:'🍟' },
    { g:'sh',word:'shop',emoji:'🏪' },
    // Voiced /ð/ ('this') would clash with the unvoiced /θ/ chip clip — use
    // 'thin' which matches the recorded en/th (unvoiced) and has an on-disk
    // blend take in audio/en/blends/thin.mp3.
    { g:'th',word:'thin',emoji:'🥢' },
    { g:'ng',word:'ring',emoji:'💍' }
  ],
  scotland: [
    { g:'s', word:'sat', emoji:'😺' },
    { g:'a', word:'am',  emoji:'🍎' },
    { g:'t', word:'top', emoji:'🎩' },
    { g:'i', word:'in',  emoji:'🏠' },
    { g:'p', word:'pin', emoji:'📌' },
    { g:'n', word:'nap', emoji:'😴' },
    { g:'c', word:'cat', emoji:'🐱' },
    { g:'k', word:'kit', emoji:'🧰' },
    { g:'e', word:'egg', emoji:'🥚' },
    { g:'h', word:'hop', emoji:'🐰' },
    { g:'r', word:'run', emoji:'🏃' },
    { g:'m', word:'mum', emoji:'👩' },
    { g:'d', word:'dad', emoji:'👨' },
    { g:'g', word:'got', emoji:'🎁' },
    { g:'o', word:'on',  emoji:'🔛' },
    { g:'l', word:'log', emoji:'🪵' },
    { g:'f', word:'fun', emoji:'🎉' },
    { g:'b', word:'bat', emoji:'🦇' },
    { g:'sh',word:'ship',emoji:'🚢' },
    { g:'ch',word:'chip',emoji:'🍟' }
  ],
  wales: [
    { g:'s', word:'sat', emoji:'😺' },
    { g:'a', word:'am',  emoji:'🍎' },
    { g:'t', word:'top', emoji:'🎩' },
    { g:'p', word:'pin', emoji:'📌' },
    { g:'i', word:'in',  emoji:'🏠' },
    { g:'n', word:'nap', emoji:'😴' },
    { g:'m', word:'mat', emoji:'🧎' },
    { g:'d', word:'dad', emoji:'👨' },
    { g:'o', word:'on',  emoji:'🔛' },
    { g:'c', word:'cat', emoji:'🐱' },
    { g:'e', word:'egg', emoji:'🥚' },
    { g:'r', word:'red', emoji:'🔴' },
    { g:'h', word:'hop', emoji:'🐰' },
    { g:'b', word:'bat', emoji:'🦇' },
    { g:'f', word:'fun', emoji:'🎉' },
    { g:'l', word:'log', emoji:'🪵' }
  ],
  nireland: [
    { g:'s', word:'sat', emoji:'😺' },
    { g:'a', word:'am',  emoji:'🍎' },
    { g:'t', word:'top', emoji:'🎩' },
    { g:'i', word:'in',  emoji:'🏠' },
    { g:'p', word:'pin', emoji:'📌' },
    { g:'n', word:'nap', emoji:'😴' },
    { g:'c', word:'cat', emoji:'🐱' },
    { g:'e', word:'egg', emoji:'🥚' },
    { g:'h', word:'hop', emoji:'🐰' },
    { g:'r', word:'run', emoji:'🏃' },
    { g:'m', word:'mum', emoji:'👩' },
    { g:'d', word:'dad', emoji:'👨' },
    { g:'g', word:'got', emoji:'🎁' },
    { g:'o', word:'on',  emoji:'🔛' }
  ],
  welsh: [
    { g:'a', word:'am',  emoji:'🍎' },
    { g:'i', word:'ci',  emoji:'🐶' },
    { g:'o', word:'os',  emoji:'❓' },
    { g:'u', word:'un',  emoji:'1️⃣' },
    { g:'e', word:'egni',emoji:'⚡' },
    { g:'m', word:'mam', emoji:'👩' },
    { g:'t', word:'tad', emoji:'👨' },
    { g:'s', word:'sut', emoji:'❓' },
    { g:'d', word:'dol', emoji:'🪆' },
    { g:'l', word:'lôn', emoji:'🛣️' },
    { g:'n', word:'nain',emoji:'👵' },
    { g:'p', word:'pen', emoji:'✏️' },
    { g:'r', word:'ras', emoji:'🏃' },
    { g:'b', word:'bag', emoji:'🎒' },
    { g:'c', word:'cae', emoji:'🌾' },
    { g:'g', word:'gêm', emoji:'🎮' },
    { g:'h', word:'haf', emoji:'☀️' },
    { g:'f', word:'fy',  emoji:'👤' },
    { g:'ff',word:'fferm',emoji:'🚜' },
    { g:'ll',word:'llaw',emoji:'✋' },
    { g:'dd',word:'dydd',emoji:'📅' },
    { g:'ch',word:'chwe',emoji:'6️⃣' },
    { g:'ng',word:'angel',emoji:'👼' },
    { g:'th',word:'thema',emoji:'🎭' }
  ],
  ireland: [
    // Aistear-style s-a-t-i-p-n order, Irish English keywords.
    { g:'s', word:'sun', emoji:'☀️' },
    { g:'a', word:'ant', emoji:'🐜' },
    { g:'t', word:'top', emoji:'🎩' },
    { g:'i', word:'in',  emoji:'➡️' },
    { g:'p', word:'pup', emoji:'🐶' },
    { g:'n', word:'net', emoji:'🥅' },
    { g:'c', word:'cat', emoji:'🐱' },
    { g:'e', word:'egg', emoji:'🥚' },
    { g:'h', word:'hop', emoji:'🐇' },
    { g:'r', word:'run', emoji:'🏃' },
    { g:'m', word:'mam', emoji:'👩' },
    { g:'d', word:'dad', emoji:'👨' }
  ],
  germany: [
    // Fibel-Reihenfolge, gebräuchliche Reihenfolge deutscher Grundschulen.
    { g:'m', word:'Mama',    emoji:'👩' },
    { g:'a', word:'Affe',    emoji:'🐒' },
    { g:'l', word:'Lampe',   emoji:'💡' },
    { g:'o', word:'Ohr',     emoji:'👂' },
    { g:'e', word:'Elefant', emoji:'🐘' },
    { g:'t', word:'Tisch',   emoji:'🪑' },
    { g:'i', word:'Igel',    emoji:'🦔' },
    { g:'s', word:'Sonne',   emoji:'☀️' },
    { g:'r', word:'Rose',    emoji:'🌹' },
    { g:'n', word:'Nase',    emoji:'👃' },
    { g:'u', word:'Uhr',     emoji:'🕓' },
    { g:'w', word:'Wasser',  emoji:'💧' },
    // Fisch/Dach/Haus previewed 'sch'/'ch'/'au' before those digraphs were
    // taught (Stufe 5). Swapped for words built from letters taught by Stufe 3.
    { g:'f', word:'Fee',     emoji:'🧚' },
    { g:'d', word:'Dose',    emoji:'🎁' },
    { g:'h', word:'Hund',    emoji:'🐕' },
    { g:'k', word:'Katze',   emoji:'🐱' },
    { g:'b', word:'Ball',    emoji:'⚽' },
    { g:'z', word:'Zebra',   emoji:'🦓' },
    { g:'g', word:'Gans',    emoji:'🪿' },
    { g:'p', word:'Papa',    emoji:'👨' }
  ],
  france: [
    // Méthode syllabique CP — voyelles d'abord.
    { g:'a', word:'ami',    emoji:'👫' },
    { g:'i', word:'igloo',  emoji:'🧊' },
    { g:'o', word:'orange', emoji:'🍊' },
    { g:'u', word:'une',    emoji:'1️⃣' },
    { g:'e', word:'école',  emoji:'🏫' },
    { g:'l', word:'livre',  emoji:'📘' },
    { g:'r', word:'rat',    emoji:'🐀' },
    { g:'m', word:'maison', emoji:'🏠' },
    { g:'s', word:'sac',    emoji:'🎒' },
    { g:'p', word:'papa',   emoji:'👨' },
    { g:'n', word:'nid',    emoji:'🪹' },
    { g:'t', word:'tortue', emoji:'🐢' },
    { g:'d', word:'dodo',   emoji:'😴' },
    { g:'f', word:'fleur',  emoji:'🌷' },
    { g:'v', word:'vache',  emoji:'🐄' },
    { g:'b', word:'ballon', emoji:'🎈' },
    { g:'c', word:'carotte',emoji:'🥕' },
    { g:'g', word:'gâteau', emoji:'🍰' },
    { g:'j', word:'jouet',  emoji:'🧸' },
    { g:'h', word:'hibou',  emoji:'🦉' }
  ]
};

/* Bilingual contrast set — the moat.
 * Cards teach the same letter with two orthographies side by side, and the
 * Welsh-only graphemes explicitly. This is the first phonics set anywhere to
 * treat English + Cymraeg as one interleaved orthography study.
 */
const BilingualLessons = [
  // Shared letters where the sound is nearly the same — foundation
  { g:'a', word:'am',  emoji:'🍎', note:'Same sound in both languages.', both:true },
  { g:'m', word:'mam', emoji:'👩', note:'"mam" means mum in Cymraeg.',  both:true },
  { g:'t', word:'top', emoji:'🎩', note:'Same short /t/ in both.',       both:true },
  // 'sam' isn't a standard Welsh word for sandwich (brechdan is). Use 'sut'
  // (how) — clean CVC, works as a shared teaching word for the /s/ sound.
  { g:'s', word:'sut', emoji:'❓', note:'Same /s/ in both languages. "sut" means "how" in Cymraeg.', both:true },

  // The interesting contrasts — same letter, different sound
  { g:'f', bilingual:true,
    en:{ sound:'/f/', word:'fun', emoji:'🎉', example:'fish, fun, four' },
    cy:{ sound:'/v/', word:'fy',  emoji:'👤', example:'fy, fydd, fory' },
    lesson:'The letter f says two different sounds. In English it hisses like a cat. In Welsh it hums like a bee.'
  },
  { g:'u', bilingual:true,
    en:{ sound:'/ʌ/', word:'up',  emoji:'⬆️', example:'up, cup, sun' },
    cy:{ sound:'/ɨ/', word:'un',  emoji:'1️⃣', example:'un, dau, tri' },
    lesson:'In English u sounds like the u in "up". In Welsh u sounds like the ee in "see".'
  },
  { g:'w', bilingual:true,
    en:{ sound:'/w/', word:'wet', emoji:'💧', example:'wet, win, warm' },
    cy:{ sound:'/u/', word:'cwm', emoji:'⛰️', example:'cwm, dwr, mwd' },
    lesson:'In English w is at the start of a word. In Welsh w can be a vowel that says "oo".'
  },
  { g:'y', bilingual:true,
    en:{ sound:'/j/', word:'yes', emoji:'👍', example:'yes, yak, yard' },
    cy:{ sound:'/ə/', word:'y',   emoji:'📎', example:'y, yn, yr' },
    lesson:'y in English is a consonant. In Welsh y is a vowel that often says "uh".'
  },

  // Welsh-only graphemes — explicit teaching
  { g:'ll', welshOnly:true, word:'llaw', emoji:'✋',
    lesson:'ll is a special Welsh letter. Put your tongue behind your teeth and blow — like a hissing snake.',
    sound:'/ɬ/'
  },
  { g:'dd', welshOnly:true, word:'dydd', emoji:'📅',
    lesson:'dd is one Welsh letter that says "th" as in "this".',
    sound:'/ð/'
  },
  { g:'ff', welshOnly:true, word:'fferm', emoji:'🚜',
    lesson:'ff is the Welsh way to spell the /f/ sound. Single f in Welsh says /v/.',
    sound:'/f/'
  },
  { g:'ch', bilingual:true,
    en:{ sound:'/tʃ/', word:'chip', emoji:'🍟', example:'chip, chin, church' },
    cy:{ sound:'/χ/',  word:'chwech', emoji:'6️⃣', example:'chwech, bach, coch' },
    lesson:'ch in English says "ch" like chip. In Welsh ch says a scratchy sound at the back of your throat.'
  },
  { g:'ng', bilingual:true,
    en:{ sound:'/ŋ/', word:'ring', emoji:'💍', example:'ring, sing, song' },
    cy:{ sound:'/ŋ/', word:'angel',emoji:'👼', example:'angel, canghellor' },
    lesson:'ng sounds the same in both — the humming sound at the end of "ring".'
  },
  { g:'th', bilingual:true,
    en:{ sound:'/θ/', word:'thin', emoji:'🥢', example:'thin, thumb, three' },
    cy:{ sound:'/θ/', word:'thema',emoji:'🎭', example:'thema, athro' },
    lesson:'th sounds nearly the same in both — the buzzy sound between your teeth.'
  }
];

/* Public API */
function getLessonSet() {
  const code = (typeof StarSettings !== 'undefined') ? StarSettings.curriculum : 'england';
  if (code === 'bilingual') return BilingualLessons;
  return LessonSets[code] || LessonSets.england;
}

function getLesson(index) {
  const set = getLessonSet();
  return set[index % set.length];
}

function totalLessons() {
  return getLessonSet().length;
}

// Bilingual entry is now registered in curriculum.js so every page's picker
// sees it (was previously only visible on the lesson screen).
