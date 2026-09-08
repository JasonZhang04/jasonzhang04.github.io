import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// vinext beta.5 skips the gallery when trailingSlash redirects are enabled
// during prerender. Keep its normal export and add a portable directory index.
const root = resolve('dist/client');
const home = await readFile(resolve(root, 'index.html'), 'utf8');
const gallery = await readFile(resolve(root, 'photography.html'), 'utf8');
if (!home.includes('href="/photography/"') || !gallery.includes('Kyoto Time')) {
  throw new Error('Static export is missing the photography link or gallery content.');
}
await mkdir(resolve(root, 'photography'), { recursive: true });
await copyFile(resolve(root, 'photography.html'), resolve(root, 'photography/index.html'));
// Also prevents Jekyll processing if this build is later hosted on GitHub Pages.
await writeFile(resolve(root, '.nojekyll'), '');
console.log('Validated homepage and gallery; wrote photography/index.html.');
