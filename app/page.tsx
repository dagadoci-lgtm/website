import Link from "next/link";
import { ProjectCard } from "@/components/project-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  getExperience,
  getHomeContent,
  getProjects,
  getSiteSettings,
  getSkillGroups,
  sortByOrder
} from "@/lib/content";

export default async function HomePage() {
  const [settings, home, projects, experience, skills] = await Promise.all([
    getSiteSettings(),
    getHomeContent(),
    getProjects(),
    getExperience(),
    getSkillGroups()
  ]);
  const featuredProjects = projects.filter((project) => project.featured).slice(0, 3);

  return (
    <>
      <SiteHeader links={settings.navLinks} title={settings.title} />
      <main>
        <section className="shell hero">
          <div className="hero__copy">
            <p className="eyebrow">{home.eyebrow}</p>
            <h1>{home.headline}</h1>
            <p className="lead">{home.intro}</p>
            <div className="button-row">
              <Link className="button" href={home.primaryCtaHref}>
                {home.primaryCtaLabel}
              </Link>
              <Link className="button button--secondary" href={home.secondaryCtaHref}>
                {home.secondaryCtaLabel}
              </Link>
            </div>
          </div>
          <aside className="hero-card">
            <span className="status-dot" aria-hidden="true" />
            <h2>{home.availabilityTitle}</h2>
            <p>{home.availabilityText}</p>
            <div className="pill-list">
              {settings.socialLinks.map((link) => (
                <Link className="pill" href={link.href} key={`${link.label}-${link.href}`}>
                  {link.label}
                </Link>
              ))}
            </div>
          </aside>
        </section>

        <section className="section" id="projects">
          <div className="shell">
            <div className="section__heading">
              <div>
                <p className="eyebrow">Selected work</p>
                <h2>{home.projectsHeading}</h2>
              </div>
              <p>{home.projectsIntro}</p>
            </div>
            <div className="project-grid">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
            <div className="section__action">
              <Link className="project-link" href="/projects/">
                View all projects <span aria-hidden="true">-&gt;</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="section" id="experience">
          <div className="shell">
            <p className="eyebrow">Experience</p>
            <h2>{home.experienceHeading}</h2>
            <div className="stack">
              {sortByOrder(experience).map((item) => (
                <article className="timeline-item" key={`${item.company}-${item.role}`}>
                  <div>
                    <strong>
                      {item.startDate} - {item.endDate || "Present"}
                    </strong>
                    <p className="meta">{item.location}</p>
                  </div>
                  <div>
                    <h3>{item.role}</h3>
                    <p>{item.company}</p>
                    <ul>
                      {item.highlights.map((highlight) => (
                        <li key={highlight}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="skills">
          <div className="shell">
            <p className="eyebrow">Skills</p>
            <h2>{home.skillsHeading}</h2>
            <div className="skill-grid">
              {sortByOrder(skills).map((group) => (
                <article className="skill-group" key={group.category}>
                  <h3>{group.category}</h3>
                  <div className="pill-list">
                    {group.skills.map((skill) => (
                      <span className="pill" key={skill}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter>{settings.footerText}</SiteFooter>
    </>
  );
}
