// Night-lab scene authoring. Produces the static layers (back to front).
// All art here is original; the references only informed mood and technique.
import { S0, S1, S2, S3, S4, S5, S6, S7, C0, C1, C2, O0, O1, V0, V1, M1, T } from '../public/js/pixel/palette.js';
import { LEGEND } from '../public/js/pixel/sprites.js';
import { W, H, TUBES, ECG, MONITOR, LEDS } from '../public/js/pixel/scene-core.js';
import { Grid, bayer } from './grid.mjs';

// Tiny 3x5 capitals and digits for lab signage.
const FONT = {
  E: ['###', '#..', '##.', '#..', '###'],
  C: ['###', '#..', '#..', '#..', '###'],
  G: ['###', '#..', '#.#', '#.#', '###'],
  X: ['#.#', '#.#', '.#.', '#.#', '#.#'],
  R: ['##.', '#.#', '##.', '#.#', '#.#'],
  H: ['#.#', '#.#', '###', '#.#', '#.#'],
  I: ['###', '.#.', '.#.', '.#.', '###'],
  7: ['###', '..#', '.#.', '.#.', '.#.'],
  2: ['##.', '..#', '.#.', '#..', '###'],
};
function text(g, str, x, y, c) {
  str.split('').forEach((ch, i) => {
    const f = FONT[ch];
    if (f) f.forEach((row, j) => row.split('').forEach((p, k) => { if (p === '#') g.set(x + i * 4 + k, y + j, c); }));
  });
}

function noise(x, y) {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return n - Math.floor(n);
}
function smoothNoise(x, y, s) {
  const xi = Math.floor(x / s), yi = Math.floor(y / s);
  const fx = x / s - xi, fy = y / s - yi;
  const a = noise(xi, yi), b = noise(xi + 1, yi), c = noise(xi, yi + 1), d = noise(xi + 1, yi + 1);
  const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
  return a * (1 - ux) * (1 - uy) + b * ux * (1 - uy) + c * (1 - ux) * uy + d * ux * uy;
}

