---
name: site-onboarding
description: Interview the site owner and fill this portfolio template with their real data (profile, photo, socials, GitHub, links, Work page, projects and case studies), then build and publish it on Vercel. Use when the person says "fill in my site", "set up my site", "onboarding", "put my data in the template", "preencher meu site", "configurar meu site", or opens the template for the first time and wants it to be theirs.
---

# Site onboarding

You turn this template into the person's own site by asking questions and writing the answers into the files yourself. The person is usually not a programmer: they should never have to open a code file.

Read before starting:
- `references/content-map.md`: every field, the file it lives in, its format and what an empty value does. Look up each field there before writing it.
- `references/icons.md`: when a social network or tool needs an icon or logo.
- `references/deploy.md`: at step 7.

## How to talk

- Speak the person's language (follow whatever language they write in).
- One question at a time. Short. Offer an example answer with every question.
- Every question is skippable. A skipped optional field stays empty (it hides, see content-map) or keeps the template value; tell them which.
- Write to the files as you go, right after each answer or small group of answers. Do not batch everything to the end.
- At the end of each section, show a short summary of what was saved (both languages) and ask if anything should change before moving on.
- Use plain words. Say "your photo", "the Work page", not "the `PROFILE` export".

## Rules

- **Out of scope:** layout or design changes, removing sections other than through the switches in content-map, new features, other site languages. If asked, say it is outside this setup, and offer to continue the setup. (They can ask for it separately after.)
- **Never invent facts.** No made-up numbers, clients, dates, results or quotes. If something is missing, ask, or leave it out. Polishing their wording is fine; adding claims is not.
- **Footer credit** (`@viniciusbedum`): optional. It stays by default; if the person wants it gone, remove it (the license does not require it).
- **Secrets:** never read, create or edit `.env`, `.env.local` or any `.env*` file. This site needs no secrets.
- Text fields are bilingual `{ pt, en }`: the site is English at `/` and Portuguese at `/br`. Both must be filled.
- Keep the code style of each file (quotes, commas, indentation). Change values, not structure.

## Interview flow

### 0. Languages

1. Answer in the language the person used. Ask only if unclear.
2. Ask which language they want to write the site content in: English or Portuguese.
3. Offer to translate each answer into the other language. Show both versions before saving; they approve or correct. If they prefer to write both, accept that.

### 1. Profile (home page)

Writes `lib/content/profile.ts` (`PROFILE`), `messages/{en,pt}.json` (`meta.siteName`, `meta.description`), `public/llms.txt`, and for the clock `components/home/live-clock.tsx` / `components/home/profile-card.tsx`.

Ask, one at a time:
1. **Photo.** "Send me the path to a photo of you, or drag the file here. A square-ish photo with your face centred works best." Then run:
   `node .claude/skills/site-onboarding/scripts/prepare-image.mjs avatar <input> public/images/avatar.webp`
   and set `avatar: "/images/avatar.webp"`. If the script fails, show its message and help fix it (usually `npm install`).
2. **Name**, as it should appear on the site (e.g. "Ana Souza"). Sets `name`, `heroTitle` and `meta.siteName` in both message files.
3. **Role**: what they do in a few words (e.g. "Product designer for early-stage startups"). Sets `role` and `meta.description`.
4. **Location** (e.g. "Lisbon, Portugal") and **time zone** for the live clock next to it (e.g. "Europe/Lisbon"; derive it from the city and confirm). Or remove the clock (see content-map).
5. **Socials**: which networks to show, and the URL of each. Only the ones they want; remove the rest. Check icons per `icons.md`.
6. **Email** for the contact button (e.g. "hello@anasouza.com"). Empty hides the "Copy email" button.
7. **Site icon and link preview image** (optional): "The site comes with a default icon and link preview. Do you have your own?" If yes, ask for the files and follow the exact sizes and names in content-map ("Site icon and share image"); convert with `sharp` to PNG/JPG at those sizes. If no, keep the defaults.

Then rewrite `public/llms.txt` with their name and role (content-map). Summarize.

### 2. GitHub

Writes `lib/content/github.ts`.

Ask: "Do you have a GitHub profile you want to show on the home page? It shows your contribution graph." (e.g. "github.com/anasouza").
- Yes: set `GITHUB_USERNAME` to the username only (`"anasouza"`), keep `SHOW_BUILD_SECTION = true`. If they also want the GitHub icon in the socials, add it there too.
- No, or they don't want it: `SHOW_BUILD_SECTION = false`.

### 3. Links

Writes `lib/content/links.ts` (`LINKS`).

Ask which links to highlight on the home (e.g. newsletter, course, podcast, shop). For each: title, a short subtitle, URL. Any number. None: set `LINKS = []` (the section hides). Summarize.

### 4. Work page

Writes `messages/{en,pt}.json` (`work.heading`, `work.intro`, `work.contactText`), `lib/content/profile.ts` (`availability`), `lib/content/skills.ts`, `lib/content/tools.ts` + `public/tools/`, `lib/content/languages.ts`, `lib/content/contact.ts`.

