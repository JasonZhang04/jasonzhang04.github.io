// Dependency-free indexed PNG encoder (colour type 3 with tRNS) and a small decoder for the same format.
import { deflateSync, inflateSync } from 'node:zlib';
import { T, hexToRgb, NIGHT } from '../public/js/pixel/palette.js';

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'latin1'), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
};

/**
 * Encode indexed pixels. `pixels` holds palette indices with T for transparent.
 * `colors` may be overridden for one-off images such as the dithered portrait.
 */
export function encodeIndexed(w, h, pixels, colors = NIGHT) {
  const used = [...new Set(pixels)].filter((c) => c !== T).sort((a, b) => a - b);
  const hasT = pixels.includes(T);
  const remap = new Map(used.map((c, i) => [c, i + (hasT ? 1 : 0)]));
  if (hasT) remap.set(T, 0);
  const plte = Buffer.alloc((used.length + (hasT ? 1 : 0)) * 3);
  used.forEach((c, i) => {
    const [r, g, b] = hexToRgb(colors[c]);
    plte.set([r, g, b], (i + (hasT ? 1 : 0)) * 3);
  });
  const raw = Buffer.alloc((w + 1) * h);
  for (let y = 0; y < h; y++) {
    const row = y * (w + 1);
    raw[row] = 0;
    for (let x = 0; x < w; x++) raw[row + 1 + x] = remap.get(pixels[y * w + x]);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 3;
  const parts = [Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('PLTE', plte)];
  if (hasT) parts.push(chunk('tRNS', Buffer.from([0])));
  parts.push(chunk('IDAT', deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0)));
  return Buffer.concat(parts);
}

/** Decode an indexed PNG written by encodeIndexed back to scene palette indices. */
export function decodeIndexed(buf, colors = NIGHT) {
  let p = 8, w = 0, h = 0, plte, trns; const idat = [];
  while (p < buf.length) {
    const len = buf.readUInt32BE(p); const type = buf.toString('latin1', p + 4, p + 8); const data = buf.subarray(p + 8, p + 8 + len);
    if (type === 'IHDR') { w = data.readUInt32BE(0); h = data.readUInt32BE(4); }
    if (type === 'PLTE') plte = data;
    if (type === 'tRNS') trns = data;
    if (type === 'IDAT') idat.push(data);
    p += 12 + len;
  }
  const raw = inflateSync(Buffer.concat(idat));
  const lut = new Map(colors.map((hex, i) => [hex.toLowerCase(), i]));
  const out = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const v = raw[y * (w + 1) + 1 + x];
    if (trns && v < trns.length && trns[v] === 0) { out[y * w + x] = T; continue; }
    const hex = '#' + [...plte.subarray(v * 3, v * 3 + 3)].map((b) => b.toString(16).padStart(2, '0')).join('');
    out[y * w + x] = lut.get(hex);
  }
  return { w, h, data: out };
}

/** Upscale for inspection or social images. */
export function scaleUp(w, h, pixels, k) {
  const out = new Uint8Array(w * k * h * k);
  for (let y = 0; y < h * k; y++) for (let x = 0; x < w * k; x++) out[y * w * k + x] = pixels[Math.floor(y / k) * w + Math.floor(x / k)];
  return out;
}
