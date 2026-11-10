# Chenjia Zhang: academic website

Status: draft / needs_review. First prepared September 7, 2026; redesigned November 7, 2026; extended November 10, 2026. Substantive copy has not been approved as final.

A calm, editorial page with a few rich pixel-art windows: two neutrals plus one cyan accent for the page, and a 16-color palette that exists only inside the art. Static output keeps the site portable to any static host.

Design brief and style references: `reference_style/`. Review notes and provenance: `../outputs/website/pixel-redesign-v04.md` and `../outputs/website/content-update-v05.md`.

## Local development

Use Node 22 or newer (see `.nvmrc`), then `npm ci` and `npm run dev`.
Build: `npm run build`. Static public output is `dist/client/`.

## Where things live

| To change | Edit |
|---|---|
| Introduction, research entries, course projects | `lib/profile.ts` |
| Smaller projects | `lib/smaller-projects.ts` |
| Publications, abstracts, BibTeX, research-card status lines | `lib/publications.ts` |
| Lab names and links (linked wherever the names appear) | `lib/labs.ts` |
| Courses, their areas, and links to related work | `lib/courses.ts` |
| Quote and favorites in "Other things" | `lib/other-things.ts` |
| Timeline and honors, section order | `app/page.tsx` |
| Which pixel object goes with which entry; hobbies | `lib/site-art.ts` |
| Gallery photos, titles, alt text, order, and the photo featured on the main page | `lib/photography.ts` |
| Gallery introduction and metadata | `app/photography/page.tsx` |
| Navigation | `components/site-header.tsx` |
| Colors, type scale, spacing | `app/styles/tokens.css` |
| Other styles, one file per area | `app/styles/` |
| Title, description, social metadata | `app/layout.tsx` |
| Scene speech bubbles, agent links, greeting, frame rate, layer list | `public/js/pixel/config.js` |

`public/profile.jpeg` is the academic portrait, shown as is in About; CSS frames it to the sitter. `public/profile_avatar.jpeg` is the painted portrait; a small copy appears in Contact. No clinical datasets or private application materials belong in `public/`. All medical imagery on the site is original pixel illustration, never patient data.

### Adding a photograph

Put the full-resolution original in `photo-originals/`. That folder is git-ignored, so originals never enter the repository or the build. Run `python3 pixel-src/prepare_photos.py`, which writes a 2000px copy and an 800px phone copy to `public/photos/`, converted to sRGB. It also prints the `src`, `small`, width and height to copy into a new entry in `lib/photography.ts`. Give the entry a unique `id`, a title, and meaningful alt text. Array order controls viewing order, and counters update automatically. `layout` may be `wide`, `left`, `right`, `closing`, `portrait`, or `pair`; two consecutive `pair` photos share a row. To change the photo framed on the main page, edit `featuredPhoto` at the end of the same file. Original images are not retouched or cropped.

### Adding a course website

Add `website: 'https://…'` to the course in `lib/courses.ts` to link it from that course's page. Add `embed: true` as well to show the site inside the page; this only works if the course site allows framing, which many do not.

### Adding a publication

Add an entry to `lib/publications.ts`. State the status exactly as the source does and never upgrade it. Filter chips were left out while there is only one publication.

## Design system

- **Page:** tokens in `app/styles/tokens.css` only. No other colors in page UI. Hairlines instead of shadows, corners of 2px or less, transitions of 150-200ms.
- **Type:** Geist Pixel for display only (name, section headings, wordmark). Geist Sans for reading. Geist Mono for metadata.
- **Crisp pixel type:** Geist Pixel is drawn on a 38-unit grid, so it is sharp only when `font-size = n / 0.038`. Sizes are therefore derived from `--cell-*` variables, never typed by hand. The boot script in `app/layout.tsx` rounds them to whole device pixels at any display ratio.
- **Pixel art:** whole-number scaling only, no blur, no rotation, no smooth gradients. Light is drawn with pixels: emissive core, bright ring, dithered falloff.
- **Motion:** only the hero scene animates continuously. It pauses offscreen and in hidden tabs, and reduced-motion readers get a still frame. Tube flicker stays within the limit of three flashes per second.

## Pixel art pipeline

Art is authored as code in `pixel-src/`, baked to indexed PNGs in `public/pixel/`, and read by small modules in `public/js/`. Baking needs no dependencies. The browser only ever loads the PNGs, so any of them can be replaced by hand.

```
npm run pixel                             # scene layers, fallback frame, objects, portrait, favicons
python3 pixel-src/make_og.py              # public/og.png (Pillow, fonttools, brotli)
python3 pixel-src/prepare_photos.py       # web copies of gallery photos (Pillow)
node pixel-src/preview-scene.mjs out.png 60 6        # scene at frame 60, 6x, with coverage figures
node pixel-src/preview-objects.mjs out.png 4 0       # contact sheet of objects, 4x, frame 0
```

