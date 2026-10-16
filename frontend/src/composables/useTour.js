import { computed, ref } from 'vue';
import router from '../router';
import { useToast } from './useToast.js';
import { useWeatherMode } from './useWeatherMode.js';

// First-visit onboarding and the guided tour from the mockup.
//
// The tour only changes the screen and the demo weather. A feature that must
// react to a step (for example, plan a trip on step 1) watches `step`.

const STORAGE_KEY = 'rw_onboarded';

export const TOUR_STEPS = [
  { screen: 'home', title: 'Your commute, at a glance', body: 'Weather, a planner, live timings and a smart recommendation on one screen. Try the weather switch at the top: the whole sky reacts.' },
  { screen: 'home', title: '1 · Plan SMU to VivoCity', body: 'We filled in the trip and planned it for you. RouteWise checks every option against live timings and rain cells.' },
  { screen: 'home', title: '2 · Leave now, or wait?', body: 'RouteWise says wait 8 min. Rain over your walk is easing, and the next option has fewer transfers. The ring counts down live.' },
  { screen: 'routes', title: '3 · Compare routes', body: 'Every option side by side: time, transfers, walking, live departures, rain exposure and comfort.' },
  { screen: 'routes', title: '4 · Make it yours', body: 'Drag cards to reorder them by what matters to you, or pin a favourite. Hover over a card to trace it on the map.' },
  { screen: 'map', title: '5 · See it on the map', body: 'Dotted lines are walking legs. Solid lines are trains and buses. Shaded zones are rain cells, and drop markers flag exposed walks.' },
  { screen: 'map', title: '6 · Inspect a stop', body: 'We opened Dhoby Ghaut: live arrivals, shelter, the weather there, and what other commuters report.' },
  { screen: 'saved', title: '7 · Saved routes and alerts', body: 'Regular trips get forecast alerts, for example a warning before your 8:15 AM commute. Pin favourites to keep them on top.' },
  { screen: 'reports', title: '8 · Community reports', body: 'Quick, timestamped updates from people at the stop. Pick a place, tap a type, and you are done.' },
];

const step = ref(-1);
const onboarding = ref(false);
let checked = false;

function go(i) {
  if (i < 0) return;
  if (i >= TOUR_STEPS.length) {
    step.value = -1;
    useToast().show('Tour done. Explore freely.');
    return;
  }
  if (i === 0) useWeatherMode().setMode('heavy');
  step.value = i;
  router.push({ name: TOUR_STEPS[i].screen });
}

function closeOnboarding(startTour) {
  try { localStorage.setItem(STORAGE_KEY, '1'); } catch { /* storage blocked */ }
  onboarding.value = false;
  if (startTour) go(0);
}

export function useTour() {
  if (!checked && typeof window !== 'undefined') {
    checked = true;
    let seen = null;
    try { seen = localStorage.getItem(STORAGE_KEY); } catch { /* storage blocked */ }
    if (!seen) onboarding.value = true;
  }
  return {
    step,
    active: computed(() => step.value >= 0),
    current: computed(() => TOUR_STEPS[step.value] || null),
    total: TOUR_STEPS.length,
    onboarding,
    start: () => go(0),
    next: () => go(step.value + 1),
    back: () => go(Math.max(0, step.value - 1)),
    exit: () => { step.value = -1; },
    closeOnboarding,
  };
}
