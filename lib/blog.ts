// Blog posts are Markdown files in content/blog/, read at build time. Nothing here runs in
// the browser. See content/blog/_template.md for the format.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { marked } from 'marked';

export const POST_KINDS = {
  Note: 'Thoughts and inspirations',
  'Research log': 'Early findings and research experiences',
} as const;
export type PostKind = keyof typeof POST_KINDS;

export type Post = {
  slug: string; title: string; date: string; kind: PostKind; summary: string; tags: string[];
  html: string; minutes: number;
};

const DIR = join(process.cwd(), 'content/blog');

/** Minimal front matter: `key: value` lines, with `[a, b]` or `a, b` lists for tags. */
function parse(file: string) {
  const text = readFileSync(join(DIR, file), 'utf8');
  const match = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(text);
  if (!match) throw new Error(`${file}: missing front matter`);
  const meta: Record<string, string> = {};
  for (const line of match[1].split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, '');
  }
  return { meta, body: match[2] };
}

export function getPosts(): Post[] {
  let files: string[] = [];
  try { files = readdirSync(DIR).filter((f) => f.endsWith('.md') && !f.startsWith('_')); } catch { return []; }
  return files
    .map((file) => {
      const { meta, body } = parse(file);
      if (meta.draft === 'true') return null;
      for (const key of ['title', 'date', 'kind', 'summary']) if (!meta[key]) throw new Error(`${file}: missing "${key}"`);
      if (!(meta.kind in POST_KINDS)) throw new Error(`${file}: kind must be one of ${Object.keys(POST_KINDS).join(', ')}`);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.date)) throw new Error(`${file}: date must look like 2026-11-14`);
      const words = body.split(/\s+/).filter(Boolean).length;
      return {
        slug: file.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, ''),
        title: meta.title, date: meta.date, kind: meta.kind as PostKind, summary: meta.summary,
        tags: (meta.tags ?? '').replace(/^\[|\]$/g, '').split(',').map((t) => t.trim()).filter(Boolean),
        html: marked.parse(body, { async: false }) as string,
        minutes: Math.max(1, Math.round(words / 220)),
      } satisfies Post;
    })
    .filter((p): p is Post => p !== null)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
