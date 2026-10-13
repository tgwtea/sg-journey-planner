# Design source of truth

These files come from the Claude Design project "RouteWise"
(`https://claude.ai/design/p/f6600339-3adc-4354-b365-d1edf5ecf17f`).

| File | Purpose |
| --- | --- |
| `RouteWise v2.dc.html` | The current mockup. Implement this one. |
| `RouteWise.dc.html` | The older v1 mockup. Reference only. |
| `support.js` | The design runtime that renders the `.dc.html` files. Generated; do not edit. |

Rules:

1. Do not edit these files. Change the design in Claude Design, then copy the new export here.
2. The Vue app copies the tokens from `RouteWise v2.dc.html` into `frontend/src/styles/tokens.css`.
   When a token changes here, update that file too.
3. To view a mockup, serve this folder and open the `.dc.html` file:
   `npx serve design` and open the link it prints.
