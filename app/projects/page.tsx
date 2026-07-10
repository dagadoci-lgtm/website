import type { Metadata } from "next";
import { ProjectCard } from "@/components/project-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getProjects, getSiteSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description: "Case studies and selected work."
};

export default async function ProjectsPage() {
  const [settings, projects] = await Promise.all([getSiteSettings(), getProjects()]);

  return (
    <>
      <SiteHeader links={settings.navLinks} title={settings.title} />
      <main className="shell page-main">
        <section className="project-hero">
          <p className="eyebrow">Projects</p>
          <h1>Case studies and selected work.</h1>
          <p className="lead">
            A closer look at product decisions, design systems, and implementation details.
          </p>
        </section>
        <section className="project-grid project-grid--listing" aria-label="Project list">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </section>
      </main>
      <SiteFooter>{settings.footerText}</SiteFooter>
    </>
  );
}
