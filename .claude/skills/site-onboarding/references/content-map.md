# Content map

Every field the person fills, where it lives, its format and what an empty value does.

**Bilingual text** is `{ pt: string; en: string }` (type `Localized` in `lib/content/types.ts`). `en` shows at `/`, `pt` at `/br`. Fill both.

**Images** live in `public/` and are referenced by their path from the site root (`public/images/avatar.webp` → `"/images/avatar.webp"`). Always produce them with `scripts/prepare-image.mjs`.

Paths used by the skill:

| Image | Mode | Output file | Referenced as |
|---|---|---|---|
| Profile photo | `avatar` (216×216) | `public/images/avatar.webp` | `"/images/avatar.webp"` |
| Project cover | `cover` (1280×853) | `public/projects/<slug>/cover.webp` | `"/projects/<slug>/cover.webp"` |
| Case image | `body` (max 1280 wide) | `public/projects/<slug>/<n>.webp` | `![alt](/projects/<slug>/<n>.webp "caption")` |

**Site icon and share image** (optional, the template ships with a default "VB" set). Same file names, replace the file:
- Browser tab icon: `app/icon.png`, PNG, 512×512 (square).
- iPhone home-screen icon: `app/apple-icon.png`, PNG, 180×180.
- Link preview image (WhatsApp, LinkedIn, X...): `public/og-image.jpg`, JPG, 1200×630; keep text/logo centred (some apps crop it to a square). Alt text: `SHARE_IMAGE.alt` in `lib/share-image.ts`.
PNG/JPG only: browsers and social apps don't reliably support WebP here.

Every page uses this same share image (no per-page images).

---

## Profile — `lib/content/profile.ts`, export `PROFILE`

| Field | Format | Example | Empty |
|---|---|---|---|
| `name` | string | `"Ana Souza"` | required |
| `heroTitle` | string (page `<title>` on the home) | `"Ana Souza"` (same as name) | required |
| `role` | Localized | `{ pt: "Designer de produto para startups", en: "Product designer for startups" }` | required; also the home meta description |
| `availability` | Localized, optional | `{ pt: "Disponível para novos projetos", en: "Available for new projects" }` | delete the key: the line above the Work page contact buttons disappears |
| `location` | Localized, optional | `{ pt: "Lisboa, Portugal", en: "Lisbon, Portugal" }` | delete the key: only the clock shows |
| `email` | string, optional | `"hello@anasouza.com"` | delete the key: hides "Copy email" on Work and the email line on `/privacy`. If `email` and `BOOKING_URL` are both empty, the whole contact section hides |
| `avatar` | image path | `"/images/avatar.webp"` | required |
| `socials` | `{ platform: string; url: string }[]` | `{ platform: "Instagram", url: "https://instagram.com/anasouza" }` | `[]` hides the icon row. Order = display order. `platform` picks the icon and is the hover label (see `icons.md`) |

## Clock — `components/home/live-clock.tsx`

- Time zone: `const TIME_ZONE = "America/Sao_Paulo";`. Replace with an IANA name (`"Europe/Lisbon"`, `"America/New_York"`, `"Asia/Tokyo"`). Also update the doc comment that says "São Paulo".
- Remove the clock: in `components/home/profile-card.tsx` delete the `<LiveClock locale={locale} />` line and the `import { LiveClock } from "./live-clock";` line. Leave `live-clock.tsx` in place.

## Site name and description — `messages/en.json`, `messages/pt.json`

| Key | What | Example |
|---|---|---|
| `meta.siteName` | name after each page title ("Work · Ana Souza") | `"Ana Souza"` in both files |
| `meta.description` | default description for search/share | the role, in each language |

## `public/llms.txt`

Plain Markdown summary for AI crawlers. Replace the template text with the person's name, one line on what they do, and the pages (`/` home, `/work` projects), in the site's main language. Keep it short.

## GitHub (Build section) — `lib/content/github.ts`

| Export | Format | Example | Notes |
|---|---|---|---|
| `GITHUB_USERNAME` | `string \| null` | `"anasouza"` | username only, not the URL. `null` uses the GitHub URL in `PROFILE.socials`, else a demo graph with the label "your-handle" |
| `SHOW_BUILD_SECTION` | boolean | `false` | `false` hides the Build section on the home |

Do not change `DEFAULT_GITHUB_USERNAME` or `DEFAULT_GITHUB_LABEL`.

## Links section — `lib/content/links.ts`, export `LINKS`

`{ title: Localized; subtitle: Localized; url: string }[]`, display order.

```ts
{
  title: { pt: "Minha newsletter", en: "My newsletter" },
  subtitle: { pt: "Uma carta por semana sobre design.", en: "One letter a week about design." },
  url: "https://anasouza.substack.com",
},
```

Empty: `export const LINKS: HomeLink[] = [];` hides the section.

## Work page texts — `messages/en.json`, `messages/pt.json`

Edit the value only, keep the key. Both files.

| Key | What | Example (en) |
|---|---|---|
| `work.heading` | page title | `"Projects I helped build"` |
| `work.intro` | one or two sentences under the title; also the page meta description | `"I design and build products for small teams, from the first sketch to launch."` |
| `work.contactText` | line above the contact buttons | `"Let's talk about working together."` |

