# Drew website

A Git-backed portfolio built with Next.js, edited through [Pages CMS](https://pagescms.org/), and exported as static files for Cloudflare Pages.

## How it works

- Pages CMS reads `.pages.yml` from this repository and edits files under `content/`.
- Project images are uploaded to `public/uploads/` and referenced as `/uploads/...`.
- A CMS save creates a Git commit on the selected branch.
- Cloudflare Pages sees the commit, runs `pnpm build`, and publishes the generated `out/` directory.
- The deployed site has no CMS runtime, database, API credentials, or server-side code.

## Local development

Requirements: Node.js 20 or newer and pnpm.

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`. Run all repository checks with:

```bash
pnpm validate
```

To preview the production export through Cloudflare's local Pages server:

```bash
pnpm build
pnpm preview
```

## Connect Pages CMS

1. Open [app.pagescms.org](https://app.pagescms.org/) and sign in with GitHub.
2. Install or authorize the Pages CMS GitHub App for `dagadoci-lgtm/website`.
3. Select this repository and the `main` branch.
4. Pages CMS will load `.pages.yml` automatically.
5. Use **Site content** for global copy and navigation. Use **Portfolio** for projects, experience, and skills.

There is intentionally no `/admin` route in this site. Editing happens in the hosted Pages CMS application. No Pages CMS environment variables are required in Cloudflare.

### Content locations

| Content | Repository path |
| --- | --- |
| Site settings and navigation | `content/settings/site.json` |
| Homepage copy | `content/pages/home.json` |
| Project case studies | `content/projects/*.md` |
| Experience entries | `content/experience/*.json` |
| Skill groups | `content/skills/*.json` |
| Uploaded images | `public/uploads/` |

Project URLs come from Markdown filenames. Renaming `content/projects/my-project.md` changes its route to `/projects/my-project/`.

## Connect Cloudflare Pages

In Cloudflare, open **Workers & Pages**, create a Pages application, and import the GitHub repository. Use these settings:

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Framework preset | `Next.js (Static HTML Export)` |
| Build command | `pnpm build` |
| Build output directory | `out` |
| Root directory | `/` |
| Node.js version | `24` (current LTS) |

Set `NODE_VERSION=24` in the Pages build environment if the dashboard does not already use the current Node.js LTS. No application secrets are needed.

The optional `wrangler.jsonc` supports local Pages previews and direct CLI deployment. Its project name is `drew-website`; update both that value and `content/settings/site.json` if the Cloudflare project or production URL uses a different name.

## Editor workflow

1. Open the repository in Pages CMS.
2. Select the production branch or a preview branch.
3. Edit content and save it with a clear commit message.
4. For `main`, wait for the Cloudflare production deployment. Other branches become Cloudflare preview deployments when branch previews are enabled.
5. If a content change needs to be rolled back, revert its Git commit and let Cloudflare redeploy.

Before publishing a project, provide a concise summary, meaningful image alt text, at least one stack item, a unique display order, and a case-study body. The local validator and Cloudflare build reject incomplete content.

## Deployment notes

- Static export is enabled in `next.config.mjs`; every project route is generated during the build.
- `public/_headers` adds security headers and long-lived caching for fingerprinted Next.js assets.
- `robots.txt`, `sitemap.xml`, project metadata, and a custom `404.html` are generated at build time.
- Change `siteUrl` in Pages CMS as soon as the custom domain or final `pages.dev` address is known.
