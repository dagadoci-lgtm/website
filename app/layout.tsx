import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/content";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    metadataBase: new URL(settings.siteUrl),
    title: {
      default: settings.title,
      template: `%s | ${settings.title}`
    },
    description: settings.description,
    openGraph: {
      type: "website",
      title: settings.title,
      description: settings.description,
      url: settings.siteUrl
    }
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
