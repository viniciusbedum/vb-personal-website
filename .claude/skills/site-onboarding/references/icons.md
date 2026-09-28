# Icons and logos

## License rule

Before using any icon or logo from a third-party pack, check its license.

- OK: MIT, Apache 2.0, ISC, CC0 (public domain).
- Not OK by default: any CC BY license (it requires crediting the icon's author), any license with NC (non-commercial), ND (no derivatives) or SA (share-alike), GPL, and anything with no clear license (e.g. a logo copied from a company's website). Pick another pack.
- If the person insists on a specific logo that is only available under one of these: explain the risk in plain words (for example, CC BY means they must credit the author somewhere on the site; NC means it can't be used on a site that earns money; no license means the owner can ask them to take it down), then let them decide. If they still want it, use it, add the credit when the license asks for one, and note the license in a comment next to the icon.
- Brand logos stay trademarks of their owners; the license covers the drawing, not the brand. Use them only to name the network or tool, unchanged in meaning.

Add a short comment next to every new icon with its pack and license (the existing ones do: "Griddy Icons (MIT)", "Tabler (MIT)").

## Social icons — `components/home/profile-card.tsx`

The icon comes from the `platform` string in `PROFILE.socials`. It is normalized by `socialKey()`: lowercased, a trailing `.com`/`.net` removed, everything except `a-z` removed, and `twitter` becomes `x`. So `"X.com"`, `"Twitter"` → `x`; `"LinkedIn"` → `linkedin`.

### Already mapped (use these `platform` values, nothing else to do)

Phosphor Icons (`socialIcons`): `X.com` (or `Twitter`), `Linkedin`, `GitHub`, `Instagram`, `Threads`, `Figma`, `Dribbble`, `TikTok`, `YouTube`.

Custom SVG paths (`customSocialIcons`): `Substack`, `Behance`, `Strava`.

Any other platform shows a generic link icon. That works, but offer to add the real one.

### Adding a network

1. **Phosphor first.** Phosphor (MIT) is already installed. Check if it has the logo: `ls node_modules/@phosphor-icons/react/dist/ssr | grep -i <name>` (e.g. `PinterestLogo`, `SpotifyLogo`, `TwitchLogo`, `DiscordLogo`, `MediumLogo`, `WhatsappLogo`, `TelegramLogo`, `FacebookLogo`, `SnapchatLogo`, `RedditLogo`, `MastodonLogo`). If yes:
   - add it to the `@phosphor-icons/react/ssr` import at the top of `profile-card.tsx`, keeping the list alphabetical;
   - add `<key>: <Name>Logo,` to `socialIcons`, where `<key>` is the `socialKey()` of the platform string (e.g. `pinterest: PinterestLogo`).
2. **Otherwise, an Iconify pack.** Search: `curl -s "https://api.iconify.design/search?query=<name>&limit=30"`. Prefer 24px packs that match Phosphor's thin look: `tabler` (MIT, stroked), `griddy-icons` (MIT), `ri` (Remix, Apache 2.0), `mingcute` (Apache 2.0), `mdi` (Apache 2.0).
   - License check: `curl -s "https://api.iconify.design/collections?prefixes=<prefix>"` → read `license.spdx`. Apply the rule above.
   - Fetch: `curl -s "https://api.iconify.design/<prefix>.json?icons=<name>"` → `icons.<name>.body` is the SVG content; check the pack `width`/`height` is 24 (the component draws on a 24×24 viewBox).
   - Add to `customSocialIcons`: `<key>: { path: "<d>" }` for filled icons. For stroked icons (the body has `stroke="currentColor"`), use `{ path: "<d>", stroke: true }`; it is drawn at stroke width 1.5 to match Phosphor. If the body has several `<path d="...">`, join the `d` values with a space into one string. Skip icons that need several colours or shapes other than paths.

## Tool logos — `public/tools/`

Each entry in `TOOLS` (`lib/content/tools.ts`) has `icon: "<file>"`, a file in `public/tools/`. The list shows the logo small, in colour.

1. Check `public/tools/` first; the file may already exist.
2. Find a logo on allsvgicons.com (search `https://allsvgicons.com/search/?q=<tool>`) or Iconify (`curl -s "https://api.iconify.design/search?query=<tool>&limit=30"`; colour brand logos are in `logos` (CC0) and `simple-icons` (CC0, single colour)). Every allsvgicons.com icon page names its pack and license; apply the rule above.
3. Save the SVG: `curl -s "https://api.iconify.design/<prefix>/<name>.svg" -o public/tools/<tool-slug>.svg`. Check the file starts with `<svg` and is not empty.
4. If the person has their own logo file (PNG/JPG), convert it: `node .claude/skills/site-onboarding/scripts/prepare-image.mjs body <input> public/tools/<tool-slug>.webp`.
5. Set `icon: "<tool-slug>.svg"` (or `.webp`).