Ask, one at a time:
1. **Page title** (e.g. "Projects I helped build").
2. **Intro**: one or two sentences. Tell them it can be about the projects, or about them through the projects (e.g. "I design and build products for small teams, from the first sketch to launch.").
3. **Availability line** (e.g. "Available for new projects") or none.
4. **Contact line** above the buttons (e.g. "Let's talk about working together.").
5. **Skills**: a list of words or short phrases (e.g. "UX research, Prototyping, Design systems"). At least one.
6. **Tools**: read the current `TOOLS` list to them by name. Ask which to keep, which to remove, and which to add. For each new tool: name, what they use it for, website, and a logo (`icons.md`). At least one.
7. **Languages** they speak and level: native first ("Native"), then Basic / Intermediate / Advanced. None: empty list hides the section.
8. **Booking link** (Cal.com, Calendly...) for the "Book call" button, or none (empty hides it).

Summarize.

### 5. Projects, one by one

Writes `lib/content/projects-data.ts` (`PROJECTS`, `FEATURED_PROJECTS`), `content/projects/<slug>/{en,pt}.md`, images in `public/projects/<slug>/`.

Ask how many projects they want to add now (they can come back later). For each project:

**Card fields**, one at a time: title; short card description; one-paragraph summary; client (or none); their role; main result in one line (or none); period (e.g. "2024-2025") and year (for ordering); category, chosen from the existing list in content-map (show the labels in their language); external link (or none). Create the `slug` from the title (lowercase, hyphens, ASCII) and confirm it; it becomes the page URL `/work/<slug>`.

**Cover image**: "Send me an image for the project cover; it will be cropped to 3:2." Run:
`node .claude/skills/site-onboarding/scripts/prepare-image.mjs cover <input> public/projects/<slug>/cover.webp`

**The case**, in four parts plus two optional ones. Ask each part's guiding questions one at a time, then write the part in their voice from their answers (first person, short paragraphs, lists where they fit), show it, and adjust.

- **Context**: What was the problem or goal? Who was it for (client, users, team)? Why did it matter then?
- **What I did**: What was your role, and who did you work with? What were the key decisions, and why? What did the process look like, step by step?
- **Detail** (optional): Is there one piece worth zooming in on (a screen, a flow, a technique, a hard trade-off)? What made it interesting? Do you have images of it? For each image: run the `body` mode to `public/projects/<slug>/<n>.webp`; images have no caption, and only if they have a source link for it, add a `note` block right after the image (format in content-map).
- **Result**: What changed after? Any numbers (conversion, revenue, time saved, users)? If there are no numbers, what was the qualitative outcome (feedback, launch, what the client did next)?

- **Development** (optional): Were there dated updates worth recording (a release, a milestone, a change)? For each: the date and one short paragraph. Skip it if there are none.
- **Sources** (optional): Are there links worth crediting (articles, docs, repos, press)? For each: kind, title, link, who and where, one line on why. Also ask if any paragraph or image needs a short source line. If they have no links, omit the `source` and `note` blocks entirely.

Write both `en.md` and `pt.md` following the heading structure in content-map. Never add numbers they did not give.

**When the first real project is saved:** hide the examples, do not delete them. Remove the `projeto-exemplo-1` and `projeto-exemplo-2` entries from `PROJECTS` and their slugs from `FEATURED_PROJECTS`; that is enough for them to disappear from the site (an unlisted project never becomes a page). Keep the folders `content/projects/projeto-exemplo-*/` and the covers in `public/projects/projeto-exemplo-*/`: they stay in the code as hidden models, and a new project is made by duplicating one. Keep `public/placeholder-thumbnail.svg` in place regardless (it is the fallback for empty images). The shipped `public/images/avatar.webp` is the template author's photo: step 1 replaces it with theirs.

After the last project, ask **which projects show on the home**; set `FEATURED_PROJECTS` (it only picks; the order is the same as `/work`). Then ask whether they want to pin up to 5 projects to the top (set `pinnedAt` to today's date on the one pinned last, earlier dates on the others so the last pinned is first). Summarize all projects.

### 6. Check

1. Run `npm run build`. If it fails, read the error, fix what it points at (usually a quote, comma or missing field in a file you edited), and run again until it passes.
2. List what is still template text or placeholder. At least search for: `Your Name`, `example.com`, `Lorem ipsum`, `placeholder-thumbnail` (in `lib/` and `content/` only), `Page title (e.g.`, `A short line inviting`, `Título da página (ex:`, `Uma frase curta convidando`, `Vinicius Bedum` in `messages/` and `public/llms.txt`, and the example socials (bare `https://x.com`, `https://github.com`...). Ask about each remaining item: fill it or remove it.
3. Optionally, offer `npm run dev` so they can open `http://localhost:3000` and look.

### 7. Publish

Follow `references/deploy.md` (including the optional visit counter). Hand back the public link and suggest putting it in their bio.
