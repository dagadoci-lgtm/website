import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/content";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project-card">
      <Image
        alt={project.coverImageAlt}
        className="project-card__image"
        height={500}
        src={project.coverImage}
        width={800}
      />
      <div className="project-card__body">
        <p className="meta">{project.role}</p>
        <h3>{project.title}</h3>
        <p>{project.summary}</p>
        <Link className="project-link" href={`/projects/${project.slug}/`}>
          Read case study <span aria-hidden="true">-&gt;</span>
        </Link>
      </div>
    </article>
  );
}
