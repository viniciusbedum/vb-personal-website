import type { Localized } from "./types";

export type ProfileData = {
  name: string;
  /** Page title (home hero, `<title>`). */
  heroTitle: string;
  role: Localized;
  availability?: Localized;
  location?: Localized;
  email?: string;
  avatar: string;
  socials: { platform: string; url: string }[];
};

/** Whitelabel users edit this. */
export const PROFILE: ProfileData = {
  name: "Your Name",
  heroTitle: "Your Name",
  role: {
    pt: "O que você faz, em poucas palavras",
    en: "What you do, in a few words",
  },
  availability: {
    pt: "Disponível para novos projetos",
    en: "Available for new opportunities",
  },
  location: {
    pt: "Brasil",
    en: "Brazil",
  },
  email: "hello@example.com",
  avatar: "/images/avatar.webp",
  socials: [
    { platform: "X.com", url: "https://x.com" },
    { platform: "Linkedin", url: "https://www.linkedin.com" },
    { platform: "GitHub", url: "https://github.com" },
    { platform: "Instagram", url: "https://instagram.com" },
    { platform: "TikTok", url: "https://www.tiktok.com" },
    { platform: "YouTube", url: "https://www.youtube.com" },
    { platform: "Substack", url: "https://substack.com" },
    { platform: "Strava", url: "https://www.strava.com" },
    { platform: "Behance", url: "https://www.behance.net" },
  ],
};
