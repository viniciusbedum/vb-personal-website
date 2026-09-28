export type Tool = {
  name: string;
  area: { pt: string; en: string };
  url: string;
  icon: string;
};

/** Whitelabel users edit this list. */
export const TOOLS: Tool[] = [
  {
    name: "Claude Code",
    area: { pt: "IA para programação", en: "AI coding" },
    url: "https://claude.com/product/claude-code",
    icon: "claude-code.svg",
  },
  {
    name: "Codex",
    area: { pt: "IA para programação", en: "AI coding" },
    url: "https://openai.com/codex",
    icon: "codex.svg",
  },
  {
    name: "Visual Studio Code",
    area: { pt: "Editor de código", en: "Code editor" },
    url: "https://code.visualstudio.com",
    icon: "vscode.svg",
  },
  {
    name: "Vercel",
    area: { pt: "Deploy e hospedagem", en: "Deploy & hosting" },
    url: "https://vercel.com",
    icon: "vercel.svg",
  },
  {
    name: "Framer",
    area: { pt: "Sites", en: "Websites" },
    url: "https://www.framer.com",
    icon: "framer.svg",
  },
  {
    name: "WordPress",
    area: { pt: "Sites", en: "Websites" },
    url: "https://wordpress.org",
    icon: "wordpress.svg",
  },
  {
    name: "Figma",
    area: { pt: "Design de interface", en: "UI design" },
    url: "https://www.figma.com",
    icon: "figma.svg",
  },
  {
    name: "Meta Ads",
    area: { pt: "Tráfego pago", en: "Paid media" },
    url: "https://www.facebook.com/business/ads",
    icon: "meta-ads.svg",
  },
  {
    name: "Google Ads",
    area: { pt: "Tráfego pago", en: "Paid media" },
    url: "https://ads.google.com",
    icon: "google-ads.svg",
  },
  {
    name: "Google Analytics",
    area: { pt: "Análise de dados", en: "Analytics" },
    url: "https://marketingplatform.google.com/about/analytics/",
    icon: "google-analytics.svg",
  },
  {
    name: "HubSpot",
    area: { pt: "CRM e automação", en: "CRM & automation" },
    url: "https://www.hubspot.com",
    icon: "hubspot.svg",
  },
  {
    name: "ClickUp",
    area: { pt: "Gestão de projetos", en: "Project management" },
    url: "https://clickup.com",
    icon: "clickup.svg",
  },
  {
    name: "Obsidian",
    area: { pt: "Notas e conhecimento", en: "Notes & knowledge" },
    url: "https://obsidian.md",
    icon: "obsidian.svg",
  },
  {
    name: "Canva",
    area: { pt: "Criação de conteúdo", en: "Content creation" },
    url: "https://www.canva.com",
    icon: "canva.svg",
  },
  {
    name: "CapCut",
    area: { pt: "Edição de vídeo", en: "Video editing" },
    url: "https://www.capcut.com",
    icon: "capcut.svg",
  },
];
