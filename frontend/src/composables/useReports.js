// OWNER: Anumitaa (Community Reports).
//
// DEMO STUB. Reports live in memory only, and their times count from app start.
// Replace the body with real storage (for example MongoDB through the backend).
// Keep the return shape.
//
// Returns:
//   reports   ref([...])  { id, type, stop, note, at (clock tick), c, mine }
//   types     ref([...])  report types
//   typeOf(id)            one type
//   placeName(id)         stop or place name
//   ago(at)               'Just now' | 'N min ago' | 'N h ago'
//   preview   computed([...]) newest 3 for Home: { id, label, icon, stopName, ago }

import { computed, ref } from 'vue';
import { useClock } from './useClock.js';
import { getExtraPlaces, getReports, getReportTypes, getStops } from '../services/mockService.js';

const reports = ref([]);
const types = ref([]);
const places = ref([]);
let loaded = false;

export function useReports() {
  const { tick } = useClock();

  if (!loaded) {
    loaded = true;
    Promise.all([getReports(), getReportTypes(), getStops(), getExtraPlaces()]).then(([r, t, s, e]) => {
      reports.value = r.map(({ ageSec, ...rest }) => ({ ...rest, at: tick.value - ageSec, mine: false }));
      types.value = t;
      places.value = [...s, ...e];
    });
  }

  const typeOf = (id) => types.value.find((t) => t.id === id) || { label: id, icon: 'info' };
  const placeName = (id) => places.value.find((p) => p.id === id)?.name || id;

  function ago(at) {
    const sec = tick.value - at;
    if (sec < 45) return 'Just now';
    if (sec < 3600) return `${Math.max(1, Math.round(sec / 60))} min ago`;
    return `${Math.floor(sec / 3600)} h ago`;
  }

  const preview = computed(() => [...reports.value]
    .sort((a, b) => b.at - a.at)
    .slice(0, 3)
    .map((r) => ({ id: r.id, label: typeOf(r.type).label, icon: typeOf(r.type).icon, stopName: placeName(r.stop), ago: ago(r.at) })));

  return { reports, types, places, typeOf, placeName, ago, preview };
}
