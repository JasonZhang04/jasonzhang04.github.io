// Indexed framebuffer plus the drawing primitives used to author all pixel art.
import { T } from '../public/js/pixel/palette.js';

const BAYER4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];
/** Ordered-dither threshold in (0,1) for a pixel. */
export const bayer = (x, y) => (BAYER4[y & 3][x & 3] + 0.5) / 16;

export class Grid {
  constructor(w, h, fill = T) {
    this.w = w;
    this.h = h;
    this.d = new Uint8Array(w * h).fill(fill);
  }
  has(x, y) { return x >= 0 && y >= 0 && x < this.w && y < this.h; }
  get(x, y) { return this.has(x, y) ? this.d[y * this.w + x] : T; }
  set(x, y, c) { if (this.has(x, y)) this.d[y * this.w + x] = c; return this; }
  rect(x, y, w, h, c) {
    for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) this.set(i, j, c);
    return this;
  }
  frame(x, y, w, h, c) {
    this.hline(x, y, w, c); this.hline(x, y + h - 1, w, c);
    this.vline(x, y, h, c); this.vline(x + w - 1, y, h, c);
    return this;
  }
  hline(x, y, w, c) { for (let i = x; i < x + w; i++) this.set(i, y, c); return this; }
  vline(x, y, h, c) { for (let j = y; j < y + h; j++) this.set(x, j, c); return this; }
  line(x0, y0, x1, y1, c) {
    const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    for (;;) {
      this.set(x0, y0, c);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) { err += dy; x0 += sx; }
      if (e2 <= dx) { err += dx; y0 += sy; }
    }
    return this;
  }
  /** Polyline through integer points. */
  path(points, c) {
    for (let i = 1; i < points.length; i++) this.line(...points[i - 1], ...points[i], c);
    return this;
  }
  /** Hanging cable: parabola between two anchors, sagging by `sag` pixels. */
  cable(x0, y0, x1, y1, sag, c) {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    let px = x0, py = y0;
    for (let i = 1; i <= n; i++) {
      const t = i / n;
      const x = Math.round(x0 + (x1 - x0) * t);
      const y = Math.round(y0 + (y1 - y0) * t + sag * 4 * t * (1 - t));
      this.line(px, py, x, y, c);
      px = x; py = y;
    }
    return this;
  }
  disc(cx, cy, rx, ry, c) {
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) {
      for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
        const u = (x - cx) / (rx + 0.01), v = (y - cy) / (ry + 0.01);
        if (u * u + v * v <= 1) this.set(x, y, c);
      }
    }
    return this;
  }
  /** Fill with colour c where the Bayer threshold passes `level` (0..1). */
  dither(x, y, w, h, c, level, onlyOver) {
    for (let j = y; j < y + h; j++) {
      for (let i = x; i < x + w; i++) {
        if (bayer(i, j) < level && (onlyOver === undefined || this.get(i, j) === onlyOver)) this.set(i, j, c);
      }
    }
    return this;
  }
  /** Draw ASCII rows using a char-to-index map. Unmapped chars are transparent. */
  sprite(rows, x, y, map, flip = false) {
    rows.forEach((row, j) => {
      for (let i = 0; i < row.length; i++) {
        const c = map[row[i]];
        if (c !== undefined) this.set(flip ? x + row.length - 1 - i : x + i, y + j, c);
      }
    });
    return this;
  }
  blit(src, x = 0, y = 0) {
    for (let j = 0; j < src.h; j++) {
      for (let i = 0; i < src.w; i++) {
        const c = src.d[j * src.w + i];
        if (c !== T) this.set(x + i, y + j, c);
      }
    }
    return this;
  }
  clone() { const g = new Grid(this.w, this.h); g.d.set(this.d); return g; }
  /** Add a 1px outline of colour c around all opaque pixels. */
  outline(c) {
    const src = this.clone();
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        if (src.get(x, y) !== T) continue;
        if (src.get(x - 1, y) !== T || src.get(x + 1, y) !== T || src.get(x, y - 1) !== T || src.get(x, y + 1) !== T) this.set(x, y, c);
      }
    }
    return this;
  }
  /** Recolour outline pixels on top/left silhouette edges so they read on dark surfaces. */
  rim(outlineColor, rimColor) {
    const src = this.clone();
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        if (src.get(x, y) !== outlineColor) continue;
        if (src.get(x - 1, y) === T || src.get(x, y - 1) === T) this.set(x, y, rimColor);
      }
    }
    return this;
  }
}

/** Dimetric (2:1) box helper. (cx, ty) is the front-top corner; faces can be painted via L() and R(). */
export class IsoBox {
  constructor(g, cx, ty, wl, wr, h) { Object.assign(this, { g, cx, ty, wl, wr, h }); }
  /** Left face point: u outward from the front edge, v down from the top. */
  L(u, v) { return [this.cx - 1 - u, this.ty - Math.floor(u / 2) + v]; }
  /** Right face point: u outward from the front edge, v down from the top. */
  R(u, v) { return [this.cx + u, this.ty - Math.floor(u / 2) + v]; }
  paintL(u, v, w, h, c) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const [x, y] = this.L(u + i, v + j); this.g.set(x, y, c); } return this; }
  paintR(u, v, w, h, c) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const [x, y] = this.R(u + i, v + j); this.g.set(x, y, c); } return this; }
  plotL(u, v, c) { const [x, y] = this.L(u, v); this.g.set(x, y, c); return this; }
  plotR(u, v, c) { const [x, y] = this.R(u, v); this.g.set(x, y, c); return this; }
  /** Fill all three faces. Colours: top, left, right, and optional edge highlight. */
  fill(top, left, right, edge) {
    const { g, cx, ty, wl, wr, h } = this;
    this.paintL(0, 0, wl, h, left);
    this.paintR(0, 0, wr, h, right);
    // Top rhombus, bounded below by the face tops.
    for (let x = cx - wl; x < cx + wr; x++) {
      const fromLeft = x - (cx - wl);
      const fromRight = cx + wr - 1 - x;
      const lower = x < cx ? ty - Math.floor((cx - 1 - x) / 2) : ty - Math.floor((x - cx) / 2);
      const upperA = ty - Math.floor((wl - 1) / 2) - Math.ceil(fromLeft / 2);
      const upperB = ty - Math.floor((wr - 1) / 2) - Math.ceil(fromRight / 2);
      const upper = Math.max(upperA, upperB);
      for (let y = upper; y < lower; y++) g.set(x, y, top);
    }
    if (edge !== undefined) { g.vline(cx, ty, h, edge); }
    return this;
  }
}
