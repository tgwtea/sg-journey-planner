// OWNER: Woody (Lu Jia Hong) (Weather-Triggered Trip Alerts / Saved Routes).
//
// DEMO STUB. Saved routes, pins, alert switches and alerts live in memory only,
// and each route has a fixed forecast per demo weather. Replace the body with
// real storage (for example MongoDB through the backend) and real forecast
// checks. Keep the return shape.
//
// Returns:
//   saved      ref([...])   saved routes (mockService shape)
//   pinned     ref([ids])
//   ordered    computed([...]) pinned first
//   shortList  computed([...]) top 3 for Home: { id, label, when, icon, route }
//   cards      computed([...]) view models for the Saved screen (see below)
//   alerts     computed([...]) alerts that are not dismissed
//   alertSummary computed('Rain alerts on for N of M routes')
//   togglePin(id), toggleAlert(id), dismiss(id), act(id), restore()

import { computed, ref } from 'vue';
import { useWeatherMode } from './useWeatherMode.js';
import { useLiveArrivals } from './useLiveArrivals.js';
import { buzz, useToast } from './useToast.js';
import { getAlerts, getSavedDefaults, getSavedRoutes } from '../services/mockService.js';

const saved = ref([]);
const pinned = ref([]);
const alertsOn = ref({});
const allAlerts = ref([]);
const dismissed = ref([]);
let loaded = false;

export function useSavedRoutes() {
  const { wx } = useWeatherMode();
  const { lineColours } = useLiveArrivals();

  if (!loaded) {
    loaded = true;
    Promise.all([getSavedRoutes(), getSavedDefaults(), getAlerts()]).then(([routes, defaults, alerts]) => {
      saved.value = routes;
      pinned.value = defaults.pinned;
      alertsOn.value = defaults.alertsOn;
      allAlerts.value = alerts;
    });
  }

  const ordered = computed(() => [
    ...saved.value.filter((r) => pinned.value.includes(r.id)),
    ...saved.value.filter((r) => !pinned.value.includes(r.id)),
  ]);

  const shortList = computed(() => ordered.value.slice(0, 3).map((r) => ({
    id: r.id,
    label: `${r.from} to ${r.to}`,
    when: r.when,
    icon: pinned.value.includes(r.id) ? 'push_pin' : 'bookmark',
    route: r,
  })));

  const cards = computed(() => ordered.value.map((r) => {
    const [fc, fcIcon, warn] = r.fc[wx.value];
    return {
      id: r.id,
      name: r.name,
      from: r.from,
      to: r.to,
      when: r.when,
      dur: r.dur,
      pinned: pinned.value.includes(r.id),
      alertOn: !!alertsOn.value[r.id],
      legs: r.legs.map((k) => (k === 'walk'
        ? { kind: 'walk', icon: 'directions_walk', text: '' }
        : { kind: 'rail', icon: 'train', text: k, bg: lineColours.value[k]?.[0], fg: lineColours.value[k]?.[1] })),
      forecast: fc,
      forecastIcon: fcIcon,
      warn: !!warn,
      route: r,
    };
  }));

  const alerts = computed(() => allAlerts.value.filter((a) => !dismissed.value.includes(a.id)));

  const alertSummary = computed(() => {
    const on = Object.values(alertsOn.value).filter(Boolean).length;
    return `Rain alerts on for ${on} of ${saved.value.length} routes`;
  });

  function togglePin(id) {
    buzz();
    pinned.value = pinned.value.includes(id) ? pinned.value.filter((x) => x !== id) : [...pinned.value, id];
  }

  function toggleAlert(id) {
    buzz();
    alertsOn.value = { ...alertsOn.value, [id]: !alertsOn.value[id] };
  }

  function dismiss(id) {
    buzz();
    dismissed.value = [...dismissed.value, id];
  }

  function act(id) {
    const a = allAlerts.value.find((x) => x.id === id);
    if (a) useToast().show(a.toast);
    dismissed.value = [...dismissed.value, id];
  }

  return {
    saved, pinned, ordered, shortList, cards, alerts, alertSummary,
    togglePin, toggleAlert, dismiss, act,
    restore: () => { dismissed.value = []; },
    routeOf: (id) => saved.value.find((r) => r.id === id) || null,
  };
}
