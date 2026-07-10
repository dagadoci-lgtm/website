import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/content";

export const dynamic = "force-static";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSiteSettings();

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${settings.siteUrl.replace(/\/$/, "")}/sitemap.xml`
  };
}
