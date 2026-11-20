// Deck content: Game Arena (Junior High School, general subjects)
module.exports = {
  out: "Game_Arena_Interactive.pptx",
  meta: {
    title: "Game Arena: Interactive Classroom Games",
    subject: "Gamified interactive quiz games para sa high school",
    titleA: "GAME ", titleB: "ARENA",
    subtitle: "5 interactive na laro para sa high school \u2014 Science, Math, Kasaysayan, English at Filipino",
  },
  theme: {
    name: "Game Arena", headFontFace: "Arial", bodyFontFace: "Calibri",
    colors: {
      dk1: "14102E", lt1: "FFFFFF", dk2: "1E1650", lt2: "C9BBFF",
      accent1: "FFC83D", accent2: "FF4F8B", accent3: "21D4B4",
      accent4: "FF8A3D", accent5: "2ED573", accent6: "FF4757",
      hlink: "FFC83D", folHlink: "C9BBFF",
    },
  },
  QB: {
  cats: [
    { name: "Science", icon: "FaFlask", qs: [
      ["Ano ang tinatawag na “powerhouse of the cell”?", "Mitochondria"],
      ["Ano ang chemical formula ng tubig?", "H₂O"],
      ["Anong planeta ang may pinakamaraming kilalang buwan (moons)?", "Saturn"],
    ] },
    { name: "Math", icon: "FaCalculator", qs: [
      ["Ano ang halaga ng 3² + 4²?", "25"],
      ["Solve for x:  2x + 5 = 17", "x = 6"],
      ["Ano ang area ng bilog na may radius na 7 cm? (Gamitin ang π ≈ 22/7)", "154 cm²"],
    ] },
    { name: "Kasaysayan", icon: "FaLandmark", qs: [
      ["Sino ang sumulat ng nobelang “Noli Me Tángere”?", "Dr. José Rizal"],
      ["Kailan idineklara ang kalayaan ng Pilipinas sa Kawit, Cavite?", "Hunyo 12, 1898"],
      ["Sino ang tinaguriang “Utak ng Katipunan”?", "Emilio Jacinto"],
    ] },
    { name: "English", icon: "FaBook", qs: [
      ["What is the plural form of the word “child”?", "Children"],
      ["Identify the figure of speech:  “The wind whispered through the trees.”", "Personification"],
      ["What is the antonym of “benevolent”?", "Malevolent"],
    ] },
  ],
  pts: [100, 200, 300],
  },
  MC: [
  { q: "Ano ang pinakamalaking karagatan sa mundo?", opts: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"], a: 2, why: "Ang Pacific Ocean ay sumasakop ng halos one-third ng ibabaw ng Earth." },
  { q: "Which part of speech describes a noun?", opts: ["Verb", "Adjective", "Adverb", "Preposition"], a: 1, why: "Adjectives describe nouns — e.g. “masipag na estudyante,” “a tall tree.”" },
  { q: "Ano ang pambansang wika ng Pilipinas ayon sa 1987 Konstitusyon?", opts: ["Tagalog", "Filipino", "Ingles", "Cebuano"], a: 1, why: "Artikulo XIV, Seksyon 6: “Ang wikang pambansa ng Pilipinas ay Filipino.”" },
  { q: "What is 15% of 200?", opts: ["15", "20", "30", "45"], a: 2, why: "0.15 × 200 = 30" },
  { q: "Anong gas ang kailangan ng halaman para sa photosynthesis?", opts: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"], a: 2, why: "Gumagamit ang halaman ng carbon dioxide, tubig at sikat ng araw para gumawa ng glucose." },
  ],
  TF: [
  { s: "Ang Mount Apo ang pinakamataas na bundok sa Pilipinas.", t: true, why: "Tama! Ang Mount Apo sa Mindanao ay may taas na humigit-kumulang 2,954 metro." },
  { s: "Sound travels faster in air than in water.", t: false, why: "Mas mabilis ang tunog sa tubig (~1,480 m/s) kaysa sa hangin (~343 m/s)." },
  { s: "Ang 0 ay isang even number.", t: true, why: "Ang 0 ay divisible by 2 (0 ÷ 2 = 0), kaya even number ito." },
  { s: "Si Andres Bonifacio ang unang pangulo ng Pilipinas.", t: false, why: "Si Emilio Aguinaldo ang unang pangulo. Si Bonifacio ang “Supremo” ng Katipunan." },
  { s: "The human heart has four chambers.", t: true, why: "Dalawang atrium at dalawang ventricle ang bumubuo sa puso ng tao." },
  ],
  JW: [
  { hint: "Science: Proseso kung saan gumagawa ng sariling pagkain ang halaman", jumble: "TOHSYPSINEHOTS", word: "PHOTOSYNTHESIS" },
  { hint: "Math: Hugis na may tatlong gilid at tatlong anggulo", jumble: "GNARLITE", word: "TRIANGLE" },
  { hint: "Araling Panlipunan: Kabisera ng Pilipinas", jumble: "LAYNIMA", word: "MAYNILA" },
  { hint: "English: A word that means “extremely happy”", jumble: "TICSTACE", word: "ECSTATIC" },
  { hint: "Filipino: Pambansang ibon ng Pilipinas (5 letra)", jumble: "LAIGA", word: "AGILA" },
  ],
  MB: [
  { kind: "q", subj: "Science", q: "Ilang buto mayroon ang katawan ng isang adult na tao?", a: "206 na buto" },
  { kind: "s", title: "BONUS!", msg: "+200 puntos agad sa inyong team — walang tanong!", good: true },
  { kind: "q", subj: "Math", q: "Ano ang susunod na numero?   2, 6, 12, 20, 30, ___", a: "42", why: "Ang pagitan ay 4, 6, 8, 10 … kaya +12" },
  { kind: "q", subj: "English", q: "What do you call words that sound the same but have different meanings (e.g. “sea” and “see”)?", a: "Homophones" },
  { kind: "s", title: "OOPS!", msg: "Ibigay ang 100 puntos ng inyong team sa team na pipiliin ninyo!", good: false },
  { kind: "q", subj: "Araling Panlipunan", q: "Ano ang tawag sa sinaunang sistema ng pagsulat ng mga Pilipino?", a: "Baybayin" },
  ],

  GAMES: [
  { id: "qb", name: "QUIZ BOARD", title: "Quiz Board", card: "QUIZ BOARD", icon: "FaThLarge", col: "yellow", desc: "Pumili ng kategorya at puntos", pts: "100–300 bawat tanong",
    how: ["Pipili ang team ng kategorya at puntos sa board", "Sagutin ang tanong sa loob ng 30 segundo", "Tama = makukuha ang puntos ng tile", "Mali = may pagkakataong sumagot ang ibang team"] },
  { id: "mc", name: "PILIIN ANG SAGOT", title: "Piliin ang Sagot", card: "PILIIN ANG\nSAGOT", icon: "FaListOl", col: "pink", desc: "Multiple choice, i-click ang sagot", pts: "100 bawat tamang sagot",
    how: ["Basahin ang tanong at ang apat na pagpipilian", "I-click ang napiling sagot (A, B, C o D)", "Tama = 100 puntos at susunod na tanong", "Mali = subukan muli ng ibang team"] },
  { id: "tf", name: "TAMA O MALI", title: "Tama o Mali", card: "TAMA O MALI", icon: "FaBalanceScale", col: "teal", desc: "Totoo ba o hindi?", pts: "50 bawat tamang sagot",
    how: ["Basahin nang malakas ang pahayag", "Magbotohan ang team: TAMA o MALI", "I-click ang napiling button", "Alamin ang paliwanag sa bawat sagot"] },
  { id: "jw", name: "AYUSIN ANG LETRA", title: "Ayusin ang Letra", card: "AYUSIN ANG\nLETRA", icon: "FaPuzzlePiece", col: "orange", desc: "Buuin ang salita mula sa hint", pts: "150 bawat salita",
    how: ["Basahin ang hint sa itaas", "Ayusin ang mga letra para mabuo ang salita", "Unang team na makasagot nang tama ang panalo", "I-click ang “Ipakita ang Sagot” para i-check"] },
  { id: "mb", name: "MYSTERY BOX", title: "Mystery Box", card: "MYSTERY BOX", icon: "FaGift", col: "lilac", desc: "Anong nasa loob ng kahon?", pts: "200 bawat tanong + sorpresa",
    how: ["Pipili ang team ng numero ng kahon", "May tanong, BONUS, o OOPS sa loob", "Tama ang sagot = 200 puntos", "Tandaan ang mga kahong nabuksan na"] },
  ],
};
