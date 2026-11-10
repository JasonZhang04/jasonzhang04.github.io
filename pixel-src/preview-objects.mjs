// Contact sheet of all objects on the light and dark surfaces, for visual review.
import { writeFileSync } from 'node:fs';
import { OBJECTS, OBJECT_SIZE as S, buildAtlas } from './objects.mjs';
import { Grid } from './grid.mjs';
import { encodeIndexed, scaleUp } from './png.mjs';
import { NIGHT } from '../public/js/pixel/palette.js';
const [, , out, k = '4', frame = '0'] = process.argv;
const atlas = buildAtlas();
const cols = 5, rows = Math.ceil(OBJECTS.length / cols);
const pad = 6;
const colors = [...NIGHT, '#E5E9E9', '#152226'];
const sheet = new Grid((S + pad) * cols, (S + pad) * rows * 2, 19);
sheet.rect(0, (S + pad) * rows, sheet.w, (S + pad) * rows, 20);
OBJECTS.forEach((o, n) => {
  for (const dark of [0, 1]) {
    const cell = new Grid(S, S);
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) cell.set(x, y, atlas.get(x + +frame * S, y + (n * 2 + dark) * S));
    sheet.blit(cell, (n % cols) * (S + pad) + pad / 2, Math.floor(n / cols) * (S + pad) + dark * (S + pad) * rows + pad / 2);
  }
});
writeFileSync(out, encodeIndexed(sheet.w * +k, sheet.h * +k, scaleUp(sheet.w, sheet.h, sheet.d, +k), colors));
