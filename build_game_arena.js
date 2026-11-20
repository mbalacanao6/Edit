// Generator for interactive, hyperlink-driven classroom game decks.
// Run: node build_game_arena.js [decks/jhs.js | decks/shs.js] [output.pptx]
// (needs pptxgenjs, react, react-dom, react-icons, sharp; set PPTX_SKILL_DIR to apply the theme)
const path = require("path");
const pptxgen = require("pptxgenjs");
const React = require("react");
const RDS = require("react-dom/server");
const sharp = require("sharp");
const fa = require("react-icons/fa");

const SKILL = process.env.PPTX_SKILL_DIR;
const DECK = require(path.resolve(process.argv[2] || path.join(__dirname, "decks/jhs.js")));
const OUT = process.argv[3] || path.join(__dirname, DECK.out);
const THEME = DECK.theme;
const HEX = THEME.colors;

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
pres.title = DECK.meta.title;
pres.subject = DECK.meta.subject;
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const C = pres.SchemeColor;
const K = {
  bg: C.text2, ink: C.text1, white: C.background1, lilac: C.background2,
  yellow: C.accent1, pink: C.accent2, teal: C.accent3, orange: C.accent4, green: C.accent5, red: C.accent6,
};

// ---------- icons ----------
const iconCache = {};
async function icon(name, hex) {
  const k = name + hex;
  if (!iconCache[k]) {
    const svg = RDS.renderToStaticMarkup(React.createElement(fa[name], { size: 256, color: "#" + hex }));
    const buf = await sharp(Buffer.from(svg)).resize(256, 256).png().toBuffer();
    iconCache[k] = "image/png;base64," + buf.toString("base64");
  }
  return iconCache[k];
}
const shadow = () => ({ type: "outer", color: "000000", blur: 0, offset: 5, angle: 90, opacity: 0.4 });

// ---------- layouts ----------
pres.defineSlideMaster({
  title: "ARENA",
  background: { color: K.bg },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.35, w: 10.3, h: 0.8, fontSize: 30, bold: true, color: K.white, align: "left", valign: "middle", margin: 0 }, text: "" } },
  ],
});
pres.defineSlideMaster({
  title: "ARENA_HERO",
  background: { color: K.bg },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: 0.8, y: 2.55, w: 11.7, h: 1.4, fontSize: 66, bold: true, color: K.white, align: "center", valign: "middle", margin: 0 }, text: "" } },
  ],
});

// ---------- content (from deck file) ----------
const { QB, MC, TF, JW, MB, CL, GAMES } = DECK;
const G = Object.fromEntries(GAMES.map((g, i) => [g.id, { ...g, num: i + 1 }]));

// ---------- slide plan (keys -> slide numbers) ----------
const plan = [];
const add = (key, type, data = {}, section) => plan.push({ key, type, data, section });
add("cover", "cover", {}, "Simula");
add("rules", "rules", {}, "Simula");
add("menu", "menu", {}, "Simula");
for (const g of GAMES) {
  const sec = `Laro ${G[g.id].num}: ${g.title}`;
  add(`${g.id}-intro`, "intro", { g: g.id }, sec);
  if (g.id === "qb") {
    add("qb-board", "board", {}, sec);
    QB.cats.forEach((c, ci) => c.qs.forEach((q, ri) => {
      add(`qb-q-${ci}-${ri}`, "qbq", { ci, ri }, sec);
      add(`qb-a-${ci}-${ri}`, "qba", { ci, ri }, sec);
    }));
  } else if (g.id === "cl") {
    CL.forEach((c, i) => {
      c.clues.forEach((_, k) => add(`cl-c-${i}-${k}`, "clc", { i, k }, sec));
      add(`cl-a-${i}`, "cla", { i }, sec);
    });
  } else if (g.id === "mc") {
    MC.forEach((_, i) => {
      add(`mc-q-${i}`, "mcq", { i }, sec);
      add(`mc-ok-${i}`, "mcok", { i }, sec);
      add(`mc-no-${i}`, "mcno", { i }, sec);
    });
  } else if (g.id === "tf") {
    TF.forEach((_, i) => {
      add(`tf-q-${i}`, "tfq", { i }, sec);
      add(`tf-ok-${i}`, "tfr", { i, ok: true }, sec);
      add(`tf-no-${i}`, "tfr", { i, ok: false }, sec);
    });
  } else if (g.id === "jw") {
    JW.forEach((_, i) => {
      add(`jw-q-${i}`, "jwq", { i }, sec);
      add(`jw-a-${i}`, "jwa", { i }, sec);
    });
  } else if (g.id === "mb") {
    add("mb-grid", "mbgrid", {}, sec);
    MB.forEach((b, i) => {
      if (b.kind === "q") {
        add(`mb-q-${i}`, "mbq", { i }, sec);
        add(`mb-a-${i}`, "mba", { i }, sec);
      } else add(`mb-q-${i}`, "mbs", { i }, sec);
    });
  } else throw new Error("unknown game " + g.id);
}
add("score", "score", {}, "Pagtatapos");
add("end", "end", {}, "Pagtatapos");
const N = Object.fromEntries(plan.map((p, i) => [p.key, i + 1]));
const L = (key) => { if (!N[key]) throw new Error("bad link " + key); return N[key]; };

// ---------- helpers ----------
const W = 13.333;
let objId = 0;
const nm = (s) => `${s}-${++objId}`;