// ---------------------------------------------------------------- background
function drawRoom(g) {
  g.rect(0, 0, W, H, S3);
  // Mottled wall so large areas are never flat.
  for (let y = 10; y < 84; y++) for (let x = 0; x < W; x++) {
    const n = smoothNoise(x, y, 11) * 0.7 + smoothNoise(x + 40, y, 4) * 0.3;
    if (n > 0.66 && bayer(x, y) < (n - 0.66) * 4) g.set(x, y, S4);
    if (n < 0.3 && bayer(x, y) < (0.3 - n) * 4) g.set(x, y, S2);
  }
  // Wall panel seams with one lit edge.
  for (const x of [8, 50, 84, 132, 166]) { g.vline(x, 10, 74, S2); g.vline(x + 1, 10, 74, S4); }
  for (const [x, w] of [[9, 41], [85, 47], [133, 33]]) { g.hline(x, 46, w, S2); g.hline(x, 47, w, S4); }
  for (const x of [11, 48, 87, 130, 135, 164]) for (const y of [14, 44, 50, 80]) g.set(x, y, S5);

  // Ceiling: dark slab, beam, conduit.
  g.rect(0, 0, W, 8, S2);
  g.hline(0, 8, W, S4);
  g.rect(0, 9, W, 2, S1);
  for (let x = 6; x < W; x += 30) { g.rect(x, 0, 3, 8, S1); g.vline(x + 3, 0, 8, S3); }
  g.rect(0, 3, W, 3, S3); g.hline(0, 3, W, S5); g.hline(0, 5, W, S2);
  for (let x = 20; x < W; x += 34) { g.rect(x, 2, 2, 5, S4); g.vline(x, 2, 5, S6); }

  // Wainscot and skirting.
  g.rect(0, 84, W, 10, S2);
  g.hline(0, 84, W, S5); g.hline(0, 85, W, S3);
  for (let x = 4; x < W; x += 13) g.vline(x, 86, 8, S1);
  g.rect(0, 92, W, 2, S1);

  // Floor tiles.
  g.rect(0, 94, W, 26, S3);
  g.hline(0, 94, W, S4);
  for (let y = 94; y < H; y++) for (let x = 0; x < W; x++) {
    const row = Math.floor((y - 94) / 7);
    const tx = (x + row * 9) % 18;
    if ((y - 94) % 7 === 0 || tx === 0) g.set(x, y, S2);
    else if ((Math.floor((x + row * 9) / 18) + row) % 2 === 0 && bayer(x, y) < 0.5) g.set(x, y, S4);
  }

  // Wall-mounted ECG display housing.
  g.rect(10, 19, 58, 31, S4);
  g.hline(10, 19, 58, S6); g.vline(10, 19, 31, S5);
  g.hline(10, 49, 58, S2); g.vline(67, 19, 31, S2);
  g.rect(36, 50, 6, 2, S2);
  g.set(62, 48, S1);
  // Stacked panel housing on the wall beside the chair.
  g.rect(70, 49, 13, 31, S4);
  g.hline(70, 49, 13, S5); g.hline(70, 79, 13, S2); g.vline(82, 49, 31, S2);
  g.vline(76, 40, 9, S2);
  // Wall shelf under the display, with a speaker, a stack of folders and a cable drop.
  g.rect(12, 56, 34, 2, S5); g.hline(12, 56, 34, S6); g.hline(12, 57, 34, S2);
  g.rect(14, 50, 8, 6, S4); g.hline(14, 50, 8, S5); g.vline(21, 50, 6, S2);
  g.disc(17, 53, 1.4, 1.4, S1); g.set(20, 52, S2); g.set(20, 54, S2);
  for (const [x, c] of [[25, S3], [28, S5], [31, S4], [34, S3]]) { g.rect(x, 51, 3, 5, c); g.hline(x, 51, 3, S6); g.vline(x + 2, 51, 5, S2); }
  g.cable(44, 50, 40, 62, 1, S1);
  g.cable(47, 50, 44, 66, 1, S2);
  // Conduit from the display up into the ceiling.
  g.vline(64, 10, 9, S2); g.vline(65, 10, 9, S4);
  g.vline(16, 10, 2, S2);

  // Wall breaker box near the rack.
  g.rect(168, 44, 8, 15, S4); g.frame(168, 44, 8, 15, S2); g.hline(169, 45, 6, S5);
  g.rect(170, 50, 4, 6, S2); g.hline(170, 52, 4, S1); g.hline(170, 54, 4, S1);
  g.vline(172, 11, 33, S2); g.vline(173, 11, 33, S4);

  // Pinned paper above the desk, a mundane detail.
  g.rect(72, 24, 8, 10, S5); g.hline(72, 24, 8, S6); g.hline(73, 27, 5, S3); g.hline(73, 29, 6, S3); g.hline(73, 31, 4, S3); g.set(75, 24, S7);
  g.rect(74, 38, 6, 7, S4); g.hline(74, 38, 6, S5); g.hline(75, 41, 3, S2);

  // Cables loosely strung across the wall.
  g.cable(66, 11, 88, 11, 9, S1);
  g.cable(92, 11, 134, 11, 6, S1);
  g.cable(134, 11, 148, 30, 5, S1);
  g.cable(152, 11, 158, 30, 3, S0);
}

function drawTubeHousings(g) {
  for (const t of TUBES) {
    g.rect(t.x - 2, t.y - 2, t.w + 4, 2, S4);
    g.hline(t.x - 2, t.y - 2, t.w + 4, S5);
    g.rect(t.x - 2, t.y, 2, t.h, S2);
    g.rect(t.x + t.w, t.y, 2, t.h, S2);
    g.vline(t.x + 6, 10, t.y - 12, S5);
    g.vline(t.x + t.w - 6, 10, t.y - 12, S5);
  }
}

function drawSignHousing(g) {
  g.rect(94, 11, 28, 21, S4);
  g.frame(94, 11, 28, 21, S2);
  g.hline(95, 12, 26, S5);
  g.vline(99, 9, 2, S5); g.vline(116, 9, 2, S5);
}

