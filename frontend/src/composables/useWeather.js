import { ref } from 'vue';
import { fetchWeather } from '../services/weatherService.js';

/**
 * Weather state for one area.
 *
 * The refs below match the WeatherHero props, so a view can pass them in.
 *
 * @param {string} area
 */
export function useWeather(area = 'City') {
  const status = ref('idle'); // 'idle' | 'loading' | 'success' | 'empty' | 'error'
  const weather = ref(null);   // the normalized object from the backend
  const errorMessage = ref('');

  async function refresh() {
    status.value = 'loading';
    errorMessage.value = '';
    try {
      const data = await fetchWeather(area);
      weather.value = data;
      status.value = data?.forecast ? 'success' : 'empty';
    } catch (err) {
      weather.value = null;
      errorMessage.value = err.response?.data?.error?.message || 'We could not load the weather. Try again.';
      status.value = 'error';
    }
  }

  return { area, status, weather, errorMessage, refresh };
}