async function button(s, o) {
  const { x, y, w, h, text, fill, color = K.ink, link, ic, icHex = HEX.dk1, fontSize = 20, outline } = o;
  const icS = ic ? Math.min(h * 0.5, 0.5) : 0;
  // estimate text width (bold Arial ~0.62em per char) so icon + label sit centered as a group
  const tw = Math.min(w - 0.6, text.length * fontSize * 0.62 / 72);
  const gx = ic ? x + Math.max(0.25, (w - (icS + 0.15 + tw)) / 2) : x;
  s.addText(text, {
    shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: Math.min(0.22, h / 2.5), x, y, w, h,
    fill: outline ? { color: K.white, transparency: 88 } : { color: fill },
    line: outline ? { color: K.white, width: 1.5 } : { color: fill, width: 0 },
    color: outline ? K.white : color, bold: true, fontSize, align: ic ? "left" : "center", valign: "middle",
    margin: ic ? [(gx - x + icS + 0.15) * 72, 4, 0, 0] : [6, 6, 0, 0], isTextBox: true,
    hyperlink: { slide: L(link), tooltip: text }, objectName: nm("btn"), shadow: outline ? undefined : shadow(),
  });
  if (ic) {
    s.addImage({ data: await icon(ic, outline ? "FFFFFF" : icHex), x: gx, y: y + (h - icS) / 2, w: icS, h: icS,
      hyperlink: { slide: L(link), tooltip: text }, altText: "", objectName: nm("btn-icon") });
  }
}
async function menuBtn(s) {
  await button(s, { x: 11.3, y: 0.4, w: 1.45, h: 0.6, text: "MENU", fontSize: 14, link: "menu", ic: "FaHome", outline: true });
}
async function iconCircle(s, ic, x, y, d, fill, icHex) {
  s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { color: fill, width: 0 }, objectName: nm("icon-circle"), shadow: shadow() });
  const p = d * 0.52;
  s.addImage({ data: await icon(ic, icHex), x: x + (d - p) / 2, y: y + (d - p) / 2, w: p, h: p, altText: "", objectName: nm("icon") });
}
function card(s, x, y, w, h, fill = K.white) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.25, fill: { color: fill }, line: { color: fill, width: 0 }, shadow: shadow(), objectName: nm("card") });
}
function chip(s, text, x, y, w, fill, color = K.ink) {
  s.addText(text, { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.2, x, y, w, h: 0.45, fill: { color: fill }, line: { color: fill, width: 0 },
    color, bold: true, fontSize: 14, align: "center", valign: "middle", margin: 0, isTextBox: true, objectName: nm("chip"), charSpacing: 1 });
}
function decorate(s) {
  s.addShape(pres.shapes.OVAL, { x: 11.0, y: 5.5, w: 3.8, h: 3.8, fill: { color: K.pink, transparency: 90 }, line: { color: K.pink, transparency: 100 }, objectName: nm("decor") });
  s.addShape(pres.shapes.OVAL, { x: -1.2, y: -1.3, w: 3.0, h: 3.0, fill: { color: K.teal, transparency: 92 }, line: { color: K.teal, transparency: 100 }, objectName: nm("decor") });
}
function newSlide(p, master = "ARENA") {
  const s = pres.addSlide({ masterName: master, sectionTitle: p.section });
  decorate(s);
  return s;
}
// question card with label + big text
function qCard(s, label, text, fill, labelFill, { y = 1.45, h = 3.65, fontSize = 32 } = {}) {
  card(s, 0.9, y, 11.53, h, fill);
  chip(s, label, 1.3, y + 0.35, 1.9, labelFill, K.white === labelFill ? K.ink : K.white);
  s.addText(text, { x: 1.4, y: y + 0.9, w: 10.53, h: h - 1.25, fontSize, bold: true, color: K.ink, align: "center", valign: "middle", margin: 0, isTextBox: true, objectName: nm("question"), fit: "none" });
}
function tiles(s, word, y, fill, color) {
  const n = word.length, gap = 0.12;
  const t = Math.min(1.05, (11.6 - gap * (n - 1)) / n);
  const total = n * t + (n - 1) * gap;
  let x = (W - total) / 2;
  for (const ch of word) {
    s.addText(ch, { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.12, x, y, w: t, h: t * 1.1, fill: { color: fill }, line: { color: fill, width: 0 },
      color, bold: true, fontSize: Math.round(t * 40), align: "center", valign: "middle", margin: 0, isTextBox: true, shadow: shadow(), objectName: nm("tile") });
    x += t + gap;
  }
}
function registerLink(s, link) {
  const rId = s._rels.length + s._relsChart.length + s._relsMedia.length + 1;
  s._rels.push({ type: "hyperlink", data: "slide", rId, Target: String(link.slide) });
  link._rId = rId;
}

