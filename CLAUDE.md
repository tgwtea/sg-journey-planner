# SG Journey Planner: guidance for agents

IS216 Web Application Development, section G5, Group 8. Read `docs/PROPOSAL.md` first.

## Goal

A weather-aware public transport journey planner for Singapore. It combines routes, live
arrival times, weather, and community reports, so commuters decide which route to take and
when to leave.

## Ground rules

1. **Students own the critical logic.** Do not write the fetching, state management, scoring,
   or weather-mapping logic for a feature unless its owner asks. Scaffolding, styling, stubs,
   tests, and explanations are fine. See the owner table below.
2. **The mockup is the source of truth** for visual design: `design/RouteWise v2.dc.html`.
   Do not redesign without team approval. Do not edit files in `design/`.
3. **Only weather data is live.** Every other screen reads mock data through
   `frontend/src/services/mockService.js` until real fixtures or routes exist.
   Views never import `src/mocks/` directly.
4. **No secrets in git.** Keys live in `backend/.env` (ignored) and in the Vercel dashboard.
   Only `.env.example` files are committed.
5. Keep it simple. This is an undergraduate project. Avoid new libraries and abstractions.

## Feature owners

| Feature | Owner | Screen |
| --- | --- | --- |
| Smart Departure Recommender | Tan Guan Wei | Home |
| Rain-Aware Route Finder (owns weather data) | Dillon | Map, Home weather |
| Route Comparison with Live Conditions | Amanda | Routes |
| Weather-Triggered Trip Alerts / Saved Routes | Woody (Lu Jia Hong, to be confirmed) | Saved |
| Community Reports & App Integration, E2E tests | Anumitaa | Reports |

## Stack

- Frontend: Vue 3, Vite, Vue Router, Bootstrap 5 (grid and utilities), Axios. `frontend/`
- Backend: Node.js, Express 5 (ESM). `backend/`
- Database: MongoDB through Mongoose. Optional; the app runs without `MONGODB_URI`.
- APIs: data.gov.sg (weather, no key), LTA DataMall (transport, `LTA_ACCOUNT_KEY`).
- Tests: Postman (`postman/`), Playwright (`e2e/`).
- Deploy: one Vercel project. Static frontend plus one function at `api/index.js` that wraps Express.

## Layout

```
api/index.js              Vercel function; imports backend/src/app.js
backend/src/app.js        Express app (no listen); all routes under /api
backend/src/server.js     Local dev entry (listen on PORT)
backend/src/{routes,controllers,services,middleware,config}
frontend/src/{views,components,services,composables,mocks,router,styles}
design/                   Mockup files (read-only)
docs/                     Proposal, weather API notes
e2e/                      Playwright tests
postman/                  Postman collection
```

Request flow: view, then composable, then `services/*.js` (axios), then `/api/...`, then
route, then controller, then service, then the external API.

## Commands

```
npm install            # once, at the root (npm workspaces)
npm run dev            # backend :3000 and frontend :5173 together
npm run dev:backend
npm run dev:frontend
npm run build          # frontend production build
npm run test:e2e       # Playwright smoke tests (starts both servers)
```

## Design tokens

`frontend/src/styles/tokens.css` copies the CSS variables from the mockup. Use `var(--ink)`,
`var(--glass)`, and so on, not raw colours. Use the `.rw-glass` and `.rw-pill` classes from
`base.css`. Icons are Material Symbols Outlined: `<span class="material-symbols-outlined">rainy</span>`.
