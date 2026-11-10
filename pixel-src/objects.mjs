// Isolated 48 x 48 objects for research cards, project cards and hobbies.
// Three-quarter view, light from the top left, 1px S1 outline, 3-4 tones per material.
// Each object has four frames: frame 0 is the resting state, frames 1-3 play once on hover.
import { S1, S2, S3, S4, S5, S6, S7, C0, C1, C2, O0, O1, V0, V1, M1, T } from '../public/js/pixel/palette.js';
import { Grid, IsoBox } from './grid.mjs';

const SIZE = 48;

// Reusable materials: top, left, right, front-edge highlight.
const CREAM = [S7, S6, V0, S7];
const SLATE = [S5, S4, S3, S5];
const DARK = [S4, S3, S2, S4];
const VIOLET = [S6, V0, S4, S6];

const box = (g, cx, ty, wl, wr, h, m) => new IsoBox(g, cx, ty, wl, wr, h).fill(...m);

function wheel(g, x, y) {
  g.rect(x, y, 3, 3, S2); g.set(x, y, S4); g.set(x + 1, y + 1, S5);
}

/** Skewed ECG trace on the left face of a box. */
function ecgOnLeft(b, u0, v0, len, c, hi, shift = 0) {
  const beat = [0, 0, 0, -1, 0, 0, 2, -5, 3, 0, 0, -1, -1, 0, 0, 0];
  for (let i = 0; i < len; i++) {
    const y = beat[(i + shift) % beat.length];
    b.plotL(u0 + len - 1 - i, v0 + y, Math.abs(y) > 2 ? hi : c);
    if (Math.abs(y) > 2) b.plotL(u0 + len - 1 - i, v0 + y + Math.sign(-y), c);
  }
}

// ------------------------------------------------------------------ research
function ecgCart(g, f) {
  // Base shelf, wheels and post.
  for (const [x, y] of [[13, 39], [31, 39], [22, 43]]) wheel(g, x, y);
  g.rect(22, 30, 2, 12, S4); g.vline(22, 30, 12, S5);
  box(g, 23, 36, 9, 9, 3, SLATE);
  // Printer unit with paper strip.
  box(g, 23, 28, 11, 9, 5, CREAM);
  // Paper strip feeding out of the right face.
  const strip = new IsoBox(g, 23, 28, 11, 9, 5);
  for (let u = 2; u < 8; u++) { strip.plotR(u, 2, S7); strip.plotR(u, 3, S6); }
  // Monitor.
  const m = box(g, 23, 15, 14, 9, 13, CREAM);
  m.paintL(1, 1, 12, 10, S1);
  ecgOnLeft(m, 1, 6, 12, f === 2 ? C2 : C1, f === 0 ? C2 : S7, f);
  for (let u = 1; u < 8; u++) m.plotR(u, 11, S2);
  m.plotR(2, 2, f % 2 ? S4 : M1);
  m.plotR(4, 2, S2);
  m.paintR(2, 5, 5, 1, S4);
  m.paintR(2, 7, 5, 1, S4);
}

function lightbox(g, f) {
  // Foot and legs.
  box(g, 22, 40, 10, 10, 2, SLATE);
  g.rect(21, 32, 3, 8, S4); g.vline(21, 32, 8, S5);
  // Thin illuminated panel. Illustrated chest film, not patient data.
  const p = box(g, 26, 26, 22, 4, 22, SLATE);
  const lit = f === 1 ? S6 : S7;
  p.paintL(1, 1, 20, 20, lit);
  p.paintL(2, 2, 18, 18, S5);
  const cx = 10.5;
  for (let v = 2; v < 20; v++) for (let u = 2; u < 20; u++) {
    const inside = (a, b, rx, ry) => ((u - a) / rx) ** 2 + ((v - b) / ry) ** 2 <= 1;
    if (inside(cx - 4.5, 10, 3.6, 7.2) || inside(cx + 4.5, 10, 3.6, 7.2)) {
      const rib = ((v - Math.floor(Math.abs(u - cx) / 2)) % 3 + 3) % 3 === 0;
      p.plotL(u, v, rib ? S4 : S1);
    }
  }
  for (let v = 2; v < 20; v++) { p.plotL(10, v, S6); p.plotL(11, v, S6); }
  for (let v = 10; v < 16; v++) { p.plotL(8, v, S6); p.plotL(9, v, S6); }
  p.paintL(3, 3, 7, 1, S7); p.paintL(12, 3, 7, 1, S7);
  p.paintL(2, 18, 18, 1, S6);
  if (f === 2) p.paintL(1, 1, 20, 1, C2);
  p.plotR(1, 19, f === 3 ? S2 : M1);
}

