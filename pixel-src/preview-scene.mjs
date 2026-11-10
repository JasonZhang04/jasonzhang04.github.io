// Fast iteration helper: render the scene at a given frame and scale to a PNG path.
import { writeFileSync } from 'node:fs';
import { buildScene } from './scene.mjs';
import { W, H, createState, step, render, coverage } from '../public/js/pixel/scene-core.js';
import { encodeIndexed, scaleUp } from './png.mjs';
const [, , out, frames = '60', k = '5'] = process.argv;
const s = createState(buildScene());
for (let i = 0; i < +frames; i++) step(s);
const buf = new Uint8Array(W * H);
render(s, buf);
writeFileSync(out, encodeIndexed(W * +k, H * +k, scaleUp(W, H, buf, +k)));
const c = coverage(buf);
console.log('slate', (c.slate * 100).toFixed(1), 'saturated', (c.saturated * 100).toFixed(1), 'other', (c.other * 100).toFixed(1));