// ---------- renderers ----------
const R = {
  async cover(p) {
    const s = newSlide(p, "ARENA_HERO");
    await iconCircle(s, "FaGamepad", (W - 1.6) / 2, 0.8, 1.6, K.yellow, HEX.dk1);
    s.addText([{ text: DECK.meta.titleA, options: { color: K.white } }, { text: DECK.meta.titleB, options: { color: K.yellow } }], { placeholder: "title" });
    s.addText(DECK.meta.subtitle, { x: 1.5, y: 4.0, w: 10.33, h: 0.6, fontSize: 20, color: K.lilac, align: "center", valign: "middle", margin: 0, isTextBox: true, objectName: nm("subtitle") });
    await button(s, { x: 3.67, y: 5.15, w: 2.9, h: 0.9, text: "SIMULAN", fontSize: 24, fill: K.yellow, link: "menu", ic: "FaPlay" });
    await button(s, { x: 6.77, y: 5.15, w: 2.9, h: 0.9, text: "PAANO LARUIN", fontSize: 20, link: "rules", ic: "FaQuestion", outline: true });
    s.addNotes("I-play sa Slide Show mode (F5). Gamitin ang mga button para mag-navigate — hindi uusad ang slide kapag nag-click sa ibang bahagi. Para sa guro: puwede pa ring gamitin ang arrow keys.");
    return s;
  },
  async rules(p) {
    const s = newSlide(p);
    s.addText("Paano Laruin", { placeholder: "title" });
    await menuBtn(s);
    const steps = [
      ["FaUsers", "yellow", "Hatiin ang klase", "Gumawa ng 4 na team at pumili ng pangalan ng bawat isa."],
      ["FaThLarge", "pink", "Pumili ng laro", "Sa Menu, i-click ang larong gusto ninyong laruin."],
      ["FaMousePointer", "teal", "I-click ang mga button", "Ang mga button lang ang nagpapalipat ng slide."],
      ["FaTrophy", "orange", "Itala ang puntos", "Gamitin ang Scoreboard. Ang may pinakamataas ang panalo!"],
    ];
    for (let i = 0; i < steps.length; i++) {
      const [ic, col, h, d] = steps[i];
      const y = 1.5 + i * 1.22;
      await iconCircle(s, ic, 0.7, y, 0.95, K[col], HEX.dk1);
      s.addText([{ text: h, options: { bold: true, fontSize: 20, color: K.white, breakLine: true } }, { text: d, options: { fontSize: 15, color: K.lilac } }],
        { x: 1.9, y: y - 0.05, w: 5.3, h: 1.05, valign: "middle", margin: 0, isTextBox: true, objectName: nm("step") });
    }
    // scoring panel
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 7.6, y: 1.5, w: 5.13, h: 4.6, rectRadius: 0.25, fill: { color: K.white, transparency: 90 }, line: { color: K.white, transparency: 70, width: 1 }, objectName: nm("panel") });
    s.addText("PUNTOS BAWAT LARO", { x: 7.95, y: 1.7, w: 4.5, h: 0.5, fontSize: 16, bold: true, color: K.yellow, charSpacing: 2, margin: 0, isTextBox: true, objectName: nm("panel-title") });
    GAMES.forEach((g, i) => {
      const y = 2.35 + i * 0.72;
      s.addShape(pres.shapes.OVAL, { x: 7.95, y: y + 0.17, w: 0.26, h: 0.26, fill: { color: K[g.col] }, line: { color: K[g.col], width: 0 }, objectName: nm("dot") });
      s.addText([{ text: g.name, options: { bold: true, color: K.white, fontSize: 15, breakLine: true } }, { text: g.pts, options: { color: K.lilac, fontSize: 14 } }],
        { x: 8.4, y, w: 4.1, h: 0.62, valign: "middle", margin: 0, isTextBox: true, objectName: nm("score-row") });
    });
    await button(s, { x: 0.7, y: 6.45, w: 3.2, h: 0.7, text: "PUMUNTA SA MENU", fontSize: 16, fill: K.yellow, link: "menu", ic: "FaArrowRight" });
    s.addNotes("Mungkahi: 30 segundo bawat tanong. Kapag mali ang sagot ng isang team, puwedeng 'steal' ng ibang team.");
  },
  async menu(p) {
    const s = newSlide(p);
    s.addText("Pumili ng Laro", { placeholder: "title" });
    const cw = 2.3, gap = 0.21, x0 = (W - (5 * cw + 4 * gap)) / 2;
    for (let i = 0; i < GAMES.length; i++) {
      const g = GAMES[i];
      const x = x0 + i * (cw + gap), y = 1.5, h = 4.25;
      const cardLink = { slide: L(`${g.id}-intro`), tooltip: g.name };
      s.addText([
        { text: `LARO ${i + 1}`, options: { fontSize: 12, bold: true, color: K.ink, charSpacing: 2, breakLine: true } },
        { text: g.card, options: { fontSize: 18, bold: true, color: K.ink, breakLine: true } },
        { text: g.desc, options: { fontSize: 14, color: K.ink } },
      ], { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.25, x, y, w: cw, h, fill: { color: K[g.col] }, line: { color: K[g.col], width: 0 },
        align: "center", valign: "top", margin: [10, 10, 10, 2.05 * 72], paraSpaceAfter: 4, isTextBox: true, shadow: shadow(),
        hyperlink: cardLink, objectName: nm("game-card") });
      registerLink(s, cardLink); // pptxgenjs skips the rel for shape-level links on multi-run text
      const d = 1.25;
      s.addShape(pres.shapes.OVAL, { x: x + (cw - d) / 2, y: y + 0.45, w: d, h: d, fill: { color: K.white }, line: { color: K.white, width: 0 }, hyperlink: { slide: L(`${g.id}-intro`), tooltip: g.name }, objectName: nm("game-icon-bg") });
      s.addImage({ data: await icon(g.icon, HEX.dk1), x: x + (cw - 0.65) / 2, y: y + 0.45 + (d - 0.65) / 2, w: 0.65, h: 0.65, hyperlink: { slide: L(`${g.id}-intro`), tooltip: g.name }, altText: "", objectName: nm("game-icon") });
    }
    await button(s, { x: 3.67, y: 6.25, w: 2.9, h: 0.75, text: "SCOREBOARD", fontSize: 18, link: "score", ic: "FaTrophy", outline: true });
    await button(s, { x: 6.77, y: 6.25, w: 2.9, h: 0.75, text: "PAANO LARUIN", fontSize: 18, link: "rules", ic: "FaQuestion", outline: true });
    s.addNotes("Hub ng lahat ng laro. Bawat slide ng laro ay may MENU button sa kanang itaas para bumalik dito.");
  },
  async intro(p) {
    const g = G[p.data.g];
    const s = newSlide(p);
    s.addText(`Laro ${g.num}: ${g.title}`, { placeholder: "title" });
    await menuBtn(s);
    await iconCircle(s, g.icon, 1.0, 2.0, 3.3, K[g.col], HEX.dk1);
    s.addText(g.name, { x: 5.0, y: 1.5, w: 7.7, h: 0.9, fontSize: 44, bold: true, color: K[g.col], margin: 0, valign: "middle", isTextBox: true, objectName: nm("game-name") });
    s.addText(g.how.map((t, i) => ({ text: t, options: { bullet: { type: "number" }, breakLine: i < g.how.length - 1 } })),
      { x: 5.0, y: 2.55, w: 7.5, h: 2.4, fontSize: 19, color: K.white, paraSpaceAfter: 10, margin: 0, valign: "top", isTextBox: true, objectName: nm("how") });
    chip(s, `PUNTOS: ${g.pts.toUpperCase()}`, 5.0, 5.15, 4.6, K.white);
    const first = { qb: "qb-board", cl: "cl-c-0-0", mc: "mc-q-0", tf: "tf-q-0", jw: "jw-q-0", mb: "mb-grid" }[g.id];
    await button(s, { x: 5.0, y: 5.95, w: 3.2, h: 0.85, text: "SIMULAN", fontSize: 22, fill: K[g.col], link: first, ic: "FaPlay" });
    s.addNotes(`Mekaniks ng ${g.name}: ` + g.how.join(". ") + ".");
  },
  async board(p) {
    const s = newSlide(p);
    s.addText("Quiz Board", { placeholder: "title" });
    await menuBtn(s);
    const cw = 2.85, gap = 0.2, x0 = (W - (4 * cw + 3 * gap)) / 2;
    for (let ci = 0; ci < 4; ci++) {
      const c = QB.cats[ci], x = x0 + ci * (cw + gap);
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.45, w: cw, h: 0.95, rectRadius: 0.2, fill: { color: K.white, transparency: 85 }, line: { color: K.white, transparency: 60, width: 1 }, objectName: nm("cat") });
      s.addImage({ data: await icon(c.icon, HEX.accent1), x: x + 0.3, y: 1.45 + 0.27, w: 0.42, h: 0.42, altText: "", objectName: nm("cat-icon") });
      s.addText(c.name.toUpperCase(), { x: x + 0.8, y: 1.45, w: cw - 0.9, h: 0.95, fontSize: 17, bold: true, color: K.white, valign: "middle", margin: 0, isTextBox: true, objectName: nm("cat-name") });
      for (let ri = 0; ri < 3; ri++) {
        s.addText(String(QB.pts[ri]), { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.2, x, y: 2.6 + ri * 1.3, w: cw, h: 1.1,
          fill: { color: K.yellow }, line: { color: K.yellow, width: 0 }, fontSize: 40, bold: true, color: K.ink, align: "center", valign: "middle", margin: 0,
          isTextBox: true, shadow: shadow(), hyperlink: { slide: L(`qb-q-${ci}-${ri}`), tooltip: `${c.name} ${QB.pts[ri]}` }, objectName: nm("tile") });
      }
    }
    s.addText("Tip: Lagyan ng marka (Ctrl+P / pen tool) ang mga tile na nasagot na.", { x: 0.6, y: 6.6, w: 9, h: 0.4, fontSize: 14, italic: true, color: K.lilac, margin: 0, isTextBox: true, objectName: nm("tip") });
    s.addNotes("I-click ang isang tile para buksan ang tanong. Pagkatapos, bumalik sa board. Gamitin ang pen tool para i-cross out ang mga tile na nagamit na.");
  },
  async qbq(p) {
    const { ci, ri } = p.data, c = QB.cats[ci], [q, a] = c.qs[ri];
    const s = newSlide(p);
    s.addText(`${c.name} · ${QB.pts[ri]} puntos`, { placeholder: "title" });
    await menuBtn(s);
    qCard(s, "TANONG", q, K.white, K.bg);
    await button(s, { x: 2.5, y: 5.65, w: 4.0, h: 0.9, text: "IPAKITA ANG SAGOT", fontSize: 20, fill: K.yellow, link: `qb-a-${ci}-${ri}`, ic: "FaEye" });
    await button(s, { x: 6.83, y: 5.65, w: 4.0, h: 0.9, text: "BALIK SA BOARD", fontSize: 20, link: "qb-board", ic: "FaThLarge", outline: true });
    s.addNotes(`Sagot: ${a}`);
  },
  async qba(p) {
    const { ci, ri } = p.data, c = QB.cats[ci], [q, a] = c.qs[ri];
    const s = newSlide(p);
    s.addText(`${c.name} · ${QB.pts[ri]} puntos`, { placeholder: "title" });
    await menuBtn(s);
    card(s, 0.9, 1.45, 11.53, 3.65, K.yellow);
    chip(s, "SAGOT", 1.3, 1.8, 1.9, K.bg, K.white);
    s.addText(q, { x: 1.4, y: 2.35, w: 10.53, h: 0.7, fontSize: 18, color: K.ink, align: "center", valign: "middle", margin: 0, isTextBox: true, objectName: nm("q-recap") });
    s.addText(a, { x: 1.4, y: 3.05, w: 10.53, h: 1.7, fontSize: ansSize(a), bold: true, color: K.ink, align: "center", valign: "middle", margin: 0, isTextBox: true, objectName: nm("answer") });
    await button(s, { x: 4.67, y: 5.65, w: 4.0, h: 0.9, text: "BALIK SA BOARD", fontSize: 20, fill: K.white, link: "qb-board", ic: "FaThLarge" });
    s.addNotes(`Kung tama: +${QB.pts[ri]} puntos sa team.`);
  },
  async mcq(p) {
    const { i } = p.data, m = MC[i];
    const s = newSlide(p);
    s.addText(`Piliin ang Sagot · Tanong ${i + 1} sa ${MC.length}`, { placeholder: "title" });
    await menuBtn(s);
    qCard(s, `TANONG ${i + 1}`, m.q, K.white, K.pink, { y: 1.45, h: 2.25, fontSize: 30 });
    const cols = ["pink", "teal", "orange", "lilac"];
    for (let k = 0; k < 4; k++) {
      const x = k % 2 === 0 ? 0.9 : 6.83, y = 3.95 + Math.floor(k / 2) * 1.35, w = 5.6, h = 1.15;
      const link = k === m.a ? `mc-ok-${i}` : `mc-no-${i}`;
      s.addText(m.opts[k], { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.2, x, y, w, h, fill: { color: K[cols[k]] }, line: { color: K[cols[k]], width: 0 },
        fontSize: 24, bold: true, color: K.ink, align: "left", valign: "middle", margin: [1.3 * 72, 10, 0, 0], isTextBox: true, shadow: shadow(),
        hyperlink: { slide: L(link), tooltip: "Sagot " + "ABCD"[k] }, objectName: nm("option") });
      s.addText("ABCD"[k], { shape: pres.shapes.OVAL, x: x + 0.22, y: y + 0.2, w: 0.75, h: 0.75, fill: { color: K.ink }, line: { color: K.ink, width: 0 },
        fontSize: 24, bold: true, color: K.white, align: "center", valign: "middle", margin: 0, isTextBox: true, hyperlink: { slide: L(link), tooltip: "Sagot " + "ABCD"[k] }, objectName: nm("option-letter") });
    }
    s.addNotes(`Tamang sagot: ${"ABCD"[m.a]}. ${m.opts[m.a]}`);
  },
  async mcok(p) {
    const { i } = p.data, m = MC[i], last = i === MC.length - 1;
    const s = newSlide(p);
    s.addText(`Piliin ang Sagot · Tanong ${i + 1} sa ${MC.length}`, { placeholder: "title" });
    await menuBtn(s);
    await resultBlock(s, true, "TAMA!", `Ang sagot: ${"ABCD"[m.a]}. ${m.opts[m.a]}`, m.why, "+100 PUNTOS");
    if (last) {
      await button(s, { x: 5.2, y: 5.75, w: 3.6, h: 0.85, text: "SCOREBOARD", fontSize: 20, fill: K.green, link: "score", ic: "FaTrophy" });
      await button(s, { x: 9.0, y: 5.75, w: 3.3, h: 0.85, text: "BALIK SA MENU", fontSize: 18, link: "menu", ic: "FaHome", outline: true });
    } else await button(s, { x: 5.2, y: 5.75, w: 4.2, h: 0.85, text: "SUSUNOD NA TANONG", fontSize: 20, fill: K.green, link: `mc-q-${i + 1}`, ic: "FaArrowRight" });
  },
  async mcno(p) {
    const { i } = p.data;
    const s = newSlide(p);
    s.addText(`Piliin ang Sagot · Tanong ${i + 1} sa ${MC.length}`, { placeholder: "title" });
    await menuBtn(s);
    await resultBlock(s, false, "AY, MALI!", "Hindi iyan ang tamang sagot.", "Ipasa sa susunod na team ang pagkakataong sumagot.", "STEAL CHANCE");
    await button(s, { x: 5.2, y: 5.75, w: 3.6, h: 0.85, text: "SUBUKAN MULI", fontSize: 20, fill: K.red, link: `mc-q-${i}`, ic: "FaRedo" });
  },
  async tfq(p) {
    const { i } = p.data, t = TF[i];
    const s = newSlide(p);
    s.addText(`Tama o Mali · Pahayag ${i + 1} sa ${TF.length}`, { placeholder: "title" });
    await menuBtn(s);
    qCard(s, `PAHAYAG ${i + 1}`, `“${t.s}”`, K.white, K.teal, { y: 1.45, h: 2.75, fontSize: 32 });
    const ok = `tf-ok-${i}`, no = `tf-no-${i}`;
    await button(s, { x: 1.4, y: 4.6, w: 4.95, h: 1.55, text: "TAMA", fontSize: 40, fill: K.green, link: t.t ? ok : no, ic: "FaCheck" });
    await button(s, { x: 6.98, y: 4.6, w: 4.95, h: 1.55, text: "MALI", fontSize: 40, fill: K.red, link: t.t ? no : ok, ic: "FaTimes" });
    s.addNotes(`Tamang sagot: ${t.t ? "TAMA" : "MALI"}. ${t.why}`);
  },
  async tfr(p) {
    const { i, ok } = p.data, t = TF[i], last = i === TF.length - 1;
    const s = newSlide(p);
    s.addText(`Tama o Mali · Pahayag ${i + 1} sa ${TF.length}`, { placeholder: "title" });
    await menuBtn(s);
    await resultBlock(s, ok, ok ? "TUMPAK!" : "SAYANG!", `Ang tamang sagot ay ${t.t ? "TAMA" : "MALI"}.`, t.why, ok ? "+50 PUNTOS" : "0 PUNTOS");
    if (last) {
      await button(s, { x: 5.2, y: 5.75, w: 3.6, h: 0.85, text: "SCOREBOARD", fontSize: 20, fill: K.teal, link: "score", ic: "FaTrophy" });
      await button(s, { x: 9.0, y: 5.75, w: 3.3, h: 0.85, text: "BALIK SA MENU", fontSize: 18, link: "menu", ic: "FaHome", outline: true });
    } else await button(s, { x: 5.2, y: 5.75, w: 4.2, h: 0.85, text: "SUSUNOD NA PAHAYAG", fontSize: 20, fill: K.teal, link: `tf-q-${i + 1}`, ic: "FaArrowRight" });
  },
  async jwq(p) {
    const { i } = p.data, j = JW[i];
    const s = newSlide(p);
    s.addText(`Ayusin ang Letra · Salita ${i + 1} sa ${JW.length}`, { placeholder: "title" });
    await menuBtn(s);
    card(s, 0.9, 1.45, 11.53, 1.25, K.white);
    await iconCircle(s, "FaLightbulb", 1.2, 1.62, 0.9, K.orange, HEX.dk1);
    s.addText([{ text: "HINT:  ", options: { bold: true } }, { text: j.hint }], { x: 2.35, y: 1.45, w: 9.8, h: 1.25, fontSize: 22, color: K.ink, valign: "middle", margin: 0, isTextBox: true, objectName: nm("hint") });
    tiles(s, j.jumble, 3.3, K.white, K.ink);
    s.addText(`${j.word.length} letra`, { x: 0.9, y: 4.75, w: 11.53, h: 0.45, fontSize: 16, color: K.lilac, align: "center", margin: 0, isTextBox: true, objectName: nm("count") });
    await button(s, { x: 4.67, y: 5.65, w: 4.0, h: 0.9, text: "IPAKITA ANG SAGOT", fontSize: 20, fill: K.orange, link: `jw-a-${i}`, ic: "FaEye" });
    s.addNotes(`Sagot: ${j.word}`);
  },
  async jwa(p) {
    const { i } = p.data, j = JW[i], last = i === JW.length - 1;
    const s = newSlide(p);
    s.addText(`Ayusin ang Letra · Salita ${i + 1} sa ${JW.length}`, { placeholder: "title" });
    await menuBtn(s);
    chip(s, "ANG SAGOT AY…", (W - 3.2) / 2, 1.75, 3.2, K.white);
    tiles(s, j.word, 2.75, K.orange, K.ink);
    s.addText(j.hint, { x: 0.9, y: 4.3, w: 11.53, h: 0.6, fontSize: 18, color: K.lilac, align: "center", valign: "middle", margin: 0, isTextBox: true, objectName: nm("hint-recap") });
    if (last) {
      await button(s, { x: 3.0, y: 5.65, w: 3.6, h: 0.9, text: "SCOREBOARD", fontSize: 20, fill: K.orange, link: "score", ic: "FaTrophy" });
      await button(s, { x: 6.8, y: 5.65, w: 3.6, h: 0.9, text: "BALIK SA MENU", fontSize: 18, link: "menu", ic: "FaHome", outline: true });
    } else await button(s, { x: 4.57, y: 5.65, w: 4.2, h: 0.9, text: "SUSUNOD NA SALITA", fontSize: 20, fill: K.orange, link: `jw-q-${i + 1}`, ic: "FaArrowRight" });
    s.addNotes("+150 puntos sa unang team na nakabuo ng tamang salita.");
  },
  async mbgrid(p) {
    const s = newSlide(p);
    s.addText("Mystery Box · Pumili ng Kahon", { placeholder: "title" });
    await menuBtn(s);
    const cols = ["yellow", "pink", "teal", "orange", "lilac", "green"];
    const bw = 3.6, bh = 2.25, gx = 0.37, x0 = (W - (3 * bw + 2 * gx)) / 2;
    for (let i = 0; i < 6; i++) {
      const x = x0 + (i % 3) * (bw + gx), y = 1.45 + Math.floor(i / 3) * (bh + 0.3);
      const link = `mb-q-${i}`;
      s.addText(String(i + 1), { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.25, x, y, w: bw, h: bh, fill: { color: K[cols[i]] }, line: { color: K[cols[i]], width: 0 },
        fontSize: 66, bold: true, color: K.ink, align: "right", valign: "middle", margin: [0, 0.55 * 72, 0, 0], isTextBox: true, shadow: shadow(),
        hyperlink: { slide: L(link), tooltip: `Kahon ${i + 1}` }, objectName: nm("box") });
      s.addImage({ data: await icon("FaGift", HEX.dk1), x: x + 0.5, y: y + (bh - 1.2) / 2, w: 1.2, h: 1.2, hyperlink: { slide: L(link), tooltip: `Kahon ${i + 1}` }, altText: "", objectName: nm("box-icon") });
    }
    s.addText("Tip: Lagyan ng X (Ctrl+P / pen tool) ang mga kahong nabuksan na.", { x: 0.6, y: 6.6, w: 9, h: 0.4, fontSize: 14, italic: true, color: K.lilac, margin: 0, isTextBox: true, objectName: nm("tip") });
    s.addNotes("Laman ng mga kahon: " + MB.map((b, i) => `${i + 1}=${b.kind === "q" ? "tanong (" + b.subj + ")" : b.title}`).join(", "));
  },
  async mbq(p) {
    const { i } = p.data, b = MB[i];
    const s = newSlide(p);
    s.addText(`Mystery Box ${i + 1} · ${b.subj}`, { placeholder: "title" });
    await menuBtn(s);
    qCard(s, "TANONG", b.q, K.white, K.bg);
    await button(s, { x: 2.5, y: 5.65, w: 4.0, h: 0.9, text: "IPAKITA ANG SAGOT", fontSize: 20, fill: K.lilac, link: `mb-a-${i}`, ic: "FaEye" });
    await button(s, { x: 6.83, y: 5.65, w: 4.0, h: 0.9, text: "BALIK SA MGA KAHON", fontSize: 18, link: "mb-grid", ic: "FaGift", outline: true });
    s.addNotes(`Sagot: ${b.a}`);
  },
  async mba(p) {
    const { i } = p.data, b = MB[i];
    const s = newSlide(p);
    s.addText(`Mystery Box ${i + 1} · ${b.subj}`, { placeholder: "title" });
    await menuBtn(s);
    card(s, 0.9, 1.45, 11.53, 3.65, K.lilac);
    chip(s, "SAGOT", 1.3, 1.8, 1.9, K.bg, K.white);
    s.addText(b.q, { x: 1.4, y: 2.35, w: 10.53, h: 0.75, fontSize: 18, color: K.ink, align: "center", valign: "middle", margin: 0, isTextBox: true, objectName: nm("q-recap") });
    s.addText(b.a, { x: 1.4, y: 3.1, w: 10.53, h: 1.3, fontSize: ansSize(b.a), bold: true, color: K.ink, align: "center", valign: "middle", margin: 0, isTextBox: true, objectName: nm("answer") });
    if (b.why) s.addText(b.why, { x: 1.4, y: 4.4, w: 10.53, h: 0.5, fontSize: 16, italic: true, color: K.ink, align: "center", valign: "middle", margin: 0, isTextBox: true, objectName: nm("why") });
    await button(s, { x: 4.57, y: 5.65, w: 4.2, h: 0.9, text: "BALIK SA MGA KAHON", fontSize: 18, fill: K.white, link: "mb-grid", ic: "FaGift" });
    s.addNotes("Kung tama: +200 puntos.");
  },
  async mbs(p) {
    const { i } = p.data, b = MB[i];
    const s = newSlide(p);
    s.addText(`Mystery Box ${i + 1} · Sorpresa!`, { placeholder: "title" });
    await menuBtn(s);
    const col = b.good ? "green" : "red";
    await iconCircle(s, b.icon || (b.good ? "FaStar" : "FaBomb"), (W - 2.2) / 2, 1.4, 2.2, K[col], HEX.dk1);
    s.addText(b.title, { x: 0.9, y: 3.75, w: 11.53, h: 1.0, fontSize: 60, bold: true, color: K[col], align: "center", valign: "middle", margin: 0, isTextBox: true, objectName: nm("surprise") });
    s.addText(b.msg, { x: 1.5, y: 4.75, w: 10.33, h: 0.7, fontSize: 24, color: K.white, align: "center", valign: "middle", margin: 0, isTextBox: true, objectName: nm("surprise-msg") });
    await button(s, { x: 4.57, y: 5.85, w: 4.2, h: 0.85, text: "BALIK SA MGA KAHON", fontSize: 18, fill: K[col], link: "mb-grid", ic: "FaGift" });
    s.addNotes(b.msg);
  },
  async score(p) {
    const s = newSlide(p);
    s.addText("Scoreboard", { placeholder: "title" });
    await menuBtn(s);
    const cols = ["yellow", "pink", "teal", "orange"];
    const cw = 2.85, gap = 0.2, x0 = (W - (4 * cw + 3 * gap)) / 2;
    for (let i = 0; i < 4; i++) {
      const x = x0 + i * (cw + gap);
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.45, w: cw, h: 4.55, rectRadius: 0.25, fill: { color: K.white, transparency: 90 }, line: { color: K[cols[i]], width: 2 }, objectName: nm("team") });
      s.addText(`TEAM ${i + 1}`, { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.2, x: x + 0.2, y: 1.65, w: cw - 0.4, h: 0.75, fill: { color: K[cols[i]] }, line: { color: K[cols[i]], width: 0 },
        fontSize: 22, bold: true, color: K.ink, align: "center", valign: "middle", margin: 0, isTextBox: true, objectName: nm("team-name") });
      s.addText("PUNTOS", { x: x + 0.2, y: 2.6, w: cw - 0.4, h: 0.4, fontSize: 14, bold: true, color: K.lilac, align: "center", charSpacing: 2, margin: 0, isTextBox: true, objectName: nm("team-label") });
    }
    await iconCircle(s, "FaPen", 0.7, 6.25, 0.7, K.yellow, HEX.dk1);
    s.addText("Sa Slide Show: Ctrl+P = pen para isulat ang puntos \u00B7 Ctrl+A = balik sa arrow", { x: 1.6, y: 6.2, w: 8.1, h: 0.8, fontSize: 15, color: K.white, valign: "middle", margin: 0, isTextBox: true, objectName: nm("pen-tip") });
    await button(s, { x: 10.0, y: 6.3, w: 2.73, h: 0.7, text: "TAPUSIN", fontSize: 16, fill: K.yellow, link: "end", ic: "FaFlagCheckered" });
    s.addNotes("Isulat ang puntos ng bawat team gamit ang pen tool. Puwede ring i-type ang puntos sa Normal view bago mag-present.");
  },
  async end(p) {
    const s = newSlide(p, "ARENA_HERO");
    await iconCircle(s, "FaTrophy", (W - 1.8) / 2, 0.7, 1.8, K.yellow, HEX.dk1);
    s.addText([{ text: "SALAMAT SA ", options: { color: K.white, fontSize: 44 } }, { text: "PAGLALARO!", options: { color: K.yellow, fontSize: 44 } }], { placeholder: "title" });
    s.addText("Congratulations sa nanalong team — at sa lahat ng nakisali!", { x: 1.5, y: 4.0, w: 10.33, h: 0.6, fontSize: 22, color: K.lilac, align: "center", valign: "middle", margin: 0, isTextBox: true, objectName: nm("subtitle") });
    await button(s, { x: 3.67, y: 5.15, w: 2.9, h: 0.9, text: "MAGLARO ULIT", fontSize: 20, fill: K.yellow, link: "menu", ic: "FaRedo" });
    await button(s, { x: 6.77, y: 5.15, w: 2.9, h: 0.9, text: "SCOREBOARD", fontSize: 20, link: "score", ic: "FaTrophy", outline: true });
  },
};
// keep long answers on one line inside the 10.5" answer box
function ansSize(a) { return a.length <= 14 ? 60 : a.length <= 20 ? 46 : 36; }