function ultrasound(g, f) {
  for (const [x, y] of [[14, 40], [29, 40], [22, 44]]) wheel(g, x, y);
  const body = box(g, 23, 31, 9, 9, 10, VIOLET);
  body.paintL(2, 2, 5, 1, S6); body.paintL(2, 5, 5, 1, S6);
  // Control deck.
  const deck = box(g, 23, 25, 12, 9, 2, CREAM);
  void deck;
  g.set(17, 22, C1); g.set(20, 21, M1); g.set(23, 22, S3); g.set(21, 19, S3); g.set(25, 19, S3);
  // Monitor on a short arm.
  g.rect(26, 15, 2, 7, S4);
  const m = box(g, 28, 7, 15, 6, 13, CREAM);
  m.paintL(1, 1, 13, 11, S1);
  // Fan-shaped echo sector.
  const ax = 6.5, ay = 1.5;
  for (let v = 1; v < 12; v++) for (let u = 1; u < 14; u++) {
    const d = Math.hypot(u - ax, v - ay), a = Math.abs(u - ax) / Math.max(0.5, v - ay);
    if (a <= 0.75 && d <= 10) {
      const ring = Math.floor(d) % 3 === 0;
      m.plotL(u, v, ring ? C1 : C0);
    }
  }
  // Scan line sweeps through the sector on hover.
  if (f > 0) {
    const off = [-3, 0, 3][f - 1];
    for (let k = 1; k < 10; k++) {
      const u = Math.round(ax + (off * k) / 9), v = 1 + k;
      m.plotL(u, v, C2);
    }
  } else {
    m.plotL(5, 6, C2); m.plotL(8, 7, C2); m.plotL(6, 9, C2);
  }
  // Probe hanging from the deck on a cable.
  g.cable(33, 25, 37, 37, 2, S3);
  g.rect(36, 35, 3, 5, S6); g.vline(38, 35, 5, V0); g.set(36, 35, S7);
}

function ehrTerminal(g, f) {
  // Keyboard.
  const k = box(g, 20, 41, 12, 10, 2, SLATE);
  for (let i = 2; i < 12; i += 2) { const [x, y] = k.L(i, -3); g.set(x, y, S7); const [a, b] = k.L(i, -5); g.set(a + 2, b + 1, S6); }
  // Monitor stand.
  box(g, 28, 33, 6, 6, 2, SLATE);
  g.rect(27, 29, 3, 5, S4);
  // Monitor with a data table and a temporal bar.
  const m = box(g, 28, 12, 22, 5, 19, CREAM);
  m.paintL(1, 1, 20, 17, S1);
  m.paintL(2, 2, 18, 2, C0);
  for (let u = 3; u < 19; u += 5) m.paintL(u, 2, 3, 1, C1);
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 3; c++) {
      const w = [4, 3, 5, 2, 4][(r + c * 2) % 5];
      const col = r === (f % 5) + 0 && f > 0 ? C2 : c === 1 ? C0 : c === 2 && r % 2 ? M1 : C1;
      m.paintL(3 + c * 6, 6 + r * 2, w, 1, col);
    }
  }
  m.paintR(1, 3, 3, 1, S4); m.paintR(1, 6, 3, 1, S4);
  m.plotR(1, 15, f % 2 ? S3 : M1);
}

function robot(g, cx, ty, mat, eye, flip) {
  // Legs.
  g.rect(cx - 3, ty + 13, 2, 3, S3); g.rect(cx + 1, ty + 13, 2, 3, S3);
  // Torso and head.
  box(g, cx, ty + 7, 5, 4, 6, mat);
  const h = box(g, cx, ty, 6, 5, 5, mat);
  // One glowing eye, facing the shared terminal.
  if (flip) { h.plotL(1, 2, eye); h.plotL(2, 2, eye); h.plotL(1, 3, S1); h.plotL(2, 3, S1); }
  else { h.plotR(1, 2, eye); h.plotR(2, 2, eye); h.plotR(1, 3, S1); h.plotR(2, 3, S1); }
  // Antenna.
  g.vline(cx, ty - 7, 4, S5); g.set(cx, ty - 8, eye);
}

