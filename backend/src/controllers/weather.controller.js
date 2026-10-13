import { getWeatherForArea } from '../services/weather.service.js';

// GET /api/weather?area=City
// The controller handles HTTP only: read the query, call the service, send JSON.
export async function getCurrentWeather(req, res, next) {
  try {
    const area = req.query.area || 'City';
    const weather = await getWeatherForArea(area);
    res.json(weather);
  } catch (err) {
    next(err);
  }
}
