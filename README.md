# CastleAgentIQ Intranet

The CastleAgentIQ Intranet is the ConnectIQ application shell for internal Castle Horizon Group tools and prototypes. It is a Vite + React single-page application hosted on Cloudflare Pages and protected by Cloudflare Access.

## Project Overview

- Hosts current modules: `Ecosystem Map` and `AdeptIQ Onboarding Prototype`.
- Uses `window.storage` through `src/storage.js` as a localStorage shim for future backend migration.
- Supports modular expansion: add a module in `src/apps/`, register it in `src/App.jsx`, push to GitHub, and deploy automatically.
- Follows CastleAgentIQ standards for naming, infrastructure, and CI/CD automation.

## Local Setup

### Prerequisites

- Node.js 20+
- npm (required package manager)

### Run Locally

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

### Quality Checks

```bash
npm run lint
npm run test
npm run build
```

## Environment Variables

Set required variables in Cloudflare Pages (do not commit secrets):

| Variable | Purpose |
| --- | --- |
| `VITE_ANTHROPIC_API_KEY` | API key used by AdeptIQ's browser-based Anthropic SDK integration |

## Deployment (Cloudflare Pages)

1. Create Cloudflare Pages project named `castleagentiq-intranet`.
2. Connect GitHub repository.
3. Configure build:
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Add environment variable `VITE_ANTHROPIC_API_KEY` in Cloudflare Pages settings.
5. Configure custom domain (for example, `intranet.yourdomain.com`).
6. Protect the domain using Cloudflare Access with explicit email allowlist.

## CI/CD

- `ci.yml` runs lint, optional typecheck (if `tsconfig.json` exists), tests, and build on push/PR.
- `deploy.yml` runs quality gates and deploys to Cloudflare Pages using:
  - `CLOUDFLARE_API_TOKEN`
  - `CLOUDFLARE_ACCOUNT_ID`
- `main` deploys production.
- `develop` deploys preview/staging branch.

## Architecture Decisions

- ADR-001: `docs/decisions/ADR-001-cloudflare-pages.md`
- Deployment execution notes: `docs/deployment-notes.md`

## Rollback Procedure

Use Cloudflare Pages deployment history:
1. Open project `Deployments`.
2. Select last known-good deployment.
3. Roll back and verify the custom domain.

If code rollback is required:
1. Identify last known-good commit.
2. Create `fix/rollback-{date}` branch.
3. Open and merge PR to `main` to trigger redeploy.
