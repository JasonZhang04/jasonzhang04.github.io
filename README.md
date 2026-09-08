# Chenjia Zhang — academic website

Status: draft / needs_review. Prepared September 7, 2026. Substantive copy has not been approved as final.

A custom academic profile built from the OpenAI Sites starter. Warm ivory, forest green, literary serif headings, and a compact profile sidebar. Static output keeps the site portable to other static hosts later.

## Local development

Use Node 22.22.0 (see `.nvmrc`), then `npm ci` and `npm run dev`.
Build: `npm run build`. Static public output is `out/`.

## Editing

- `lib/profile.ts`: introduction, selected research, course projects.
- `app/page.tsx`: navigation, publication, education/experience, personal section, contact.
- `app/globals.css`: shared palette, typography, responsive and print styles.
- `app/layout.tsx`: page title, description, search and social metadata.
- `public/`: favicon and generated social card only. No clinical datasets, raw project files, or private application materials.

The monogram can be replaced with an approved portrait. The small “Beyond research” area is intentionally a placeholder until personal interests are supplied. A current, corrected, public-facing CV can be added later. Academic email and GitHub come from the current CV.

Review provenance and unresolved questions in `../outputs/website/content-review-v01.md`. Consult the parent workspace policy before changing personal claims. Preserve human edits when preparing new substantive drafts. The SCAI work is separate from the course capstone.

## Publication

The first delivery is intended for private review, with search indexing disabled. Public release, any access changes, a custom domain, and a downloadable CV are later user-controlled steps. Update the metadata origin and robots directives when moving to an approved public domain.

No external fonts, analytics, backend, forms, or data storage are required.
