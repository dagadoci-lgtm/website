# Portfolio Website Next Steps Spec

## Goal

Move the current TinaCMS portfolio scaffold from a working local prototype to a production-ready portfolio hosted on Cloudflare Pages, with TinaCloud editing configured through `https://app.tina.io`.

The site should remain a static Next.js export, use Git-backed content, and allow portfolio content edits through Tina admin without requiring code changes for normal content updates.

## Current Baseline

- Frontend: Next.js App Router, React 18, TypeScript, global CSS.
- CMS: TinaCMS schema in `tina/config.ts`.
- Content: repo-backed files under `content/`.
- Media: repo-backed assets under `public/uploads/`.
- Hosting target: Cloudflare Pages static output from `out/`.
- Build command: `pnpm build`.
- Local admin: `/admin/index.html`.

## Phase 1: TinaCloud Setup

Configure the connected production TinaCloud project in `https://app.tina.io`.

### Repo Status

The repository-side Phase 1 setup is implemented:

- TinaCloud env names are documented in `.env.example`.
- The Tina admin shell exists at `public/admin/index.html`.
- `pnpm tina:validate` checks required TinaCloud env vars and content paths.
- `README.md` documents the `app.tina.io` setup flow.

The TinaCloud project is connected in `app.tina.io`. The remaining Phase 1 work is environment-variable setup for local development and Cloudflare Pages.

### Tasks

- Confirm the connected TinaCloud project uses this GitHub repository.
- Confirm the production branch is `main`, unless the deployment branch changes before launch.
- Copy the Tina project client ID into `NEXT_PUBLIC_TINA_CLIENT_ID`.
- Create or copy the Tina token into `TINA_TOKEN`.
- Confirm `NEXT_PUBLIC_TINA_BRANCH=main` is set for local and Cloudflare environments.
- In TinaCloud, verify the project can read the configured repository branch and content paths:
  - `content/settings`
  - `content/pages`
  - `content/projects`
  - `content/experience`
  - `content/skills`
  - `public/uploads`

### Acceptance Criteria

- `pnpm dev` opens Tina admin locally at `/admin/index.html`.
- Tina admin authenticates against the TinaCloud project when env vars are present.
- Editing a content item in Tina creates the expected Git-backed content change.
- New media uploads are written under `public/uploads`.

## Phase 2: Cloudflare Pages Integration

Deploy the static site and Tina admin to Cloudflare Pages.

### Tasks

- Create a Cloudflare Pages project connected to the GitHub repo.
- Use these build settings:
  - Framework preset: `Next.js`
  - Build command: `pnpm build`
  - Output directory: `out`
  - Deploy command: `npx wrangler pages deploy out --project-name=website --branch=$CF_PAGES_BRANCH`
  - Node.js version: current LTS
- Add Cloudflare Pages environment variables:
  - `NEXT_PUBLIC_TINA_CLIENT_ID`
  - `TINA_TOKEN`
  - `NEXT_PUBLIC_TINA_BRANCH`
- Configure preview and production environments separately if Cloudflare uses branch previews.
- Confirm the deployed admin path works at `/admin/index.html`.
- Confirm project detail routes are emitted as static files.

### Acceptance Criteria

- Cloudflare production deployment succeeds from a clean checkout.
- Home, `/projects`, and all `/projects/[slug]` pages load from Cloudflare.
- `/admin/index.html` loads on the deployed domain.
- TinaCloud edits can be published and reflected in the next Cloudflare deployment.
- Cloudflare does not run `pnpm opennextjs-cloudflare build`; this site is a static export, not an OpenNext Workers deployment.
- If the Cloudflare Pages project name is not `website`, the Wrangler deploy command uses the actual Pages project name.

## Phase 3: Portfolio Content Completion

Replace placeholder content with final portfolio material.

### Tasks

- Finalize global site settings:
  - site title
  - SEO description
  - navigation links
  - social links
  - footer text
- Rewrite the home page:
  - hero headline
  - intro
  - availability text
  - project section copy
  - experience and skills headings
- Replace seed project case studies with real work.
- Add final project images and alt text strategy.
- Replace placeholder experience entries.
- Replace placeholder skills with real categories.
- Review all external links and email links.

### Acceptance Criteria

- No placeholder names, URLs, email addresses, or images remain.
- At least three real projects are published.
- Featured projects appear in the intended order on the home page.
- Every project detail page has a readable summary, stack, role, and body content.

## Phase 4: Frontend Polish

Refine the portfolio UI after real content is available.

### Tasks

- Tune responsive layout against final copy lengths.
- Add project image treatment for mixed aspect ratios.
- Improve project detail page typography for long case studies.
- Add explicit image alt text fields to the Tina project schema if final images are meaningful content.
- Add contact section behavior, either as a mail link or a form integration.
- Review keyboard navigation, focus states, contrast, and heading order.

### Acceptance Criteria

- Layout works at mobile, tablet, and desktop widths.
- No text overlaps or overflows in nav, cards, buttons, or project pages.
- Project cards remain visually consistent with real images.
- Lighthouse accessibility issues are either fixed or documented.

## Phase 5: Production Hardening

Prepare the site for launch and long-term maintenance.

### Tasks

- Add production metadata:
  - page titles
  - descriptions
  - Open Graph image
  - favicon assets
- Add sitemap and robots output if needed for search indexing.
- Confirm Cloudflare cache behavior for static assets.
- Decide whether `public/_headers` needs stricter production headers.
- Add a short editor guide to `README.md` for TinaCloud content updates.
- Document rollback flow:
  - revert content commit
  - redeploy Cloudflare Pages
  - verify TinaCloud branch state

### Acceptance Criteria

- Production domain serves the site over HTTPS.
- Social previews use the intended title, description, and image.
- TinaCloud content edits have a documented publish workflow.
- A clean clone can run `pnpm install`, `pnpm dev`, and `pnpm build`.

## Phase 6: Optional Enhancements

These are not required for launch.

- Add visual editing overlays for Tina content blocks.
- Add a richer MDX component set for project case studies.
- Add a contact form using Cloudflare Workers, Forms, or a third-party provider.
- Add analytics with a privacy-conscious provider.
- Add draft or preview branch workflows for unpublished project updates.
- Add automated CI checks for typecheck, lint, and build.

## Risks And Decisions

- TinaCloud credentials are required for production editing through `app.tina.io`.
- Local no-credential builds currently run `next build` through Tina's local dev server so static queries can resolve.
- Cloudflare branch previews need matching Tina branch settings if editors should preview non-`main` content.
- The current project detail rich-text renderer is intentionally minimal; richer case study formatting should be added before complex MDX content is authored.
- Media is currently committed to Git under `public/uploads`; this keeps hosting simple, but large image libraries may require a different media backend later.

## Verification Commands

```bash
pnpm install
pnpm typecheck
pnpm lint
pnpm build
pnpm dev
```