function agents(g, f) {
  // Low desk carrying the shared terminal.
  box(g, 24, 37, 9, 9, 3, SLATE);
  g.rect(23, 27, 3, 6, S4); g.vline(23, 27, 6, S5);
  const s = box(g, 24, 15, 11, 5, 12, CREAM);
  s.paintL(1, 1, 9, 9, S1);
  s.paintL(2, 2, 5, 1, C2); s.paintL(2, 4, 7, 1, C1); s.paintL(2, 6, 4, 1, C0);
  if (f > 0) s.paintL(2, 2 + (f - 1) * 2, 3, 1, S7);
  s.plotR(1, 9, f % 2 ? S3 : M1);
  robot(g, 8, 26, CREAM, C2, false);
  robot(g, 39, 26, VIOLET, M1, true);
  // Messages passing over the terminal.
  const dots = [[10, 14], [13, 9], [18, 5], [24, 3], [30, 5], [35, 9], [38, 14]];
  dots.forEach(([x, y], i) => g.set(x, y, (i + f * 2) % 3 === 0 ? C2 : C0));
}

// ------------------------------------------------------------------ projects
function homeRobot(g, f) {
  // Corner of a small room. Walls rise from the back edges of the floor rhombus.
  for (let x = 3; x < 24; x++) g.vline(x, 1 + Math.floor((24 - x) / 2), 19, x === 3 ? S6 : S5);
  for (let x = 24; x < 45; x++) g.vline(x, 1 + Math.floor((x - 24) / 2), 19, x === 24 ? S5 : S4);
  new IsoBox(g, 24, 38, 21, 21, 2).fill(S6, S4, S3, S5);
  // Rule sheet pinned on the left wall.
  for (let i = 0; i < 10; i++) for (let j = 0; j < 9; j++) g.set(8 + i, 4 + Math.floor((17 - i) / 2) - 3 + j, S7);
  for (let r = 0; r < 3; r++) for (let i = 1; i < 9; i++) {
    g.set(8 + i, 5 + Math.floor((17 - i) / 2) - 3 + r * 2, r === (f % 3) && f > 0 ? C2 : C1);
  }
  // Shelf on the right wall.
  for (let i = 0; i < 12; i++) { g.set(28 + i, 13 + Math.floor(i / 2), S6); g.set(28 + i, 14 + Math.floor(i / 2), S2); }
  g.rect(30, 9, 2, 5, V0); g.rect(33, 11, 2, 4, C1); g.rect(36, 12, 2, 4, M1);
  // Table with a mug the robot has been asked to place.
  box(g, 33, 30, 7, 7, 1, CREAM);
  g.vline(27, 29, 4, S3); g.vline(39, 29, 4, S3); g.vline(33, 31, 5, S3);
  g.rect(32, 24, 3, 3, C1); g.set(32, 24, C2); g.set(35, 25, C0);
  // Small helper robot.
  g.rect(12, 34, 2, 3, S2); g.rect(17, 34, 2, 3, S2);
  box(g, 15, 27, 5, 5, 7, CREAM);
  const h = box(g, 15, 21, 6, 5, 5, VIOLET);
  h.plotR(1, 2, C2); h.plotR(2, 2, C2);
  g.vline(15, 14, 3, S5); g.set(15, 13, f % 2 ? M1 : C2);
}

function robotArm(g, f) {
  // Table with a goal marker.
  const t = box(g, 24, 31, 21, 21, 4, [S6, S5, V0, S7]);
  void t;
  // Goal outline on the table.
  for (let i = 0; i < 6; i++) { g.set(9 + i, 26 - Math.floor(i / 2) + 2, f > 0 ? C2 : M1); g.set(9 + i, 26 + Math.floor((i + 1) / 2) + 2, f > 0 ? C2 : M1); g.set(15 + i - 1, 25 + Math.floor((i + 1) / 2), f > 0 ? C2 : M1); g.set(15 + i - 1, 31 - Math.floor(i / 2), f > 0 ? C2 : M1); }
  // Blocks.
  box(g, 33, 25, 4, 4, 4, [C2, C1, C0, C2]);
  box(g, 28, 34 - 4, 3, 3, 3, [S6, V0, S3, S6]);
  // Arm base.
  box(g, 22, 22, 6, 6, 3, DARK);
  // Segments.
  const lift = f === 2 ? -1 : 0;
  g.rect(20, 11 + lift, 4, 11, S5); g.vline(20, 11 + lift, 11, S7); g.vline(23, 11 + lift, 11, S4);
  g.disc(22, 11 + lift, 3, 3, S6); g.set(21, 10 + lift, S7); g.set(23, 12 + lift, S4);
  for (let i = 0; i < 12; i++) { g.rect(23 + i, 10 + lift + Math.floor(i / 3), 2, 4, S4); g.set(23 + i, 10 + lift + Math.floor(i / 3), S7); g.set(23 + i, 11 + lift + Math.floor(i / 3), S6); }
  g.disc(35, 15 + lift, 2, 2, S6);
  // Gripper.
  g.rect(33, 17 + lift, 5, 1, S4); g.vline(33, 18 + lift, 3, S3); g.vline(37, 18 + lift, 3, S3);
  g.set(35, 15 + lift, f === 0 ? M1 : C2);
}

