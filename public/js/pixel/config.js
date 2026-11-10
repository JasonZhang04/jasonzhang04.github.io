// Editable behaviour for the night-lab scene.

/** Speech bubbles shown by the agents: one at a time, 2.5 seconds each. */
export const BUBBLE_LINES = [
  'fusing ECG + CXR',
  'cross-attention?',
  'check ablations',
  'plan -> act',
  'ask the human',
];

/** Links offered when a visitor clicks an agent. */
export const AGENT_LINKS = [
  { label: 'Research', href: '#research' },
  { label: 'Projects', href: '#projects' },
  { label: 'Background', href: '#experience' },
];

/** Greeting shown when a visitor presses the avatar. */
export const AVATAR_GREETING = 'Hello, I’m Chenjia';

/** Ambient animation rate. Every sprite and light steps on this clock. */
export const FPS = 8;

/**
 * Scene layers, back to front. `depth` is the pointer-parallax weight in logical pixels.
 * `src` may be a PNG URL or a 2D matrix of palette indices, so any layer can be replaced
 * with hand-drawn art. PNG layers must use the exact palette colours, at 180 x 120.
 */
const asset = (path) => new URL(`../..${path}`, import.meta.url).href; // works under any base path

export const LAYERS = [
  { name: 'bg', depth: 0, src: asset('/pixel/scene/bg.png') },
  { name: 'glow-wall', depth: 0, src: asset('/pixel/scene/glow-wall.png') },
  { name: 'props', depth: 1, src: asset('/pixel/scene/props.png') },
  { name: 'glow-props', depth: 1, src: asset('/pixel/scene/glow-props.png') },
  { name: 'fg', depth: 2, src: asset('/pixel/scene/fg.png') },
];
