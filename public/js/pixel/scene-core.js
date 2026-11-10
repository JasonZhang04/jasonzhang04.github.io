// Night-lab simulation and compositor. It has no DOM dependency, so the same code
// draws the browser canvas and the static fallback frame baked in Node.
import { S1, S2, S3, S5, S6, S7, C0, C1, C2, V0, V1, M1, T, DARKEN, BRIGHTEN } from './palette.js';
import { AVATAR, ROVER, DRONE, CRAWLER } from './sprites.js';

export const W = 180;
export const H = 120;

// Locations of animated elements, in logical pixels.
export const ECG = { x: 13, y: 22, w: 37, h: 25, step: 2 };
export const TUBES = [
  { x: 14, y: 12, w: 46, h: 2 },
  { x: 130, y: 14, w: 44, h: 2 },
];
export const STRIP = { x: 71, y: 50, panels: 3, step: 10 };
export const MONITOR = { x: 20, y: 64, w: 18, h: 11 };
export const AVATAR_POS = { x: 47, y: 62 };
export const LEDS = [
  ...[35, 42, 49, 56, 63, 70, 77, 84].flatMap((y, i) => [
    { x: 141, y, c: i % 3 === 2 ? C1 : M1, period: 13 + i * 3, phase: i * 5 },
    { x: 143, y, c: i % 4 === 1 ? M1 : C1, period: 9 + i * 2, phase: i * 3 },
  ]),
  { x: 171, y: 47, c: M1, period: 40, phase: 0 },
];

const ECG_CYCLE = (() => {
  const flat = 12;
  const beat = [0, 0, 1, 2, 2, 1, 0, 0, 0, 1, -1, -7, -10, -3, 3, 1, 0, 0, 0, 0, 1, 2, 3, 3, 2, 1, 0];
  return [...beat, ...Array.from({ length: flat }, () => 0)];
})();

const WAYPOINTS = {
  rover: [{ x: 72, wait: 40 }, { x: 96, wait: 56 }, { x: 124, wait: 44 }, { x: 84, wait: 30 }],
  drone: [{ x: 72, y: 46, wait: 44 }, { x: 130, y: 38, wait: 52 }, { x: 74, y: 66, wait: 36 }],
  crawler: [{ x: 137, wait: 60 }, { x: 155, wait: 48 }],
};

/** Vignette: how many DARKEN steps each pixel takes, with a dithered edge reaching S1 exactly. */
export function makeVignette() {
  const B = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];
  const v = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const ex = Math.min(x, W - 1 - x) / 11;
      const ey = Math.min(y, H - 1 - y) / 9;
      const corner = Math.hypot(Math.max(0, 1 - ex), Math.max(0, 1 - ey));
      const t = Math.min(1, Math.max(0, corner));
      const b = (B[y & 3][x & 3] + 0.5) / 16;
      v[y * W + x] = t <= 0.02 ? 0 : Math.min(8, Math.floor(t * t * 8 + b));
    }
  }
  return v;
}

export function createState(layers) {
  return {
    layers, // [{ name, depth, data: Uint8Array }]
    vignette: makeVignette(),
    frame: 0,
    ecgPhase: 0,
    tubeDim: [0, 0],
    flickerSeq: null,
    flickerAt: 90 + 40,
    avatar: { mode: 'type', typeFrame: 0, waveFrame: 0, blink: 0 },
    agents: [
      { kind: 'rover', sprites: ROVER, x: 84, y: 91, target: 0, wait: 16, dir: 1, f: 0, moveEvery: 2 },
      { kind: 'drone', sprites: DRONE, x: 76, y: 50, target: 1, wait: 26, dir: 1, f: 0, moveEvery: 2 },
      { kind: 'crawler', sprites: CRAWLER, x: 145, y: 26, target: 0, wait: 24, dir: -1, f: 0, moveEvery: 3 },
    ],
    monitorLines: [10, 6, 13, 8, 4],
    stripSeed: 3,
  };
}

