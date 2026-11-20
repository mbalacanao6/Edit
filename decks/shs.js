// Deck content: SHS Showdown (Senior High School, Grade 11-12 core subjects)
module.exports = {
  out: "SHS_Showdown_Interactive.pptx",
  meta: {
    title: "SHS Showdown: Interactive Classroom Games",
    subject: "Gamified interactive quiz games para sa Senior High School",
    titleA: "SHS ", titleB: "SHOWDOWN",
    subtitle: "5 interactive na laro para sa Grade 11 at 12 — mula sa mga SHS core subject",
  },
  theme: {
    name: "SHS Showdown", headFontFace: "Arial", bodyFontFace: "Calibri",
    colors: {
      dk1: "0B1F1D", lt1: "FFFFFF", dk2: "0E2F2C", lt2: "BFEADF",
      accent1: "FFC83D", accent2: "FF4F8B", accent3: "21D4B4",
      accent4: "FF8A3D", accent5: "2ED573", accent6: "FF4757",
      hlink: "FFC83D", folHlink: "BFEADF",
    },
  },

  QB: {
    cats: [
      { name: "Gen Math", icon: "FaCalculator", qs: [
        ["Kung f(x) = 2x + 3, ano ang f(4)?", "11"],
        ["Ano ang simple interest ng ₱10,000 sa 5% bawat taon sa loob ng 3 taon?", "₱1,500"],
        ["Ano ang inverse ng function na f(x) = 3x − 6?", "f⁻¹(x) = (x + 6) / 3"],
      ] },
      { name: "Stat & Prob", icon: "FaChartBar", qs: [
        ["Ano ang mean ng 4, 8, 6, 10 at 12?", "8"],
        ["Sa normal distribution, humigit-kumulang ilang porsyento ng data ang nasa loob ng ±1 standard deviation mula sa mean?", "Mga 68%"],
        ["Ilang paraan ang pagpili ng 2 lider mula sa 5 estudyante kung hindi mahalaga ang pagkakasunod? (₅C₂)", "10"],
      ] },
      { name: "Science", icon: "FaGlobeAsia", qs: [
        ["Anong layer ng Earth ang pinakalabas at kung saan tayo nakatira?", "Crust"],
        ["Anong uri ng plate boundary ang nabubuo kapag naghihiwalay ang dalawang tectonic plates?", "Divergent"],
        ["Ano ang tawag sa proseso kung saan kinokopya ang DNA para makabuo ng mRNA?", "Transcription"],
      ] },
      { name: "Komunikasyon", icon: "FaComments", qs: [
        ["Ano ang tawag sa wikang unang natutunan ng isang bata mula pagkasilang?", "Unang Wika (L1)"],
        ["In the communication process, what do you call the receiver’s response to the message?", "Feedback"],
        ["Ano ang tawag sa barayti ng wika na ginagamit sa isang partikular na larangan o propesyon (hal. wika ng mga doktor)?", "Register"],
      ] },
    ],
    pts: [100, 200, 300],
  },

  CL: [
    { subj: "Introduction to Philosophy / UCSP", clues: [
      "Isa akong pilosopo at ekonomistang Aleman noong ika-19 na siglo.",
      "Sinulat ko ang aklat na “Das Kapital.”",
      "Kasama si Friedrich Engels, isinulat ko ang “The Communist Manifesto.”",
    ], a: "Karl Marx" },
    { subj: "Empowerment Technologies / MIL", clues: [
      "Isa akong uri ng cyber attack.",
      "Madalas akong dumating bilang pekeng email o text na mukhang galing sa bangko.",
      "Layunin kong nakawin ang password at personal na impormasyon mo.",
    ], a: "Phishing" },
    { subj: "Earth and Life Science", clues: [
      "Nawala na ako mga 200 milyong taon na ang nakalipas.",
      "Ako ay isang napakalaking landmass na napapalibutan ng iisang karagatan.",
      "Ayon kay Alfred Wegener, ako ang supercontinent na nahati at bumuo sa mga kontinente ngayon.",
    ], a: "Pangaea" },
    { subj: "Entrepreneurship", clues: [
      "Ginagamit ako sa pagpaplano ng negosyo.",
      "Apat ang bahagi ko: dalawang internal at dalawang external.",
      "Strengths, Weaknesses, Opportunities at Threats.",
    ], a: "SWOT Analysis" },
    { subj: "Personal Development", clues: [
      "Isa akong teorya sa sikolohiya tungkol sa motibasyon ng tao.",
      "Madalas akong iguhit bilang isang pyramid.",
      "Physiological needs ang nasa ibaba ko at self-actualization ang nasa tuktok.",
    ], a: "Maslow’s Hierarchy of Needs" },
  ],

  MC: [
    { q: "Sino ang pilosopong nagsabing “The unexamined life is not worth living”?", opts: ["Plato", "Aristotle", "Socrates", "René Descartes"], a: 2, why: "Sinabi ito ni Socrates sa kanyang paglilitis, ayon sa “Apology” ni Plato." },
    { q: "Anong uri ng pananaliksik ang gumagamit ng numerical data at statistical analysis?", opts: ["Qualitative", "Quantitative", "Narrative", "Ethnography"], a: 1, why: "Ang quantitative research ay sumusukat gamit ang numero at istatistika." },
    { q: "Which of the following is an example of a primary source?", opts: ["Encyclopedia", "Textbook", "Diary of a witness", "News commentary"], a: 2, why: "Primary sources are first-hand accounts created at the time of the event." },
    { q: "Ano ang tawag sa paniniwalang mas mataas ang sariling kultura kaysa sa ibang kultura?", opts: ["Cultural relativism", "Ethnocentrism", "Xenocentrism", "Acculturation"], a: 1, why: "Ethnocentrism: hinuhusgahan ang ibang kultura gamit ang pamantayan ng sariling kultura." },
    { q: "What is the domain of f(x) = 1 / (x − 2)?", opts: ["All real numbers", "x > 2", "All real numbers except 2", "x ≠ 0"], a: 2, why: "Hindi puwedeng zero ang denominator, kaya x ≠ 2." },
  ],

  TF: [
    { s: "Ang metamorphic rock ay nabubuo mula sa lava o magma na lumamig.", t: false, why: "Igneous rock ang nabubuo mula sa lumamig na magma o lava. Ang metamorphic ay galing sa init at presyon." },
    { s: "The probability of any event is always between 0 and 1, inclusive.", t: true, why: "0 = imposible, 1 = tiyak na mangyayari. Walang probability na negatibo o higit sa 1." },
    { s: "Ang Komisyon sa Wikang Filipino ang ahensyang nangangasiwa sa pagpapaunlad ng wikang Filipino.", t: true, why: "Itinatag ang KWF sa bisa ng Republic Act No. 7104 noong 1991." },
    { s: "Mitosis produces four genetically different daughter cells.", t: false, why: "Mitosis: 2 magkaparehong cell. Meiosis: 4 na magkakaibang cell (gametes)." },
    { s: "Ayon sa First Law of Motion ni Newton, kusang titigil ang gumagalaw na bagay kahit walang puwersang kumikilos dito.", t: false, why: "Law of Inertia: patuloy na gagalaw ang bagay hangga’t walang net force na pipigil dito." },
  ],

  MB: [
    { kind: "q", subj: "Physical Science", q: "Ano ang chemical symbol ng ginto (gold)?", a: "Au", why: "Mula sa salitang Latin na “aurum.”" },
    { kind: "q", subj: "Empowerment Technologies", q: "What does “URL” stand for?", a: "Uniform Resource Locator" },
    { kind: "s", title: "DOUBLE UP!", msg: "Doble ang puntos ng susunod na tamang sagot ng inyong team!", good: true, icon: "FaBolt" },
    { kind: "q", subj: "Statistics and Probability", q: "Ano ang median ng 3, 7, 9, 15, 20 at 22?", a: "12", why: "Even ang bilang ng data, kaya (9 + 15) ÷ 2 = 12" },
    { kind: "q", subj: "Komunikasyon at Pananaliksik", q: "Ano ang tawag sa wikang nagmula sa pidgin at naging unang wika na ng isang komunidad?", a: "Creole" },
    { kind: "s", title: "PLOT TWIST!", msg: "Ipagpalit ang puntos ng inyong team sa team na nasa huling puwesto!", good: false, icon: "FaRandom" },
  ],

  GAMES: [
    { id: "qb", name: "QUIZ BOARD", title: "Quiz Board", card: "QUIZ BOARD", icon: "FaThLarge", col: "yellow", desc: "Pumili ng subject at puntos", pts: "100–300 bawat tanong",
      how: ["Pipili ang team ng subject at puntos sa board", "Sagutin ang tanong sa loob ng 30 segundo", "Tama = makukuha ang puntos ng tile", "Mali = may pagkakataong sumagot ang ibang team"] },
    { id: "cl", name: "3 CLUES", title: "3 Clues", card: "3 CLUES", icon: "FaSearch", col: "orange", desc: "Hulaan sa pinakakaunting clue", pts: "300 / 200 / 100 depende sa clue",
      how: ["Unang clue lang ang makikita — 300 puntos kung mahuhulaan agad", "Walang nakahula? Buksan ang susunod na clue (200, tapos 100)", "Isang hula lang bawat team sa bawat clue", "I-click ang “Sagot Na!” para ipakita ang tamang sagot"] },
    { id: "mc", name: "PILIIN ANG SAGOT", title: "Piliin ang Sagot", card: "PILIIN ANG\nSAGOT", icon: "FaListOl", col: "pink", desc: "Multiple choice, i-click ang sagot", pts: "100 bawat tamang sagot",
      how: ["Basahin ang tanong at ang apat na pagpipilian", "I-click ang napiling sagot (A, B, C o D)", "Tama = 100 puntos at susunod na tanong", "Mali = subukan muli ng ibang team"] },
    { id: "tf", name: "TAMA O MALI", title: "Tama o Mali", card: "TAMA O MALI", icon: "FaBalanceScale", col: "teal", desc: "Totoo ba o hindi?", pts: "50 bawat tamang sagot",
      how: ["Basahin nang malakas ang pahayag", "Magbotohan ang team: TAMA o MALI", "I-click ang napiling button", "Alamin ang paliwanag sa bawat sagot"] },
    { id: "mb", name: "MYSTERY BOX", title: "Mystery Box", card: "MYSTERY BOX", icon: "FaGift", col: "lilac", desc: "Anong nasa loob ng kahon?", pts: "200 bawat tanong + sorpresa",
      how: ["Pipili ang team ng numero ng kahon", "May tanong, DOUBLE UP, o PLOT TWIST sa loob", "Tama ang sagot = 200 puntos", "Tandaan ang mga kahong nabuksan na"] },
  ],
};