Object.assign(R, {
  // 3 Clues: clue k of item i is revealed; earlier clues stay visible, later ones locked
  async clc(p) {
    const { i, k } = p.data, c = CL[i], pts = [300, 200, 100];
    const s = newSlide(p);
    s.addText(`3 Clues \u00B7 Hula ${i + 1} sa ${CL.length}`, { placeholder: "title" });
    await menuBtn(s);
    s.addText([{ text: "SINO O ANO AKO?  ", options: { bold: true, color: K.orange } }, { text: c.subj, options: { color: K.lilac } }],
      { x: 0.9, y: 1.3, w: 9.5, h: 0.45, fontSize: 16, margin: 0, valign: "middle", isTextBox: true, objectName: nm("cl-subject") });
    for (let n = 0; n < 3; n++) {
      const y = 1.95 + n * 1.12, open = n <= k;
      if (open) card(s, 0.9, y, 11.53, 0.95, n === k ? K.white : K.lilac);
      else s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.9, y, w: 11.53, h: 0.95, rectRadius: 0.25, fill: { color: K.white, transparency: 92 }, line: { color: K.white, transparency: 60, width: 1, dashType: "dash" }, objectName: nm("cl-locked") });
      s.addText(String(n + 1), { shape: pres.shapes.OVAL, x: 1.12, y: y + 0.15, w: 0.65, h: 0.65, fill: { color: open ? K.orange : K.white, transparency: open ? 0 : 80 }, line: { color: open ? K.orange : K.white, width: 0 },
        fontSize: 22, bold: true, color: open ? K.ink : K.white, align: "center", valign: "middle", margin: 0, isTextBox: true, objectName: nm("cl-num") });
      s.addText(open ? c.clues[n] : `Clue ${n + 1} \u2014 nakatago pa (${pts[n]} puntos)`,
        { x: 2.0, y, w: 10.2, h: 0.95, fontSize: open ? 21 : 18, bold: open && n === k, italic: !open, color: open ? K.ink : K.lilac, valign: "middle", margin: 0, isTextBox: true, objectName: nm("cl-clue") });
    }
    chip(s, `KUNG MAHUHULAAN NGAYON: ${pts[k]} PUNTOS`, 0.9, 5.4, 5.6, K.yellow);
    if (k < 2) await button(s, { x: 0.9, y: 6.15, w: 4.2, h: 0.85, text: "SUSUNOD NA CLUE", fontSize: 20, fill: K.orange, link: `cl-c-${i}-${k + 1}`, ic: "FaSearch" });
    await button(s, { x: k < 2 ? 5.35 : 0.9, y: 6.15, w: 3.6, h: 0.85, text: "SAGOT NA!", fontSize: 20, fill: K.white, link: `cl-a-${i}`, ic: "FaEye" });
    s.addNotes(`Sagot: ${c.a}. Puntos kung mahuhulaan sa clue ${k + 1}: ${pts[k]}.`);
  },
  async cla(p) {
    const { i } = p.data, c = CL[i], last = i === CL.length - 1;
    const s = newSlide(p);
    s.addText(`3 Clues \u00B7 Hula ${i + 1} sa ${CL.length}`, { placeholder: "title" });
    await menuBtn(s);
    card(s, 0.9, 1.45, 11.53, 3.65, K.orange);
    chip(s, "ANG SAGOT AY\u2026", 1.3, 1.8, 2.6, K.bg, K.white);
    s.addText(c.a, { x: 1.4, y: 2.45, w: 10.53, h: 1.5, fontSize: ansSize(c.a), bold: true, color: K.ink, align: "center", valign: "middle", margin: 0, isTextBox: true, objectName: nm("answer") });
    s.addText(c.subj, { x: 1.4, y: 4.0, w: 10.53, h: 0.6, fontSize: 18, color: K.ink, align: "center", valign: "middle", margin: 0, isTextBox: true, objectName: nm("cl-subj") });
    if (last) {
      await button(s, { x: 2.83, y: 5.65, w: 3.6, h: 0.9, text: "SCOREBOARD", fontSize: 20, fill: K.orange, link: "score", ic: "FaTrophy" });
      await button(s, { x: 6.9, y: 5.65, w: 3.6, h: 0.9, text: "BALIK SA MENU", fontSize: 18, link: "menu", ic: "FaHome", outline: true });
    } else await button(s, { x: 4.57, y: 5.65, w: 4.2, h: 0.9, text: "SUSUNOD NA HULA", fontSize: 20, fill: K.orange, link: `cl-c-${i + 1}-0`, ic: "FaArrowRight" });
    s.addNotes("Clue 1 = 300, Clue 2 = 200, Clue 3 = 100 puntos.");
  },
});

