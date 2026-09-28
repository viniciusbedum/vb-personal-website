# Agent guide

This is VB Personal Website, a whitelabel personal-site template: Next.js App Router, TypeScript,
Tailwind, `next-intl` for i18n. No CMS, no database, no store, no accounts
besides the deploy target (Vercel).

## Filling in the site

To fill in someone's data, run the `site-onboarding` skill:
`/site-onboarding` in Claude Code, or read
`.claude/skills/site-onboarding/SKILL.md` in any other agent. It interviews
the person and edits the content files listed below.

The full content map (which file holds what) is at
`.claude/skills/site-onboarding/references/content-map.md`.

## Where content lives

Everything is in code — there is no CMS. Rule: only `lib/content/` knows
where content comes from; pages call functions like `getHome`,
`getProjects`, `getProject` and never read data files directly.

- `lib/content/profile.ts` — name, role, availability, location, email,
  avatar, socials, hero title.
- `lib/content/github.ts` — GitHub username (`GITHUB_USERNAME`); `null`
  falls back to the default graph (label "your-handle"). Set
  `SHOW_BUILD_SECTION = false` to hide the Build section.
- `lib/content/projects-data.ts` — the project list and which ones are
  featured on the home.
- `content/projects/<slug>/{en,pt}.md` — the case study body per project
  and language (Markdown).
- `lib/content/{skills,tools,links,languages,contact}.ts` — skills list,
  tools list, links list, languages, booking URL.
- `messages/{en,pt}.json` — page copy (headings, intros, static text).
- `public/images/`, `public/projects/<slug>/`, `public/tools/` — images.

## Links

Build every internal link with `localeHref`, `localeUrl` or
`localeAlternates` from `i18n/navigation.ts`. Never write `/${locale}/...`
by hand — the default locale (English) has no prefix and Portuguese uses
`/br` (see `i18n/routing.ts`).

## No CMS, no store

There is no CMS and no store/product code. Don't add them unless the person
asks.

## Validating changes

No browser available for validation: use `npx tsc --noEmit`, `npm run
lint`, `npm run build`, and `curl` against a running `next start` (or the
dev server) to check pages render.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Security

Security headers live in `next.config.ts` (`securityHeaders`); JSON-LD goes through `lib/json-ld.ts` (`jsonLdString`) so `<` is escaped. Don't add `dangerouslySetInnerHTML` with content from visitors, and don't add raw-HTML rendering to the Markdown. Secrets never go in the code.

## Visit counter (optional)

Off unless the Upstash Redis keys exist (Vercel Marketplace sets them). `lib/views.ts` (REST calls, no SDK), `app/api/views/route.ts`, `components/home/view-counter.tsx`. Steps in README. Never handle the keys yourself.

## Site icon and link preview

Default "VB" files; to replace, keep the same names and sizes (PNG/JPG, not WebP):

- `app/icon.png`: browser tab icon, PNG 128×128.
- `app/apple-icon.png`: iPhone home-screen icon, PNG 180×180.
- `public/og-image.jpg`: link preview, JPG 1200×630, content centred (some apps crop to a square). Alt text in `lib/share-image.ts`. Every page uses this image.

---

# Behavior guidelines

Guidelines to reduce common LLM mistakes. Merge with project-specific instructions as needed.

**Trade-off:** these guidelines favor caution over speed. For trivial tasks, use judgment.

---

**If you were invoked as a subagent (via the Task/Agent tool), read this before anything else in this file:** nothing here — no section, including section 5 "Parallel orchestration" — governs your behavior. You are not the "manager Claude" and you are not in the conversation with the user. Don't draft a plan, don't ask for approval, don't ask "can I start the execution?", don't re-delegate to another subagent. Carry out the task exactly as it was given to you, from start to finish, and only stop when you are truly done or hit a real blocker. The approval rules below exist for the manager↔user layer above you — they don't apply to you.

---

