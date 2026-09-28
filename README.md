# VB Personal Website

A plug-and-play personal site: a home page, a filterable work/portfolio
page with case studies, and a privacy page. No CMS, no database, no store
— all content lives in code, and an AI agent skill fills it in for you by
asking a few questions.

## Quick start

1. Clone this repo and `cd` into it.
2. `npm install`
3. `npm run dev` — open `http://localhost:3000`
4. Open the project in an AI coding agent (Claude Code, Codex...) and run
   the onboarding skill: in Claude Code, type `/site-onboarding`; in other
   agents, ask it to read and follow
   `.claude/skills/site-onboarding/SKILL.md`. It will interview you and
   edit the files below with your name, work, links and case studies.

No account is required to run the site locally, and no environment
variables are required for a first deploy.

## Editing the content yourself

If you'd rather skip the skill and edit the files directly:

| Content | File |
|---|---|
| Name, role, availability, location, email, avatar, socials, hero title | `lib/content/profile.ts` |
| GitHub username (or hide the Build section) | `lib/content/github.ts` |
| Project list (title, summary, client, role, outcome, period, category, cover, which are featured on the home) | `lib/content/projects-data.ts` |
| Case study body per project and language | `content/projects/<slug>/en.md`, `content/projects/<slug>/pt.md` |
| Skills list | `lib/content/skills.ts` |
| Tools list | `lib/content/tools.ts` |
| Links list (home "Links" section) | `lib/content/links.ts` |
| Languages you speak | `lib/content/languages.ts` |
| Booking/scheduling URL | `lib/content/contact.ts` |
| Page copy (headings, intros) | `messages/en.json`, `messages/pt.json` |
| Images | `public/images/`, `public/projects/<slug>/`, `public/tools/` |

Only `lib/content/` knows where content comes from — pages call functions
like `getHome`, `getProjects` and `getProject` and never read the data
files directly.

## Site icon and link preview

The template ships with a default "VB" icon and link preview image. Replace the files, keeping the same names and sizes:

| What | File | Format and size |
|---|---|---|
| Browser tab icon | `app/icon.png` | PNG, 512×512 |
| iPhone home-screen icon | `app/apple-icon.png` | PNG, 180×180 |
| Link preview (WhatsApp, LinkedIn, X, iMessage...) | `public/og-image.jpg` | JPG, 1200×630 |

Keep the text or logo of the preview centred: some apps show it as a square thumbnail and crop the sides. The alt text is `SHARE_IMAGE.alt` in `lib/share-image.ts`. Use PNG/JPG, not WebP: browsers and social apps don't reliably support WebP for these. Every page uses the same preview image.

## Deploying

Import the repo on [Vercel](https://vercel.com/new). No environment
variables are required — the site falls back to the deployment's own URL.
If you want a fixed canonical URL, set `NEXT_PUBLIC_SITE_URL` (see
`.env.example`).

## Visit counter (optional)

Off by default. It shows "N profile views" in the footer, above "Share page". To turn it on (after the site is on Vercel):

1. In the Vercel dashboard, open the project → **Storage** (or **Marketplace**) → **Upstash for Redis** → create a free database and **connect it to this project**. Vercel adds the keys (`KV_REST_API_URL`, `KV_REST_API_TOKEN` or `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`) to the project by itself.
2. **Redeploy** (Deployments → the latest one → Redeploy), so the site picks up the keys.

That's it: the counter appears and the privacy page gains a line about it. Each browser session counts once; no cookie and no personal data. To run it locally, put the same two values in `.env.local` (names in `.env.example`). To turn it off, disconnect the database and redeploy. Code: `lib/views.ts`, `app/api/views/route.ts`, `components/home/view-counter.tsx`.

## Languages

The site ships in English (default, at the bare domain) and Portuguese Brazil (at
`/br`). Adding another language is possible but outside the scope of the
onboarding skill — ask your agent for help if you want one.

## Security

The site has no login, database or forms, and no secrets in the code. It ships with standard security headers and its dependencies are kept current.

Good practice for your own copy:

- Turn on 2FA or a passkey on GitHub, Vercel and your domain registrar.
- Turn on Dependabot in your GitHub repository and apply security updates when it warns you.
- Never put secrets (API keys, tokens) in the code; use Vercel environment variables.

Found a security problem? See [SECURITY.md](SECURITY.md).

## Privacy

`/privacy` explains the only thing the site stores in the browser: a
`NEXT_LOCALE` cookie that remembers the language you picked. No analytics,
ads or tracking.

## License

Source-available, not MIT — see `LICENSE`. Free to use and modify for your
own site, personal or professional. Not allowed without written
permission: reselling or redistributing this template (modified or not) as
a product, or building sites for third parties with it. The footer credit is
optional: you don't need to keep it, only if you want to.
