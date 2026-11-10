import { readFile, writeFile, mkdir, copyFile, readdir, stat } from 'node:fs/promises';
import { resolve, relative, dirname, basename, join } from 'node:path';

const root = resolve('dist/client');
// Optional deployment settings, set by .github/workflows/deploy-pages.yml:
// BASE_PATH is the URL prefix when the site is not at a domain root (e.g. /chenjia_personal_website);
// SITE_URL is the full public address, which also turns on the sitemap.
const BASE = (process.env.BASE_PATH || '').replace(/\/+$/, '');
const SITE = (process.env.SITE_URL || '').replace(/\/+$/, '');

// Every page is fully rendered at build time and has no client components, so the React
// runtime and its hydration payload do nothing for readers. Removing them from the HTML keeps
// the site well inside its JavaScript budget. Interactivity comes from public/js only.
// Framework chunks stay in dist so `npm start` keeps working; the static HTML never requests them.
async function htmlFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir)) {
    const path = join(dir, entry);
    if (entry === '_next' || entry.startsWith('.')) continue;
    if ((await stat(path)).isDirectory()) out.push(...await htmlFiles(path));
    else if (entry.endsWith('.html')) out.push(path);
  }
  return out;
}

function stripClientRuntime(html) {
  return html
    .replace(/<script\b[^>]*\bsrc="\/_next\/[^"]*"[^>]*>\s*<\/script>/g, '')
    .replace(/<link\b[^>]*\brel="modulepreload"[^>]*\/?>/g, '')
    .replace(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g, (tag, body) => (body.includes('vinext.navigationRuntime') ? '' : tag));
}

/** Prefix root-relative URLs with the base path. Protocol-relative and absolute URLs are left alone. */
function withBase(text, kind) {
  if (!BASE) return text;
  const fix = (url) => (url.startsWith('/') && !url.startsWith('//') && !url.startsWith(`${BASE}/`) ? `${BASE}${url}` : url);
  if (kind === 'css') return text.replace(/url\(\s*(['"]?)(\/[^'")]*)\1\s*\)/g, (m, q, url) => `url(${q}${fix(url)}${q})`);
  return text
    .replace(/\b(href|src|poster|action)="([^"]*)"/g, (m, attr, url) => `${attr}="${fix(url)}"`)
    // srcset, and imageSrcSet on the image preloads React adds for priority images.
    .replace(/\b(srcset|imagesrcset)="([^"]*)"/gi, (m, attr, list) => `${attr}="${list.split(',').map((part) => { const [u, ...rest] = part.trim().split(/\s+/); return [fix(u), ...rest].join(' '); }).join(', ')}"`);
}

async function cssFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir).catch(() => [])) {
    const path = join(dir, entry);
    if ((await stat(path)).isDirectory()) out.push(...await cssFiles(path));
    else if (entry.endsWith('.css')) out.push(path);
  }
  return out;
}
for (const path of await cssFiles(resolve(root, '_next'))) await writeFile(path, withBase(await readFile(path, 'utf8'), 'css'));

const pages = await htmlFiles(root);
for (const path of pages) {
  const html = withBase(stripClientRuntime(await readFile(path, 'utf8')), 'html');
  const name = relative(root, path);
  if (/_next\/static\/chunks|vinext\.navigationRuntime/.test(html)) throw new Error(`${name} still references the client runtime.`);
  if (!html.includes("classList.add('js')")) throw new Error(`${name} lost the boot script.`);
  if (name !== '404.html' && !html.includes('/js/site.js')) throw new Error(`${name} lost its site script.`);
  await writeFile(path, html);
  // Portable directory URLs: /courses/x.html is also served as /courses/x/.
  const base = basename(path, '.html');
  if (base !== 'index' && base !== '404') {
    const dir = join(dirname(path), base);
    await mkdir(dir, { recursive: true });
    await copyFile(path, join(dir, 'index.html'));
  }
}

// Validation of key pages and links.
const read = (p) => readFile(resolve(root, p), 'utf8');
const home = await read('index.html');
const gallery = await read('photography.html');
if (!home.includes(`href="${BASE}/photography/"`) || !gallery.includes('Kyoto Time')) {
  throw new Error('Static export is missing the photography link or gallery content.');
}
const courseIndex = await read('courses/index.html').catch(() => '');
const coursePages = (await readdir(resolve(root, 'courses')).catch(() => [])).filter((f) => f.endsWith('.html'));
if (!courseIndex.includes('Machine Social Intelligence') || coursePages.length < 2) {
  throw new Error(`Course pages were not exported (found ${coursePages.length}).`);
}
const linked = [...home.matchAll(new RegExp(`href="${BASE}/courses/([^"/]+)/"`, 'g'))].map((m) => m[1]);
const missing = linked.filter((slug) => !coursePages.includes(`${slug}.html`));
if (missing.length) throw new Error(`Course links without pages: ${missing.join(', ')}`);
// Public builds get a sitemap and robots.txt listing every page.
if (SITE) {
  const paths = ['/', '/photography/', '/courses/', ...coursePages.filter((f) => f !== 'index.html').map((f) => `/courses/${f.replace(/\.html$/, '')}/`)];
  const today = new Date().toISOString().slice(0, 10);
  const urls = paths.map((p) => `  <url><loc>${SITE}${p}</loc><lastmod>${today}</lastmod></url>`).join('\n');
  await writeFile(resolve(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
  await writeFile(resolve(root, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
}
// Prevents Jekyll processing on GitHub Pages, which would hide the _next folder.
await writeFile(resolve(root, '.nojekyll'), '');
console.log(`Stripped the client runtime from ${pages.length} pages; ${coursePages.length} course pages; base path "${BASE || '/'}"${SITE ? `; sitemap for ${SITE}` : ''}.`);