function videoPose(g, f) {
  // Two receding frames behind the main frame.
  const back2 = box(g, 34, 14, 18, 2, 18, DARK); void back2;
  const back1 = box(g, 30, 18, 18, 2, 18, SLATE); void back1;
  const m = box(g, 26, 22, 20, 2, 20, CREAM);
  m.paintL(1, 1, 18, 18, S1);
  // Film perforations.
  for (let u = 2; u < 19; u += 3) { m.plotL(u, 1, S4); m.plotL(u, 18, S4); }
  // Pose skeleton on the main frame. Joints jitter less on later frames, a stability nod.
  const j = [0, 1, 0, -1][f];
  const pts = {
    head: [10, 4], neck: [10, 7], hip: [10 + j, 12],
    lh: [6, 9 + j], rh: [14, 6], lk: [7 + j, 15], rk: [13, 15], la: [5 + j, 17], ra: [15, 17],
  };
  const seg = (a, b, c) => {
    const [ax, ay] = pts[a], [bx, by] = pts[b];
    const n = Math.max(Math.abs(ax - bx), Math.abs(ay - by), 1);
    for (let i = 0; i <= n; i++) m.plotL(Math.round(ax + ((bx - ax) * i) / n), Math.round(ay + ((by - ay) * i) / n), c);
  };
  for (const [a, b] of [['head', 'neck'], ['neck', 'hip'], ['neck', 'lh'], ['neck', 'rh'], ['hip', 'lk'], ['hip', 'rk'], ['lk', 'la'], ['rk', 'ra']]) seg(a, b, C2);
  for (const k of ['lh', 'rh', 'la', 'ra', 'lk', 'rk']) m.plotL(...pts[k], M1);
  m.plotL(...pts.head, C2); m.plotL(10, 3, C2); m.plotL(9, 4, C2); m.plotL(11, 4, C2);
}

function arHeadset(g, f) {
  // Spatial strokes drawn in the air above the headset.
  const strokes = [
    { c: C1, pts: [[6, 15], [9, 8], [15, 4], [20, 7], [18, 13], [24, 16]] },
    { c: V0, pts: [[24, 16], [29, 11], [33, 4], [38, 3], [41, 8], [38, 13]] },
    { c: M1, pts: [[38, 13], [34, 15], [31, 14]] },
  ];
  for (const s of strokes) { g.path(s.pts, s.c); g.path(s.pts.map(([x, y]) => [x + 1, y + 1]), s.c === V0 ? S6 : C0); }
  g.set(9, 7, S7); g.set(36, 3, S7);
  const sp = [[3, 6], [26, 3], [44, 16], [14, 15]][f];
  g.set(sp[0], sp[1], C2);
  // Strap arching over the top and around the back.
  g.cable(9, 30, 41, 26, -12, S4);
  g.cable(9, 31, 41, 27, -12, S3);
  g.cable(9, 32, 41, 28, -12, S2);
  // Visor.
  const v = box(g, 28, 30, 21, 12, 11, CREAM);
  v.paintL(1, 1, 19, 9, S2);
  v.paintL(2, 2, 17, 7, f === 2 ? C1 : C0);
  v.paintL(3, 3, 6, 1, C2); v.paintL(3, 5, 10, 1, C1); v.paintL(11, 3, 3, 1, C1);
  // Foam and vents on the side.
  v.paintR(1, 2, 3, 1, S3); v.paintR(1, 4, 3, 1, S3);
  v.plotR(9, 8, f % 2 ? S3 : M1);
  // Round off the far corners.
  const [ax, ay] = v.L(20, 0); g.set(ax, ay, T);
  const [cx, cy] = v.L(20, 10); g.set(cx, cy, T);
  const [dx, dy] = v.R(11, 10); g.set(dx, dy, T);
}

