# Chenjia Zhang — academic website

Status: draft / needs_review. Prepared September 7, 2026. Substantive copy has not been approved as final.

A custom academic profile built from the OpenAI Sites starter. Warm ivory, forest green, literary serif headings, and a compact profile sidebar. Static output keeps the site portable to other static hosts later.

## Local development

Use Node 22.22.0 (see `.nvmrc`), then `npm ci` and `npm run dev`.
Build: `npm run build`. Static public output is `dist/client/`.

## Editing

- `lib/profile.ts`: introduction, selected research, course projects.
- `app/page.tsx`: publication, education/experience, personal section, contact.
- `lib/photography.ts`: gallery photos, titles, alt text, dimensions, and viewing order.
- `app/photography/page.tsx`: photography page introduction and metadata.
- `components/site-header.tsx`: shared navigation and avatar.
- `components/photograph.tsx`: accessible enlarged photograph viewer.
- `app/globals.css`: shared palette, typography, responsive and print styles.
- `app/layout.tsx`: page title, description, search and social metadata.
- `public/`: portrait, avatar, original photographs, favicon, and generated social card. No clinical datasets or private application materials.

`public/profile.jpeg` is the academic portrait. `public/profile_avatar.jpeg` is the header avatar and browser icon. The “Beyond research” section links to `/photography`.

To add a photograph, put it in `public/`, then copy an entry in `lib/photography.ts`. Give it a unique `id`, title, `/filename` path, meaningful alt text, and its actual pixel width/height. Array order controls viewing order; counters update automatically. `layout` may be `wide`, `left`, `right`, or `closing`. The page retains original image proportions; all layouts become a single column on small screens. Update the gallery description in `app/photography/page.tsx` if its named collection changes.

Click or keyboard-activate a photograph to view it enlarged; Escape or the Close button dismisses the dialog. Original images are not retouched or cropped. The small avatar is cropped only by its circular display container.

A current, corrected, public-facing CV can be added later. Academic email and GitHub come from the current CV.

Review provenance and unresolved questions in `../outputs/website/content-review-v01.md`. Consult the parent workspace policy before changing personal claims. Preserve human edits when preparing new substantive drafts. The SCAI work is separate from the course capstone.

## Publication

The first delivery is intended for private review, with search indexing disabled. Public release, any access changes, a custom domain, and a downloadable CV are later user-controlled steps. Update the metadata origin and robots directives when moving to an approved public domain.

No external fonts, analytics, backend, forms, or data storage are required.
