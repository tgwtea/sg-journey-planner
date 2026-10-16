// OWNER: Woody (Lu Jia Hong) (Weather-Triggered Trip Alerts / Saved Routes).
//
// DEMO STUB. Saved routes and pins live in memory only. Replace the body with
// real storage (for example MongoDB through the backend) and real forecast
// checks. Keep the return shape.
//
// Returns:
//   saved      ref([...])   saved routes (mockService shape)
//   pinned     ref([ids])
//   ordered    computed([...]) pinned first
//   shortList  computed([...]) top 3 for Home: { id, label, when, icon, route }

import { computed, ref } from 'vue';
import { getSavedDefaults, getSavedRoutes } from '../services/mockService.js';

const saved = ref([]);
const pinned = ref([]);
let loaded = false;

export function useSavedRoutes() {
  if (!loaded) {
    loaded = true;
    Promise.all([getSavedRoutes(), getSavedDefaults()]).then(([routes, defaults]) => {
      saved.value = routes;
      pinned.value = defaults.pinned;
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

  return { saved, pinned, ordered, shortList };
}
