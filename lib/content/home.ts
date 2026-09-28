import type { HomeContent, HomeProfile, Project } from "./types";
import { localize } from "./types";
import { PROFILE } from "./profile";
import { FEATURED_PROJECTS } from "./projects-data";
import { getProjects } from "./projects";

export async function getHome(locale: string): Promise<HomeContent> {
  const projects = await getProjects(locale);
  const roleText = localize(PROFILE.role, locale) ?? PROFILE.role.pt;

  const featuredProjects: Project[] = FEATURED_PROJECTS.length
    ? FEATURED_PROJECTS.map((slug) => projects.find((project) => project.slug === slug)).filter(
        (project): project is Project => Boolean(project),
      )
    : projects;

  const profile: HomeProfile = {
    name: PROFILE.name,
    role: roleText,
    availability: localize(PROFILE.availability, locale),
    location: localize(PROFILE.location, locale),
    email: PROFILE.email,
    avatar: PROFILE.avatar,
    socials: PROFILE.socials,
  };

  return {
    heroTitle: PROFILE.heroTitle,
    // The profile's role doubles as the hero subtitle / meta description.
    heroSubtitle: roleText,
    featuredProjects,
    profile,
  };
}
