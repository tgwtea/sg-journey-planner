// Weather service: talks to NEA / data.gov.sg.
// STUDENT-OWNED. See docs/WEATHER_API.md for the verified endpoints
// and the implementation checklist.

export const DATA_GOV_BASE_URL = 'https://api-open.data.gov.sg/v2/real-time/api';

/**
 * Return the current weather for one 2-hour-forecast area.
 *
 * Suggested response shape for the frontend (agree on it as a team):
 * {
 *   area: 'City',
 *   forecast: 'Light Rain',          // text from two-hr-forecast
 *   condition: 'clear' | 'light' | 'heavy',
 *   temperatureC: 29.4 | null,        // from air-temperature
 *   rainfallMm: 0.2 | null,           // from rainfall (5-min total)
 *   validPeriod: '3.30 pm to 5.30 pm',
 *   updatedAt: '2026-10-13T15:51:20+08:00'
 * }
 *
 * @param {string} area A name from two-hr-forecast area_metadata, e.g. 'City'.
 * @returns {Promise<object>}
 */
export async function getWeatherForArea(area) {
  // TODO(student): fetch the endpoints listed in docs/WEATHER_API.md.
  // TODO(student): send a normal User-Agent header (Cloudflare blocks some defaults).
  // TODO(student): pick the forecast for `area`, and the nearest stations.
  // TODO(student): map forecast text to 'clear' | 'light' | 'heavy'.
  // TODO(student): cache the result for about 60 seconds.
  const err = new Error(`Weather service is not implemented yet (area: ${area}).`);
  err.status = 501;
  throw err;
}