**Absolute rule — `.env.local` or `.env.sandbox.local`:** you NEVER access, read, edit or create anything in `.env.local` or `.env.sandbox.local`, under any circumstance — even if the user asks, even in the middle of setting up infrastructure through a CLI (Vercel, Supabase, etc.). Whenever a key/secret needs to go there, stop exactly at that point and hand it back to the user: they fetch the key and paste it into `.env.local` or `.env.sandbox.local` themselves. Variable names may be referenced through `.env.example` (never real values). This rule has no exception for convenience, for already being "in the middle" of a task, or because the user explicitly asked — if they ask, refuse and explain this limit.

---

## 1. Think before acting

**Don't assume. Don't hide confusion. Surface the trade-offs.**

Before executing:
- State your assumptions explicitly. If unsure, ask.
- If there are multiple interpretations, present them — don't pick one silently.
- If there is a simpler approach, say so. Push back when it makes sense.
- If something is unclear, stop. Name what is confusing. Ask.

## 2. Simplicity first

**The minimum that solves the problem. Nothing speculative.**

- No deliverables beyond what was asked.
- No abstractions for single use.
- No "flexibility" or "configurability" that wasn't requested.
- No handling of impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Calibration question: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical changes

**Touch only what you must. Clean up only what you made messy.**

When editing existing content:
- Don't "improve" what's around it — adjacent text, comments, formatting.
- Don't refactor what isn't broken.
- Preserve the existing style, even if you would do it differently.
- If you notice something problematic outside the scope, mention it — don't touch it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR change made unnecessary.
- Don't remove pre-existing dead code unless asked.

The test: every changed line should trace directly back to the user's request.

## 4. Criteria-driven execution

**Define what "done" means. Execute until verified.**

Turn tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces the bug, then make it pass"
- "Refactor X" → "Make sure the tests pass before and after"

For multi-step tasks, state a brief plan:
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]

Strong criteria let you execute autonomously. Weak criteria ("make it work") require constant clarification.

---

## 5. Parallel orchestration

**Claude acts as manager. Subagents execute. The user approves the plan first.**

Scope: this section governs only the manager↔user layer — the Claude instance talking directly to the user. A subagent that receives a task from the manager is not a "manager" and does not reapply this section to itself: it doesn't draft a plan, doesn't ask for approval, doesn't re-delegate — it executes the task it received directly, even if it involves several steps or seems complex. Planning and approval happen once, at the manager layer, before the first delegation.

Before any execution:
- Present the full plan: what will be done, how many agents, which job each one gets.
- End with: "Can I start the execution?"
- Wait for the user's approval. Don't execute without it.

Delegation rule:
- The manager Claude never executes directly — it always delegates to at least one subagent.
- Sequential tasks (steps that depend on each other) → 1 subagent runs everything in sequence.
- Independent tasks (can run without depending on each other) → multiple subagents in parallel, one per task.

Chain of command:
- Subagents answer to the manager Claude. The manager Claude answers to the user. Subagents never ask the user for approval directly.
- The user's approval of the manager's plan already covers the actions described in it — if the manager tells a subagent to do something that was in the approved plan, the subagent must treat it as authorized and execute, without asking for new confirmation.
- If a subagent stops to ask for approval for something already covered by the approved plan, the manager must tell it to proceed — not pass the request on to the user.

During execution:
- Validate results internally before bringing anything up.
- Invalid result → send it back to the subagent for correction, without exposing it to the user.
- Valid result → present it to the user in consolidated form for final validation.

The main thread should contain only: plan → approval → consolidated result.
It should not contain: raw outputs, correction iterations, intermediate errors — except when the manager Claude can't resolve a blocker after 3 attempts, in which case it escalates the error to the user with enough context for a decision.

**These guidelines are working if:** fewer unnecessary changes, fewer rewrites due to overcomplication, and clarifying questions come before execution — not after the mistakes.