// ------------------------------------------------------------------- glow, wall
function drawWallGlow(g) {
  for (const t of TUBES) {
    g.rect(t.x, t.y, t.w, t.h, S7);
    g.hline(t.x, t.y + t.h, t.w, S6);
    // Worn tube ends.
    g.set(t.x, t.y, S6); g.set(t.x + t.w - 1, t.y, S6);
    g.set(t.x, t.y + 1, S5); g.set(t.x + t.w - 1, t.y + 1, S5);
  }

  // ECG screen: dark glass, dotted grid.
  g.rect(12, 21, 54, 27, S1);
  for (let y = 23; y < 48; y += 5) for (let x = 14; x < 50; x += 5) g.set(x, y, C0);
  g.vline(51, 22, 25, C0);
  // Lead label and readout.
  text(g, 'II', 14, 22, C0);
  text(g, 'HR', 54, 23, C0);
  text(g, '72', 54, 30, C2);
  g.rect(54, 37, 10, 1, C0);
  g.hline(54, 40, 10, C0);
  g.hline(54, 42, 7, C1);
  g.hline(54, 44, 9, C0);

  // Stacked panels, dark glass framed in violet. Bars are drawn live.
  for (let p = 0; p < 3; p++) {
    const y = 50 + p * 10;
    g.rect(70, y - 1 + 1, 11, 9, S1);
    g.frame(70, y, 11, 9, V0);
  }

  // Warm sign: the only orange light source in the room. Core, bright ring, dark edge.
  g.rect(96, 13, 24, 17, O1);
  g.frame(96, 13, 24, 17, O0);
  const heart = [
    '...####...####...',
    '..######.######..',
    '.###############.',
    '.###############.',
    '.###############.',
    '..#############..',
    '...###########...',
    '....#########....',
    '.....#######.....',
    '......#####......',
    '.......###.......',
    '........#........',
  ];
  heart.forEach((r, j) => r.split('').forEach((p, i) => { if (p === '#') g.set(99 + i, 15 + j, S7); }));
  // Beat line across the heart.
  g.path([[100, 20], [104, 20], [105, 18], [106, 23], [108, 16], [110, 24], [111, 20], [115, 20]], O1);
}
// ------------------------------------------------------------------------ props
function drawDesk(g) {
  // Worktop.
  g.rect(4, 80, 48, 2, S5); g.hline(4, 80, 48, S6);
  g.rect(4, 82, 48, 2, S3); g.hline(4, 83, 48, S1);
  // Legs and drawer pedestal.
  g.rect(6, 84, 2, 11, S3); g.vline(6, 84, 11, S4);
  g.rect(10, 84, 15, 11, S3); g.vline(10, 84, 11, S4); g.hline(10, 94, 15, S1);
  for (const y of [86, 90]) { g.hline(11, y, 13, S2); g.hline(15, y + 2, 5, S5); }
  g.rect(48, 84, 2, 11, S3); g.vline(48, 84, 11, S4);

  // Monitor (cyan screen drawn in the glow layer).
  g.rect(18, 62, 22, 15, S2);
  g.frame(18, 62, 22, 15, S4);
  g.hline(18, 62, 22, S5);
  g.rect(27, 77, 4, 2, S3); g.hline(27, 77, 4, S4);
  g.rect(24, 79, 10, 1, S4);
  // Keyboard and hand-side clutter.
  g.rect(38, 79, 11, 1, S6);
  for (let x = 39; x < 49; x += 2) g.set(x, 79, S4);
  // Monitor glow pooling on the worktop.
  for (let x = 17; x < 44; x++) if (bayer(x, 80) < 0.55) g.set(x, 80, C0);
  // Mug.
  g.rect(9, 76, 4, 4, S5); g.hline(9, 76, 4, S6); g.vline(13, 77, 2, S4); g.set(10, 77, S1);
  // Stack of papers and a binder lying flat.
  g.rect(5, 79, 3, 1, S6);
  g.rect(14, 79, 3, 1, S4); g.rect(14, 78, 3, 1, S6);
}

