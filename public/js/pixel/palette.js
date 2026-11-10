// Scene palette: 16 indexed colours plus three avatar extras.
// All pixel art references these INDICES, never raw hex, so a palette can be
// swapped (see VARIANTS) and tuned in exactly one place.
// Used only inside pixel art. Page chrome has its own tokens in app/styles/tokens.css.
export const S0 = 0, S1 = 1, S2 = 2, S3 = 3, S4 = 4, S5 = 5, S6 = 6, S7 = 7;
export const C0 = 8, C1 = 9, C2 = 10;
export const O0 = 11, O1 = 12;
export const V0 = 13, V1 = 14, M1 = 15;
export const K0 = 16, K1 = 17, K2 = 18; // avatar extras: skin lit, skin shade, hair
export const T = 255; // transparent

export const NIGHT = [
  '#050708', '#0E191C', '#182529', '#203033', '#38494F', '#52696F', '#828497', '#F0F1F2',
  '#1F6E78', '#59C0CA', '#A6F4F4',
  '#7A4220', '#D77E31',
  '#6A5AA3', '#DC80F0', '#4FCF8F',
  '#E2B48C', '#A87657', '#14181F',
];

// Same art with the room lights down. Swappable without touching any sprite.
export const LIGHTS_OFF = [
  '#050708', '#0A1215', '#101A1D', '#152226', '#1F2C30', '#2C3C41', '#4A4C5A', '#8E9091',
  '#134650', '#2F7079', '#59A4A6',
  '#472612', '#7C481C',
  '#3D3460', '#7E4A8A', '#2D7752',
  '#856A52', '#624534', '#0C0E12',
];

export const VARIANTS = { night: NIGHT, lightsOff: LIGHTS_OFF };

// One palette step darker. S0 lifts to S1 so edges can dissolve into the dark page.
export const DARKEN = [
  S1, S1, S1, S2, S3, S4, S5, S6,
  S3, C0, C1,
  S3, O0,
  S3, V0, C0,
  K1, S3, S1,
];

// One palette step brighter, used for hotspot hover.
export const BRIGHTEN = [
  S1, S2, S3, S4, S5, S6, S7, S7,
  C1, C2, S7,
  O1, S7,
  V1, S7, C2,
  S7, K0, S2,
];

export function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export const paletteRgb = (colors = NIGHT) => colors.map(hexToRgb);
