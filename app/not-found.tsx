import Link from "next/link";

export default function NotFound() {
  return (
    <main className="shell empty-state">
      <p className="eyebrow">404</p>
      <h1>That page is not here.</h1>
      <p className="lead">The address may have changed, or the page may have been removed.</p>
      <Link className="button" href="/">
        Return home
      </Link>
    </main>
  );
}
