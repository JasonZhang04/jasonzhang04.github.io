// Courses taken at Johns Hopkins, as listed by the user on November 10, 2026.
// Each course gets a page at /courses/<slug>/. To link a course website, add `website`;
// set `embed: true` to also show it inside the page (only works if the site allows framing).
import { slugify } from '@/lib/slug';

export const AREAS = {
  ai: { name: 'Artificial Intelligence', short: 'AI' },
  ams: { name: 'Applied Mathematics & Statistics', short: 'AMS' },
  cs: { name: 'Computer Science', short: 'CS' },
} as const;
export type Area = keyof typeof AREAS;

type Related = { label: string; short: string; href: string };
export type Course = { slug: string; name: string; area: Area; code: string; related: Related[]; website?: string; embed?: boolean };

const rel = (label: string, short: string): Related => ({ label, short, href: `/#${slugify(label)}` });

// Course websites supplied by the user on November 10, 2026. None of these sends headers
// that forbid framing, so each course page also shows the site inline.
const SITES: Record<string, string> = {
  'NLP: Self-supervised Models': 'https://self-supervised.cs.jhu.edu/fa2026/',
  'Embodied AI with Web-Scale Video Data': 'https://embodied-ai-with-videos.github.io/',
  'Machine Programming': 'https://machine-programming.github.io/',
  'Machine Social Intelligence': 'https://www.tshu.io/teaching/MSI/sp26/',
  'Data Structures': 'https://jhu-dsa.github.io/',
};

const LIST: [Area, string, Related[]?][] = [
  ['ai', 'Machine Learning: Deep Learning'],
  ['ai', 'NLP: Self-supervised Models'],
  ['ai', 'Learning-Based Vision', [rel('Temporal stability in video perception', 'Temporal stability'), rel('Diffusion model sampling from scratch', 'Diffusion'), rel('Neural Radiance Field pipeline', 'NeRF')]],
  ['ai', 'Robot Learning', [rel('Goal-image alignment with vision-language models', 'Goal-image alignment')]],
  ['ai', 'Machine Social Intelligence', [rel('Embodied Pragmatic Program Synthesis', 'EPPS')]],
  ['ai', 'Embodied AI with Web-Scale Video Data'],
  ['ai', 'Cognitive AI'],
  ['ai', 'Machine Programming'],
  ['ai', 'Augmented Reality', [rel('Augmented Reality Drawing Studio', 'AR Drawing Studio')]],
  ['ams', 'Mathematical and Computational Foundations of Data Science', [rel('Unsupervised video action segmentation and forecasting', 'Action segmentation')]],
  ['ams', 'Optimization'],
  ['ams', 'Data Science'],
  ['ams', 'Probability'],
  ['ams', 'Mathematical Statistics'],
  ['cs', 'Algorithms'],
  ['cs', 'Data Structures'],
  ['cs', 'Full-Stack JavaScript'],
  ['cs', 'Computer Graphics & 3D Game Programming'],
];

const counters: Record<string, number> = {};
export const courses: Course[] = LIST.map(([area, name, related = []]) => {
  counters[area] = (counters[area] ?? 0) + 1;
  const website = SITES[name];
  return { slug: slugify(name), name, area, code: `${AREAS[area].short}-${String(counters[area]).padStart(2, '0')}`, related, website, embed: Boolean(website) };
});

export const courseHref = (c: Course) => `/courses/${c.slug}/`;
