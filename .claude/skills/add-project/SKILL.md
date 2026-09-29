---
name: add-project
description: Add one project (a card on the Work page plus its case study page) to this portfolio site from whatever the person hands over: links, images, notes, a brief, a pasted description. Collects the information, asks only for what is missing, prepares the images, writes the card and the case in English and Portuguese, and checks the build. Use when the person says "add a project", "new project", "new case", "adicionar projeto", "novo projeto", "novo case", or sends material about a project they want on the site.
---

# Add project

You add one project to the site by collecting what the person has, asking only for what is missing, and writing the files yourself. The person should never have to open a code file.

Read first: `.claude/skills/site-onboarding/references/content-map.md`, section "Projects" (every field, format and the case body structure). Images use `.claude/skills/site-onboarding/scripts/prepare-image.mjs`.

## What a project is made of

- **Card** (Work page and home): cover image, period, category pill, title, short card text.
- **Case page**: cover, title, "period · category", summary, a table with client, role and result, an "On this page" index built from the `##` headings, the case body, a "Visit project" button (external link), and other projects at the bottom.
- **Case body**: Context, What I did (lists, an optional real quote, images, each with an optional source note), Detail (optional), Result, and optionally Development (dated updates) and Sources (links).

## Rules

- **Never invent facts.** No made-up numbers, clients, dates, results or quotes. Missing: ask, or leave the field out. Polishing their wording is fine; adding claims is not.
- Both languages are always filled: the site is English at `/` and Portuguese at `/br`. If they wrote in one language, translate the rest and show both before saving.
- Answer in the language the person uses.
- Never read, create or edit `.env` files. Do not change layout, design or components; this skill only adds content.
- Keep the code style of `lib/content/projects-data.ts` (quotes, commas, indentation).
- Include `note` blocks (after a paragraph or an image) and `source` blocks only when the person supplied links; otherwise omit them. Add Development entries (`### YYYY-MM-DD` + paragraph) only when the person supplied dated updates. Formats are in content-map.

## Flow

1. **Collect.** Ask them to send everything they have in any shape: links (site, case, repo, Figma), image files or folders, notes, a brief, a pasted text. Read what you can (files and pages). Do not interrogate before you have looked at the material.
2. **Extract** into the fields of content-map: title, card text, summary, client, role, result, period and year, category (choose from the existing list, show labels in their language), external link, and the four case parts. Show a short table of what you found and what is missing.
3. **Ask only the gaps**, one at a time, in this order of importance: title, what the project was and for whom, their role, the result (numbers only if they have them), period and year (the year sorts the Work page, newest first; take it from the period), category, link. For thin case parts, use the guiding questions: Context (problem, who for, why then), What I did (role, key decisions and why, process), Detail (one piece worth zooming in on), Result (what changed, numbers or qualitative outcome). Also ask, once, whether there are dated updates (Development) or source links (Sources, source notes); if not, omit those parts.
4. **Slug.** Lowercase ASCII with hyphens, from the title. Confirm it; it becomes `/work/<slug>`. If it already exists, this is an edit: show the current values and change only what they ask.
5. **Images.** Put them in `public/projects/<slug>/`.
   - Cover, cropped 3:2: `node .claude/skills/site-onboarding/scripts/prepare-image.mjs cover <input> public/projects/<slug>/cover.webp`
   - Case images: `... body <input> public/projects/<slug>/<n>.webp`, with no caption. Alt text describes the image. If they have a source link for an image, add a `note` block right after it.
   If the script fails, show its message (usually `npm install` is missing).
6. **Write** the entry in the `PROJECTS` array (`lib/content/projects-data.ts`) and `content/projects/<slug>/en.md` and `pt.md` following the structure in content-map (`## Context`, `## What I did`, `### Detail`, `## Result` in English; `## Contexto`, `## O que eu fiz`, `### Detalhe`, `## Resultado` in Portuguese; no H1, no frontmatter), then the optional `## Development` / `## Desenvolvimento` and `## Sources and further reading` / `## Fontes e leituras` sections only if they gave material.
7. **Examples.** If the `projeto-exemplo-*` examples are still listed, this is the first real project: hide them, do not delete them. Remove their entries from `PROJECTS` and their slugs from `FEATURED_PROJECTS`, and keep their folders in `content/projects/` and `public/projects/` as hidden models (content-map, "Example projects"). To make a new project, duplicate a model folder and adapt it. Keep `public/placeholder-thumbnail.svg`.
8. **Home.** Ask whether it should show on the home; if yes, add the slug to `FEATURED_PROJECTS` and confirm the order. Ask whether to pin it (`pinnedAt` with today's date puts it first on `/work` and first inside the home list; at most 5 pins count).
9. **Check.** Run `npx tsc --noEmit` and `npm run build`; fix what they point at and run again until both pass. Then show a summary (card fields in both languages, the case headings, image count) and offer `npm run dev` to look at `http://localhost:3000/work/<slug>`.

Publishing is not part of this skill. If they want it online, follow `.claude/skills/site-onboarding/references/deploy.md`.
