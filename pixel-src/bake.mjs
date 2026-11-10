// Bakes every generated pixel asset into public/pixel. Run with: npm run pixel
// The browser only loads the output, so any PNG here can be replaced by hand-drawn art.
// Careful: re-running overwrites hand-edited PNGs of the same name.
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildScene } from './scene.mjs';
import { buildAtlas, OBJECTS, FRAMES, OBJECT_SIZE } from './objects.mjs';
import { encodeIndexed, scaleUp } from './png.mjs';
import { Grid } from './grid.mjs';
import { W, H, createState, step, render, coverage } from '../public/js/pixel/scene-core.js';
import { PORTRAIT, HEAD16 } from '../public/js/pixel/sprites.js';
import { NIGHT, S0, S1, S5, T } from '../public/js/pixel/palette.js';

const out = resolve('public/pixel');
mkdirSync(resolve(out, 'scene'), { recursive: true });
const write = (name, buf) => { writeFileSync(resolve(out, name), buf); console.log(name.padEnd(24), buf.length, 'bytes'); };

// Scene layers.
const layers = buildScene();
for (const l of layers) write(`scene/${l.name}.png`, encodeIndexed(W, H, l.data));

// Static fallback frame: the composed room with lights on, used without JS and with reduced motion.
const state = createState(layers);
for (let i = 0; i < 24; i++) step(state);
const frame = new Uint8Array(W * H);
render(state, frame);
write('night-lab.png', encodeIndexed(W, H, frame));

// Coverage across many frames, for the brief's 85% / 10% rule.
let min = 1, max = 0;
const s2 = createState(layers);
for (let i = 0; i < 400; i++) {
  step(s2);
  render(s2, frame);
  const c = coverage(frame);
  min = Math.min(min, c.slate);
  max = Math.max(max, c.saturated);
}
console.log(`coverage over 400 frames: slate >= ${(min * 100).toFixed(1)}%, saturated <= ${(max * 100).toFixed(1)}%`);

// Object atlas.
const atlas = buildAtlas();
write('objects.png', encodeIndexed(atlas.w, atlas.h, atlas.d));
console.log(`atlas: ${OBJECTS.length} objects, ${FRAMES} frames, ${OBJECT_SIZE}px cells`);

// Portrait: plain and rim-lit rows, side by side vertically.
const portrait = new Grid(32, 64);
const base = new Grid(32, 32); base.blit(new (class { w = PORTRAIT.w; h = PORTRAIT.h; d = PORTRAIT.d; })());
base.outline(S1);
portrait.blit(base, 0, 0);
portrait.blit(base.clone().rim(S1, S5), 0, 32);
write('portrait.png', encodeIndexed(32, 64, portrait.d));

// Favicon: 16 x 16 head on a dark tile, at 1x, 2x and an Apple touch size.
const head = new Grid(16, 16, S1);
for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) { const c = HEAD16.d[y * 16 + x]; if (c !== T) head.set(x, y, c); }
write('favicon-16.png', encodeIndexed(16, 16, head.d));
write('favicon-32.png', encodeIndexed(32, 32, scaleUp(16, 16, head.d, 2)));
const touch = new Grid(180, 180, S1);
const big = scaleUp(16, 16, head.d, 10);
for (let y = 0; y < 160; y++) for (let x = 0; x < 160; x++) touch.set(x + 10, y + 10, big[y * 160 + x]);
write('apple-touch.png', encodeIndexed(180, 180, touch.d));

// The Open Graph card is composed by pixel-src/make_og.py because it needs real type.
void NIGHT; void S0;
