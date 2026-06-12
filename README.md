# Drew Website

A static Next.js portfolio scaffold with TinaCMS content editing and Cloudflare Pages hosting.

## Development

```bash
pnpm install
pnpm dev
```

The site runs at `http://localhost:3000`. Tina admin is available at `http://localhost:3000/admin/index.html`.

## TinaCloud

Create the production CMS project in `https://app.tina.io`.

1. Create a TinaCloud project.
2. Connect the GitHub repository for this website.
3. Set the project branch to `main`, unless the launch branch changes.
4. Copy the project client ID into `NEXT_PUBLIC_TINA_CLIENT_ID`.
5. Create or copy the read/write token into `TINA_TOKEN`.
6. Set `NEXT_PUBLIC_TINA_BRANCH=main`.
7. Add the same values to Cloudflare Pages environment variables.

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
- Node.js version: current LTS

This app uses `output: "export"` and unoptimized images so it can be served as static assets.
