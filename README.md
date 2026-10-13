# SG Journey Planner

A weather-aware public transport journey planner for Singapore.
IS216 Web Application Development, G5, Group 8. See `docs/PROPOSAL.md`.

Live data today: **weather only**. All other screens use mock data.

## Requirements

- Node.js 22 (`.nvmrc`). Node 20 also works.
- npm 10.

## Setup

```bash
npm install                                  # installs frontend and backend (npm workspaces)
cp backend/.env.example backend/.env         # then fill in your own values
```

`backend/.env` is ignored by git. Never commit it.

## Run

```bash
npm run dev            # both servers
npm run dev:backend    # API only:  http://localhost:3000/api/health
npm run dev:frontend   # web only:  http://localhost:5173
```

Vite forwards `/api/*` from port 5173 to port 3000.

## Test

```bash
npx playwright install chromium   # once
npm run test:e2e                  # starts both servers and runs e2e/tests
```

Postman: import `postman/sg-journey-planner.postman_collection.json`.

## Project layout

| Folder | Purpose |
| --- | --- |
| `frontend/` | Vue 3 + Vite app. Views, components, services, mock data. |
| `backend/` | Express API. Routes, controllers, services, middleware. |
| `api/` | Vercel serverless entry. It wraps the Express app. |
| `design/` | The RouteWise v2 mockup. The source of truth for visual design. Do not edit. |
| `docs/` | Proposal, weather API notes. |
| `e2e/` | Playwright tests. |
| `postman/` | Postman collection. |

## Deploy to Vercel

1. Import the GitHub repository in Vercel. Keep the root directory as the repository root.
   `vercel.json` sets the build command and the output folder.
2. In Project Settings, Environment Variables, add the values from `backend/.env.example`
   that you use (`MONGODB_URI`, `LTA_ACCOUNT_KEY`, and so on). Do not set `PORT` or `CORS_ORIGIN`.
3. If you use MongoDB Atlas, allow access from `0.0.0.0/0`, because Vercel has no fixed IP.
4. Deploy. Check `https://<your-app>.vercel.app/api/health`.

## Team

See `docs/PROPOSAL.md` for owners and responsibilities.