/** Advance the simulation by one ambient frame. */
export function step(s) {
  s.frame++;
  s.ecgPhase = (s.ecgPhase + ECG.step) % ECG_CYCLE.length;

  // Rare tube flicker, at most two dips within a second and small in area.
  if (s.flickerSeq && s.flickerSeq.length) {
    s.tubeDim[s.flickerSeq[0][0]] = s.flickerSeq[0][1];
    if (s.flickerSeq[0][2]) s.tubeDim[s.flickerSeq[0][2] - 1] = s.flickerSeq[0][1];
    s.flickerSeq.shift();
  } else {
    s.tubeDim = [0, 0];
    if (s.frame >= s.flickerAt) {
      s.flickerSeq = [[1, 1], [1, 0], [1, 2], [1, 0]];
      s.flickerAt = s.frame + 160 + ((s.frame * 7) % 120);
    }
  }

  const a = s.avatar;
  if (a.mode === 'wave') {
    a.waveFrame++;
    if (a.waveFrame >= 12) { a.mode = 'type'; a.waveFrame = 0; }
  } else {
    if (s.frame % 2 === 0) a.typeFrame = (a.typeFrame + 1) % 4;
    if (a.blink > 0) a.blink--;
    else if (s.frame % 37 === 0) a.blink = 1;
    if (s.frame % 6 === 0) {
      s.monitorLines.shift();
      s.monitorLines.push(3 + ((s.frame * 5) % 12));
    }
  }
  if (s.frame % 12 === 0) s.stripSeed = (s.stripSeed * 7 + 3) % 97;

  for (const g of s.agents) {
    g.f = (s.frame >> 1) % 2;
    if (g.wait > 0) { g.wait--; continue; }
    if (s.frame % g.moveEvery) continue;
    const route = WAYPOINTS[g.kind];
    const wp = route[g.target];
    if (g.x !== wp.x) { const d = Math.sign(wp.x - g.x); g.x += d; g.dir = d; }
    if (wp.y !== undefined && g.y !== wp.y && s.frame % (g.moveEvery * 2) === 0) g.y += Math.sign(wp.y - g.y);
    if (g.x === wp.x && (wp.y === undefined || g.y === wp.y)) {
      g.wait = wp.wait;
      g.target = (g.target + 1) % route.length;
    }
  }
}

/** Queue the short flicker-on used when the page switches to dark mode. */
export function flickerOn(s) {
  s.flickerSeq = [[0, 3, 2], [0, 0, 2], [0, 3, 2], [0, 0, 2]];
}

export const wave = (s) => { s.avatar.mode = 'wave'; s.avatar.waveFrame = 0; };

function blitSprite(out, sp, x, y, flip, hover) {
  for (let j = 0; j < sp.h; j++) {
    for (let i = 0; i < sp.w; i++) {
      const c = sp.d[j * sp.w + (flip ? sp.w - 1 - i : i)];
      if (c === T) continue;
      const px = x + i, py = y + j;
      if (px < 0 || py < 0 || px >= W || py >= H) continue;
      out[py * W + px] = hover ? BRIGHTEN[c] : c;
    }
  }
}

function inRect(x, y, r) { return r && x >= r.x && y >= r.y && x < r.x + r.w && y < r.y + r.h; }

function blitLayer(out, layer, dx, hover) {
  const d = layer.data;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const c = d[y * W + x];
      if (c === T) continue;
      const px = x + dx;
      if (px < 0 || px >= W) continue;
      out[y * W + px] = inRect(x, y, hover) ? BRIGHTEN[c] : c;
    }
  }
}

function drawEcg(s, out, hover) {
  const trace = hover ? C2 : C1;
  const baseY = ECG.y + 14;
  let prev = null;
  for (let i = 0; i < ECG.w; i++) {
    const idx = (s.ecgPhase + i * 1) % ECG_CYCLE.length;
    const y = baseY + ECG_CYCLE[idx];
    const x = ECG.x + i;
    if (prev !== null) {
      const top = Math.min(prev, y), bot = Math.max(prev, y);
      for (let k = top; k <= bot; k++) out[k * W + x] = bot - top > 2 ? C2 : trace;
    } else out[y * W + x] = trace;
    prev = y;
  }
  // Brighter sweep head at the right edge of the trace.
  out[prev * W + ECG.x + ECG.w - 1] = S7;
}

const STRIP_BARS = [
  [2, 4, 1, 3, 5, 2, 4, 3],
  [3, 1, 4, 5, 2, 3, 1, 4],
  [5, 3, 2, 4, 1, 4, 2, 3],
];

