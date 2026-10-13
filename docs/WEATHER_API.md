# Live weather: API notes and implementation checklist

Owner of weather data: Dillon (Rain-Aware Route Finder). The Home screen uses it first.

## Endpoints (verified 2026-10-13)

Base URL: `https://api-open.data.gov.sg/v2/real-time/api`

| Endpoint | What it gives | Update interval |
| --- | --- | --- |
| `GET /two-hr-forecast` | Forecast text for 47 named areas, with a label lat/long per area | About 30 min |
| `GET /air-temperature` | Temperature (deg C) from 18 stations | 1 min |
| `GET /rainfall` | Rainfall (mm per 5 min) from 89 stations | 5 min |
| `GET /twenty-four-hr-forecast` | Island-wide high/low temperature, humidity, wind; forecast for 5 regions | A few times a day |

Authentication: none. An optional `x-api-key` header (from data.gov.sg) raises the rate limit.
The response has `access-control-allow-origin: *`.

### Response shapes (trimmed)

`two-hr-forecast`:

```json
{
  "code": 0,
  "data": {
    "area_metadata": [{ "name": "City", "label_location": { "latitude": 1.292, "longitude": 103.844 } }],
    "items": [{
      "update_timestamp": "2026-10-13T15:51:20+08:00",
      "timestamp": "2026-10-13T15:45:00+08:00",
      "valid_period": { "start": "…", "end": "…", "text": "3.30 pm to 5.30 pm" },
      "forecasts": [{ "area": "City", "forecast": "Cloudy" }]
    }]
  }
}
```

`air-temperature` and `rainfall` share one shape:

```json
{
  "code": 0,
  "data": {
    "stations": [{ "id": "S109", "name": "Ang Mo Kio Avenue 5", "location": { "latitude": 1.3793, "longitude": 103.85 } }],
    "readings": [{ "timestamp": "2026-10-13T15:53:00+08:00", "data": [{ "stationId": "S109", "value": 29.1 }] }],
    "readingType": "DBT 1M F",
    "readingUnit": "deg C"
  }
}
```

### Limits

1. The 2-hour forecast is per area, not per street. "Bras Basah" (in the mockup) is not an area. Use "City".
2. Only 18 stations measure temperature. Use the nearest station to the area label location.
3. The forecast text set is not fully documented. On 2026-10-13 the API returned "Cloudy" and
   "Light Rain". Other values (for example showers and thunderstorms) are expected, but this check
   did not see them. Confirm the full list in the data.gov.sg documentation. Log any unknown text
   and map it to a safe default.
4. A forecast is a forecast. It can be wrong. Show `valid_period` and the update time.
5. Cloudflare returned HTTP 403 to Python's default `User-Agent`. curl and browsers worked.
   Send a normal `User-Agent` header from the backend.
6. Without an API key, the rate limit is low. Cache responses for about 60 seconds.

## How the data fits the mockup

| Mockup element (Home hero) | Data source |
| --- | --- |
| Area name | The selected `two-hr-forecast` area |
| Large temperature | Nearest `air-temperature` station value |
| Condition title and icon | `two-hr-forecast` text, mapped to `clear` / `light` / `heavy` |
| Sky colour (`data-wx`) | The same `condition` value |
| "Live · time" line | `update_timestamp` |
| H / L line | `twenty-four-hr-forecast` `general.temperature` (optional) |
| Rain bar chart (next 60 min) | No verified source gives per-minute rain. Leave it out or use `rainfall` totals. |

## Scaffold that already exists

| File | State |
| --- | --- |
| `backend/src/routes/weather.routes.js` | Done. `GET /api/weather?area=City` |
| `backend/src/controllers/weather.controller.js` | Done. Calls the service, sends JSON. |
| `backend/src/services/weather.service.js` | **Stub.** Throws HTTP 501. |
| `frontend/src/services/weatherService.js` | **Stub.** `fetchWeather(area)` throws. |
| `frontend/src/composables/useWeather.js` | **Stub.** `refresh()` does nothing. |
| `frontend/src/components/WeatherHero.vue` | Done. Shows idle, loading, success, empty, error. Emits `refresh`. |
| `frontend/src/views/HomeView.vue` | Done. Connects `useWeather` to `WeatherHero`. |

## Student checklist

Do the steps in order. Test each step before the next one.

1. **Agree on the response shape.** Use the JSDoc in `weather.service.js` as a start.
   Test: the team reviews the shape.
2. **Fetch `two-hr-forecast` in the backend.** Use `fetch` (built into Node 22). Set a `User-Agent`.
   Test: Postman `GET http://localhost:3000/api/weather?area=City` returns the raw forecast.
3. **Pick the forecast for one area.** Return 404 if the area name is unknown.
   Test: Postman with `area=City` and with `area=Nowhere`.
4. **Map forecast text to `clear` / `light` / `heavy`.** Put the table in one function.
   Test: call the function with each known text and one unknown text.
5. **Add the temperature.** Fetch `air-temperature`. Pick the station nearest to the area label location.
   Test: compare the value with the data.gov.sg response in your browser.
6. **Cache for 60 seconds.** Keep it in memory.
   Test: call twice. The second call is fast, and the server log shows one upstream request.
7. **Handle upstream failure.** A timeout or a non-200 status becomes HTTP 502 with a clear message.
   Test: change the base URL to a wrong host. Postman shows 502.
8. **Implement `fetchWeather(area)` in the frontend.**
   Test: browser DevTools, Network tab, shows `/api/weather?area=City` with status 200.
9. **Implement `useWeather().refresh()`.** Set `loading`, then `success`, `empty`, or `error`.
   Call `refresh()` once in `HomeView` `onMounted`.
   Test: stop the backend and press Refresh. The hero shows the error state.
10. **Check mobile.** Test: DevTools device mode at 375 px width. Nothing overflows.
11. **Add an E2E test.** Extend `e2e/tests/smoke.spec.js` to check that the hero leaves the idle state.
    Test: `npm run test:e2e`.
