import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { parse as parseYaml } from "yaml";

const root = process.cwd();
const errors: string[] = [];

function report(condition: unknown, message: string): asserts condition {
  if (!condition) {
    errors.push(message);
  }
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

async function readJson(relativePath: string): Promise<Record<string, unknown>> {
  const source = await fs.readFile(path.join(root, relativePath), "utf8");
  return JSON.parse(source) as Record<string, unknown>;
}

async function validatePagesConfig() {
  const source = await fs.readFile(path.join(root, ".pages.yml"), "utf8");
  const config = parseYaml(source) as Record<string, unknown>;

  report(config && typeof config === "object", ".pages.yml must contain a YAML object");
  report(config.media, ".pages.yml must define media");
  report(Array.isArray(config.content) && config.content.length > 0, ".pages.yml must define content");
}

async function validateSiteFiles() {
  const settings = await readJson("content/settings/site.json");
  const home = await readJson("content/pages/home.json");
  const requiredSettings = [
    "title",
    "description",
    "siteUrl",
    "footerText"
  ];
  const requiredHome = [
    "eyebrow",
    "headline",
    "intro",
    "primaryCtaLabel",
    "primaryCtaHref",
    "secondaryCtaLabel",
    "secondaryCtaHref",
    "availabilityTitle",
    "availabilityText",
    "projectsHeading",
    "projectsIntro",
    "experienceHeading",
    "skillsHeading"
  ];

  for (const field of requiredSettings) {
    report(isNonEmptyString(settings[field]), `content/settings/site.json: ${field} is required`);
  }

  report(
    isNonEmptyString(settings.siteUrl) && /^https:\/\//.test(settings.siteUrl),
    "content/settings/site.json: siteUrl must be an HTTPS URL"
  );
  report(Array.isArray(settings.navLinks) && settings.navLinks.length > 0, "At least one nav link is required");
  report(Array.isArray(settings.socialLinks), "socialLinks must be an array");

  for (const field of requiredHome) {
    report(isNonEmptyString(home[field]), `content/pages/home.json: ${field} is required`);
  }
}

async function validateProjects() {
  const directory = path.join(root, "content/projects");
  const entries = (await fs.readdir(directory)).filter((entry) => entry.endsWith(".md"));
  const orders = new Set<number>();
  let featuredCount = 0;

  report(entries.length > 0, "At least one project is required");

  for (const entry of entries) {
    const source = await fs.readFile(path.join(directory, entry), "utf8");
    const { data, content } = matter(source);
    const prefix = `content/projects/${entry}`;
    const requiredStrings = ["title", "summary", "coverImage", "coverImageAlt", "role"];

    for (const field of requiredStrings) {
      report(isNonEmptyString(data[field]), `${prefix}: ${field} is required`);
    }

    report(Array.isArray(data.stack) && data.stack.length > 0, `${prefix}: stack requires at least one item`);
    report(Number.isInteger(data.order) && data.order > 0, `${prefix}: order must be a positive integer`);
    report(!orders.has(data.order), `${prefix}: order ${data.order} is already used by another project`);
    report(isNonEmptyString(content), `${prefix}: case study body is required`);

    if (Number.isInteger(data.order)) {
      orders.add(data.order);
    }
    if (data.featured === true) {
      featuredCount += 1;
    }
  }

  report(featuredCount > 0, "At least one project must be featured on the home page");
}

async function validateJsonCollection(
  directory: string,
  requiredStrings: string[],
  requiredLists: string[]
) {
  const fullDirectory = path.join(root, directory);
  const entries = (await fs.readdir(fullDirectory)).filter((entry) => entry.endsWith(".json"));
  const orders = new Set<number>();

  report(entries.length > 0, `${directory} requires at least one JSON file`);

  for (const entry of entries) {
    const item = await readJson(path.join(directory, entry));
    const prefix = `${directory}/${entry}`;

    for (const field of requiredStrings) {
      report(isNonEmptyString(item[field]), `${prefix}: ${field} is required`);
    }
    for (const field of requiredLists) {
      report(Array.isArray(item[field]) && item[field].length > 0, `${prefix}: ${field} requires at least one item`);
    }

    report(Number.isInteger(item.order) && Number(item.order) > 0, `${prefix}: order must be a positive integer`);
    report(!orders.has(Number(item.order)), `${prefix}: order ${item.order} is already used in this collection`);
    orders.add(Number(item.order));
  }
}

await Promise.all([
  validatePagesConfig(),
  validateSiteFiles(),
  validateProjects(),
  validateJsonCollection(
    "content/experience",
    ["company", "role", "startDate", "location"],
    ["highlights"]
  ),
  validateJsonCollection("content/skills", ["category"], ["skills"])
]);

if (errors.length > 0) {
  console.error(`Content validation failed:\n\n${errors.map((error) => `- ${error}`).join("\n")}`);
  process.exit(1);
}

console.log("Pages CMS configuration and site content are valid.");
