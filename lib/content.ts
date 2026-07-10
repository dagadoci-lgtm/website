import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const contentDirectory = path.join(process.cwd(), "content");

export type LinkItem = {
  label: string;
  href: string;
};

export type SiteSettings = {
  title: string;
  description: string;
  siteUrl: string;
  navLinks: LinkItem[];
  socialLinks: LinkItem[];
  footerText: string;
};

export type HomeContent = {
  eyebrow: string;
  headline: string;
  intro: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  availabilityTitle: string;
  availabilityText: string;
  projectsHeading: string;
  projectsIntro: string;
  experienceHeading: string;
  skillsHeading: string;
};

export type Project = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  coverImage: string;
  coverImageAlt: string;
  role: string;
  stack: string[];
  featured: boolean;
  order: number;
  body: string;
};

export type Experience = {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  location: string;
  highlights: string[];
  order: number;
};

export type SkillGroup = {
  category: string;
  skills: string[];
  order: number;
};

async function readJson<T>(relativePath: string): Promise<T> {
  const source = await fs.readFile(path.join(contentDirectory, relativePath), "utf8");
  return JSON.parse(source) as T;
}

async function readJsonCollection<T>(directory: string): Promise<T[]> {
  const fullDirectory = path.join(contentDirectory, directory);
  const entries = await fs.readdir(fullDirectory, { withFileTypes: true });

  return Promise.all(
    entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
      .map((entry) => readJson<T>(path.join(directory, entry.name)))
  );
}

export function sortByOrder<T extends { order: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.order - b.order);
}

export function getSiteSettings(): Promise<SiteSettings> {
  return readJson<SiteSettings>("settings/site.json");
}

export function getHomeContent(): Promise<HomeContent> {
  return readJson<HomeContent>("pages/home.json");
}

export function getExperience(): Promise<Experience[]> {
  return readJsonCollection<Experience>("experience");
}

export function getSkillGroups(): Promise<SkillGroup[]> {
  return readJsonCollection<SkillGroup>("skills");
}

export async function getProjects(): Promise<Project[]> {
  const projectsDirectory = path.join(contentDirectory, "projects");
  const entries = await fs.readdir(projectsDirectory, { withFileTypes: true });

  const projects = await Promise.all(
    entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
      .map(async (entry) => {
        const slug = entry.name.replace(/\.md$/, "");
        const source = await fs.readFile(path.join(projectsDirectory, entry.name), "utf8");
        const { data, content } = matter(source);

        return {
          ...data,
          slug,
          stack: Array.isArray(data.stack) ? data.stack : [],
          featured: Boolean(data.featured),
          order: Number(data.order ?? 999),
          body: content
        } as Project;
      })
  );

  return sortByOrder(projects);
}

export async function getProject(slug: string): Promise<Project | undefined> {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug);
}
