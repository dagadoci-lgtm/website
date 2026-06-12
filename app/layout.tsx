import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Drew Portfolio",
  description: "Portfolio website built with Next.js and TinaCMS."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
