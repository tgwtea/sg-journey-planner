# Mock data

Only the weather data is live. Every other screen reads mock data from this folder
until the team adds real fixtures or API routes.

- The data comes from the RouteWise v2 mockup (`design/RouteWise v2.dc.html`).
- Views do not import these files directly. They call `services/mockService.js`.
- To go live, change one function in `mockService.js` to call the backend with `api`.
  The views do not change.
