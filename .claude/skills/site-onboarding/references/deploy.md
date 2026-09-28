# Publish on Vercel

The site is a standard Next.js app. It needs no environment variables or accounts other than GitHub and Vercel (both free). Run `npm run build` first; publish only when it passes.

Ask the person which path they prefer. Default to A.

## A. GitHub + Vercel import (default)

Every later change is published automatically when pushed.

1. **GitHub account.** Ask if they have one; if not, send them to https://github.com/signup and wait.
2. **Commit the work.** `git status`, then `git add` the changed files by name (never secrets; there should be none) and `git commit -m "content: my site"`. If the folder is not a git repo yet, `git init` first.
3. **Create the repository and push.**
   - First, `git remote -v`. If a remote named `origin` already exists (a clone of the template repo has one), it must not be reused for the person's site: `git remote rename origin template` (keeps it around, harmless) or `git remote remove origin` if they don't want it at all.
   - With the GitHub CLI (`gh --version` works and `gh auth status` is logged in): `gh repo create <name> --private --source . --push`. If `gh` is installed but not logged in, ask them to run `gh auth login` themselves and follow the browser steps.
   - Without it: ask them to create an empty repository at https://github.com/new (no README, no .gitignore, no license), paste the URL back, then `git remote add origin <url>` and `git push -u origin main` (use the current branch name from `git branch --show-current`).
   - Private or public is their choice; private is fine for Vercel.
4. **Import on Vercel.** Tell them: go to https://vercel.com/new, sign in with GitHub, pick the repository, keep every default (Vercel detects Next.js), click **Deploy**. Wait for it to finish (1–3 minutes).
5. **The link.** Vercel shows `https://<project>.vercel.app`. Ask them to paste it; check it with `curl -sI <url>` (expect `200`). That is the public link for their bio.

## B. Vercel CLI (no GitHub)

Quicker once, but each update needs the command again.

1. `npx vercel login`: they sign in in the browser (let them do it).
2. `npx vercel --prod` from the project folder. Accept the defaults for scope and project name (they may rename it; the name becomes `<name>.vercel.app`).
3. The command prints the production URL. Check with `curl -sI <url>` and hand it back.

Do not run `vercel link` or `vercel env pull`: they create or touch `.env*` files, and this site has nothing to pull.

## Visit counter (optional)

After the first deploy, ask if they want a "profile views" counter in the footer. If yes, guide them in the Vercel dashboard (they click; you never handle the keys): project → **Storage** / **Marketplace** → **Upstash for Redis** → create the free database → **connect to this project** → **Redeploy**. Vercel sets the keys itself. Then `curl -s <url>/api/views` should return `{"count":…}` (a 404 means the keys aren't there yet or the redeploy didn't run). Never read or write `.env*` files for this.

## Custom domain (optional)

If they own a domain: Vercel dashboard → the project → **Settings → Domains** → add it, then set the DNS records Vercel shows at their domain registrar. It can take from minutes to a few hours to work. You can explain the records but they must enter them in their registrar.

## `NEXT_PUBLIC_SITE_URL` (optional)

Canonical links, sitemap and share previews use the Vercel production URL automatically. Only with a custom domain it's worth setting `NEXT_PUBLIC_SITE_URL` to `https://theirdomain.com` in Vercel → **Settings → Environment Variables** (Production), then redeploy. They set it in the dashboard; never write it into a local `.env*` file.

## After publishing

- Hand back the link and suggest it for their bio.
- To update later: edit (or ask the AI to edit), then commit and push (A) or run `npx vercel --prod` again (B).
