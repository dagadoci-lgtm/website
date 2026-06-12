import { defineConfig } from "tinacms";

const branch =
  process.env.NEXT_PUBLIC_TINA_BRANCH ||
  process.env.HEAD ||
  process.env.CF_PAGES_BRANCH ||
  "main";

export default defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public"
    }
  },
  schema: {
    collections: [
      {
        name: "settings",
        label: "Site Settings",
        path: "content/settings",
        format: "json",
        match: {
          include: "site"
        },
        fields: [
          { name: "title", label: "Site Title", type: "string", isTitle: true, required: true },
          { name: "description", label: "Description", type: "string", ui: { component: "textarea" } },
          {
            name: "navLinks",
            label: "Navigation Links",
            type: "object",
            list: true,
            fields: [
              { name: "label", label: "Label", type: "string", required: true },
              { name: "href", label: "URL", type: "string", required: true }
            ]
          },
          {
            name: "socialLinks",
            label: "Social Links",
            type: "object",
            list: true,
            fields: [
              { name: "label", label: "Label", type: "string", required: true },
              { name: "href", label: "URL", type: "string", required: true }
            ]
          },
          { name: "footerText", label: "Footer Text", type: "string" }
        ]
      },
      {
        name: "home",
        label: "Home Page",
        path: "content/pages",
        format: "json",
        match: {
          include: "home"
        },
        fields: [
          { name: "eyebrow", label: "Eyebrow", type: "string" },
          { name: "headline", label: "Headline", type: "string", isTitle: true, required: true },
          { name: "intro", label: "Intro", type: "string", ui: { component: "textarea" } },
          { name: "primaryCtaLabel", label: "Primary CTA Label", type: "string" },
          { name: "primaryCtaHref", label: "Primary CTA URL", type: "string" },
          { name: "secondaryCtaLabel", label: "Secondary CTA Label", type: "string" },
          { name: "secondaryCtaHref", label: "Secondary CTA URL", type: "string" },
          { name: "availabilityTitle", label: "Availability Title", type: "string" },
          { name: "availabilityText", label: "Availability Text", type: "string", ui: { component: "textarea" } },
          { name: "projectsHeading", label: "Projects Heading", type: "string" },
          { name: "projectsIntro", label: "Projects Intro", type: "string", ui: { component: "textarea" } },
          { name: "experienceHeading", label: "Experience Heading", type: "string" },
          { name: "skillsHeading", label: "Skills Heading", type: "string" }
        ]
      },
      {
        name: "project",
        label: "Projects",
        path: "content/projects",
        format: "mdx",
        fields: [
          { name: "title", label: "Title", type: "string", isTitle: true, required: true },
          { name: "slug", label: "Slug", type: "string", required: true },
          { name: "date", label: "Date", type: "datetime" },
          { name: "summary", label: "Summary", type: "string", ui: { component: "textarea" } },
          { name: "coverImage", label: "Cover Image", type: "image" },
          { name: "role", label: "Role", type: "string" },
          { name: "stack", label: "Stack", type: "string", list: true },
          { name: "featured", label: "Featured", type: "boolean" },
          { name: "order", label: "Display Order", type: "number" },
          { name: "body", label: "Body", type: "rich-text", isBody: true }
        ]
      },
      {
        name: "experience",
        label: "Experience",
        path: "content/experience",
        format: "json",
        fields: [
          { name: "company", label: "Company", type: "string", isTitle: true, required: true },
          { name: "role", label: "Role", type: "string", required: true },
          { name: "startDate", label: "Start Date", type: "string" },
          { name: "endDate", label: "End Date", type: "string" },
          { name: "location", label: "Location", type: "string" },
          { name: "highlights", label: "Highlights", type: "string", list: true },
          { name: "order", label: "Display Order", type: "number" }
        ]
      },
      {
        name: "skillGroup",
        label: "Skill Groups",
        path: "content/skills",
        format: "json",
        fields: [
          { name: "category", label: "Category", type: "string", isTitle: true, required: true },
          { name: "skills", label: "Skills", type: "string", list: true },
          { name: "order", label: "Display Order", type: "number" }
        ]
      }
    ]
  }
});