// ------------------------------------------------------------------- hobbies
function camera(g, f) {
  const b = box(g, 28, 22, 22, 13, 15, DARK);
  // Silver top plate and leatherette band.
  b.paintL(0, 0, 22, 3, S6); b.paintR(0, 0, 13, 3, S5);
  new IsoBox(g, 28, 22, 22, 13, 0).fill(S6, S6, S6);
  for (let v = 5; v < 14; v += 2) for (let u = 18; u < 21; u += 2) b.plotL(u, v, S1);
  for (let v = 5; v < 14; v += 2) for (let u = 1; u < 4; u += 2) b.plotL(u, v, S2);
  // Viewfinder hump, shutter and dial on the top plate.
  box(g, 22, 12, 5, 4, 3, [S7, S6, S4, S7]);
  g.rect(11, 12, 4, 2, S3); g.hline(11, 12, 4, S7);
  g.rect(33, 12, 3, 2, S4); g.hline(33, 12, 3, S7);
  // Lens barrel.
  const lx = 16, ly = 27;
  g.disc(lx, ly, 9, 9, S1);
  g.disc(lx, ly, 8, 8, S5);
  g.disc(lx, ly, 7, 7, S3);
  g.disc(lx, ly, 5, 5, S1);
  g.disc(lx, ly, 3.4, 3.4, f === 1 ? C1 : C0);
  g.disc(lx, ly, 1.2, 1.2, S1);
  g.set(lx - 2, ly - 2, f === 2 ? S7 : C2);
  g.set(lx - 1, ly - 3, C1);
  g.set(lx - 5, ly - 5, S7); g.set(lx - 4, ly - 6, S6); g.set(lx - 6, ly - 4, S6);
  // Flash window and status light.
  b.paintR(3, 5, 4, 3, f === 1 ? S7 : S1);
  b.plotR(9, 6, f % 2 ? S2 : M1);
}

function watercolor(g, f) {
  const t = box(g, 24, 33, 21, 21, 3, CREAM);
  void t;
  // Recessed paint wells.
  const wells = [[12, 28, C1], [18, 25, V0], [24, 22, M1], [18, 31, O1], [24, 28, V1], [30, 25, C2], [30, 31, S4], [36, 28, S2]];
  wells.forEach(([x, y, c], i) => {
    g.disc(x, y, 2.6, 1.6, S4);
    g.disc(x, y, 2, 1.1, c);
    if ((i + f) % 4 === 1 && f > 0) g.set(x - 1, y, S7); else g.set(x - 1, y - 1, S7);
  });
  // Brush resting across the palette.
  g.line(26, 15, 44, 5, S5); g.line(26, 16, 44, 6, O0);
  g.line(44, 5, 46, 4, S3);
  g.rect(22, 16, 4, 2, S6);
  g.set(21, 17, V1); g.set(20, 18, f === 2 ? C2 : V1); g.set(19, 18, V0);
}

function easel(g, f) {
  // Legs.
  g.line(14, 44, 24, 6, S4); g.line(15, 44, 25, 6, O0);
  g.line(35, 44, 25, 6, S4); g.line(34, 44, 24, 6, O0);
  g.line(25, 22, 25, 42, O0);
  g.hline(10, 35, 30, O0); g.hline(10, 34, 30, S5);
  // Canvas with an oil-painted scene: dusk over ridgelines.
  g.rect(11, 12, 28, 22, S7);
  g.rect(12, 13, 26, 20, V0);
  g.rect(12, 13, 26, 5, S4);
  for (let x = 12; x < 38; x++) if ((x + 13) % 2) g.set(x, 18, V0);
  g.rect(12, 19, 26, 5, O0);
  for (let x = 12; x < 38; x++) if (x % 2) g.set(x, 19, V0);
  g.rect(12, 23, 26, 2, O1);
  g.disc(29, 21, 3, 3, O1); g.disc(29, 21, 2, 2, f === 1 ? S7 : O1); g.set(28, 20, S7);
  // Ridgelines.
  for (let x = 12; x < 38; x++) {
    const a = 25 + Math.round(2 * Math.sin(x * 0.45));
    g.vline(x, a, 33 - a, S3);
    const b = 28 + Math.round(1.5 * Math.sin(x * 0.8 + 2));
    g.vline(x, b, 33 - b, S2);
  }
  g.hline(12, 32, 26, C0);
  // Palette knife stroke highlight.
  g.hline(15, 15, 6, S6); g.hline(30, 16, 5, S5);
}

