# Drew Website

A static Next.js portfolio scaffold with TinaCMS content editing and Cloudflare Pages hosting.

## Development

```bash
pnpm install
pnpm dev
```

The site runs at `http://localhost:3000`. Tina admin is available at `http://localhost:3000/admin/index.html`. Use the full `/admin/index.html` path; `/admin/` can show the Next.js 404 page during local development.

## TinaCloud

The production CMS project is connected in `https://app.tina.io`. Finish local and Cloudflare setup by copying the TinaCloud environment values.

1. Confirm the TinaCloud project branch is `main`, unless the launch branch changes.
2. Copy the project client ID into `NEXT_PUBLIC_TINA_CLIENT_ID`.
3. Create or copy the read/write token into `TINA_TOKEN`.
4. Set `NEXT_PUBLIC_TINA_BRANCH=main`.
5. Add the same values to Cloudflare Pages environment variables.

Local environment values should live in `.env.local`:

```bash
NEXT_PUBLIC_TINA_CLIENT_ID=your-client-id
TINA_TOKEN=your-token
NEXT_PUBLIC_TINA_BRANCH=main
```

Validate local TinaCloud configuration with:

```bash
pnpm tina:validate
```

The default build command uses TinaCloud when `NEXT_PUBLIC_TINA_CLIENT_ID` and `TINA_TOKEN` are present. Without those variables it runs `next build` inside Tina's local dev server, so static builds still work before TinaCloud is configured.

## Cloudflare Pages

Use these Pages settings:

- Framework preset: `Next.js`
- Build command: `pnpm build`
- Build output directory: `out`
- Deploy command: `npx wrangler pages deploy out --project-name=website --branch=$CF_PAGES_BRANCH`
- Node.js version: current LTS

This app uses `output: "export"` and unoptimized images so it can be served as static assets. Replace `website` in the deploy command if the Cloudflare Pages project uses a different project name. Do not use `pnpm opennextjs-cloudflare build`; this project does not produce `.next/standalone` output.
