import type { MetadataRoute } from "next";
import { getProjects, getSiteSettings } from "@/lib/content";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [settings, projects] = await Promise.all([getSiteSettings(), getProjects()]);
  const baseUrl = settings.siteUrl.replace(/\/$/, "");

  return [
    { url: baseUrl, priority: 1 },
    { url: `${baseUrl}/projects/`, priority: 0.8 },
    ...projects.map((project) => ({
      url: `${baseUrl}/projects/${project.slug}/`,
      lastModified: project.date,
      priority: 0.7
    }))
  ];
}
