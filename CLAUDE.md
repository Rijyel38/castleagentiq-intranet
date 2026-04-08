# CLAUDE.md

Project standards for `castleagentiq-intranet`.

## 1) Project Context

- Product: CastleAgentIQ Intranet
- Organisation: Castle Horizon Group / Coconut Drift Ltd
- Domain: 6 - Tech, Data and AI Platform
- Purpose: internal application shell for CastleAgentIQ modules

## 2) Core Standards

- Package manager: `npm` only
- Frontend: React + Vite
- Branches: `main`, `develop`, `feature/{description}`, `fix/{description}`
- Commit format: `{type}: {description}`
- Allowed commit types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `migration`, `deploy`

## 3) Infrastructure Standards

- Tier 1 defaults:
  - Cloudflare Pages (hosting)
  - Cloudflare Access (access control)
  - Cloudflare DNS
  - GitHub + GitHub Actions
  - Anthropic Claude API
- Prohibited: AWS, DigitalOcean, Firebase/Google Cloud, Heroku

## 4) Security and Secrets

- Never commit secrets, credentials, or `.env` files.
- Required secret variables:
  - `VITE_ANTHROPIC_API_KEY` (Cloudflare Pages environment variable)
  - `CLOUDFLARE_API_TOKEN` (GitHub Actions secret)
  - `CLOUDFLARE_ACCOUNT_ID` (GitHub Actions secret)
- Access control is enforced by Cloudflare Access email allowlist.

## 5) Architecture Rules

- Application modules must not call `localStorage` directly.
- All persistence goes through `window.storage` provided by `src/storage.js`.
- New modules are added in `src/apps/` and registered in `src/App.jsx`.

## 6) Code Quality Rules

- Prefer TypeScript for new modules where practical.
- Include JSDoc for exported functions and complex internals.
- Handle errors explicitly and log meaningful context.
- Do not log full LLM API payloads/responses; log metadata only.

## 7) Deployment Rules

- Production deployments originate from `main`.
- CI gates must pass before deployment:
  - lint
  - (optional) typecheck when TypeScript exists
  - tests
  - build
- SPA routing fallback must be configured via `public/_redirects`.

## 8) Documentation Requirements

- `README.md` with setup, environment, deployment, architecture, rollback.
- ADR files under `docs/decisions/`.
- Deployment notes under `docs/`.
