// Character sprites, stored as ASCII matrices so they can be edited by hand.
//
// Format: every string is one row and every character is one logical pixel.
//   .  transparent        0-7  slate ramp S0-S7
//   a b c   cyan C0 C1 C2     o O   orange O0 O1
//   v V     violet V0 V1      m     mint M1
//   k l h   avatar skin lit, skin shade, hair
//
// The avatar is a stylised likeness (short black hair, dark blazer, white
// collar) based on the portrait in public/profile.jpeg. Sprite data is kept
// here on its own so it can be redrawn without touching any other code.
import { S0, S1, S2, S3, S4, S5, S6, S7, C0, C1, C2, O0, O1, V0, V1, M1, K0, K1, K2, T } from './palette.js';

export const LEGEND = {
  0: S0, 1: S1, 2: S2, 3: S3, 4: S4, 5: S5, 6: S6, 7: S7,
  a: C0, b: C1, c: C2, o: O0, O: O1, v: V0, V: V1, m: M1, k: K0, l: K1, h: K2,
};

/** Convert ASCII rows to { w, h, d } with palette indices. */
export function compile(rows) {
  const h = rows.length, w = Math.max(...rows.map((r) => r.length));
  const d = new Uint8Array(w * h).fill(T);
  rows.forEach((row, y) => { for (let x = 0; x < row.length; x++) { const c = LEGEND[row[x]]; if (c !== undefined) d[y * w + x] = c; } });
  return { w, h, d };
}

// Seated, facing left toward the monitor. Rim light (b) on the screen side.
const HEAD_SIDE = [
  '.....4444h......',
  '....4hhhhhhh....',
  '...4hhhhhhhhh...',
  '..bhhhhhhhhhh...',
  '..bhkkkhhhhhh...',
  '..bkkkkkkhhhh...',
  '..bkk1kkkhlhh...',
  '.bkkkkkkkllh....',
  '..bkkkkkkll.....',
  '...bkkkkll......',
  '.....kkll.......',
];
const HEAD_BLINK = HEAD_SIDE.map((r, i) => (i === 6 ? '..bkklkkkhlhh...' : r));
const TORSO = [
  '....7744444.....',
  '...b7444444.4...',
  '...b44444444....',
  '...544444444....',
  '..b5544444443...',
];
const ARM_A = [
  '.bkk55444444433.',
  '.kk.5554444433..',
];
const ARM_B = [
  'bkk.55444444433.',
  '....5554444433..',
];
const ARM_C = [
  '..bkk5444444433.',
  '.kk.5554444433..',
];
const LAP = [
  '.....54444433...',
  '.....3444443....',
  '....33333333....',
  '...233333333....',
  '...22222222.....',
];

const HEAD_FRONT = [
  '.....4444h......',
  '....4hhhhhhh....',
  '...4hhhhhhhhh...',
  '...hhhhhhhhhh...',
  '...hhkkhkkhhh...',
  '...hkkkkkkkkh...',
  '..lkk1kkk1kkl...',
  '...kkkkkkkkkl...',
  '...kkkkllkkl....',
  '....kkkkkkl.....',
  '.....kkll.......',
];
const WAVE_UP = [
  '....77744444.kk.',
  '...447744444.k5.',
  '..4444444445555.',
  '..4444444444555.',
  '..3444444444....',
];
const WAVE_MID = [
  '....77744444..kk',
  '...447744444..k5',
  '..444444444.555.',
  '..44444444455...',
  '..3444444444....',
];
const WAVE_ARM = [
  '..34444444443...',
  '..33444444433...',
];

