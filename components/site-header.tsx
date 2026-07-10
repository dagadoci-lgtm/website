import Link from "next/link";
import type { LinkItem } from "@/lib/content";

type SiteHeaderProps = {
  title: string;
  links: LinkItem[];
};

export function SiteHeader({ title, links }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="shell site-header__inner">
        <Link className="brand" href="/">
          {title}
        </Link>
        <nav className="nav" aria-label="Primary navigation">
          {links.map((link) => (
            <Link href={link.href} key={`${link.label}-${link.href}`}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
