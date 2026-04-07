# CastleAgentIQ Intranet

Internal application hub for Castle Horizon Group prototypes, tools, and reference applications.

## What This Is

A lightweight React app that hosts all CastleAgentIQ artifacts (ecosystem map, AdeptIQ prototype, future tools) in one place, deployed on Cloudflare Pages with access protection via Cloudflare Access.

Instead of artifacts living inside Claude chat sessions, they live here — shareable, bookmarkable, and persistent.

## Quick Start (Local Development)

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`. Click any card to launch an app.

## Adding a New Artifact

1. Export your artifact from Claude as a `.jsx` file
2. Drop it in `src/apps/YourApp.jsx`
3. Open `src/App.jsx` and add two lines:

```javascript
// At the top, add the import:
import YourApp from './apps/YourApp.jsx'

// In the APPS array, add an entry:
{ id: 'yourapp', name: 'Your App Name', icon: '✨', desc: 'What it does', component: YourApp },
```

4. Run `npm run dev` to test locally
5. Push to GitHub — Cloudflare Pages auto-deploys

### Storage Compatibility

Claude artifacts use `window.storage` for persistence. This project includes a shim (`src/storage.js`) that maps those calls to `localStorage`. Your artifacts work without code changes.

When ConnectIQ is live, replace the shim with API calls to the real backend.

### API Calls (AdeptIQ Lumo Chat)

The AdeptIQ prototype calls the Anthropic API directly from the browser. For this to work in production:

- Option A: Keep the direct API call (works but exposes the API key in browser — acceptable for internal intranet behind Cloudflare Access)
- Option B: Proxy through a Cloudflare Worker that holds the API key server-side (recommended for anything beyond internal prototype use)

## Deploying to Cloudflare Pages

### First-Time Setup

1. Push this project to a GitHub repository
2. Log into Cloudflare Dashboard → Pages → Create a project
3. Connect to your GitHub repo
4. Build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node.js version:** 18+
5. Deploy

Cloudflare Pages will auto-deploy on every push to main.

### Adding Access Protection (Cloudflare Access)

To restrict access to team members only:

1. Cloudflare Dashboard → Zero Trust → Access → Applications
2. Add an application → Self-hosted
3. Set the application domain to your Pages URL (e.g., `intranet.castleagentiq.com`)
4. Add a policy: allow specific email addresses (Magnus, Aksana, Marisa, Tech Ops Lead)
5. Authentication method: One-time PIN via email (simplest) or Google SSO

This gives you password-protected access with zero infrastructure — Cloudflare handles everything.

### Custom Domain

1. Cloudflare Dashboard → Pages → Your project → Custom domains
2. Add `intranet.castleagentiq.com` (or similar)
3. DNS is auto-configured since you're already on Cloudflare

## Project Structure

```
castleagentiq-intranet/
├── public/              # Static assets
├── src/
│   ├── apps/            # ← Drop artifact .jsx files here
│   │   ├── Ecosystem.jsx
│   │   ├── AdeptIQ.jsx
│   │   └── ...future apps
│   ├── storage.js       # window.storage → localStorage shim
│   ├── App.jsx          # Navigation shell (register new apps here)
│   └── main.jsx         # Entry point
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Notes

- **Tier 1 compliant:** Cloudflare Pages hosting, GitHub source control, Cloudflare Access for auth
- **No backend required:** All data persists in the user's browser via localStorage
- **Future migration:** When ConnectIQ is built, replace `src/storage.js` with API calls and all apps automatically use the real database
- **Anyone can add apps:** Drop a .jsx, register it, push to GitHub. Done.
