import { env } from '../config/env.js';

export const DATA_GOV_BASE_URL = 'https://api-open.data.gov.sg/v2/real-time/api';

// Cloudflare blocks some default user agents. See docs/WEATHER_API.md, limit 5.
const USER_AGENT = 'Mozilla/5.0 (compatible; RouteWise/0.1; +https://github.com)';
const CACHE_TTL_MS = 60 * 1000;
const TIMEOUT_MS = 8000;

// In-memory cache: path -> { at, data }. Resets when the server restarts.
const cache = new Map();

function upstreamError(message) {
  const err = new Error(message);
  err.status = 502;
  return err;
}

// Requests for the same path that arrive at the same time share one upstream call.
const inFlight = new Map();

async function fetchJson(path) {
  const hit = cache.get(path);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.data;
  if (inFlight.has(path)) return inFlight.get(path);

  const promise = fetchUpstream(path)
    .catch((err) => {
      // On a rate limit or an outage, older data is better than none.
      if (hit) return hit.data;
      throw err;
    })
    .finally(() => inFlight.delete(path));
  inFlight.set(path, promise);
  return promise;
}

async function fetchUpstream(path) {
  const headers = { 'User-Agent': USER_AGENT, Accept: 'application/json' };
  if (env.dataGovSgApiKey) headers['x-api-key'] = env.dataGovSgApiKey;

  let res;
  try {
    console.info(`[weather] GET ${path}`);
    res = await fetch(`${DATA_GOV_BASE_URL}${path}`, { headers, signal: AbortSignal.timeout(TIMEOUT_MS) });
  } catch (err) {
    throw upstreamError(`data.gov.sg ${path} did not respond (${err.name}).`);
  }
  if (!res.ok) throw upstreamError(`data.gov.sg ${path} returned HTTP ${res.status}.`);

  const body = await res.json();
  if (body.code !== 0 || !body.data) throw upstreamError(`data.gov.sg ${path} returned no data.`);

  cache.set(path, { at: Date.now(), data: body.data });
  return body.data;
}

const CONDITIONS = {
  clear: ['Fair', 'Fair (Day)', 'Fair (Night)', 'Fair & Warm', 'Partly Cloudy', 'Partly Cloudy (Day)',
    'Partly Cloudy (Night)', 'Cloudy', 'Hazy', 'Slightly Hazy', 'Windy', 'Mist', 'Fog'],
  light: ['Light Rain', 'Light Showers', 'Passing Showers', 'Showers', 'Moderate Rain'],
  heavy: ['Heavy Rain', 'Heavy Showers', 'Thundery Showers', 'Heavy Thundery Showers',
    'Heavy Thundery Showers with Gusty Winds'],
};

/**
 * Map two-hr-forecast text to 'clear' | 'light' | 'heavy'.
 * Unknown text logs a warning and returns 'clear'.
 */
export function mapCondition(text) {
  for (const [condition, texts] of Object.entries(CONDITIONS)) {
    if (texts.includes(text)) return condition;
  }
  console.warn(`[weather] Unknown forecast text: "${text}"`);
  return 'clear';
}

// Squared distance is enough to compare stations that are close together.
function distance2(a, b) {
  return (a.latitude - b.latitude) ** 2 + (a.longitude - b.longitude) ** 2;
}

/**
 * Value from the station nearest to `point`, for air-temperature or rainfall data.
 * Only stations with a reading in the latest set count. Returns null if none.
 */
function nearestStationValue(data, point) {
  const values = new Map((data.readings?.[0]?.data || []).map((r) => [r.stationId, r.value]));
  let best = null;
  for (const station of data.stations || []) {
    if (!values.has(station.id) || !station.location) continue;
    const d = distance2(station.location, point);
    if (!best || d < best.d) best = { d, value: values.get(station.id) };
  }
  return best ? best.value : null;
}

/**
 * Return the current weather for one 2-hour-forecast area.
 *
 * Response shape:
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
  const [forecastRes, tempRes, rainRes] = await Promise.allSettled([
    fetchJson('/two-hr-forecast'),
    fetchJson('/air-temperature'),
    fetchJson('/rainfall'),
  ]);

  // The forecast is required. Temperature and rainfall are optional.
  if (forecastRes.status === 'rejected') throw forecastRes.reason;
  const forecastData = forecastRes.value;

  const meta = forecastData.area_metadata?.find((a) => a.name.toLowerCase() === area.toLowerCase());
  if (!meta) {
    const err = new Error(`Unknown forecast area: ${area}.`);
    err.status = 404;
    throw err;
  }

  const item = forecastData.items?.[0];
  const forecast = item?.forecasts?.find((f) => f.area === meta.name)?.forecast || '';
  const point = meta.label_location;

  return {
    area: meta.name,
    forecast,
    condition: forecast ? mapCondition(forecast) : 'clear',
    temperatureC: tempRes.status === 'fulfilled' ? nearestStationValue(tempRes.value, point) : null,
    rainfallMm: rainRes.status === 'fulfilled' ? nearestStationValue(rainRes.value, point) : null,
    validPeriod: item?.valid_period?.text || '',
    updatedAt: item?.update_timestamp || '',
  };
}
