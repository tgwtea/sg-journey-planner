import { ref } from 'vue';
// import { fetchWeather } from '../services/weatherService.js';

/**
 * Weather state for one area. STUDENT-OWNED.
 *
 * The refs below match the WeatherHero props, so a view can pass them in.
 * See docs/WEATHER_API.md for the checklist.
 *
 * @param {string} area
 */
export function useWeather(area = 'City') {
  const status = ref('idle'); // 'idle' | 'loading' | 'success' | 'empty' | 'error'
  const weather = ref(null);   // the normalized object from the backend
  const errorMessage = ref('');

  async function refresh() {
    // TODO(student): set status to 'loading'.
    // TODO(student): call fetchWeather(area) and store the result in `weather`.
    // TODO(student): set 'success', or 'empty' if there is no reading.
    // TODO(student): on failure, set 'error' and a friendly errorMessage.
    console.info(`[useWeather] refresh() is not implemented yet (area: ${area}).`);
  }

  return { area, status, weather, errorMessage, refresh };
}
