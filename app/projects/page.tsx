import Image from "next/image";
import Link from "next/link";
import client from "@/tina/__generated__/client";

type Project = {
  title?: string | null;
  slug?: string | null;
  date?: string | null;
  summary?: string | null;
  coverImage?: string | null;
  role?: string | null;
  stack?: (string | null)[] | null;
  order?: number | null;
};

export default async function ProjectsPage() {
  const projectsResponse = await client.queries.projectConnection();
  const projects = (projectsResponse.data.projectConnection.edges ?? [])
    .map((edge) => edge?.node)
    .filter(Boolean) as Project[];

  return (
    <main className="shell">
      <section className="project-hero">
        <p className="eyebrow">Projects</p>
        <h1>Case studies and selected work</h1>
      </section>
      <section className="project-grid">
        {[...projects]
          .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
          .map((project) => (
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
      </section>
    </main>
  );
}
