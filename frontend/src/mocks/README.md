# Mock data

Only the weather data is live. Every other screen reads mock data from this folder
until the team adds real fixtures or API routes.

- The data comes from the RouteWise v3 mockup (`design/RouteWise v3.dc.html`).
- Stops and routes have real (approximate) lat/lng for the Leaflet map. Route lines are
  traced by hand.
- Views do not import these files directly. They call `services/mockService.js`.
- To go live, change one function in `mockService.js` to call the backend with `api`.
  The views do not change.

| File | Contents | Feature owner |
| --- | --- | --- |
| `routes.js` | Route options SMU to VivoCity | Amanda, Tan Guan Wei |
| `stops.js` | Stops, live arrival schedules, trip points | Dillon |
| `weather.js` | Demo weather copy, rain zones | Dillon |
| `saved.js` | Saved routes, alerts | Woody (Lu Jia Hong) |
| `reports.js` | Report types, sample reports | Anumitaa |
| `lines.js` | MRT line colours | Shared |