function racket(g, f) {
  // Handle.
  g.line(29, 28, 44, 43, S2); g.line(30, 28, 45, 43, S1); g.line(28, 28, 43, 43, S4);
  g.line(40, 39, 44, 43, V0); g.line(41, 39, 45, 43, V0); g.line(39, 39, 43, 43, S6);
  // Head: ring with string grid.
  g.disc(18, 18, 15, 15, S7);
  g.disc(18, 18, 13, 13, T);
  for (let y = 5; y <= 31; y += 3) for (let x = 5; x <= 31; x++) { if (((x - 18) / 13) ** 2 + ((y - 18) / 13) ** 2 <= 1) g.set(x, y, S5); }
  for (let x = 6; x <= 30; x += 3) for (let y = 5; y <= 31; y++) { if (((x - 18) / 13) ** 2 + ((y - 18) / 13) ** 2 <= 1) g.set(x, y, S5); }
  // Ring shading.
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
    const d = Math.hypot(x - 18, y - 18);
    if (d > 13.2 && d <= 15.4 && x + y > 40) g.set(x, y, C0);
    else if (d > 13.2 && d <= 15.4 && x + y > 30) g.set(x, y, C1);
  }
  // Ball, bouncing one pixel on hover.
  const by = 38 - [0, 2, 1, 0][f];
  g.disc(11, by, 5, 5, M1);
  g.disc(12, by + 1, 3.6, 3.6, M1);
  for (const [x, y] of [[9, 35], [8, 36], [7, 37]]) g.set(x, y + by - 38, S7);
  for (const [x, y] of [[12, 42], [14, 40], [15, 38], [13, 41]]) g.set(x, y + by - 38, C0);
  g.line(7, by + 2, 13, by - 4, S6);
}

function bicycle(g, f) {
  const wheelAt = (cx, cy, spin) => {
    g.disc(cx, cy, 9, 9, S2);
    g.disc(cx, cy, 8, 8, S4);
    g.disc(cx, cy, 7, 7, T);
    for (let a = 0; a < 6; a++) {
      const t = (a * Math.PI) / 3 + spin;
      g.line(cx, cy, Math.round(cx + Math.cos(t) * 7), Math.round(cy + Math.sin(t) * 7), S5);
    }
    g.disc(cx, cy, 1, 1, S7);
  };
  const spin = (f * Math.PI) / 9;
  wheelAt(12, 32, spin);
  wheelAt(36, 32, spin);
  // Frame: a clean diamond.
  const frame = [[12, 32], [20, 18], [33, 18], [24, 32], [12, 32]];
  g.path(frame, C1); g.path(frame.map(([x, y]) => [x, y + 1]), C0);
  g.path([[33, 18], [36, 32]], C1); g.path([[34, 18], [37, 32]], C0);
  g.path([[20, 18], [24, 32]], C1); g.path([[21, 18], [25, 32]], C0);
  // Saddle, handlebar, crank.
  g.line(20, 18, 19, 13, S4); g.rect(15, 12, 8, 2, S2); g.hline(15, 12, 8, S6);
  g.line(33, 18, 32, 12, S4); g.rect(31, 11, 6, 2, S5); g.hline(31, 11, 6, S7); g.rect(36, 12, 2, 3, S3);
  g.disc(24, 32, 2, 2, S6); g.set(24, 32, S1);
  const pedal = [[28, 34], [26, 36], [22, 35], [27, 30]][f];
  g.line(24, 32, pedal[0], pedal[1], S5); g.rect(pedal[0] - 1, pedal[1], 3, 1, S3);
}