function drawChair(g) {
  // Back rest and post.
  g.rect(62, 66, 4, 16, S3); g.vline(62, 66, 16, S4); g.vline(65, 66, 16, S2); g.hline(62, 66, 4, S5);
  g.rect(63, 82, 2, 4, S2);
  // Seat.
  g.rect(50, 84, 16, 3, S3); g.hline(50, 84, 16, S4); g.hline(50, 86, 16, S1);
  // Column and five-star base.
  g.rect(56, 87, 3, 6, S2); g.vline(56, 87, 6, S4);
  g.hline(50, 93, 15, S3);
  for (const x of [50, 57, 64]) { g.rect(x, 94, 2, 2, S1); g.set(x, 94, S4); }
  // Legs reaching under the desk.
  g.rect(39, 83, 14, 3, S3); g.hline(39, 83, 14, S4);
  g.rect(38, 86, 3, 8, S2); g.vline(38, 86, 8, S3);
  g.rect(34, 93, 7, 2, S1); g.hline(34, 93, 7, S4);
}

function drawShelf(g) {
  const L = 88, R = 128;
  // Back panel in shadow so items read against it.
  g.rect(L + 2, 36, R - L - 2, 58, S2);
  for (let y = 36; y < 94; y++) for (let x = L + 2; x < R; x++) if (bayer(x, y) < 0.45) g.set(x, y, S1);

  // Boards.
  for (const y of [34, 50, 66, 82, 93]) {
    g.rect(L, y, R - L + 2, 2, S4);
    g.hline(L, y, R - L + 2, S6);
    g.hline(L, y + 1, R - L + 2, S3);
    g.hline(L + 2, y + 2, R - L - 2, S1);
  }
  // Uprights.
  for (const x of [L, R]) {
    g.rect(x, 34, 2, 61, S4); g.vline(x, 34, 61, S5); g.vline(x + 1, 34, 61, S3);
    for (let y = 38; y < 92; y += 4) g.set(x + 1, y, S1);
  }

  // Row A: lightbox housing and jars.
  g.rect(90, 36, 25, 14, S3); g.frame(90, 36, 25, 14, S4); g.hline(90, 36, 25, S5);
  for (const [x, h, cap] of [[118, 9, S5], [123, 6, S6]]) {
    g.rect(x, 50 - h, 4, h, S4); g.vline(x, 50 - h, h, S5); g.vline(x + 3, 50 - h, h, S2);
    g.rect(x, 50 - h - 2, 4, 2, cap);
    g.hline(x + 1, 50 - 3, 2, S6);
  }

  // Row B: binders.
  const binders = [[91, 3, S5, S6], [94, 4, V0, S6], [98, 3, S4, S5], [101, 4, C0, C1], [105, 3, S5, S6], [108, 4, V0, S6], [112, 3, S4, S6]];
  for (const [x, w, c, hi] of binders) {
    g.rect(x, 53, w, 13, c);
    g.vline(x, 53, 13, hi === C1 ? C0 : S4);
    g.vline(x + w - 1, 53, 13, S1);
    g.hline(x, 53, w, hi);
    g.rect(x + 1, 56, w - 2 > 0 ? w - 2 : 1, 2, S6);
    g.set(x + 1, 62, S1);
  }
  // One binder leaning, one small box.
  g.path([[116, 65], [120, 54]], S5); g.path([[117, 65], [121, 54]], S4); g.path([[118, 65], [122, 54]], S4); g.path([[119, 65], [123, 54]], S2);
  // Row C: anatomical heart model on a stand.
  const heart = [
    '....6666.55...',
    '...66..66.5...',
    '...6.5..6.5...',
    '...oo655vvv...',
    '..oOOo5ovvVv..',
    '.oOOooooovvvv.',
    '.oOoooo4vvvvv.',
    '.ooooo4vvvvVv.',
    '.oooo4vvvvvvv.',
    '..ooo4vvvvvv..',
    '...oo4vvvvv...',
    '....o4vvvv....',
    '.....ovvv.....',
    '......4.......',
  ];
  g.sprite(heart, 91, 67, LEGEND);
  g.rect(93, 81, 10, 1, S5); g.hline(93, 81, 10, S6);
  // Stacked boxes.
  g.rect(110, 72, 16, 10, S3); g.hline(110, 72, 16, S5); g.vline(110, 72, 10, S4); g.vline(125, 72, 10, S2);
  g.rect(115, 76, 6, 2, S6);
  g.rect(112, 68, 10, 4, S4); g.hline(112, 68, 10, S5); g.vline(121, 68, 4, S2);
  // Row D: crates.
  for (const [x, w, c] of [[91, 12, S3], [104, 9, S4], [114, 12, S3]]) {
    g.rect(x, 85, w, 8, c); g.hline(x, 85, w, S5); g.vline(x + w - 1, 85, 8, S1);
    for (let i = x + 2; i < x + w - 1; i += 3) g.vline(i, 87, 5, S2);
  }
  // On top of the shelf: coiled cable and a small box.
  g.rect(122, 30, 6, 4, S3); g.hline(122, 30, 6, S5);
  g.frame(89, 29, 5, 5, S4); g.set(91, 31, S2);
}

