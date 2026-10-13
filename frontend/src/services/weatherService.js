import api from './api.js';

// Frontend calls to our backend weather route.
// The browser never calls data.gov.sg directly; the backend does.

/**
 * GET /api/weather?area=<area>
 * @param {string} area A two-hr-forecast area name, e.g. 'City'.
 * @returns {Promise<object>} The JSON body from the backend.
 */
export async function fetchWeather(area) {
  // TODO(student): call the backend with `api.get('/weather', { params: { area } })`.
  // TODO(student): return response.data.
  throw new Error(`fetchWeather is not implemented yet (area: ${area}).`);
}
