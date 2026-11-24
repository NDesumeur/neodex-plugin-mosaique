// Mosaïque : Des grilles à noircir d'après les nombres des lignes et des colonnes. Chaque grille finie révèle une image en pixel art.
// Jeu NeoDex en pixel art dessiné à la main (police bitmap, cadres et boutons en pixels). Il tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Mosaïque</span><span class="hint">Clic : noircir · clic droit : croix · glisser pour en faire plusieurs</span></div>
  <div class="gMain"><div class="gameBox"><canvas id="gc" width="288" height="216"></canvas></div>
    <div class="gSide">
      <div class="sysCard"><b>RECORDS</b><div class="gStats" id="gStats"></div></div>
      <div class="row"><button class="btn main" id="gNew">NOUVELLE PARTIE</button><button class="btn" id="gFs">PLEIN ÉCRAN</button></div>
      <label class="row">Taille <select id="mqSize" class="gSel"><option value="5">5 × 5 · débutant</option><option value="10">10 × 10</option><option value="15">15 × 15</option><option value="20">20 × 20</option></select></label>
      <div class="row"><select id="mqSel" class="f"></select></div>
      <div class="sysCard"><b>ALBUM</b><div class="mqAlbum" id="mqAlbum"></div></div>
      <div class="hint">Les nombres donnent les blocs de cases noires de chaque ligne et colonne, dans l'ordre. « 3 1 » veut dire : un bloc de 3 cases noires, au moins une case blanche, puis un bloc de 1. Chaque nombre a sa petite étiquette.</div><div class="hint">La croix (clic droit) marque une case sûre d'être blanche. Une ligne juste se grise.</div>
    </div></div>