function drawRack(g) {
  const x = 136, y = 32, w = 29, h = 62;
  g.rect(x, y, w, h, S2);
  g.frame(x, y, w, h, S4);
  g.hline(x, y, w, S6);
  g.vline(x, y, h, S5);
  g.vline(x + 1, y + 1, h - 2, S1);
  g.vline(x + w - 2, y + 1, h - 2, S1);
  // Eight rack units.
  for (let i = 0; i < 8; i++) {
    const uy = y + 2 + i * 7;
    g.rect(x + 3, uy, w - 6, 6, i % 3 === 1 ? S3 : S2);
    g.hline(x + 3, uy, w - 6, S4);
    g.hline(x + 3, uy + 5, w - 6, S0);
    g.set(x + 3, uy + 2, S5);
    g.set(x + w - 4, uy + 2, S5);
    // LED sockets.
    g.set(141, uy + 1, S1); g.set(143, uy + 1, S1);
    if (i % 3 === 0) {
      for (let k = 146; k < 161; k += 2) g.vline(k, uy + 1, 4, S1);
    } else if (i % 3 === 1) {
      for (let k = 146; k < 161; k += 4) { g.rect(k, uy + 1, 3, 3, S4); g.hline(k, uy + 1, 3, S5); g.set(k + 2, uy + 3, S1); }
    } else {
      g.hline(146, uy + 2, 14, S1); g.hline(146, uy + 3, 10, S4);
    }
  }
  // Feet and a floor cable.
  g.rect(x + 2, y + h, 3, 1, S1); g.rect(x + w - 5, y + h, 3, 1, S1);
  // Patch cables between units, in the room's accent colours.
  g.cable(158, 34, 160, 48, 2, C0);
  g.cable(150, 55, 158, 62, 3, V0);
  g.cable(148, 76, 156, 90, 2, S5);
}

function drawLightboxGlow(g) {
  // Backlit lightbox with an illustrated chest film. Original art, no patient data.
  const X = 91, Y = 37, FW = 23, FH = 12;
  g.rect(X, Y, FW, FH, S7);
  const fx = X + 1, fy = Y + 1, w = FW - 2, h = FH - 2;
  g.rect(fx, fy, w, h, S5);
  const cx = (w - 1) / 2;
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const inside = (u, v, rx, ry) => ((i - u) / rx) ** 2 + ((j - v) / ry) ** 2 <= 1;
    if (inside(cx - 5.2, 5.2, 4.3, 5.6) || inside(cx + 5.2, 5.2, 4.3, 5.6)) {
      // Ribs sweep downward away from the spine.
      const rib = ((j - Math.floor(Math.abs(i - cx) / 3)) % 3 + 3) % 3 === 0;
      g.set(fx + i, fy + j, rib ? S4 : S1);
    }
  }
  // Clavicles, spine, cardiac silhouette, diaphragm.
  g.hline(fx + 2, fy, 7, S7); g.hline(fx + w - 9, fy, 7, S7);
  for (let j = 0; j < h; j++) g.rect(fx + cx - 1, fy + j, 3, 1, S6);
  g.rect(fx + cx, fy + 5, 4, 3, S6); g.rect(fx + cx, fy + 8, 3, 1, S6);
  g.hline(fx, fy + h - 1, w, S6);
}