function drawStrip(s, out, hover) {
  const on = hover ? S7 : V1;
  for (let p = 0; p < STRIP.panels; p++) {
    const baseline = STRIP.y + p * STRIP.step + 7;
    for (let b = 0; b < 5; b++) {
      // A slow drift, one bar at a time, so the panel stays calm.
      const drift = (s.stripSeed + b * 3 + p) % 9 === 0 ? 1 : 0;
      const v = Math.min(5, STRIP_BARS[p][(b + (s.stripSeed >> 3)) % 8] + drift);
      for (let k = 0; k < v; k++) out[(baseline - k) * W + STRIP.x + 1 + b * 2] = on;
    }
  }
}

function drawMonitor(s, out, dx, hover) {
  s.monitorLines.forEach((len, row) => {
    const y = MONITOR.y + 1 + row * 2;
    const x0 = MONITOR.x + 2 + dx + (row % 2);
    for (let i = 0; i < len; i++) out[y * W + x0 + i] = hover ? S7 : i < 2 ? C2 : C1;
  });
}

function drawLeds(s, out, dx, hover) {
  for (const l of LEDS) {
    const on = (s.frame + l.phase) % l.period < l.period * 0.72;
    out[l.y * W + l.x + dx] = on ? (hover ? S7 : l.c) : S2;
  }
}

/**
 * Composite the current state into `out`, a W x H array of palette indices.
 * opts: { dx1, dx2, hover: { x, y, w, h } | null }
 */
export function render(s, out, opts = {}) {
  const { dx1 = 0, dx2 = 0, hover = null } = opts;
  out.fill(S1);
  const layer = (n) => s.layers.find((l) => l.name === n);
  blitLayer(out, layer('bg'), 0, null);
  blitLayer(out, layer('glow-wall'), 0, hover);
  drawEcg(s, out, inRect(ECG.x + 2, ECG.y + 2, hover));
  drawStrip(s, out, inRect(STRIP.x + 2, STRIP.y + 2, hover));
  // Tubes dim stepwise when flickering.
  TUBES.forEach((t, i) => {
    const dim = s.tubeDim[i];
    if (!dim) return;
    for (let y = t.y; y < t.y + t.h; y++) for (let x = t.x; x < t.x + t.w; x++) {
      let c = out[y * W + x];
      for (let k = 0; k < dim + 1; k++) c = DARKEN[c];
      out[y * W + x] = c;
    }
  });
  blitLayer(out, layer('props'), dx1, hover);
  blitLayer(out, layer('glow-props'), dx1, hover);
  drawMonitor(s, out, dx1, inRect(MONITOR.x + 2, MONITOR.y + 2, hover));
  drawLeds(s, out, dx1, inRect(LEDS[0].x, LEDS[0].y, hover));

  const a = s.avatar;
  const sprite = a.mode === 'wave'
    ? AVATAR.wave[[0, 1, 2, 3, 2, 3, 2, 3, 2, 1, 0, 0][a.waveFrame]]
    : a.blink > 0 ? AVATAR.blink : AVATAR.type[a.typeFrame];
  blitSprite(out, sprite, AVATAR_POS.x + dx1, AVATAR_POS.y, false, false);
  for (const g of s.agents) {
    blitSprite(out, g.sprites[g.f], g.x + dx1, g.y, g.dir > 0, false);
  }
  blitLayer(out, layer('fg'), dx2, null);

  // Vignette: steps toward S1 so the edge dissolves into the dark page.
  const v = s.vignette;
  for (let i = 0; i < out.length; i++) {
    let c = out[i];
    for (let k = v[i]; k > 0 && c !== S1; k--) c = DARKEN[c];
    out[i] = c;
  }
  return out;
}

/** Share of pixels per group, for the coverage check in the brief. */
export function coverage(out) {
  let slate = 0, sat = 0, other = 0;
  for (const c of out) {
    if (c <= S7) slate++;
    else if (c === C1 || c === C2 || c === 12 || c === V1 || c === M1) sat++;
    else other++;
  }
  const n = out.length;
  return { slate: slate / n, saturated: sat / n, other: other / n };
}

export { S3, S5, S6, C0, V0 };
