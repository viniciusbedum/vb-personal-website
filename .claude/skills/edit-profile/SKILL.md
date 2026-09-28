---
name: edit-profile
description: Change the owner's personal data on this portfolio site after the first setup: photo, name, role, location and clock time zone, availability, social links, email, booking link, highlighted links, skills, tools, languages, GitHub section, Work page texts, site icon and link preview image. Updates the files in both languages and checks the build. Use when the person says "edit my profile", "change my photo", "update my bio", "new social link", "editar perfil", "trocar minha foto", "atualizar minhas informações", or asks to change any of those items.
---

# Edit profile

You change the person's own data on the site by asking what to change and writing it yourself. The person should never have to open a code file. This is for changes after the first setup; for the very first fill-in use `site-onboarding`.

Read first: `.claude/skills/site-onboarding/references/content-map.md` (every field, its file, format and what an empty value does) and `.claude/skills/site-onboarding/references/icons.md` when a social network or tool needs an icon or logo.

## Rules

- **Never invent facts.** Ask for what is missing; polishing their wording is fine.
- Text fields are bilingual `{ pt, en }` (English at `/`, Portuguese at `/br`). Fill both; if they give one language, translate and show both before saving.
- Answer in the language the person uses.
- Never read, create or edit `.env` files. Do not change layout, design or components; this skill only changes content and content-related settings from content-map.
- Keep each file's code style. Change values, not structure.
- One change at a time: apply it, show what changed in both languages, ask if anything else.

## Where each thing lives

| They want to change | Change | File (details in content-map) |
|---|---|---|
| Photo | run `prepare-image.mjs avatar <input> public/images/avatar.webp` | `PROFILE.avatar` stays `"/images/avatar.webp"` |
| Name | `name`, `heroTitle`, `meta.siteName` in both message files, and the title and description line in `public/llms.txt` | `profile.ts`, `messages/{en,pt}.json`, `public/llms.txt` |
| Role | `role`, `meta.description` in both languages, and the description line under the title in `public/llms.txt` | same + `public/llms.txt` |
| Location, clock time zone | `location`; `TIME_ZONE` (IANA name, derive from the city and confirm) and the city named in the doc comment above the clock function, or remove the clock | `profile.ts`, `components/home/live-clock.tsx` |
| Availability line | `availability` (delete the key to hide) | `profile.ts` |
| Socials | add, remove, reorder; check the icon in `icons.md`. The template ships example socials with generic URLs: ask which are really theirs and remove the rest | `profile.ts` |
| Email, booking link | `email`; `BOOKING_URL` | `profile.ts`, `lib/content/contact.ts` |
| Highlighted links | add, edit, remove; `[]` hides the section | `lib/content/links.ts` |
| Skills, tools, languages | lists in order; new tool logos per `icons.md` | `skills.ts`, `tools.ts` + `public/tools/`, `languages.ts` |
| GitHub | `GITHUB_USERNAME`, `SHOW_BUILD_SECTION` | `lib/content/github.ts` |
| Work page texts | `work.heading`, `work.intro`, `work.contactText` | `messages/{en,pt}.json` |
| Site icon, link preview image | exact sizes and names in content-map | `app/icon.png`, `app/apple-icon.png`, `public/og-image.jpg` |

When the name or role changes, keep `meta.*` and `public/llms.txt` in sync. When a tool is removed, delete its logo file. When something is removed, remove what depended on it (for example the email line on `/privacy` disappears by itself when `email` is deleted).

## Flow

1. Ask what they want to change (or read their message). If it is several things, list them and go one by one.
2. Show the current value, take the new one, translate if needed, confirm.
3. Write the change to every place in the table above.
4. After the last change run `npx tsc --noEmit` and `npm run build` until both pass, then summarize and offer `npm run dev` to look at `http://localhost:3000`.

Adding a project is `add-project`. Publishing is `.claude/skills/site-onboarding/references/deploy.md`.