</div>`;
const CSS = `.gMain{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap}
.gameBox{display:grid;place-items:center;padding:10px;background:#05010b;flex:2 1 560px;min-width:min(100%,560px);position:relative}
.gameBox canvas{width:100%;image-rendering:pixelated;cursor:var(--cp,pointer);touch-action:none}
.gSide{display:flex;flex-direction:column;gap:14px;flex:1;min-width:250px;max-width:420px}
.gSide .sysCard{display:flex;flex-direction:column}
.gStats{display:grid;grid-template-columns:1fr auto;gap:4px 14px}
.gStats b{text-align:right}
.gameBox canvas{width:min(100%,max(320px,calc((100vh - 190px) * 4 / 3)));height:auto;aspect-ratio:4/3}
.gameBox:fullscreen{padding:0}
.mqAlbum{display:grid;grid-template-columns:repeat(auto-fill,minmax(52px,1fr));gap:6px;max-height:300px;overflow:auto;margin-top:8px}
.mqAlbum button{all:unset;cursor:var(--cp,pointer);display:flex;flex-direction:column;align-items:center;gap:2px;font-size:11px;line-height:12px;text-align:center}
.mqAlbum canvas{width:48px;height:48px;image-rendering:pixelated;background:#f3e8d0;border:2px solid #05010b}
.mqAlbum button.lock canvas{background:#2a2040}
.mqAlbum button:focus-visible canvas,.mqAlbum button:hover canvas{border-color:#ffd84a}
.gameBox:fullscreen canvas{width:min(100vw,calc(100vh * 4 / 3))}`;
/* ---------- l'habillage pixel art, dessiné à la main : police bitmap (accents compris), cadres, boutons, icônes ----------
   Tout est en pixels pleins, agrandis par 2 sans lissage : aucun dégradé, aucune ombre floue. */
const PXK = (() => {
  // chaque lettre : ses lignes, de haut en bas, à partir de la ligne 2 de la case (0-1 : accents des majuscules, 9-10 : jambages)
  const S = {
    A: '.###. #...# #...# ##### #...# #...# #...#', B: '####. #...# #...# ####. #...# #...# ####.', C: '.###. #...# #.... #.... #.... #...# .###.',
    D: '####. #...# #...# #...# #...# #...# ####.', E: '##### #.... #.... ####. #.... #.... #####', F: '##### #.... #.... ####. #.... #.... #....',
    G: '.###. #...# #.... #.### #...# #...# .####', H: '#...# #...# #...# ##### #...# #...# #...#', I: '### .#. .#. .#. .#. .#. ###',
    J: '..### ...#. ...#. ...#. #..#. #..#. .##..', K: '#...# #..#. #.#.. ##... #.#.. #..#. #...#', L: '#.... #.... #.... #.... #.... #.... #####',
    M: '#...# ##.## #.#.# #.#.# #...# #...# #...#', N: '#...# ##..# #.#.# #..## #...# #...# #...#', O: '.###. #...# #...# #...# #...# #...# .###.',
    P: '####. #...# #...# ####. #.... #.... #....', Q: '.###. #...# #...# #...# #.#.# #..#. .##.#', R: '####. #...# #...# ####. #.#.. #..#. #...#',
    S: '.#### #.... #.... .###. ....# ....# ####.', T: '##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..', U: '#...# #...# #...# #...# #...# #...# .###.',
    V: '#...# #...# #...# #...# #...# .#.#. ..#..', W: '#...# #...# #...# #.#.# #.#.# ##.## #...#', X: '#...# #...# .#.#. ..#.. .#.#. #...# #...#',
    Y: '#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..', Z: '##### ....# ...#. ..#.. .#... #.... #####',
    a: '..... ..... .###. ....# .#### #...# .####', b: '#.... #.... ####. #...# #...# #...# ####.', c: '..... ..... .###. #.... #.... #.... .###.',
    d: '....# ....# .#### #...# #...# #...# .####', e: '..... ..... .###. #...# ##### #.... .###.', f: '..## .#.. #### .#.. .#.. .#.. .#..',
    g: '..... ..... .#### #...# #...# #...# .#### ....# .###.', h: '#.... #.... ####. #...# #...# #...# #...#', i: '.#. ... ##. .#. .#. .#. ###',
    'ı': '... ... ##. .#. .#. .#. ###', j: '...# .... ..## ...# ...# ...# ...# #..# .##.', k: '#... #... #..# #.#. ##.. #.#. #..#',
    l: '##. .#. .#. .#. .#. .#. ###', m: '..... ..... ##.#. #.#.# #.#.# #.#.# #...#', n: '..... ..... ####. #...# #...# #...# #...#',
    o: '..... ..... .###. #...# #...# #...# .###.', p: '..... ..... ####. #...# #...# #...# ####. #.... #....', q: '..... ..... .#### #...# #...# #...# .#### ....# ....#',
    r: '.... .... #.## ##.. #... #... #...', s: '..... ..... .#### #.... .###. ....# ####.', t: '.#.. .#.. #### .#.. .#.. .#.. ..##',
    u: '..... ..... #...# #...# #...# #..## .##.#', v: '..... ..... #...# #...# #...# .#.#. ..#..', w: '..... ..... #...# #...# #.#.# #.#.# .#.#.',
    x: '..... ..... #...# .#.#. ..#.. .#.#. #...#', y: '..... ..... #...# #...# #...# #...# .#### ....# .###.', z: '..... ..... ##### ...#. ..#.. .#... #####',
    0: '.###. #...# #..## #.#.# ##..# #...# .###.', 1: '..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.', 2: '.###. #...# ....# ...#. ..#.. .#... #####',
    3: '####. ....# ....# .###. ....# ....# ####.', 4: '...#. ..##. .#.#. #..#. ##### ...#. ...#.', 5: '##### #.... ####. ....# ....# #...# .###.',
    6: '.###. #.... #.... ####. #...# #...# .###.', 7: '##### ....# ...#. ..#.. .#... .#... .#...', 8: '.###. #...# #...# .###. #...# #...# .###.',
    9: '.###. #...# #...# .#### ....# ....# .###.',
    '.': '. . . . . . #', ',': '.. .. .. .. .. .# .# #.', ':': '. . # . . . #', ';': '.. .. .# .. .. .# .# #.', '!': '# # # # # . #',
    '?': '.###. #...# ....# ...#. ..#.. ..... ..#..', "'": '# # . . . . .', '"': '#.# #.# ... ... ... ... ...', '-': '... ... ... ### ... ... ...',
    '+': '..... ..#.. ..#.. ##### ..#.. ..#.. .....', '/': '....# ...#. ...#. ..#.. .#... .#... #....', '(': '.# #. #. #. #. #. .#', ')': '#. .# .# .# .# .# #.',
    '%': '##..# ##.#. ...#. ..#.. .#... .#.## #..##', '·': '. . . # . . .', '×': '..... ..... #...# .#.#. ..#.. .#.#. #...#',
    '<': '...# ..#. .#.. #... .#.. ..#. ...#', '>': '#... .#.. ..#. ...# ..#. .#.. #...', '=': '.... .... #### .... #### .... ....',
    '_': '..... ..... ..... ..... ..... ..... #####', '#': '.#.#. .#.#. ##### .#.#. ##### .#.#. .#.#.', '&': '.##.. #..#. #.#.. .#... #.#.# #..#. .##.#',
    '…': '..... ..... ..... ..... ..... ..... #.#.#', '«': '..... ..#.# .#.#. #.#.. .#.#. ..#.# .....', '»': '..... #.#.. .#.#. ..#.# .#.#. #.#.. .....',
    '◀': '...# ..## .### #### .### ..## ...#', '▶': '#... ##.. ###. #### ###. ##.. #...', '→': '..... ..#.. ...#. ##### ...#. ..#.. .....',
    '←': '..... ..#.. .#... ##### .#... ..#.. .....', '↑': '..#.. .###. #.#.# ..#.. ..#.. ..#.. ..#..', '↓': '..#.. ..#.. ..#.. ..#.. #.#.# .###. ..#..',
    '*': '..... #.#.# .###. ##### .###. #.#.# .....', '[': '## #. #. #. #. #. ##', ']': '## .# .# .# .# .# ##', '|': '# # # # # # #',
    '@': '.###. #...# #.### #.#.# #.### #.... .###.', '€': '..### .#... ####. .#... ####. .#... ..###', '$': '..#.. .#### #.#.. .###. ..#.# ####. ..#..',
    '°': '.#. #.# .#. ... ... ... ...', '~': '..... ..... .#..# #.##. ..... ..... .....', '♪': '..##. ..#.# ..#.. ..#.. .##.. ###.. .#...',
  };
  const ACC = { a: ['..#', '.#.'], g: ['#..', '.#.'], c: ['.#.', '#.#'], d: ['...', '#.#'], t: ['.#.#', '#.#.'], z: ['.#.', '##.'] };  // aigu, grave, circonflexe, tréma, tilde, cédille
  const COMP = { é: 'ea', è: 'eg', ê: 'ec', ë: 'ed', á: 'aa', à: 'ag', â: 'ac', ä: 'ad', í: 'ıa', ì: 'ıg', î: 'ıc', ï: 'ıd', ó: 'oa', ò: 'og', ô: 'oc', ö: 'od',
    ú: 'ua', ù: 'ug', û: 'uc', ü: 'ud', ÿ: 'yd', ñ: 'nt', ç: 'cz', É: 'Ea', È: 'Eg', Ê: 'Ec', Ë: 'Ed', Á: 'Aa', À: 'Ag', Â: 'Ac', Ä: 'Ad', Í: 'Ia', Î: 'Ic', Ï: 'Id',
    Ó: 'Oa', Ô: 'Oc', Ö: 'Od', Ú: 'Ua', Ù: 'Ug', Û: 'Uc', Ü: 'Ud', Ñ: 'Nt', Ç: 'Cz' };
  const SUB = { 'œ': 'oe', 'Œ': 'OE', '’': "'", '‘': "'", '“': '"', '”': '"', '–': '-', '—': '-', ' ': ' ', ' ': ' ', '•': '·', '✓': 'v', 'ᐸ': '<', 'ᐳ': '>', '＜': '<', '＞': '>', '｜': '|', '／': '/', '！': '!', '？': '?', '（': '(', '）': ')', '：': ':', '　': ' ' };  // ᐸ ᐳ : les < > des titres YouTube
  const H = 11, glyphs = new Map(); let raster;
  function glyph(ch) {
    let g = glyphs.get(ch); if (g) return g;
    const px = [], add = (rows, ox, oy) => rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] === '#') px.push([ox + x, oy + y]); });
    const c = COMP[ch], src = S[c ? c[0] : ch]; let w = 3;
    if (src) {
      const rows = src.split(' '); w = Math.max(...rows.map(r => r.length)); add(rows, 0, 2);
      if (c) { const a = ACC[c[1]]; add(a, Math.floor((w - a[0].length) / 2), c[1] === 'z' ? 9 : /[A-Z]/.test(c[0]) ? 0 : 1); }
    } else if (ch !== ' ') {  // japonais, emoji… : la lettre du système, réduite à des pixels nets (sans lissage) sur la même hauteur que la police
      const q = (raster ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })), RW = 16;
      q.canvas.width = RW; q.canvas.height = H; q.font = '11px "MS Gothic", "Yu Gothic UI", Meiryo, "Segoe UI Symbol", sans-serif'; q.fillStyle = '#000'; q.fillText(ch, 0, 10);
      const d = q.getImageData(0, 0, RW, H).data; let mx = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < RW; x++) if (d[(y * RW + x) * 4 + 3] > 110) { px.push([x, y]); mx = Math.max(mx, x + 1); }
      w = mx || 3;
      if (!px.length) { w = 5; add(['#####', '#...#', '#...#', '#...#', '#...#', '#...#', '#####'], 0, 2); }  // vraiment inconnue : une petite case
    }
    g = { w, px }; glyphs.set(ch, g); return g;
  }
  function layout(text) {
    let x = 0; const items = [];
    for (const ch of String(text)) for (const c of SUB[ch] ?? ch) { const g = glyph(c); items.push([g, x]); x += g.w + 1; }
    return { w: Math.max(0, x - 1), items };
  }
  function draw(g, text, x, y, color, s = 1) {  // (x, y) : coin haut gauche de la case
    const L = layout(text); g.fillStyle = color;
    for (const [gl, ox] of L.items) for (const [px, py] of gl.px) g.fillRect(x + (ox + px) * s, y + py * s, s, s);
    return L.w * s;
  }
  const bmp = new Map();
  function sprite(text, color, s = 1) {  // le texte tout prêt, gardé pour les images suivantes du jeu
    const k = text + '|' + color + '|' + s; let c = bmp.get(k); if (c) return c;
    c = document.createElement('canvas'); c.width = Math.max(1, layout(text).w * s); c.height = H * s; draw(c.getContext('2d'), text, 0, 0, color, s);
    if (bmp.size > 400) bmp.delete(bmp.keys().next().value);
    bmp.set(k, c); return c;
  }
  // comme fillText : (x, y) sur la ligne de base, aligné à gauche, au centre ou à droite
  function fill(g, text, x, y, color, s = 1, align = 'left') {
    const c = sprite(String(text), color, s), dx = align === 'center' ? -c.width / 2 : align === 'right' ? -c.width : 0;
    g.drawImage(c, Math.round(x + dx), Math.round(y - 9 * s));
  }
  const scale = size => Math.max(1, Math.round((size || 8) / 8));
  function art(rows, pal, s = 1) {  // un dessin en lignes de caractères, chaque caractère une couleur de la palette (« . » : transparent)
    const c = document.createElement('canvas'); c.width = Math.max(...rows.map(r => r.length)) * s; c.height = rows.length * s;
    const g = c.getContext('2d');
    rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) { const col = pal[r[x]]; if (col) { g.fillStyle = col; g.fillRect(x * s, y * s, s, s); } } });
    return c;
  }
  return { H, layout, draw, sprite, fill, scale, art };
})();

// les pièces de l'interface, pixel par pixel (K : contour, les autres lettres : la palette du jeu)
const PX_PANEL = ['..KKKKKKKKKKKK..', '.KAAAAAAAAAAAAK.', 'KALAAAAAAAAAALSK', 'KAAKKKKKKKKKKSSK', 'KAAKHHHHHHHHKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK',
  'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKKKKKKKKKKSSK', 'KALSSSSSSSSSSLSK', '.KSSSSSSSSSSSSK.', '..KKKKKKKKKKKK..'];
const PX_CARD = ['.KKKKKKKKKK.', 'KFFFFFFFFFFK', 'KFHHHHHHHHFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFSSSSSSSSFK', 'KFFFFFFFFFFK', '.KKKKKKKKKK.'];
const PX_BTN = ['.KKKKKKKKKK.', 'KWWWWWWWWWWK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KBBBBBBBBBBK', 'KKKKKKKKKKKK', 'KDDDDDDDDDDK', '.KKKKKKKKKK.'];
const PX_BTN_DOWN = ['............', '............', '.KKKKKKKKKK.', 'KBBBBBBBBBBK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KWWWWWWWWWWK', '.KKKKKKKKKK.'];
const PX_TRACK = ['.KKKKKKKKKK.', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KHHHHHHHHHHK', '.KKKKKKKKKK.'];
const PX_KNOB = ['.KKKKK.', 'KWWWWWK', 'KWAAABK', 'KWAAABK', 'KKKKKKK', 'KWAAABK', 'KWAAABK', 'KBBBBBK', 'KDDDDDK', '.KKKKK.'];
const PX_RAIL = ['KDDDDDDK', 'KDDDDDDK', 'KDDDDDDK', 'KDDHHDDK'];
const PX_ICONS = {
  play: ['kk......', 'kakk....', 'kaaakk..', 'kaaaaakk', 'kaaaaaak', 'kaaaaakk', 'kaaakk..', 'kakk....', 'kk......'],
  full: ['www...www', 'w.......w', 'w.......w', '.........', '....a....', '.........', 'w.......w', 'w.......w', 'www...www'],
  note: ['...aaaaaa', '...aaaaaa', '...a....a', '...a....a', '...a....a', '.aaa..aaa', 'aaaa.aaaa', 'aaaa.aaaa', '.aa...aa.'],
  star: ['....g....', '....g....', '...ggg...', 'ggggwgggg', '.ggwwwgg.', '..ggggg..', '..oo.oo..', '.oo...oo.', '.o.....o.'],
  crown: ['g...g...g', 'gg.ggg.gg', 'ggggggggg', 'grgggggrg', 'ggggggggg', 'ooooooooo'],
  folder: ['oooo.....', 'oggoooooo', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ooooooooo'],
  vol: ['....w....', '...ww..b.', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', '...ww..b.', '....w....'],
  clock: ['..wwwww..', '.w.....w.', 'w...a...w', 'w...a...w', 'w...aaa.w', 'w.......w', 'w.......w', '.w.....w.', '..wwwww..'],
  cursor: ['....a....', '..aaaaa..', '.a..a..a.', '.a.....a.', 'aaa.w.aaa', '.a.....a.', '.a..a..a.', '..aaaaa..', '....a....'],
  plus: ['...b...', '...b...', '...b...', 'bbbbbbb', '...b...', '...b...', '...b...'],
  down: ['wwwwwww', '.wwwww.', '..www..', '...w...'],
};

/* habille la page du jeu : root = son conteneur, T = sa palette, icons = [motif du texte, icône] pour les boutons et libellés */
function pxSkin(root, { T, icons = [], emblem, title }) {
  root.classList.add('pxk'); const s = 2, url = c => c.toDataURL();
  const btnPal = (M, W, B, D) => ({ K: T.k, W, M, B, D });
  const BN = btnPal(T.btn, T.btnHi, T.btnLo, T.k2), BH = btnPal(T.btnHov, T.btnHovHi, T.btnLo, T.k2);
  const BA = btnPal(T.acc, T.accL, T.accS, T.accD), BAH = btnPal(T.accL, '#ffffff', T.acc, T.accD);
  const img = { panel: PXK.art(PX_PANEL, { K: T.k, A: T.acc, S: T.accS, L: T.rivet, H: T.hl, D: T.fill }, s),
    card: PXK.art(PX_CARD, { K: T.k, F: T.line, H: T.hl, D: T.fill, S: T.k2 }, s), cardOn: PXK.art(PX_CARD, { K: T.k, F: T.acc, H: T.accS, D: T.fillOn, S: T.accD }, s),
    btn: PXK.art(PX_BTN, BN, s), btnH: PXK.art(PX_BTN, BH, s), btnD: PXK.art(PX_BTN_DOWN, BH, s),
    main: PXK.art(PX_BTN, BA, s), mainH: PXK.art(PX_BTN, BAH, s), mainD: PXK.art(PX_BTN_DOWN, BA, s),
    track: PXK.art(PX_TRACK, { K: T.k, D: T.k2, H: T.line }, s), knob: PXK.art(PX_KNOB, { K: T.k, W: T.accL, A: T.acc, B: T.accS, D: T.accD }, s),
    rail: PXK.art(PX_RAIL, { K: T.k, D: T.k2, H: T.line }, s), tile: PXK.art(T.tile, { x: T.bgDot, ':': T.bgDot2, '+': T.spark, '*': T.spark2 }, s) };
  const u = Object.fromEntries(Object.entries(img).map(([k, c]) => [k, url(c)]));
  const nine = (k, sl) => `border-style:solid;border-width:${sl * s}px;border-image:url(${u[k]}) ${sl * s} fill / ${sl * s}px stretch`;
  const IP = { k: T.k, w: T.text, a: T.acc, b: T.acc2, g: T.gold, o: T.orange, r: T.red, n: T.green, N: T.green2, m: T.muted, s: T.accS };
  const iconUrl = new Map(), icon = name => {
    let v = iconUrl.get(name); if (!v) { const c = PXK.art(PX_ICONS[name] || emblem, IP, s); v = { u: url(c), w: c.width, h: c.height }; iconUrl.set(name, v); }
    const b = document.createElement('b'); b.className = 'pxI'; b.setAttribute('aria-hidden', 'true'); b.style.cssText = `width:${v.w}px;height:${v.h}px;background-image:url(${v.u})`; return b;
  };
  const R = '.pxk.pxk';
  const css = document.createElement('style');
  css.textContent = `html,html body{background:${T.bg} url(${u.tile}) 0 0/${img.tile.width}px ${img.tile.height}px repeat!important}
::-webkit-scrollbar{width:16px;height:16px} ::-webkit-scrollbar-track{background:url(${u.rail}) 0 0/16px 8px repeat-y} ::-webkit-scrollbar-thumb{${nine('main', 4)}} ::-webkit-scrollbar-corner{background:none}
${R}{color:${T.text}}
${R} .px{box-shadow:none;background:none}
${R} .agHead{gap:18px;margin:0}
${R} .agHead .label{display:flex;align-items:center;gap:12px}
${R} .btn,${R} .tab{${nine('btn', 4)};height:auto;min-height:0;padding:0 6px 4px;margin:0;color:${T.text};font:12px/1 monospace;display:inline-flex;align-items:center;gap:6px;filter:none;text-shadow:none;letter-spacing:0;cursor:var(--cp,pointer)}
${R} .btn:hover,${R} .tab:hover{border-image-source:url(${u.btnH})}
${R} .btn:active,${R} .tab:active{border-image-source:url(${u.btnD});padding:4px 6px 0}
${R} .btn.main,${R} .tab.on{border-image-source:url(${u.main});color:${T.k}}
${R} .btn.main:hover,${R} .tab.on:hover{border-image-source:url(${u.mainH})}
${R} .btn.main:active,${R} .tab.on:active{border-image-source:url(${u.mainD})}
${R} .btn:focus-visible,${R} .tab:focus-visible{outline:2px dashed ${T.acc2};outline-offset:2px}
${R} .btn .pxV,${R} .tab .pxV{white-space:nowrap}
${R} .sysCard{${nine('card', 4)};padding:4px 6px;gap:8px;background:none}
${R} .sysCard.on{border-image-source:url(${u.cardOn})}
${R} .sysCard.on>b{color:${T.acc}}
${R} .sysCard>b{color:${T.text}}
${R} .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
${R} .gameBox,${R} .thBox{${nine('panel', 5)};box-shadow:none;background:none;padding:2px;gap:8px;grid-template-rows:auto auto}
${R} .gameBox canvas,${R} .thBox canvas{display:block;background:#05010b}
${R} .gameBox:fullscreen,${R} .thBox:fullscreen{border:0;padding:0;background:#000}
${R} .rhFs{position:static;opacity:1;justify-self:end;margin:0 6px 6px 0}
${R} .rhTabs{gap:8px;flex-wrap:wrap}
${R} .hint{color:${T.muted};line-height:24px}
${R} label{color:${T.muted};display:inline-flex;align-items:center;gap:8px}
${R} .rhDel{color:${T.red};top:6px;right:8px}
${R} input[type=range]{-webkit-appearance:none;appearance:none;background:none;height:20px;width:150px}
${R} input[type=range]::-webkit-slider-runnable-track{height:12px;${nine('track', 2)}}
${R} input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:20px;border:0;background:url(${u.knob}) 0 0/100% 100%;margin-top:-8px;cursor:var(--cp,pointer)}
${R} .pxSel{justify-content:space-between;gap:10px;max-width:100%;overflow:hidden}
${R} .rhImport .pxSel{flex:1;min-width:0}
.pxMenu{position:fixed;z-index:50;${nine('card', 4)};padding:2px;max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:2px;color:${T.text}}
.pxMenu button{all:unset;padding:3px 8px;cursor:var(--cp,pointer);white-space:nowrap}
.pxMenu button:hover,.pxMenu button:focus-visible,.pxMenu button.on{background:${T.btnHov};color:${T.text}}
.pxMenu button.on{color:${T.acc}}
.pxT{position:relative;white-space:normal;font:12px/1 monospace;letter-spacing:0;text-transform:none}
.pxT i{display:inline-block;vertical-align:middle;background:currentColor;-webkit-mask:var(--m) 0 0/100% 100% no-repeat;mask:var(--m) 0 0/100% 100% no-repeat;image-rendering:pixelated}
.pxI{display:inline-block;vertical-align:middle;background:0 0/100% 100% no-repeat;image-rendering:pixelated;margin-right:6px}
.pxV>.pxI+.pxI{margin-left:-4px}
.pxSr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`;
  document.head.append(css);
  // un mot = une image (en masque : sa couleur suit celle du texte), une règle par mot pour ne pas répéter l'image
  const words = new Map(), sheet = document.head.appendChild(document.createElement('style')).sheet;
  const word = w => {
    let k = words.get(w);
    if (!k) { const c = PXK.sprite(w, '#fff', s); k = 'pw' + words.size; words.set(w, k); sheet.insertRule(`.${k}{--m:url(${c.toDataURL()});width:${c.width}px;height:${c.height}px}`, sheet.cssRules.length); }
    const i = document.createElement('i'); i.className = k; return i;
  };
  function render(vis, text, lead) {
    const parts = [], ic = lead && icons.find(([re]) => re.test(text.trim()));
    if (ic) parts.push(icon(ic[1]));
    for (const m of text.matchAll(/(★+)|(\s+)|([^\s★]+)/g)) {
      if (m[1]) for (const _ of m[1]) parts.push(icon('star'));
      else if (m[2]) parts.push(document.createTextNode(' '));
      else parts.push(word(m[3]));
    }
    vis.replaceChildren(...parts);
  }
  const lead = node => node.parentElement?.matches('button,label,.tab,.btn') && !node.previousSibling;
  function pixText(node) {  // le texte reste dans la page (lecteur d'écran, copier) ; on voit ses lettres en pixels
    const wrap = document.createElement('span'), sr = document.createElement('span'), vis = document.createElement('span');
    wrap.className = 'pxT'; sr.className = 'pxSr'; vis.className = 'pxV'; vis.setAttribute('aria-hidden', 'true');
    const first = lead(node); node.replaceWith(wrap); sr.append(node); wrap.append(sr, vis); render(vis, node.data, first);
  }
  function pxSelect(sel) {  // une liste déroulante en pixels ; la vraie reste cachée et garde sa valeur et ses événements
    sel.dataset.px = '1'; sel.style.display = 'none';
    const b = document.createElement('button'), lab = document.createElement('span'); b.type = 'button'; b.className = 'btn pxSel'; b.append(lab, icon('down')); sel.after(b);
    const sync = () => { const t = sel.selectedOptions[0]?.textContent || '—'; if (lab.dataset.t !== t) { lab.dataset.t = t; lab.textContent = t; } };
    const d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    Object.defineProperty(sel, 'value', { configurable: true, get() { return d.get.call(this); }, set(v) { d.set.call(this, v); sync(); } });
    new MutationObserver(sync).observe(sel, { childList: true, subtree: true, characterData: true, attributes: true });
    sel.addEventListener('change', sync);
    b.onclick = () => {
      document.querySelector('.pxMenu')?.remove();
      const m = document.createElement('div'), r = b.getBoundingClientRect(); m.className = 'pxMenu'; m.setAttribute('role', 'listbox');
      for (const o of sel.options) {
        const it = document.createElement('button'); it.type = 'button'; it.textContent = o.textContent; it.className = o.selected ? 'on' : ''; it.setAttribute('role', 'option');
        it.onclick = () => { sel.value = o.value; sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); close(); b.focus(); };
        m.append(it);
      }
      root.append(m);
      const below = innerHeight - r.bottom; m.style.minWidth = r.width + 'px'; m.style.left = Math.min(r.left, innerWidth - m.offsetWidth - 4) + 'px';
      m.style.top = (below > m.offsetHeight + 8 || below > r.top ? r.bottom + 2 : r.top - m.offsetHeight - 2) + 'px';
      const close = () => { m.remove(); removeEventListener('pointerdown', out, true); removeEventListener('keydown', key, true); removeEventListener('blur', close); };
      const out = e => { if (!m.contains(e.target) && e.target !== b && !b.contains(e.target)) close(); };
      const key = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); b.focus(); } };
      addEventListener('pointerdown', out, true); addEventListener('keydown', key, true); addEventListener('blur', close);
      (m.querySelector('.on') || m.firstChild)?.focus();
    };
    sync();
  }
  const SKIP = 'select,option,textarea,script,style,canvas,.pxT,[data-pxskip]';
  let queued = false;
  function pass() {
    queued = false;
    root.querySelectorAll('select.gSel:not([data-px])').forEach(pxSelect);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), todo = [];
    for (let n; (n = w.nextNode());) if (n.data.trim() && n.parentElement && !n.parentElement.closest(SKIP)) todo.push(n);
    todo.forEach(pixText);
  }
  new MutationObserver(ms => {
    for (const m of ms) if (m.type === 'characterData') { const wrap = m.target.parentNode?.closest?.('.pxT'); if (wrap) render(wrap.lastChild, m.target.data, false); }
    if (!queued) { queued = true; queueMicrotask(pass); }
  }).observe(root, { childList: true, subtree: true, characterData: true });
  // le titre : grosses lettres à contour, trois tons, et l'emblème du jeu
  const lab = root.querySelector('.agHead .label');
  if (lab) {
    const L = PXK.layout(title), c = document.createElement('canvas'), g = c.getContext('2d'), on = [];
    c.width = L.w + 3; c.height = PXK.H + 3;
    for (const [gl, ox] of L.items) for (const [x, y] of gl.px) on.push([ox + x + 1, y + 1]);
    g.fillStyle = T.k; for (const [x, y] of on) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [2, 2], [1, 2], [2, 1]]) g.fillRect(x + dx, y + dy, 1, 1);
    for (const [x, y] of on) { g.fillStyle = y <= 5 ? T.accL : y <= 7 ? T.acc : T.accS; g.fillRect(x, y, 1, 1); }
    const big = document.createElement('canvas'), z = 4; big.width = c.width * z; big.height = c.height * z;
    const bg = big.getContext('2d'); bg.imageSmoothingEnabled = false; bg.drawImage(c, 0, 0, big.width, big.height);
    const t = document.createElement('b'); t.className = 'pxI'; t.style.cssText = `width:${big.width}px;height:${big.height}px;background-image:url(${big.toDataURL()})`;
    const e = PXK.art(emblem, IP, 3), em = document.createElement('b'); em.className = 'pxI'; em.style.cssText = `width:${e.width}px;height:${e.height}px;background-image:url(${e.toDataURL()})`;
    const sr = document.createElement('span'); sr.className = 'pxSr'; sr.textContent = lab.textContent;
    lab.dataset.pxskip = '1'; lab.replaceChildren(em, t, sr);
  }
  pass();
}

export default async function (ctx) {
  const view = ctx.view;
  if (!ctx.host) { view.textContent = "Ce plugin doit être approuvé par NeoDex pour s'ouvrir."; return; }
  const host = ctx.host, { el, toast, sfx } = host;
  const folder = ctx.folder;
  host.addStyle(CSS);
  view.innerHTML = HTML;
  pxSkin(view.querySelector('.appWrap'), { title: "MOSAÏQUE", T: {"k": "#0a0604", "k2": "#160e08", "fill": "#22160c", "fillOn": "#2e1e10", "hl": "#3a2614", "line": "#5a3a1a", "acc": "#ffd84a", "accL": "#fff4b0", "accS": "#c49a1a", "accD": "#4a3a06", "rivet": "#fff4b0", "btn": "#3a2614", "btnHi": "#6a4a24", "btnLo": "#160e08", "btnHov": "#4a3018", "btnHovHi": "#8a5e2e", "text": "#fff4e0", "muted": "#c8a880", "acc2": "#ff8ab0", "gold": "#ffd84a", "orange": "#ffa030", "red": "#ff4a5a", "green": "#7ee07a", "green2": "#2f8a3a", "bg": "#0c0804", "bgDot": "#22160c", "bgDot2": "#160e08", "spark": "#5a3a1a", "spark2": "#ff8ab0", "tile": ["................", "...:............", "................", "..........+.....", "................", "................", ".....:..........", "................", "................", ".............:..", "................", "..+.............", "................", ".........:......", "................", "................"]},
  emblem: ["kkkkkkkkkkkk", "kaaakwwkaaak", "kaaakwwkaaak", "kaaakwwkaaak", "kkkkkkkkkkkk", "kwwkaaakwwwk", "kwwkaaakwwwk", "kkkkkkkkkkkk", "kaaakwwkaaak", "kaaakwwkaaak", "kaaakwwkaaak", "kkkkkkkkkkkk"],
  icons: [[/^NOUVELLE/, "play"], [/^RECORDS/, "crown"]] });
  const $ = id => view.querySelector('#' + id) || document.getElementById(id);
  const doc = async n => { try { return await folder.read(n); } catch { return null; } };
  const games = { best: {}, ...(await doc('games')) };
  let gamesTimer = null;
  const saveGames = () => { clearTimeout(gamesTimer); gamesTimer = setTimeout(() => { gamesTimer = null; folder.write('games', games).catch(() => {}); }, 500); };
  const best = (k, v) => { const b = games.best[k]; if (b == null || v > b) { games.best[k] = v; saveGames(); return true; } return false; };
  const gstore = (k, init) => (games[k] ??= init);
function gameLoop(st, appKey, update, draw) {
  cancelAnimationFrame(st.raf);
  const STEP = 1000 / 60; let acc = 0, last = performance.now();
  const frame = t => {
    if (!view.classList.contains('on')) { st.raf = 0; if (st.mode === 'play') st.mode = 'pause'; return; }  // leaving the tab pauses the game
    st.raf = requestAnimationFrame(frame);
    acc += Math.min(200, t - last); last = t;
    while (acc >= STEP) { if (st.mode === 'play') update(); st.tick++; acc -= STEP; }
    draw();
  };
  st.raf = requestAnimationFrame(frame);
}
function gameText(g, w, lines, y0) {  // lignes centrées en police pixel, sur une bande sombre
  g.fillStyle = 'rgba(11,3,28,.72)'; g.fillRect(0, y0 - 14, w, lines.length * 14 + 14);
  lines.forEach(([text, color, size], i) => PXK.fill(g, text, w / 2, y0 + i * 14, color, PXK.scale(size), 'center'));
}
const px = (g, color, x, y, w = 1, h = 1) => { g.fillStyle = color; g.fillRect(Math.round(x), Math.round(y), w, h); };
function sprite(g, rows, x, y, pal) { rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c) px(g, c, x + i, y + j); } }); }
const seeded = s => () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const pxFont = (g, text, x, y, color, size = 8, align = 'left') => { const s = PXK.scale(size); PXK.fill(g, text, x + s, y + s, '#05010b', s, align); PXK.fill(g, text, x, y, color, s, align); };

const clock = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
// petits outils communs aux jeux : une toile pré-dessinée, la position du pointeur dans le canevas, un bip
const cnv = (w, h, fn) => { const c = el('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); g.imageSmoothingEnabled = false; fn(g); return c; };
const spr = (rows, pal) => cnv(Math.max(...rows.map(r => r.length)), rows.length, g => sprite(g, rows, 0, 0, pal));
let W = 288, H = 216; const cv = $('gc'), g = cv.getContext('2d'); g.imageSmoothingEnabled = false;
const cpos = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H]; };
let actx = null;
const beep = (f, d = .1, type = 'square', slide = 0, vol = .08) => { try { actx ??= new AudioContext(); const o = actx.createOscillator(), gn = actx.createGain(), t = actx.currentTime; o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); gn.gain.setValueAtTime(vol, t); gn.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(gn).connect(actx.destination); o.start(t); o.stop(t + d + .02); } catch {} };
const keyOk = e => view.classList.contains('on') && !/INPUT|SELECT|TEXTAREA/.test(e.target.tagName);
const showStats = rows => $('gStats').replaceChildren(...rows.flatMap(([a, b]) => [el('span', '', a), el('b', '', String(b))]));

/* ---------- Mosaïque : des grilles à noircir d'après les nombres (picross) ; chaque grille résolue révèle une image en pixel art ---------- */
const MQ_PAL = {r: '#ff4a5a', R: '#a02030', w: '#ffffff', s: '#e8d0a0', o: '#ffa030', p: '#ff8ab0', b: '#3f8aff', B: '#1a4aa0', d: '#8a5a34', g: '#5fbf6a', G: '#2e7a46', y: '#ffd84a', c: '#e8e0d0', k: '#3a2a20', v: '#9a6ac0'};
const MQ_PUZ = [
  ['Un cœur', ['..........', '.rrr..rrr.', 'rrwrrrrrrr', 'rwrrrrrrrr', 'rrrrrrrrrr', '.rrrrrrrr.', '..rrrrrr..', '...rrrr...', '....rr....', '..........']],
  ['Un champignon', ['...rrrr...', '.rrwwrrrr.', 'rrwwrrrwwr', 'rrrrrrrwwr', 'rwwrrrrrrr', '.rrrrrrrr.', '...ssss...', '...ssss...', '..ssssss..', '..........']],
  ['Une étoile', ['....yy....', '....yy....', '...yyyy...', 'yyyyyyyyyy', '.yyyyyyyy.', '..yyyyyy..', '..yyyyyy..', '.yyy..yyy.', '.yy....yy.', '..........']],
  ['Un chat', ['.o......o.', '.oo....oo.', '.oooooooo.', 'oooooooooo', 'oo.oooo.oo', 'oooooooooo', 'ooooppoooo', '.oooooooo.', '..oooooo..', '..........']],
  ['Une maison', ['....rr....', '...rrrr...', '..rrrrrr..', '.rrrrrrrr.', 'rrrrrrrrrr', '.wwwwwwww.', '.wbbwwddw.', '.wbbwwddw.', '.wwwwwddw.', 'gggggggggg']],
  ['Un arbre', ['...gggg...', '..gggggg..', '.gggGgggg.', 'ggGgggggGg', 'gggggGgggg', '.gggggggg.', '..gggggg..', '....dd....', '....dd....', '...dddd...']],
  ['Un bateau', ['....w.....', '....ww....', '....www...', '....wwww..', '....wwwww.', '....k.....', 'rrrrrrrrrr', '.rrrrrrrr.', '..rrrrrr..', 'bbbbbbbbbb']],
  ['Un fantôme', ['...wwww...', '..wwwwww..', '.wwwwwwww.', '.w..ww..w.', '.w..ww..w.', '.wwwwwwww.', '.wwwwwwww.', '.wwwwwwww.', '.ww.ww.ww.', '.w..w..w..']],
  ['Une tasse', ['.w..w.....', '..w..w....', '.w..w.....', 'cccccccc..', 'cddddddccc', 'cccccccc.c', 'cccccccc.c', 'ccccccccc.', '.cccccc...', 'ssssssss..']],
  ['Une clé', ['..........', '..yyy.....', '.yy.yy....', '.y...yyyyy', '.yy.yy.y.y', '..yyy..y.y', '..........', '..........', '..........', '..........']],
  ['Un poisson', ['..........', '....bbb...', '..bbbbbb..', '.bb.bbbbbb', 'bbbbbbbbbb', 'bbbbbbbbbb', '.bbbbbbbbb', '..bbbbbb..', '....bbb...', '..........']],
  ['Une note', ['...vvvvvvv', '...vvvvvvv', '...v.....v', '...v.....v', '...v.....v', '...v.....v', '.vvv...vvv', 'vvvv..vvvv', 'vvvv..vvvv', '.vv....vv.']],
];
// les autres tailles : 5 × 5 pour débuter, 15 × 15 et 20 × 20 pour les grandes images
const MQ_SETS = {10: MQ_PUZ,
  5: [['Un cœur', ['.r.r.', 'rrrrr', 'rrrrr', '.rrr.', '..r..']], ['Une flèche', ['..y..', '.yyy.', 'y.y.y', '..y..', '..y..']], ['Un sourire', ['.y.y.', '.y.y.', '.....', 'y...y', '.yyy.']],
    ['Un sapin', ['..g..', '.ggg.', 'ggggg', '..d..', '..d..']], ['Une maison', ['..r..', '.rrr.', 'rrrrr', '.cdc.', '.cdc.']], ['Un plus', ['..g..', '..g..', 'ggggg', '..g..', '..g..']]],
  15: [['Un chat', ['.o...........o.', '.oo.........oo.', '.ooo.......ooo.', '.ooooooooooooo.', 'ooooooooooooooo', 'ooo..ooooo..ooo', 'ooo..ooooo..ooo', 'ooooooooooooooo', 'oooooooppoooooo', 'ooooo.ooo.ooooo', '.oooooo.oooooo.', '..ooooooooooo..', '...ooooooooo...', '.....ooooo.....', '...............']],
    ['Un voilier', ['.......w.......', '.......ww......', '.......www.....', '.......wwww....', '.......wwwww...', '.......wwwwww..', '.......k.......', '.......k.......', 'rrrrrrrrrrrrrrr', '.rrrrrrrrrrrrr.', '..rrrrrrrrrrr..', '...rrrrrrrrr...', '...............', 'b.bb.bb.bb.bb.b', 'bbbbbbbbbbbbbbb']]],
  20: [['Un champignon', ['......rrrrrrrr......', '....rrrrrrrrrrrr....', '...rrwwrrrrrrwwrr...', '..rrwwwwrrrrwwwwrr..', '.rrrwwwwrrrrwwwwrrr.', '.rrrrwwrrrrrrwwrrrr.', 'rrrrrrrrwwwwrrrrrrrr', 'rrwwrrrwwwwwwrrrwwrr', 'rwwwwrrrwwwwrrrwwwwr', 'rwwwwrrrrrrrrrrwwwwr',
      'rrwwrrrrrrrrrrrrwwrr', '.rrrrrrrrrrrrrrrrrr.', '...rrrrrrrrrrrrrr...', '.....ssssssssss.....', '.....ss.ssss.ss.....', '.....ss.ssss.ss.....', '.....ssssssssss.....', '.....ssssssssss.....', '......ssssssss......', '....................']],
    ['Une fusée', ['.........rr.........', '........rrrr........', '.......rrrrrr.......', '.......cccccc.......', '......cccccccc......', '......ccbbbbcc......', '......ccbbbbcc......', '......cccccccc......', '......cccccccc......', '......cccccccc......',
      '.....rccccccccr.....', '....rrccccccccrr....', '...rrrccccccccrrr...', '...rrrccccccccrrr...', '...rr.cccccccc.rr...', '.......oooooo.......', '........oooo........', '.........yy.........', '........y..y........', '.........yy.........']]]};
const mqs = gstore('mosaique', {solved: {}, cur: 0, games: 0}); mqs.rand ??= 0; mqs.size ??= 10; mqs.curN ??= {};
const mqKey = (n, i) => n === 10 ? String(i) : n + ':' + i;  // les records des grilles 10 × 10 gardent leur ancienne clé
function mqRandom(N = 10) {  // une image tirée au hasard : une forme symétrique lissée, d'une seule couleur, avec au moins une case par ligne
  const hw = Math.ceil(N / 2), mir = x => x < hw ? x : N - 1 - x;  // la moitié gauche, recopiée en miroir (la colonne du milieu une seule fois si N est impair)
  for (;;) {
    let gr = Array.from({length: N}, () => Array.from({length: hw}, () => Math.random() < .55));
    for (let pass = 0; pass < 2; pass++) gr = gr.map((r, y) => r.map((v, x) => { let n = 0; for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) if ((i || j) && x + i >= 0 && x + i < N && gr[y + j]?.[mir(x + i)]) n++; return n >= 5 ? true : n <= 2 ? false : v; }));
    const full = gr.map(r => Array.from({length: N}, (_, x) => r[mir(x)])), fill = full.flat().filter(Boolean).length;
    if (fill < N * N * .35 || fill > N * N * .75 || full.some(r => !r.some(Boolean))) continue;
    const c = 'rbgovpyd'[Math.floor(Math.random() * 8)]; return full.map(r => r.map(v => v ? c : '.').join(''));
  }
}
const runs = line => { const out = []; let n = 0; for (const c of line) { if (c) n++; else if (n) { out.push(n); n = 0; } } if (n) out.push(n); return out.length ? out : [0]; };
const MQ_CANVAS = {5: [288, 216], 10: [288, 216], 15: [400, 300], 20: [512, 384]};
function mqLay(N, rows, cols) {  // la place de la grille : les plus grandes cases qui laissent la place aux nombres, sans toucher le titre en haut à gauche
  const [cw, ch] = MQ_CANVAS[N], LW = Math.max(...rows.map(r => r.length)) * 11 + 10, TH = Math.max(...cols.map(c => c.length)) * 11 + 8;
  for (let C = Math.min(26, Math.floor((cw - 24 - LW) / N)); C >= 11; C--) {
    let X = Math.round(12 + (cw - 24 - LW - N * C) / 2) + LW; const Y = Math.round(12 + (ch - 30 - TH - N * C) / 2) + TH;
    if (Y + N * C > ch - 14 || Y - TH < 10) continue;
    if (Y - TH < 44 && X < 116) X = 116;
    if (X + N * C <= cw - 12) return {N, C, X, Y, LW, TH, cw, ch};
  }
  return {N, C: 11, X: LW + 12, Y: TH + 12, LW, TH, cw, ch};
}
const mqBgs = {};
let mq = null;
function mqNew(i = mqs.size === 10 ? mqs.cur : mqs.curN[mqs.size] ?? 0, N = mqs.size) {
  const set = MQ_SETS[N]; if (i >= set.length) i = 0;
  if (i >= 0) { if (N === 10) mqs.cur = i; else mqs.curN[N] = i; } saveGames();
  const [name, img] = i < 0 ? ['Une mosaïque au hasard', mqRandom(N)] : set[i], sol = img.map(r => [...r].map(c => c !== '.')), rows = sol.map(runs), cols = sol[0].map((_, x) => runs(sol.map(r => r[x])));
  const L = mqLay(N, rows, cols); [W, H] = [L.cw, L.ch]; if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; g.imageSmoothingEnabled = false; }
  mq = Object.assign(mq || {tick: 0, raf: 0}, {mode: 'play', i, N, L, name, img, sol, cells: sol.map(r => r.map(() => 0)), rows, cols, t0: Date.now(), time: 0, hover: null, drag: null, won: 0});
  mqInfo();
}
const mqCell = (x, y) => { const {X, Y, C, N} = mq.L, cx = Math.floor((x - X) / C), cy = Math.floor((y - Y) / C); return cx >= 0 && cy >= 0 && cx < N && cy < N ? [cx, cy] : null; };
const mqSolved = () => mq.cells.every((r, y) => runs(r.map(v => v === 1)).join() === mq.rows[y].join()) && mq.cols.every((c, x) => runs(mq.cells.map(r => r[x] === 1)).join() === c.join());
function mqSet(cx, cy) {
  if (mq.cells[cy][cx] === mq.drag.to) return; mq.cells[cy][cx] = mq.drag.to; beep(mq.drag.to === 1 ? 660 : mq.drag.to === 2 ? 330 : 220, .04, 'square', 0, .04);
  if (mqSolved()) { mq.mode = 'won'; mq.time = Math.round((Date.now() - mq.t0) / 1000); mq.wonAt = mq.tick; if (mq.i < 0) { mq.img = mq.img.map((r, y) => [...r].map((c, x) => mq.cells[y][x] === 1 ? r.replace(/\./g, '') [0] : '.').join('')); mqs.rand++; mqs.gal = [mq.img, ...(mqs.gal || [])].slice(0, 12); } else { const k = mqKey(mq.N, mq.i), b = mqs.solved[k]; if (!b || mq.time < b) mqs.solved[k] = mq.time; } mqs.games++; saveGames(); mqInfo(); [523, 659, 784, 1047].forEach((f, k) => setTimeout(() => beep(f, .15, 'triangle'), k * 110)); }
}
const mqBg = () => mqBgs[W] ??= cnv(W, H, b => {  // un établi de bois et une feuille quadrillée
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const n = (x * 3 + Math.floor(y / 6) * 17) % 23; px(b, y % 6 === 0 ? '#3e2016' : n < 2 ? '#5a3420' : '#6a3e26', x, y); }
  px(b, '#05010b', 8, 8, W - 16, H - 16); px(b, '#f3e8d0', 9, 9, W - 18, H - 18); px(b, '#d9c8a8', 9, H - 11, W - 18, 2);
  for (let y = 12; y < H - 12; y += 4) for (let x = 12; x < W - 12; x += 4) px(b, '#e6d8bc', x, y);
});
function mqDraw() {
  g.drawImage(mqBg(), 0, 0); if (mq.mode === 'won') mq.won = mq.tick - mq.wonAt;
  const {N, C, X, Y, LW, TH} = mq.L, hv = mq.mode === 'play' ? mq.hover : null;
  if (hv) { px(g, '#ffe9a8', X - LW, Y + hv[1] * C, LW + N * C, C); px(g, '#ffe9a8', X + hv[0] * C, Y - TH, C, TH + N * C); }
  // les nombres : en haut pour les colonnes, à gauche pour les lignes (grisés quand la ligne est juste)
  const done = (line, clue) => runs(line.map(v => v === 1)).join() === clue.join();
  const tag = (n, x, y, ok) => { const w = n > 9 ? 12 : 9, l = n > 9 ? x - 7 : x - 4; px(g, ok ? '#e6d8bc' : '#e8dcc0', l, y - 7, w, 9); px(g, ok ? '#d9c8a8' : '#b8a888', l, y + 2, w, 1); pxFont(g, String(n), x + 1, y, ok ? '#a89878' : '#2a2040', 6, 'center'); };
  mq.cols.forEach((c, x) => { const ok = done(mq.cells.map(r => r[x]), c); c.forEach((n, k) => tag(n, X + x * C + C / 2 - 1, Y - 4 - (c.length - 1 - k) * 11, ok)); });
  mq.rows.forEach((r, y) => { const ok = done(mq.cells[y], r); r.forEach((n, k) => tag(n, X - 9 - (r.length - 1 - k) * 11, Y + y * C + Math.round(C / 2) + 4, ok)); });
  // la grille : cases noircies à l'encre, croix rouges, traits plus épais toutes les 5 cases
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const v = mq.cells[y][x], cx = X + x * C, cy = Y + y * C;
    if (mq.mode === 'won' && mq.won > (x + y) * 40 / N) { const c = MQ_PAL[mq.img[y][x]]; px(g, c || '#f3e8d0', cx, cy, C, C); if (c) { px(g, '#ffffff', cx, cy, C, 1); px(g, 'rgba(0,0,0,.25)', cx, cy + C - 1, C, 1); } continue; }
    px(g, v === 1 ? '#2a2040' : '#fbf4e4', cx, cy, C, C);
    if (v === 1) { px(g, '#4a3a6a', cx + 1, cy + 1, C - 2, 1); px(g, '#4a3a6a', cx + 1, cy + 1, 1, C - 2); }
    if (v === 2) for (let k = 3; k < C - 3; k++) { px(g, '#d8484a', cx + k, cy + k); px(g, '#d8484a', cx + C - 1 - k, cy + k); }
  }
  if (mq.mode !== 'won' || mq.won < 40) {
    for (let k = 0; k <= N; k++) { const th = k % 5 === 0 ? 2 : 1, c = k % 5 === 0 ? '#2a2040' : '#b8a888'; px(g, c, X + k * C - (th > 1 ? 1 : 0), Y, th, N * C); px(g, c, X, Y + k * C - (th > 1 ? 1 : 0), N * C, th); }
  }
  pxFont(g, mq.mode === 'won' ? mq.name.toUpperCase() : (mq.i < 0 ? 'AU HASARD' : 'GRILLE ' + (mq.i + 1) + ' / ' + MQ_SETS[N].length), 18, 22, '#2a2040', 8); pxFont(g, N + ' × ' + N, 18, 48, '#8a7aaa', 8);
  pxFont(g, clock(mq.mode === 'won' ? mq.time : (Date.now() - mq.t0) / 1000), 18, 36, '#6a5a8a', 8);
  if (mq.mode === 'won' && mq.won > 50) gameText(g, W, [['BRAVO !', '#ffd84a', 12], [mq.name + ' en ' + clock(mq.time), '#ffffff'], [mq.i < 0 ? 'Clic : une autre au hasard' : mq.i < MQ_SETS[N].length - 1 ? 'Clic : grille suivante' : 'Toutes les grilles de cette taille sont faites !', '#c8b8f0']], H - 36);
}
cv.oncontextmenu = e => e.preventDefault();
cv.onpointerdown = e => {
  e.preventDefault(); if (!mq) return;
  if (mq.mode === 'won') { if (mq.won > 50) mqNew(mq.i < 0 ? -1 : (mq.i + 1) % MQ_SETS[mq.N].length); return; }
  const c = mqCell(...cpos(e)); if (!c) return; const v = mq.cells[c[1]][c[0]], right = e.button === 2 || e.shiftKey;
  mq.drag = {to: right ? (v === 2 ? 0 : 2) : (v === 1 ? 0 : 1)}; try { cv.setPointerCapture(e.pointerId); } catch {} mqSet(...c);
};
cv.onpointermove = e => { if (!mq) return; const c = mqCell(...cpos(e)); mq.hover = c; if (mq.drag && c && mq.mode === 'play') mqSet(...c); };
cv.onpointerup = () => { if (mq) mq.drag = null; };
cv.onpointerleave = () => { if (mq) mq.hover = null; };
function mqInfo() {
  const N = mq.N, set = MQ_SETS[N], total = Object.values(MQ_SETS).reduce((a, s) => a + s.length, 0), n = Object.keys(mqs.solved).length, t = mqs.solved[mqKey(N, mq.i)];
  showStats([['Grilles résolues', n + ' / ' + total], ['Au hasard', mqs.rand], ['Temps sur celle-ci', t ? clock(t) : '-'], ['Parties gagnées', mqs.games]]);
  mqAlbum();
  const rnd = el('option', '', 'Au hasard (nouvelle à chaque fois)'); rnd.value = -1;
  $('mqSel').replaceChildren(rnd, ...set.map(([name], i) => { const o = el('option', '', 'Grille ' + (i + 1) + (mqs.solved[mqKey(N, i)] ? ' · ' + name + ' ✓' : '')); o.value = i; return o; })); $('mqSel').value = mq.i; $('mqSize').value = N;
}
function mqThumb(img, lock) {
  const N = img.length, c = cnv(N, N, b => { if (lock) { const q = ['.###.', '#...#', '...#.', '..#..', '.....', '..#..'], k = Math.max(1, Math.floor(N / 8)), o = Math.floor((N - 5 * k) / 2); q.forEach((r, y) => [...r].forEach((ch, x) => { if (ch === '#') px(b, '#8a7aaa', o + x * k, o + y * k, k, k); })); return; }
    img.forEach((r, y) => [...r].forEach((ch, x) => { if (MQ_PAL[ch]) px(b, MQ_PAL[ch], x, y); })); });
  return c;
}
function mqAlbum() {
  const items = [];
  for (const N of [5, 10, 15, 20]) MQ_SETS[N].forEach(([name, img], i) => { const ok = mqs.solved[mqKey(N, i)] != null, b = el('button', ok ? '' : 'lock'); b.title = ok ? name + ' · ' + N + ' × ' + N : N + ' × ' + N + ' · grille ' + (i + 1);
    b.append(mqThumb(img, !ok), el('span', '', N + '×' + N)); b.onclick = () => { mqs.size = N; mqNew(i, N); }; items.push(b); });
  for (const img of mqs.gal || []) { const b = el('button'); b.title = 'Au hasard · ' + img.length + ' × ' + img.length; b.append(mqThumb(img), el('span', '', 'hasard')); b.tabIndex = -1; b.style.cursor = 'default'; items.push(b); }
  $('mqAlbum').replaceChildren(...items);
}
$('mqSel').onchange = () => { mqNew(+$('mqSel').value); $('mqSel').blur(); };
$('gNew').onclick = () => { mqNew(mq.i); $('gNew').blur(); };
$('mqSize').onchange = () => { mqs.size = +$('mqSize').value; mqNew(); $('mqSize').blur(); };
$('gFs').onclick = () => { $('gFs').blur(); try { if (document.fullscreenElement) document.exitFullscreen(); else cv.parentElement.requestFullscreen?.().catch(() => {}); } catch {} };
function mqCheck() {  // vérification : chaque grille a la bonne taille, et pour chaque taille (grilles faites main et 8 au hasard) les nombres et la grille tiennent dans la feuille sans toucher le titre
  const bad = [];
  for (const [n, set] of Object.entries(MQ_SETS)) {
    const N = +n, imgs = [...set.map(s => s[1]), ...Array.from({length: 8}, () => mqRandom(N))];
    for (const img of imgs) {
      if (img.length !== N || img.some(r => r.length !== N)) { bad.push('taille ' + N); continue; }
      const sol = img.map(r => [...r].map(c => c !== '.')), rows = sol.map(runs), cols = sol[0].map((_, x) => runs(sol.map(r => r[x]))), L = mqLay(N, rows, cols);
      if (L.X - L.LW < 10 || L.Y - L.TH < 10 || L.X + N * L.C > L.cw - 10 || L.Y + N * L.C > L.ch - 12) bad.push('dehors ' + N);
      if (L.C < 11) bad.push('cases trop petites ' + N);
      if (L.Y - L.TH < 44 && L.X < 116) bad.push('titre ' + N);
    }
  }
  return bad.length ? [...new Set(bad)].join(', ') : 'ok';
}
console.assert(mqCheck() === 'ok', 'mosaïque', mqCheck());
cv.__mq = {st: () => mq, check: mqCheck, solved: () => mqs.solved, size: n => { $('mqSize').value = n; $('mqSize').dispatchEvent(new Event('change')); }, solve: () => { mq.cells = mq.sol.map(r => r.map(v => v ? 1 : 0)); const [y, x] = [0, mq.sol[0].findIndex(Boolean)]; mq.cells[y][x] = 0; mq.drag = {to: 1}; mqSet(x, y); mq.drag = null; }};
{ const rs = Array.from({length: 20}, mqRandom); console.assert(MQ_PUZ.every(([, r]) => r.length === 10 && r.every(l => l.length === 10)) && rs.every(r => r.length === 10 && r.every(l => l.length === 10 && l.includes(l.replace(/\./g, '')[0]) && l === [...l].reverse().join(''))) && runs([1, 1, 0, 1]).join() === '2,1' && runs([0, 0]).join() === '0', 'mosaïque'); }
ctx.onOpen(() => { if (!mq) mqNew(); gameLoop(mq, 'mosaique', () => {}, mqDraw); mqInfo(); });

}