function drawPropsGlow(g) {
  // Monitor glass.
  g.rect(MONITOR.x, MONITOR.y, MONITOR.w, MONITOR.h, C0);
  g.hline(MONITOR.x, MONITOR.y, MONITOR.w, C1);
  for (let y = MONITOR.y + 2; y < MONITOR.y + MONITOR.h; y += 2) g.dither(MONITOR.x, y, MONITOR.w, 1, S2, 0.5);
  drawLightboxGlow(g);
}

// ------------------------------------------------------------------- foreground
function leaf(g, x0, y0, len, ang, bend, width) {
  // A blade that widens quickly, tapers to a point and arches outward.
  let x = x0, y = y0, a = ang;
  for (let i = 0; i <= len; i++) {
    const t = i / len;
    const r = width * Math.min(1, t * 4.5) * (1 - t) ** 0.65;
    g.disc(x, y, Math.max(0.4, r), Math.max(0.4, r), S0);
    x += Math.cos(a); y += Math.sin(a);
    a += bend / len;
  }
}

function drawForeground(g) {
  // Tall plant at the right edge, reaching up in front of the rack.
  const base = { x: 170, y: 112 };
  const leaves = [
    [-1.6, -0.5, 58, 3.0], [-1.85, -1.0, 56, 3.0], [-1.45, 1.0, 40, 2.6], [-2.1, -1.1, 46, 2.8],
    [-1.75, 0.7, 40, 2.4], [-2.4, -1.0, 38, 2.6], [-1.25, 1.1, 26, 2.2], [-2.7, -0.8, 28, 2.2],
    [-2.0, 0.4, 28, 2.0],
  ];
  for (const [a, b, l, w] of leaves) leaf(g, base.x, base.y, l, a, b, w);
  g.rect(158, 108, 22, 12, S0);
  g.hline(156, 107, 24, S0);

  // Bottom-left: stool, cable loop and a case on the floor.
  g.rect(0, 110, 30, 10, S0);
  for (let x = 30; x < 42; x++) g.vline(x, 110 + Math.floor((x - 30) * 0.9), 10, S0);
  g.rect(6, 104, 16, 6, S0); g.rect(9, 102, 10, 2, S0); g.rect(12, 100, 3, 2, S0);
  g.cable(40, 119, 86, 119, -7, S0);
  g.cable(44, 119, 90, 119, -5, S0);
  g.rect(82, 113, 22, 7, S0); g.rect(86, 111, 14, 2, S0);

  // Cable bundle dropping from the ceiling, clear of the sign.
  g.cable(66, 0, 88, 8, 14, S0);
  g.cable(68, 0, 90, 10, 16, S0);
  g.cable(124, 2, 134, 22, 3, S0);
  g.cable(126, 0, 138, 30, 4, S0);
  g.rect(87, 8, 4, 3, S0);
}

// ------------------------------------------------------------------------ light
const LIGHTS = [
  { kind: 'seg', x0: 14, x1: 60, y: 14, r: 62, i: 2.3, c: 'w' },
  { kind: 'seg', x0: 130, x1: 174, y: 16, r: 62, i: 2.3, c: 'w' },
  { kind: 'pt', x: 39, y: 36, r: 34, i: 0.85, c: 'c' },
  { kind: 'pt', x: 29, y: 72, r: 26, i: 1.0, c: 'c' },
  { kind: 'pt', x: 108, y: 22, r: 26, i: 1.05, c: 'o' },
  { kind: 'pt', x: 76, y: 64, r: 15, i: 0.55, c: 'v' },
  { kind: 'pt', x: 102, y: 43, r: 13, i: 0.5, c: 'w' },
  { kind: 'pt', x: 142, y: 62, r: 11, i: 0.35, c: 'c' },
  // Tube reflections pooling on the floor.
  { kind: 'seg', x0: 60, x1: 90, y: 104, r: 26, i: 1.2, c: 'w' },
  { kind: 'seg', x0: 112, x1: 150, y: 106, r: 24, i: 1.1, c: 'w' },
  { kind: 'seg', x0: 14, x1: 44, y: 98, r: 9, i: 0.55, c: 'c' },
];

