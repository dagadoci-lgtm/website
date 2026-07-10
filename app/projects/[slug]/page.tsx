import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getProject, getProjects, getSiteSettings } from "@/lib/content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return {};
  }

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      images: [{ url: project.coverImage, alt: project.coverImageAlt }]
    }
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const [settings, project] = await Promise.all([getSiteSettings(), getProject(slug)]);

  if (!project) {
    notFound();
  }

  return (
    <>
      <SiteHeader links={settings.navLinks} title={settings.title} />
      <main>
        <section className="shell project-hero">
          <Link className="project-link back-link" href="/projects/">
            <span aria-hidden="true">&lt;-</span> Back to projects
          </Link>
          <p className="eyebrow">{project.role}</p>
          <h1>{project.title}</h1>
          <p className="lead">{project.summary}</p>
          <div className="pill-list">
            {project.stack.map((item) => (
              <span className="pill" key={item}>
                {item}
              </span>
            ))}
          </div>
        </section>
        <div className="shell project-cover">
          <Image
            alt={project.coverImageAlt}
            className="project-card__image"
            height={760}
            priority
            src={project.coverImage}
            width={1280}
          />
        </div>
        <section className="shell section project-content">
          <article className="prose">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.body}</ReactMarkdown>
          </article>
        </section>
      </main>
      <SiteFooter>{settings.footerText}</SiteFooter>
    </>
  );
}