async function resultBlock(s, ok, head, line, why, badge) {
  const col = ok ? "green" : "red";
  await iconCircle(s, ok ? "FaCheck" : "FaTimes", 1.3, 1.75, 3.0, K[col], HEX.dk1);
  s.addText(head, { x: 5.2, y: 1.55, w: 7.5, h: 1.2, fontSize: 64, bold: true, color: K[col], margin: 0, valign: "middle", isTextBox: true, objectName: nm("result") });
  s.addText(line, { x: 5.2, y: 2.85, w: 7.5, h: 0.8, fontSize: 26, bold: true, color: K.white, margin: 0, valign: "middle", isTextBox: true, objectName: nm("result-line") });
  s.addText(why, { x: 5.2, y: 3.7, w: 7.3, h: 0.95, fontSize: 18, color: K.lilac, margin: 0, valign: "top", isTextBox: true, objectName: nm("result-why") });
  chip(s, badge, 5.2, 4.85, 2.6, K[col]);
}

(async () => {
  let lastSection = null;
  for (const p of plan) {
    if (p.section !== lastSection) { pres.addSection({ title: p.section }); lastSection = p.section; }
    await R[p.type](p);
  }
  await pres.writeFile({ fileName: OUT });
  if (SKILL) {
    const { applyTheme } = require(path.join(SKILL, "scripts/apply_theme.js"));
    await applyTheme(OUT, THEME);
  }
  console.log(`Wrote ${OUT} with ${plan.length} slides`);
})();
