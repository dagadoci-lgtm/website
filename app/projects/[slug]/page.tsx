import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import client from "@/tina/__generated__/client";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const projectsResponse = await client.queries.projectConnection();
  return (projectsResponse.data.projectConnection.edges ?? [])
    .map((edge) => edge?.node?.slug)
    .filter(Boolean)
    .map((slug) => ({ slug }));
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const response = await client.queries.project({
    relativePath: `${slug}.mdx`
  });
  const project = response.data.project;

  return (
    <main>
      <section className="shell project-hero">
        <Link className="project-link" href="/projects">
          Back to projects
        </Link>
        <p className="eyebrow">{project.role}</p>
        <h1>{project.title}</h1>
        <p className="lead">{project.summary}</p>
        <div className="pill-list">
          {(project.stack ?? []).map((item) =>
            item ? <span className="pill" key={item}>{item}</span> : null
          )}
        </div>
      </section>
      {project.coverImage ? (
        <div className="shell">
          <Image
            alt=""
            className="project-card__image"
            height={760}
            src={project.coverImage}
            width={1280}
          />
        </div>
      ) : null}
      <section className="shell section">
        <article className="prose">{renderRichText(project.body)}</article>
      </section>
    </main>
  );
}

type RichTextNode = {
  type?: string;
  text?: string;
  url?: string;
  children?: RichTextNode[];
};

function renderRichText(content: unknown): ReactNode {
  if (!isRichTextNode(content)) {
    return null;
  }

  return content.children?.map((node, index) => renderNode(node, index)) ?? null;
}

function renderNode(node: RichTextNode, index: number): ReactNode {
  const children = node.children?.map((child, childIndex) => renderNode(child, childIndex)) ?? node.text;

  switch (node.type) {
    case "h1":
      return <h1 key={index}>{children}</h1>;
    case "h2":
      return <h2 key={index}>{children}</h2>;
    case "h3":
      return <h3 key={index}>{children}</h3>;
    case "ul":
      return <ul key={index}>{children}</ul>;
    case "ol":
      return <ol key={index}>{children}</ol>;
    case "li":
      return <li key={index}>{children}</li>;
    case "a":
      return node.url ? (
        <Link href={node.url} key={index}>
          {children}
        </Link>
      ) : (
        children
      );
    case "p":
      return <p key={index}>{children}</p>;
    default:
      return node.text ?? <span key={index}>{children}</span>;
  }
}

function isRichTextNode(value: unknown): value is RichTextNode {
  return Boolean(value && typeof value === "object" && "children" in value);
}
