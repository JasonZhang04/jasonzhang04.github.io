// Maps site content to pixel objects in public/pixel/objects.png.
// Row order must match OBJECTS in pixel-src/objects.mjs.
export const OBJECT_INDEX = {
  'ecg-cart': 0, lightbox: 1, ultrasound: 2, 'ehr-terminal': 3, agents: 4,
  'home-robot': 5, 'robot-arm': 6, 'video-pose': 7, 'ar-headset': 8,
  camera: 9, watercolor: 10, easel: 11, racket: 12, bicycle: 13, basketball: 14,
  clapper: 15, gamepad: 16, 'crt-tv': 17, bugs: 18,
} as const;

/** Number of objects in the atlas, which sets its height in CSS. */
export const OBJECT_COUNT = Object.keys(OBJECT_INDEX).length;

export type ObjectName = keyof typeof OBJECT_INDEX;

/** Research entries by id from lib/profile.ts. */
export const researchArt: Record<string, { object: ObjectName; label: string }> = {
  'multi-agent': { object: 'agents', label: 'Pixel illustration of two small robots sharing a terminal.' },
  'aortic-dilation': { object: 'lightbox', label: 'Pixel illustration of a lightbox showing a stylised chest film.' },
  pregnancy: { object: 'ehr-terminal', label: 'Pixel illustration of a computer terminal showing a data table.' },
  'cardiac-ml': { object: 'ultrasound', label: 'Pixel illustration of an ultrasound cart with a fan-shaped image on its screen.' },
};

/** Course projects by title from lib/profile.ts. */
export const projectArt: Record<string, { object: ObjectName; label: string }> = {
  'Embodied Pragmatic Program Synthesis': { object: 'home-robot', label: 'Pixel illustration of a small robot in the corner of a room, beside a table and a pinned rule sheet.' },
  'Goal-image alignment with vision-language models': { object: 'robot-arm', label: 'Pixel illustration of a robot arm above a tabletop with blocks and a goal marker.' },
  'Temporal stability in video perception': { object: 'video-pose', label: 'Pixel illustration of stacked video frames with a pose skeleton on the front frame.' },
  'Augmented Reality Drawing Studio': { object: 'ar-headset', label: 'Pixel illustration of a headset with strokes drawn in the air above it.' },
};

/** Interests named in the introduction in lib/profile.ts. */
export const hobbies: { name: string; object: ObjectName; label: string; href?: string }[] = [
  { name: 'Photography', object: 'camera', label: 'Pixel illustration of a camera.', href: '/photography/' },
  { name: 'Watercolor', object: 'watercolor', label: 'Pixel illustration of a watercolor palette and brush.' },
  { name: 'Oil painting', object: 'easel', label: 'Pixel illustration of a painting on an easel.' },
  { name: 'Tennis', object: 'racket', label: 'Pixel illustration of a tennis racket and ball.' },
  { name: 'Biking', object: 'bicycle', label: 'Pixel illustration of a bicycle.' },
  { name: 'Basketball', object: 'basketball', label: 'Pixel illustration of a basketball.' },
];