export const AVATAR = {
  type: [
    compile([...HEAD_SIDE, ...TORSO, ...ARM_A, ...LAP]),
    compile([...HEAD_SIDE, ...TORSO, ...ARM_B, ...LAP]),
    compile([...HEAD_SIDE, ...TORSO, ...ARM_A, ...LAP]),
    compile([...HEAD_SIDE, ...TORSO, ...ARM_C, ...LAP]),
  ],
  blink: compile([...HEAD_BLINK, ...TORSO, ...ARM_A, ...LAP]),
  wave: [
    compile([...HEAD_FRONT, ...TORSO, ...WAVE_ARM, ...LAP]),
    compile([...HEAD_FRONT, ...WAVE_MID, ...WAVE_ARM, ...LAP]),
    compile([...HEAD_FRONT, ...WAVE_UP, ...WAVE_ARM, ...LAP]),
    compile([...HEAD_FRONT, ...WAVE_MID, ...WAVE_ARM, ...LAP]),
  ],
};

// Small agents: simple geometric robots in the slate ramp with one glowing eye.
const ROVER_BODY = [
  '.....5....',
  '.....5....',
  '..555555..',
  '.56666654.',
  '.5c144454.',
  '.54444443.',
  '..333333..',
  '.45555543.',
  '.44444433.',
  '.33333332.',
];
export const ROVER = [
  compile([...ROVER_BODY, '.1.1..1.1.', '..1.11.1..']),
  compile([...ROVER_BODY, '..1.11.1..', '.1.1..1.1.']),
];

const DRONE_BODY = [
  '..5.....5..',
  '..4566654..',
  '..5c14454..',
  '...43334...',
  '....2.2....',
];
export const DRONE = [
  compile(['55555.55555', ...DRONE_BODY]),
  compile(['.555...555.', ...DRONE_BODY]),
];

const CRAWLER_BODY = [
  '..5555..',
  '.566654.',
  '.5c1454.',
  '.444443.',
];
export const CRAWLER = [
  compile([...CRAWLER_BODY, '.3.33.3.', '3..33..3']),
  compile([...CRAWLER_BODY, '3..33..3', '.3.33.3.']),
];

// 32 x 32 bust for About, footer and the social image. Short black hair,
// white collar, dark blazer, and one accent: the striped tie from the portrait.
export const PORTRAIT = compile([
  '................................',
  '...........4444hhh..............',
  '.........44hhhhhhhhh............',
  '........4hhhhhhhhhhhhh..........',
  '.......4hhhhhhhhhhhhhhh.........',
  '.......hhhhhhhhhhhhhhhhh........',
  '.......hhhhhhkkhhhhkhhhh........',
  '.......hhkkkkkkkkkkkkkhh........',
  '.......hkkkkkkkkkkkkkkkh........',
  '.......hkhhhkkkkkhhhkkkh........',
  '......lhkkkkkkkkkkkkkkkhl.......',
  '......lkkk11kkkkk11kkkkkl.......',
  '......lkkkkkkkkkkkkkkkkkl.......',
  '.......kkkkkkklkkkkkkkkl........',
  '.......kkkkkkklkkkkkkkkl........',
  '.......lkkkkkllkkkkkkkl.........',
  '........kkkkkkkkkkkkkl..........',
  '........kkkklllllkkkl...........',
  '.........kkkkkkkkkkl............',
  '..........kkkkkkkll.............',
  '...........lkkkkl...............',
  '............kkkl................',
  '..........677kkl776.............',
  '.......33467lll7764333..........',
  '.....3344467OOO7654433333.......',
  '....33444456O2O654433333332.....',
  '...334444456OOO654433333322.....',
  '...3344344456O2O5444333333322...',
  '...3344344456OOO5443334333322...',
  '...33443444456O2O5433334333322..',
  '...33443444456OOO5433334333322..',
  '...33443444445OO54433334333322..',
]);

// 16 x 16 head for the favicon.
export const HEAD16 = compile([
  '................',
  '.....hhhhhh.....',
  '....hhhhhhhh....',
  '...hhhhhhhhhh...',
  '...hhkkkkkkhh...',
  '...hkkkkkkkkh...',
  '...k1kkkkk1kk...',
  '...kkkkkkkkkk...',
  '...kkkkllkkkl...',
  '....kklllkkl....',
  '.....kkkkll.....',
  '......kkl.......',
  '....77kkl77.....',
  '..4447OOO7444...',
  '.444447O7444443.',
  '.444447O7444443.',
]);