**Warning:** `npm run pixel` overwrites everything in `public/pixel/`, including hand-edited PNGs. Move hand-drawn layers elsewhere and point `LAYERS` at them first.

- **Palette:** `public/js/pixel/palette.js`. All art references palette indices, so it can be retuned in one place. `LIGHTS_OFF` is a ready alternative.
- **Character sprites:** `public/js/pixel/sprites.js`. Each string is a row and each character a pixel; the legend is at the top of the file. Avatar likeness is isolated here.
- **Scene layers:** `pixel-src/scene.mjs` draws, back to front, `bg`, `glow-wall`, `props`, `glow-props`, and `fg`. Animated elements and their positions are in `public/js/pixel/scene-core.js`.
- **Objects:** `pixel-src/objects.mjs`. 48 x 48, four frames each (frame 0 at rest, frames 1-3 play once on hover), with a second row adding a rim for dark surfaces. If you add one, also add it to `OBJECT_INDEX` in `lib/site-art.ts`; the atlas size follows from that list.
- **Hotspots:** `components/night-lab.tsx`. Rectangles are in logical pixels, so links and art stay aligned at any scale.

### Replacing a scene layer with hand-drawn art

Draw at exactly 180 x 120 using the palette colors, keeping unused areas transparent. Save it anywhere under `public/` and set that layer's `src` in `LAYERS` in `public/js/pixel/config.js`. A `src` may also be a 2D array of palette indices. Off-palette pixels snap to the nearest palette color. Update `public/pixel/night-lab.png` too, since that still frame is what readers without JavaScript see.

## How the build works

vinext renders every page to static HTML at build time. There are no client components, so `scripts/prepare-static.mjs` strips the React runtime and its payload from the HTML. Readers load only `public/js/`, about 11 KB gzipped, compared with 148 KB before. Every page also gets a directory URL, so `/courses/robot-learning.html` is served as `/courses/robot-learning/` too. The build fails if a page loses its boot script or still refers to the runtime. It also fails if the gallery, its link, or the course pages go missing, or if the home page links to a course without a page.

`components/ui/` and `hooks/` are left over from the original starter and are no longer used. `globals.css` no longer imports Tailwind, so restore that import if you reuse them.

## Third-party assets

| Asset | License |
|---|---|
| Geist Sans, Geist Mono, Geist Pixel Square, v1.9.2 of the `geist` package, Latin subsets in `public/fonts/` | [SIL Open Font License 1.1](https://github.com/vercel/geist-font/blob/main/LICENSE.txt), copy in `public/fonts/LICENSE-Geist-OFL.txt` |
| Preprint abstract in `lib/publications.ts` | CC BY 4.0, as stated on the preprint |

All pixel art is original and hand-coded for this site. Files in `reference_style/` are style references only. Nothing from them is used in the build or copied into the art, and the CraftPix archives there carry their own [license terms](https://craftpix.net/file-licenses/), so do not publish that folder.

## Publishing with GitHub Pages

The repository is named `jasonzhang04.github.io`, so GitHub Pages serves the site at https://jasonzhang04.github.io/. `.github/workflows/deploy-pages.yml` builds it and publishes `dist/client/` on every push to `main`.

One-time setup on GitHub:

1. Make the repository public. Pages on a private repository needs a paid plan, and the workflow skips itself while the repository is private.
2. In Settings > Pages, set Source to "GitHub Actions".
3. In the Actions tab, open "Deploy to GitHub Pages" and choose "Run workflow". Later pushes deploy automatically.

The workflow asks GitHub for the site's address and passes it to the build:

- `BASE_PATH` is the URL prefix. It is empty for `<user>.github.io` and for a custom domain. A project repository such as `example_repo` would be served under `/example_repo/`, and every root-relative link and asset then gets that prefix at build time.
- `SITE_URL` is the full public address. Setting it makes the build public: search indexing is allowed, social-card URLs point at the real site, and `sitemap.xml` and `robots.txt` are written.

A local `npm run build` sets neither, so it stays a private preview with `noindex`. To check a public build locally:

```
SITE_URL=https://jasonzhang04.github.io npm run build
```

Never commit `reference_style/` (third-party art under its own license) or `photo-originals/`. Both are git-ignored.

## Local edits, version control, and hosting

Saving a local file does not update any published copy. `npm run dev` gives immediate local previews, and `npm run build` produces the static site in `dist/client/`. Cross-page links are ordinary HTML anchors with no client routing, and every page also has a directory URL, so the output works on any static host. Serve the built folder over HTTP rather than opening the HTML with `file://`.

The source lives in its own Git repository rooted at `website/`, connected to `JasonZhang04/jasonzhang04.github.io`, which was renamed from `chenjia_personal_website` on November 10, 2026. The parent PhD workspace is never uploaded. An earlier private preview was published to https://chenjia-zhang.jhu.chatgpt.site, which is separate from GitHub Pages and is not updated by pushes.

Hosting documentation:
- https://developers.cloudflare.com/pages/get-started/git-integration/
- https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