Leave the other `work.*` keys (they are interface labels, already translated). `work.eyebrow` ("Proof of work") may be changed only if the person asks.

## Skills — `lib/content/skills.ts`, export `SKILLS`

`{ label: Localized }[]`. Example: `{ label: { pt: "Pesquisa com usuários", en: "User research" } }`. Keep at least one: an empty list does not hide the section.

## Tools — `lib/content/tools.ts`, export `TOOLS`; logos in `public/tools/`

`{ name: string; area: Localized; url: string; icon: string }[]`, display order.

```ts
{
  name: "Notion",
  area: { pt: "Notas e documentação", en: "Notes & docs" },
  url: "https://www.notion.com",
  icon: "notion.svg",
},
```

`icon` is a file name inside `public/tools/` (SVG preferred; `.webp`/`.png` ok). New logos: `icons.md`. When a tool is removed, also delete its logo file from `public/tools/`. Keep at least one tool: an empty list does not hide the section.

## Languages — `lib/content/languages.ts`, export `LANGUAGES`

`{ name: Localized; level: Localized }[]`, native language first. Levels: `{ pt: "Nativa", en: "Native" }`, `{ pt: "Básico", en: "Basic" }`, `{ pt: "Intermediário", en: "Intermediate" }`, `{ pt: "Avançado", en: "Advanced" }`. Empty list hides the section.

## Booking link — `lib/content/contact.ts`, export `BOOKING_URL`

string. Example `"https://cal.com/anasouza"`. `""` hides the "Book call" button.

## Projects — `lib/content/projects-data.ts`

### `PROJECTS: ProjectData[]`

Display order on `/work` is by `year`, newest first.

| Field | Format | Example | Empty |
|---|---|---|---|
| `slug` | string, lowercase ASCII + hyphens, unique | `"checkout-redesign"` | required; URL `/work/<slug>` and the body folder name |
| `title` | Localized | `{ pt: "Redesenho do checkout", en: "Checkout redesign" }` | required |
| `cardText` | Localized, optional | short line on the card | delete the key |
| `summary` | Localized | one paragraph, shown on the case page | required |
| `client` | string, optional (not localized) | `"Acme"` | delete the key |
| `role` | Localized, optional | `{ pt: "Designer líder", en: "Lead designer" }` | delete the key |
| `outcome` | Localized, optional | `{ pt: "+18% em conversão", en: "+18% conversion" }` | delete the key. Only numbers the person gave |
| `period` | string, optional | `"2024-2025"` | delete the key |
| `year` | number, optional | `2025` | sorting only; missing sorts last |
| `category` | one of `PROJECT_CATEGORIES` | `"saas"` | delete the key |
| `externalLink` | URL, optional | `"https://acme.com"` | delete the key: no "Visit project" button |
| `coverImage` | image path | `"/projects/checkout-redesign/cover.webp"` | required |
| `metaTitle` | Localized, optional | search/share title | delete the key (the title is used) |
| `metaDescription` | Localized, optional | search/share description | delete the key (the summary is used) |

Categories (`lib/content/categories.ts`, `PROJECT_CATEGORIES`), with labels from `messages/*.json` `projectCategories.*`:

| Value | en | pt |
|---|---|---|
| `experience` | Experience | Experiência |
| `saas` | SaaS | SaaS |
| `ecommerce` | E-commerce | E-commerce |
| `landing-pages` | Landing pages | Landing pages |
| `ads` | Ads | Ads |
| `brands` | Brands | Brands |

Pick from this list; adding categories is out of scope.

### `FEATURED_PROJECTS: string[]`

Slugs shown on the home, in order. `[]` shows all projects. Unknown slugs are skipped.

### Case body — `content/projects/<slug>/en.md` and `pt.md`

Read by `readProjectBody` in `lib/content/projects.ts`: `<locale>.md`, falling back to `en.md`, then empty. Plain Markdown, no frontmatter, no H1 (the title comes from `PROJECTS`). Every `##` heading becomes an entry in the "On this page" index.

Structure, same as the examples:

```md
## Context

Paragraphs.

## What I did

Paragraphs, lists.

> Optional quote, e.g. what the client said (only a real quote).

### Detail

Paragraphs, optional images.

![Alt text describing the image](/projects/<slug>/1.webp "Caption shown under the image")

## Result

Paragraphs, numbers only if given.
```

`pt.md` uses `## Contexto`, `## O que eu fiz`, `### Detalhe`, `## Resultado`. If the person skips Detail, omit that heading. Supported Markdown: paragraphs, `**bold**`, `*italic*`, links (external ones open in a new tab), `-` and `1.` lists, `>` quotes, images with an optional `"title"` that becomes the caption.

### Example projects

`projeto-exemplo-1` and `projeto-exemplo-2`: entries in `PROJECTS`, slugs in `FEATURED_PROJECTS`, folders in `content/projects/` and their covers in `public/projects/`. Remove all of them when the first real project is saved. Keep `public/placeholder-thumbnail.svg` in place (fallback for an empty image). The shipped `public/images/avatar.webp` is the template author's photo; the profile step overwrites it with the person's own.

## Footer credit

`const CREDIT = "@viniciusbedum"` in `components/home/site-footer.tsx`. Optional: stays by default, remove it if the person wants (see SKILL.md rules).
