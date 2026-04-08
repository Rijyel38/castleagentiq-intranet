# ADR-001: Cloudflare Pages for CastleAgentIQ Intranet Hosting

**Date:** April 2026  
**Status:** accepted

## Context

The CastleAgentIQ Intranet is a Vite + React SPA requiring secure, low-friction deployment with edge protection and simple DNS integration. Platform policy mandates Tier 1 providers by default.

## Decision

Deploy the intranet to Cloudflare Pages and protect access with Cloudflare Access (email allowlist policy). Use GitHub Actions as the CI quality gate and deployment trigger.

## Consequences

- Deployments are automated from repository pushes.
- Infrastructure remains within Tier 1 providers.
- Access control is enforced at the edge without app-level auth code.
- New modules can ship by code push without manual infrastructure changes.