function lightAt(x, y) {
  const out = { w: 0, c: 0, o: 0, v: 0 };
  for (const l of LIGHTS) {
    const dx = l.kind === 'seg' ? x - Math.max(l.x0, Math.min(l.x1, x)) : x - l.x;
    const dy = y - l.y;
    const d = Math.hypot(dx, dy);
    const f = Math.max(0, 1 - d / l.r);
    out[l.c] += l.i * f ** 1.6;
  }
  return out;
}

function applyLight(g, { ambient, tint, dithered = true }) {
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const c = g.get(x, y);
      if (c === T) continue;
      const L = lightAt(x, y);
      const lum = ambient + L.w + L.c * 0.65 + L.o * 0.5 + L.v * 0.4;
      const b = dithered ? bayer(x, y) : 0.5;
      const shift = Math.floor(lum + b);
      if (c <= S7) {
        let lvl = Math.max(S0 + 1, Math.min(S6, c + shift));
        if (c === S7) lvl = S7;
        let out = lvl;
        if (tint && lvl >= S2 && lvl <= S5) {
          if (L.c * 0.62 > 0.16 + b * 0.62) out = C0;
          else if (L.o * 0.7 > 0.2 + b * 0.7) out = O0;
          else if (L.v * 0.8 > 0.18 + b * 0.7) out = V0;
        }
        g.set(x, y, out);
      } else if (shift < 0 && b > 0.5) {
        g.set(x, y, c === C0 || c === V0 || c === O0 ? S3 : c);
      }
    }
  }
}

/** Soft contact shadows on the wall and floor, cast by the props layer. */
function castShadow(bg, props) {
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (props.get(x, y) !== T) continue;
      const near = props.get(x - 2, y - 2) !== T || props.get(x - 3, y - 1) !== T;
      const c = bg.get(x, y);
      if (near && c <= S7 && c > S1) bg.set(x, y, c - 1);
    }
  }
  // Contact shadows on the floor beneath furniture.
  for (const [x, w] of [[4, 62], [88, 42], [134, 33]]) {
    for (let y = 94; y < 100; y++) for (let i = x; i < x + w; i++) {
      if (bayer(i, y) < 1 - (y - 94) / 6) { const c = bg.get(i, y); if (c > S1 && c <= S7) bg.set(i, y, c - 1); }
    }
  }
}

export function buildScene() {
  const bg = new Grid(W, H);
  const glowWall = new Grid(W, H);
  const props = new Grid(W, H);
  const glowProps = new Grid(W, H);
  const fg = new Grid(W, H);

  drawRoom(bg);
  drawTubeHousings(bg);
  drawSignHousing(bg);
  drawWallGlow(glowWall);

  drawDesk(props);
  drawChair(props);
  drawShelf(props);
  drawRack(props);
  drawPropsGlow(glowProps);
  drawForeground(fg);

  castShadow(bg, props);
  applyLight(bg, { ambient: -1.05, tint: true });
  applyLight(props, { ambient: -0.45, tint: false, dithered: false });

  return [
    { name: 'bg', depth: 0, data: bg.d },
    { name: 'glow-wall', depth: 0, data: glowWall.d },
    { name: 'props', depth: 1, data: props.d },
    { name: 'glow-props', depth: 1, data: glowProps.d },
    { name: 'fg', depth: 2, data: fg.d },
  ];
}

export { ECG, LEDS };
