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
//   flash     ref(id | null)  the report that was just posted (for a highlight)
//   post(type, stop)          add a report and show a toast
//
// Reports screen:
//   filter ref('all' | type id), query ref(''), sort ref('newest' | 'oldest' | 'confirmed')
//   newStop ref(place id)     the place picked in the quick report form
//   placeOptions computed([{ id, name }])
//   filterChips  computed([{ id, label, n, on }])
//   feed         computed([{ id, label, icon, stopName, chips, note, mine, ago, confirms, confirmed, flash }])
//   hotspots     computed([{ name, n }]) places with the most reports in the last hour
//   confirm(id), clearFilters()

import { computed, ref } from 'vue';
import { useClock } from './useClock.js';
import { buzz, useToast } from './useToast.js';
import { useLiveArrivals } from './useLiveArrivals.js';
import { getExtraPlaces, getReportPlaces, getReports, getReportTypes, getStops } from '../services/mockService.js';

const reports = ref([]);
const types = ref([]);
const places = ref([]);
const flash = ref(null);
const placeIds = ref([]);
const filter = ref('all');
const query = ref('');
const sort = ref('newest');
const newStop = ref('brasbasah');
const confirmed = ref([]);
let loaded = false;

export function useReports() {
  const { tick } = useClock();

  if (!loaded) {
    loaded = true;
    Promise.all([getReports(), getReportTypes(), getStops(), getExtraPlaces(), getReportPlaces()]).then(([r, t, s, e, ids]) => {
      placeIds.value = ids;
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

  const { lineColours } = useLiveArrivals();
  const placeOf = (id) => places.value.find((p) => p.id === id);
  function chips(p) {
    if (!p) return [];
    if (p.codes?.length) return p.codes.map(([l, t]) => ({ t, bg: lineColours.value[l]?.[0], fg: lineColours.value[l]?.[1] }));
    return [{ t: p.code, bg: 'var(--chip)', fg: 'var(--ink)' }];
  }

  const placeOptions = computed(() => placeIds.value.map((id) => ({ id, name: placeName(id) })));

  const filterChips = computed(() => {
    const counts = {};
    reports.value.forEach((r) => { counts[r.type] = (counts[r.type] || 0) + 1; });
    return [{ id: 'all', label: 'All' }, ...types.value].map((t) => ({
      id: t.id, label: t.label, n: t.id === 'all' ? reports.value.length : counts[t.id] || 0, on: filter.value === t.id,
    }));
  });

  const feed = computed(() => {
    const q = query.value.trim().toLowerCase();
    const list = reports.value.filter((r) => {
      if (filter.value !== 'all' && r.type !== filter.value) return false;
      if (!q) return true;
      const p = placeOf(r.stop);
      const codes = (p?.codes || []).map((c) => c[1]).join(' ');
      return `${placeName(r.stop)} ${r.note} ${typeOf(r.type).label} ${codes}`.toLowerCase().includes(q);
    });
    const cmp = { newest: (a, b) => b.at - a.at, oldest: (a, b) => a.at - b.at, confirmed: (a, b) => b.c - a.c }[sort.value];
    return [...list].sort(cmp).map((r) => {
      const isConfirmed = confirmed.value.includes(r.id);
      return {
        id: r.id,
        label: typeOf(r.type).label,
        icon: typeOf(r.type).icon,
        stopName: placeName(r.stop),
        chips: chips(placeOf(r.stop)),
        note: r.note,
        mine: !!r.mine,
        ago: ago(r.at),
        confirms: r.c + (isConfirmed ? 1 : 0),
        confirmed: isConfirmed,
        flash: flash.value === r.id,
      };
    });
  });

  const hotspots = computed(() => {
    const counts = {};
    reports.value.filter((r) => tick.value - r.at < 3600).forEach((r) => { counts[r.stop] = (counts[r.stop] || 0) + 1; });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([id, n]) => ({ id, name: placeName(id), n: `${n} report${n > 1 ? 's' : ''}` }));
  });

  function confirm(id) {
    buzz();
    confirmed.value = confirmed.value.includes(id) ? confirmed.value.filter((x) => x !== id) : [...confirmed.value, id];
  }

  function post(type, stop) {
    const id = Date.now();
    reports.value = [{ id, type, stop, note: '', at: tick.value, c: 1, mine: true }, ...reports.value];
    flash.value = id;
    filter.value = 'all';
    query.value = '';
    useToast().show(`Thanks. "${typeOf(type).label}" at ${placeName(stop)} is live.`);
    setTimeout(() => { if (flash.value === id) flash.value = null; }, 1500);
    return id;
  }

  return {
    reports, types, places, flash, typeOf, placeName, ago, preview, post,
    filter, query, sort, newStop, placeOptions, filterChips, feed, hotspots, confirm,
    setFilter: (id) => { buzz(); filter.value = id; },
    clearFilters: () => { filter.value = 'all'; query.value = ''; },
  };
}
