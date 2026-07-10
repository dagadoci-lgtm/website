export function SiteFooter({ children }: { children: React.ReactNode }) {
  return (
    <footer className="footer">
      <div className="shell">{children}</div>
    </footer>
  );
}
