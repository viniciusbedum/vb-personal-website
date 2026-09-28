import Image from "next/image";
import {
  DribbbleLogo,
  FigmaLogo,
  GithubLogo,
  InstagramLogo,
  Link as LinkIcon,
  LinkedinLogo,
  ThreadsLogo,
  TiktokLogo,
  XLogo,
  YoutubeLogo,
} from "@phosphor-icons/react/ssr";
import type { Icon } from "@phosphor-icons/react";
import type { HomeProfile } from "@/lib/content/types";
import { LiveClock } from "./live-clock";
import { ScrambleText } from "./scramble-text";

/** Social brand icons, from Phosphor Icons. */
const socialIcons: Record<string, Icon> = {
  x: XLogo,
  linkedin: LinkedinLogo,
  github: GithubLogo,
  instagram: InstagramLogo,
  threads: ThreadsLogo,
  figma: FigmaLogo,
  dribbble: DribbbleLogo,
  tiktok: TiktokLogo,
  youtube: YoutubeLogo,
};

/**
 * Brand icons on a 24 grid: Substack and Behance outlines from Griddy
 * Icons (MIT, filled paths), Strava line from Tabler (MIT, stroked at 1.5 so
 * it matches Phosphor's regular weight at 18px).
 */
const customSocialIcons: Record<string, { path: string; stroke?: boolean }> = {
  substack: {
    path: "m21 22.322l-8.969-5.364l-8.96 5.36L2.995 9H21zm-16.445-2.64l7.092-4.242l.384-.23l.385.23l7.084 4.237V10.5H4.504zM21 7H3V5.5h18zm0-3.5H3V2h18z",
  },
  behance: {
    path: "M7.5 5.5a3.498 3.498 0 0 1 2.51 5.938A3.75 3.75 0 0 1 12 14.75c0 2.07-1.68 3.75-3.75 3.75H2v-13zm10 3.5c2.52 0 4.349 2.02 4.494 4.455l.047.795h-7.506C14.76 15.84 16.038 17 17.5 17c1.225 0 2.317-.81 2.773-2.016l1.404.532C21.024 17.24 19.415 18.5 17.5 18.5c-2.529 0-4.5-2.172-4.5-4.75S14.971 9 17.5 9m-14 8h4.75c1.24 0 2.25-1.01 2.25-2.25S9.49 12.5 8.25 12.5H3.5zm14-6.5c-1.304 0-2.462.922-2.856 2.25h5.714c-.382-1.335-1.495-2.25-2.858-2.25m-14 .5h4c1.106 0 2-.894 2-2s-.894-2-2-2h-4zM20 7.5h-5V6h5z",
  },
  strava: {
    path: "M15 13L10 3L5 13m6 0l4 8l4-8",
    stroke: true,
  },
};

/** "X.com" -> "x", "GitHub" -> "github", "Twitter" -> "x". */
function socialKey(platform: string) {
  const key = platform
    .toLowerCase()
    .replace(/\.(com|net)$/, "")
    .replace(/[^a-z]/g, "");
  return key === "twitter" ? "x" : key;
}

function SocialIcon({ platform }: { platform: string }) {
  const key = socialKey(platform);
  const custom = customSocialIcons[key];
  if (custom) {
    return (
      <svg viewBox="0 0 24 24" className="size-[18px]" aria-hidden>
        {custom.stroke ? (
          <path
            d={custom.path}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path d={custom.path} fill="currentColor" />
        )}
      </svg>
    );
  }
  const Icon = socialIcons[key] ?? LinkIcon;
  return <Icon className="size-[18px]" weight="regular" aria-hidden />;
}

export type ProfileCardProps = {
  locale: string;
  profile: HomeProfile;
};

/**
 * Top of the home: 56px
 * avatar (rounded square, 12px corners like the cards), name,
 * role, social icons, then scrambled mono location next to the live
 * clock. Contact buttons live on the Work page. Server component.
 */
export function ProfileCard({ locale, profile }: ProfileCardProps) {
  const monoLine =
    "font-mono text-[13px] leading-[0.8] tracking-[0.6px] uppercase text-muted-foreground";

  return (
    <header className="flex flex-col items-start text-left">
      <Image
        src={profile.avatar}
        alt={profile.name}
        width={56}
        height={56}
        priority
        className="size-14 rounded-xl object-cover"
      />

      <h1 className="mt-8 text-2xl leading-[1.2] font-medium text-foreground uppercase">{profile.name}</h1>
      <p className="mt-6 text-[15px] leading-[1.5] text-subtle">{profile.role}</p>

      {profile.socials.length > 0 ? (
        <ul className="mt-[27px] flex flex-wrap justify-start gap-2">
          {profile.socials.map(({ platform, url }) => (
            <li key={url} className="relative">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={platform}
                className="group flex size-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:text-foreground"
              >
                <SocialIcon platform={platform} />
                <span
                  aria-hidden
                  className="pointer-events-none absolute top-full left-1/2 mt-2 -translate-x-1/2 rounded-md bg-border px-1.5 py-0.5 text-xs whitespace-nowrap text-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  {platform}
                </span>
              </a>
            </li>
          ))}
        </ul>
      ) : null}


      <div className={`mt-[31px] flex items-center gap-3 ${monoLine}`}>
        {profile.location ? (
          <p>
            <ScrambleText text={profile.location} />
          </p>
        ) : null}
        <LiveClock locale={locale} />
      </div>
    </header>
  );
}
