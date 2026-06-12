import Image from "next/image";
import Link from "next/link";
import client from "@/tina/__generated__/client";

type NavLink = {
  label?: string | null;
  href?: string | null;
};

type SocialLink = {
  label?: string | null;
  href?: string | null;
};

type Project = {
  title?: string | null;
  slug?: string | null;
  date?: string | null;
  summary?: string | null;
  coverImage?: string | null;
  role?: string | null;
  stack?: (string | null)[] | null;
  featured?: boolean | null;
  order?: number | null;
};

type Experience = {
  company?: string | null;
  role?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  location?: string | null;
  highlights?: (string | null)[] | null;
  order?: number | null;
};

type SkillGroup = {
  category?: string | null;
  skills?: (string | null)[] | null;
  order?: number | null;
};

async function getPortfolioData() {
  const [settings, home, projects, experience, skills] = await Promise.all([
    client.queries.settings({ relativePath: "site.json" }),
    client.queries.home({ relativePath: "home.json" }),
    client.queries.projectConnection(),
    client.queries.experienceConnection(),
    client.queries.skillGroupConnection()
  ]);

  return {
    settings: settings.data.settings,
    home: home.data.home,
    projects: (projects.data.projectConnection.edges ?? [])
      .map((edge) => edge?.node)
      .filter(Boolean) as Project[],
    experience: (experience.data.experienceConnection.edges ?? [])
      .map((edge) => edge?.node)
      .filter(Boolean) as Experience[],
    skills: (skills.data.skillGroupConnection.edges ?? [])
      .map((edge) => edge?.node)
      .filter(Boolean) as SkillGroup[]
  };
}

function sortByOrder<T extends { order?: number | null }>(items: T[]) {
  return [...items].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}

export default async function HomePage() {
  const { settings, home, projects, experience, skills } = await getPortfolioData();
  const featuredProjects = sortByOrder(projects.filter((project) => project.featured)).slice(0, 3);

  return (
    <>
      <header className="site-header">
        <div className="shell site-header__inner">
          <Link className="brand" href="/">
            {settings.title}
          </Link>
          <nav className="nav" aria-label="Primary navigation">
            {(settings.navLinks as NavLink[] | null)?.map((link) =>
              link.href && link.label ? (
                <Link href={link.href} key={link.href}>
                  {link.label}
                </Link>
              ) : null
            )}
          </nav>
        </div>
      </header>

      <main>
        <section className="shell hero">
          <div>
            <p className="eyebrow">{home.eyebrow}</p>
            <h1>{home.headline}</h1>
            <p className="lead">{home.intro}</p>
            <div className="button-row">
              {home.primaryCtaHref && home.primaryCtaLabel ? (
                <Link className="button" href={home.primaryCtaHref}>
                  {home.primaryCtaLabel}
                </Link>
              ) : null}
              {home.secondaryCtaHref && home.secondaryCtaLabel ? (
                <Link className="button button--secondary" href={home.secondaryCtaHref}>
                  {home.secondaryCtaLabel}
                </Link>
              ) : null}
            </div>
          </div>
          <aside className="hero-card">
            <h3>{home.availabilityTitle}</h3>
            <p>{home.availabilityText}</p>
            <div className="pill-list">
              {(settings.socialLinks as SocialLink[] | null)?.map((link) =>
                link.href && link.label ? (
                  <Link className="pill" href={link.href} key={link.href}>
                    {link.label}
                  </Link>
                ) : null
              )}
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
                <article className="project-card" key={project.slug}>
                  {project.coverImage ? (
                    <Image
                      alt=""
                      className="project-card__image"
                      height={500}
                      src={project.coverImage}
                      width={800}
                    />
                  ) : null}
                  <div className="project-card__body">
                    <p className="meta">{project.role}</p>
                    <h3>{project.title}</h3>
                    <p>{project.summary}</p>
                    {project.slug ? (
                      <Link className="project-link" href={`/projects/${project.slug}`}>
                        Read case study
                      </Link>
                    ) : null}
                  </div>
                </article>
              ))}
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
                    <strong>{item.startDate} - {item.endDate ?? "Present"}</strong>
                    <p className="meta">{item.location}</p>
                  </div>
                  <div>
                    <h3>{item.role}</h3>
                    <p>{item.company}</p>
                    <ul>
                      {(item.highlights ?? []).map((highlight) =>
                        highlight ? <li key={highlight}>{highlight}</li> : null
                      )}
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
                    {(group.skills ?? []).map((skill) =>
                      skill ? <span className="pill" key={skill}>{skill}</span> : null
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="shell">{settings.footerText}</div>
      </footer>
    </>
  );
}
