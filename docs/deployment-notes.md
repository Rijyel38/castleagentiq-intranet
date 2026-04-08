# Deployment Notes - CastleAgentIQ Intranet

## What Was Done

1. Reviewed TRD requirements and aligned repository structure to required standards.
2. Added mandatory repository documents: `CLAUDE.md`, updated `README.md`, ADR-001, and deployment notes.
3. Added CI pipeline (`.github/workflows/ci.yml`) for lint, tests, optional typecheck, and build.
4. Added deployment pipeline (`.github/workflows/deploy.yml`) for Cloudflare Pages via Wrangler action.
5. Added SPA routing fallback (`public/_redirects`) and baseline security headers (`public/_headers`).
6. Added quality tooling: ESLint and Vitest with a shell rendering test.
7. Updated AdeptIQ AI assistant to use `@anthropic-ai/sdk` with `VITE_ANTHROPIC_API_KEY`.
8. Added explicit error handling and metadata-only logging for storage and AI request paths.

## Order of Operations

- Tooling and scripts first (lint/test/build).
- Code compliance updates second (errors, environment usage, SDK integration).
- Deployment and security configuration third.
- Documentation and ADRs last.

## Issues Encountered and Resolutions

- Existing app had direct fetch-based Anthropic call without configured SDK pattern.
  - Resolved by switching to `@anthropic-ai/sdk` and environment variable key handling.
- Several silent catches existed in storage-related flows.
  - Resolved by explicit catches with contextual logging.

## Deviations from Standards

- TypeScript is preferred but not mandatory for this prototype codebase. Current implementation remains JavaScript-first while preserving TypeScript-ready workflow behavior (typecheck step only runs if `tsconfig.json` exists).

## Recommended Improvements

- Move Anthropic browser calls behind a Cloudflare Worker to remove API key from client runtime.
- Add broader unit coverage for `window.storage` behavior and route-level app switching.
- Add staging-specific Cloudflare environment variables and documented runbook for branch promotion.