function basketball(g, f) {
  const cx = 24, cy = 24, r = 18;
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
    const dx = x - cx, dy = y - cy;
    const d = Math.hypot(dx, dy);
    if (d > r) continue;
    const lit = (-dx - dy) / (r * 1.41) + 0.25 - d / (r * 2.2);
    const c = lit > 0.28 ? S6 : lit > -0.12 ? O1 : lit > -0.42 ? O0 : V0;
    g.set(x, y, c === S6 ? O1 : c);
    if (lit > 0.42 && (x + y) % 2 === 0) g.set(x, y, S6);
  }
  // Seams rotate one step on hover.
  const twist = [0, 1, 2, 1][f];
  for (let t = -r + 1; t <= r - 1; t++) {
    g.set(cx + t, cy + Math.round(Math.sin((t / r) * Math.PI) * twist), S1);
    g.set(cx + Math.round(Math.sin((t / r) * Math.PI) * twist), cy + t, S1);
  }
  for (let t = -r + 2; t <= r - 2; t++) {
    const k = Math.sqrt(Math.max(0, 1 - (t / r) ** 2));
    g.set(Math.round(cx - r * 0.72 * k + twist), cy + t, S1);
    g.set(Math.round(cx + r * 0.72 * k + twist), cy + t, S1);
  }
  g.rect(14, 12, 4, 2, S7); g.set(13, 14, S7);
}

// ------------------------------------------------------------ other things
function clapper(g, f) {
  // Slate board.
  g.rect(8, 21, 32, 20, S2);
  g.rect(9, 22, 30, 18, S3);
  g.hline(9, 22, 30, S4);
  for (const [y, w] of [[26, 22], [30, 16], [34, 20]]) { g.hline(11, y, w, S5); }
  g.rect(11, 37, 5, 2, C1); g.rect(18, 37, 4, 2, S5); g.rect(24, 37, 7, 2, S5);
  // Fixed striped bar.
  for (let x = 8; x < 40; x++) for (let y = 17; y < 21; y++) g.set(x, y, ((x + (20 - y)) >> 2) % 2 ? S1 : S7);
  // Hinged arm, open on rest and snapping shut on hover.
  const angle = [-0.42, -0.24, 0, -0.08][f];
  const hx = 8, hy = 16;
  for (let y = 2; y < 18; y++) for (let x = 6; x < 44; x++) {
    const dx = x - hx, dy = y - hy;
    const u = dx * Math.cos(-angle) - dy * Math.sin(-angle);
    const v = dx * Math.sin(-angle) + dy * Math.cos(-angle);
    if (u >= 0 && u < 32 && v > -4 && v <= 0) g.set(x, y, (Math.floor(u + (v + 4)) >> 2) % 2 ? S7 : S1);
  }
  g.rect(7, 15, 3, 3, S5); g.set(8, 16, S7);
  if (f === 2) { g.set(42, 13, C2); g.set(43, 15, C2); g.set(42, 17, C2); }
}

function gamepad(g, f) {
  // Body: a rounded bar with two grips, top lit, with a thickness edge below.
  const shape = (y0, c) => {
    g.rect(13, y0, 22, 13, c);
    g.disc(13, y0 + 8, 8, 8, c);
    g.disc(35, y0 + 8, 8, 8, c);
  };
  shape(19, V0);
  shape(16, S6);
  g.rect(13, 16, 22, 2, S7);
  g.disc(12, 22, 3, 3, S7);
  // D-pad.
  g.rect(9, 23, 9, 3, S2); g.rect(12, 20, 3, 9, S2);
  g.set(13, 21, f === 1 ? C2 : S3);
  // Face buttons.
  const buttons = [[34, 20, C1], [38, 24, M1], [30, 24, V1], [34, 28, O1]];
  buttons.forEach(([x, y, c], i) => {
    g.disc(x, y, 1.6, 1.6, i === f - 1 ? S7 : c);
    g.set(x - 1, y - 1, S7);
  });
  // Start and select.
  g.rect(20, 25, 3, 1, S3); g.rect(25, 25, 3, 1, S3);
  // Status light.
  g.set(24, 19, f % 2 ? S4 : M1);
}

