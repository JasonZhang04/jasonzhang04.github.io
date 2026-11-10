// Original photographs supplied by Chenjia Zhang. Titles follow the filenames.
// Add photos here in viewing order; width/height are the pixel dimensions of `src`.
// `small` is an 800px copy for phones. Full-resolution originals stay in
// photo-originals/ and pixel-src/prepare_photos.py makes these web copies.
// `layout` is one of: wide, left, right, closing, portrait, pair (two in a row side by side).
export type Photo = {
  id: string; title: string; src: string; small?: string; width: number; height: number; alt: string;
  layout: 'wide' | 'left' | 'right' | 'closing' | 'portrait' | 'pair';
};

export const photographs: Photo[] = [
  {
    id: 'noir', title: 'Noir', src: '/photo_01_Noir.jpeg', small: '/photo_01_Noir_800.jpeg',
    width: 1314, height: 598,
    alt: 'Black-and-white streetscape with a traffic light, clock tower, and low buildings beneath dark storm clouds.',
    layout: 'wide',
  },
  {
    id: 'forever-hoop', title: 'Forever Hoop', src: '/photos/forever-hoop.jpg', small: '/photos/forever-hoop-800.jpg',
    width: 2000, height: 1333,
    alt: 'Black-and-white night photograph of an empty basketball court behind a chain-link fence, with one person sitting in a folding chair at the far side.',
    layout: 'left',
  },
  {
    id: 'bei-ying', title: 'Bèi Yǐng', src: '/photos/bei-ying.jpg', small: '/photos/bei-ying-800.jpg',
    width: 2000, height: 1333,
    alt: 'Black-and-white night photograph of a man seen from behind, sitting on a bench and looking out over a fenced field, with a can at his feet.',
    layout: 'right',
  },
  {
    id: 'kyoto-time', title: 'Kyoto Time', src: '/photo_02_Kyoto_time.jpeg', small: '/photo_02_Kyoto_time_800.jpeg',
    width: 1154, height: 681,
    alt: 'Black-and-white view across Kyoto, with a clock among trees in the foreground and a tower and mountains in the distance.',
    layout: 'left',
  },
  {
    id: 'golden-age', title: 'Golden Age', src: '/photo_03_Golden_Age.jpeg', small: '/photo_03_Golden_Age_800.jpeg',
    width: 1086, height: 724,
    alt: 'Black-and-white photograph of two people seated in folding chairs beside a wooded area, with sunlight crossing the grass.',
    layout: 'right',
  },
  {
    id: 'twin', title: 'Twin', src: '/photos/twin.jpg', small: '/photos/twin-800.jpg',
    width: 1467, height: 2000,
    alt: 'Two empty park benches beside a path at dusk, seen through dark overhanging leaves and branches.',
    layout: 'portrait',
  },
  {
    id: 'dusk', title: 'Dusk', src: '/photos/dusk.jpg', small: '/photos/dusk-800.jpg',
    width: 2000, height: 1371,
    alt: 'A half moon in a deep blue evening sky above brick rooftops, their cornices lit orange by the last sunlight.',
    layout: 'pair',
  },
  {
    id: 'orange-v-s-blue', title: 'Orange v.s. Blue', src: '/photos/orange-v-s-blue.jpg', small: '/photos/orange-v-s-blue-800.jpg',
    width: 2000, height: 1333,
    alt: 'The corner of a brick building with an ornate cornice glowing orange in low sunlight against a clear blue sky.',
    layout: 'pair',
  },
  {
    id: 'shenandoah', title: 'Shenandoah', src: '/photo_04_Shenandoah.jpeg', small: '/photo_04_Shenandoah_800.jpeg',
    width: 1086, height: 724,
    alt: 'Black-and-white photograph of a sports car on a mountain road, with layered ridgelines receding into a bright sky.',
    layout: 'closing',
  },
];

/** The photograph featured on the main page. */
export const featuredPhoto = photographs.find((p) => p.id === 'forever-hoop')!;
