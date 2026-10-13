import api from './api.js';

/**
 * GET /api/weather?area=<area>
 * @param {string} area A two-hr-forecast area name, e.g. 'City'.
 * @returns {Promise<object>} The JSON body from the backend.
 */
export async function fetchWeather(area) {
  const res = await api.get('/weather', { params: { area } });
  return res.data;
}