function crtTv(g, f) {
  const t = box(g, 26, 21, 22, 12, 22, CREAM);
  t.paintL(1, 2, 18, 15, S2);
  t.paintL(2, 3, 16, 13, S1);
  // A night sky on screen: a crescent moon and stars. Channel noise on hover.
  if (f === 1 || f === 2) {
    for (let v = 3; v < 16; v++) for (let u = 2; u < 18; u++) {
      const n = Math.sin(u * 12.9898 + v * 78.233 + f * 7) * 43758.5453;
      if (n - Math.floor(n) > 0.55) t.plotL(u, v, (n * 7) % 1 > 0.5 ? S6 : S4);
    }
  } else {
    for (let v = 3; v < 16; v++) for (let u = 2; u < 18; u++) if (v % 2 === 0) t.plotL(u, v, C0);
    for (const [u, v] of [[4, 5], [8, 4], [16, 12], [6, 13], [15, 4]]) t.plotL(u, v, S7);
    for (let v = 4; v < 14; v++) for (let u = 7; u < 17; u++) {
      const inMoon = (u - 11.5) ** 2 + (v - 8.5) ** 2 <= 3.6 ** 2;
      const bite = (u - 13.2) ** 2 + (v - 7.4) ** 2 <= 3.1 ** 2;
      if (inMoon && !bite) t.plotL(u, v, C2);
    }
  }
  // Dials and speaker grille on the right face.
  for (const u of [3, 7]) { t.plotR(u, 4, S2); t.plotR(u + 1, 4, S2); t.plotR(u, 5, S2); t.plotR(u + 1, 5, S2); }
  for (let v = 9; v < 18; v += 2) t.paintR(2, v, 8, 1, S4);
  t.plotR(10, 3, f % 2 ? S3 : M1);
  // Rabbit-ear antenna rising from the top face.
  const [ax, ay] = [22, 12];
  g.line(ax, ay, ax - 8, 2, S4); g.line(ax + 1, ay, ax + 10, 1, S4);
  g.set(ax - 8, 2, S6); g.set(ax + 10, 1, S6);
  g.rect(ax - 1, ay - 1, 4, 2, S3); g.hline(ax - 1, ay - 1, 4, S5);
}

const BEETLE_LEFT = [
  '...2....',
  '....2...',
  '.....444',
  '....4455',
  '.2...444',
  '..2.vvv1',
  '...v66v1',
  '2.v66vv1',
  '.2v6vvv1',
  '..vvvvv1',
  '2.vvvvv1',
  '.2vvvvv1',
  '...vvvv1',
  '....vvv1',
  '......v1',
];
// Mirror the left half; light comes from the top left, so the right half has no highlight.
const BEETLE = BEETLE_LEFT.map((row) => row + row.slice(0, -1).split('').reverse().join('').replace(/6/g, 'v'));
const BEETLE_MAP = { 1: S1, 2: S2, 4: S4, 5: S5, 6: S6, v: V0 };

function bugs(g, f) {
  // "Double the bug": two beetles at rest; on hover they become four.
  const at = [[3, 5], [27, 9], [6, 29], [29, 31]];
  const count = [2, 3, 4, 4][f];
  at.slice(0, count).forEach(([x, y]) => g.sprite(BEETLE, x, y, BEETLE_MAP));
  // "x2" in tiny pixel type.
  const tag = [
    '#...#.###',
    '.#.#....#',
    '..#...###',
    '.#.#..#..',
    '#...#.###',
  ];
  tag.forEach((r, j) => r.split('').forEach((p, i) => { if (p === '#') g.set(37 + i, 1 + j, f >= 2 ? C2 : C1); }));
}

export const OBJECTS = [
  { id: 'ecg-cart', draw: ecgCart },
  { id: 'lightbox', draw: lightbox },
  { id: 'ultrasound', draw: ultrasound },
  { id: 'ehr-terminal', draw: ehrTerminal },
  { id: 'agents', draw: agents },
  { id: 'home-robot', draw: homeRobot },
  { id: 'robot-arm', draw: robotArm },
  { id: 'video-pose', draw: videoPose },
  { id: 'ar-headset', draw: arHeadset },
  { id: 'camera', draw: camera },
  { id: 'watercolor', draw: watercolor },
  { id: 'easel', draw: easel },
  { id: 'racket', draw: racket },
  { id: 'bicycle', draw: bicycle },
  { id: 'basketball', draw: basketball },
  { id: 'clapper', draw: clapper },
  { id: 'gamepad', draw: gamepad },
  { id: 'crt-tv', draw: crtTv },
  { id: 'bugs', draw: bugs },
];

export const FRAMES = 4;
export const OBJECT_SIZE = SIZE;

/** Atlas: one column per frame; two rows per object (plain, then with a dark-mode rim). */
export function buildAtlas() {
  const atlas = new Grid(SIZE * FRAMES, SIZE * 2 * OBJECTS.length);
  OBJECTS.forEach((o, n) => {
    for (let f = 0; f < FRAMES; f++) {
      const g = new Grid(SIZE, SIZE);
      o.draw(g, f);
      g.outline(S1);
      atlas.blit(g, f * SIZE, n * 2 * SIZE);
      const rim = g.clone().rim(S1, S5);
      atlas.blit(rim, f * SIZE, (n * 2 + 1) * SIZE);
    }
  });
  return atlas;
}
