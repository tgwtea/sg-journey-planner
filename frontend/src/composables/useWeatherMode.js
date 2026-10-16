import { computed, ref, watch } from 'vue';
import { useWeather } from './useWeather.js';
import { useClock } from './useClock.js';

// The app's current weather condition: 'clear' | 'light' | 'heavy'.
//
// It follows the live weather by default. The header switch can override it
// with a demo condition until the page reloads. Auto cycles the demo conditions.
// The live data itself comes from useWeather.js (owned by the weather feature).

const AUTO_SEQUENCE = ['clear', 'light', 'heavy', 'light'];
const AUTO_STEP_SEC = 7;

const live = useWeather('City');
const mode = ref('live'); // 'live' | 'clear' | 'light' | 'heavy'
const auto = ref(false);
const autoIdx = ref(0);
const autoAt = ref(0);
const changedAt = ref(0); // clock tick of the last condition change
let started = false;

const wx = computed(() => (mode.value === 'live' ? live.weather.value?.condition || 'clear' : mode.value));

function setMode(next) {
  mode.value = next;
  auto.value = false;
}

function toggleAuto() {
  const { tick } = useClock();
  auto.value = !auto.value;
  if (auto.value) {
    autoAt.value = tick.value;
    autoIdx.value = Math.max(0, AUTO_SEQUENCE.indexOf(wx.value));
    mode.value = wx.value;
  }
}

export function useWeatherMode() {
  if (!started) {
    started = true;
    const { tick } = useClock();
    live.refresh();
    watch(wx, () => { changedAt.value = tick.value; });
    watch(tick, (t) => {
      if (!auto.value || (t - autoAt.value) % AUTO_STEP_SEC !== 0) return;
      autoIdx.value = (autoIdx.value + 1) % AUTO_SEQUENCE.length;
      mode.value = AUTO_SEQUENCE[autoIdx.value];
    });
  }
  return { wx, mode, auto, changedAt, live, setMode, toggleAuto };
}
