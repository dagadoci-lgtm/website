import { spawnSync } from "node:child_process";

const hasTinaCloudCredentials =
  Boolean(process.env.NEXT_PUBLIC_TINA_CLIENT_ID) && Boolean(process.env.TINA_TOKEN);

const command = hasTinaCloudCredentials
  ? "tinacms build && next build"
  : "tinacms dev -c \"env NODE_ENV=production next build\"";
const result = spawnSync(command, {
  stdio: "inherit",
  shell: true
});

process.exit(result.status ?? 1);
