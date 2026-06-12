import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

loadEnvFile(".env.local");
loadEnvFile(".env");

const requiredEnvVars = [
  "NEXT_PUBLIC_TINA_CLIENT_ID",
  "TINA_TOKEN",
  "NEXT_PUBLIC_TINA_BRANCH"
];

const requiredPaths = [
  "content/settings",
  "content/pages",
  "content/projects",
  "content/experience",
  "content/skills",
  "public/uploads",
  "public/admin/index.html",
  "tina/config.ts"
];

const missingEnvVars = requiredEnvVars.filter((name) => !process.env[name]);
const missingPaths = requiredPaths.filter((path) => !existsSync(join(process.cwd(), path)));

if (missingPaths.length > 0) {
  console.error("Missing TinaCMS project paths:");
  for (const path of missingPaths) {
    console.error(`- ${path}`);
  }
}

if (missingEnvVars.length > 0) {
  console.error("Missing TinaCloud environment variables:");
  for (const name of missingEnvVars) {
    console.error(`- ${name}`);
  }
}

if (missingEnvVars.length > 0 || missingPaths.length > 0) {
  console.error("\nCreate the TinaCloud project at https://app.tina.io and copy values into .env.local.");
  process.exit(1);
}

console.log("TinaCloud local configuration looks complete.");

function loadEnvFile(fileName) {
  const filePath = join(process.cwd(), fileName);

  if (!existsSync(filePath)) {
    return;
  }

  const lines = readFileSync(filePath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const [name, ...valueParts] = trimmed.split("=");
    const value = valueParts.join("=").trim().replace(/^['"]|['"]$/g, "");

    if (name && !process.env[name]) {
      process.env[name] = value;
    }
  }
}
