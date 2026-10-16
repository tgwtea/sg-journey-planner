// OWNER: Amanda (Route Comparison with Live Conditions).
//
// DEMO STUB. It copies the mockup scoring: score = duration + rain exposure x
// weight + transfers x 5, where the weight depends on the demo weather.
// Replace the body with the real scoring and live data. Keep the return shape.
//
// Returns:
//   sort        ref('best' | 'fastest' | 'walk' | 'rain' | 'transfers' | 'custom')
//   sortOptions computed([{ id, label, icon, on }])
//   setSort(id)
//   cards       computed([...]) one view model per route, in display order (see cardView)
//   conditions  computed([{ icon, text, solid }]) the live conditions bar
//   hover       ref(route id | null), drag ref(route id | null)
//   pin(id), moveBy(id, delta), moveTo(id, targetId)

import { computed, ref } from 'vue';
import { formatTime, useClock } from './useClock.js';
import { useWeatherMode } from './useWeatherMode.js';
import { useLiveArrivals } from './useLiveArrivals.js';
import { useDepartureRecommendation } from './useDepartureRecommendation.js';
import { buzz } from './useToast.js';

const SORTS = [
  { id: 'best', label: 'RouteWise pick', icon: 'auto_awesome' },
  { id: 'fastest', label: 'Fastest', icon: 'bolt' },
  { id: 'walk', label: 'Least walking', icon: 'directions_walk' },
  { id: 'rain', label: 'Least rain', icon: 'umbrella' },
  { id: 'transfers', label: 'Fewest transfers', icon: 'sync_alt' },
];
const EXPOSURE = ['Dry', 'Low', 'Medium', 'High'];
const COMFORT = ['Comfy', 'Stay dry', 'Bring umbrella', 'Expect to get wet'];

const sort = ref('best');
const order = ref(['ne', 'bus80', 'ewne', 'b57']);
const pinned = ref([]);
const hover = ref(null);
const drag = ref(null);

export function useRouteComparison() {
  const { now } = useClock();
  const { wx } = useWeatherMode();
  const { lineColours, nextIn } = useLiveArrivals();
  const { routes } = useDepartureRecommendation();

  const rain = computed(() => wx.value !== 'clear');
  const weight = computed(() => (wx.value === 'heavy' ? 3 : wx.value === 'light' ? 1.5 : 0));
  const score = (r) => r.dur + r.exp * weight.value + r.tr * 5;

  const displayIds = computed(() => {
    let ids;
    if (sort.value === 'custom') {
      ids = [...order.value];
    } else {
      const key = {
        best: score,
        fastest: (r) => r.dur,
        walk: (r) => r.walk,
        rain: (r) => r.exp * 100 + r.dur,
        transfers: (r) => r.tr * 100 + r.dur,
      }[sort.value];
      ids = [...routes.value].sort((a, b) => key(a) - key(b)).map((r) => r.id);
    }
    return [...ids.filter((i) => pinned.value.includes(i)), ...ids.filter((i) => !pinned.value.includes(i))];
  });

  function legView(l) {
    const wet = l.wet && rain.value;
    if (l.k === 'walk') return { grow: l.m, kind: wet ? 'wet' : 'walk', icon: wet ? 'rainy' : 'directions_walk', text: l.m };
    if (l.k === 'bus') return { grow: l.m, kind: 'bus', icon: 'directions_bus', text: l.n };
    const c = lineColours.value[l.k] || ['var(--solid)', 'var(--onSolid)'];
    return { grow: l.m, kind: 'rail', icon: 'train', text: l.k, bg: c[0], fg: c[1] };
  }

  const cards = computed(() => {
    const R = routes.value;
    if (!R.length) return [];
    const byId = Object.fromEntries(R.map((r) => [r.id, r]));
    const best = [...R].sort((a, b) => score(a) - score(b))[0].id;
    const minDur = Math.min(...R.map((r) => r.dur));
    const minExp = Math.min(...R.map((r) => r.exp));
    const minWalk = Math.min(...R.map((r) => r.walk));
    const pad = (n) => String(n).padStart(2, '0');

    return displayIds.value.map((id, i) => {
      const r = byId[id];
      const lv = !rain.value ? 0 : r.exp <= 1 ? 1 : r.exp <= 5 ? 2 : 3;
      const nx = nextIn(r.next.p, r.next.o);
      const badges = [];
      if (id === best) badges.push({ label: 'RouteWise pick', solid: true });
      if (r.dur === minDur) badges.push({ label: 'Fastest' });
      if (rain.value && r.exp === minExp) badges.push({ label: 'Driest' });
      if (r.walk === minWalk && !(rain.value && r.exp === minExp)) badges.push({ label: 'Least walking' });
      return {
        id,
        rank: pad(i + 1),
        name: r.name,
        via: r.via,
        dur: r.dur,
        arrive: formatTime(new Date(now.value.getTime() + r.dur * 60000)),
        tr: r.tr === 0 ? 'None' : r.tr,
        walk: `${r.walk} m`,
        fare: r.fare,
        badges,
        isBest: id === best,
        pinned: pinned.value.includes(id),
        legs: r.legs.map(legView),
        nextLabel: r.next.label,
        nextT: nx < 45 ? 'Arriving' : `${Math.floor(nx / 60)}:${pad(nx % 60)}`,
        exposure: lv,
        expLabel: rain.value ? `${EXPOSURE[lv]} · ${r.exp} min exposed` : 'Dry · no rain on route',
        comfort: COMFORT[lv],
        aria: `Option ${i + 1}: ${r.name}, ${r.dur} minutes, ${r.tr} transfers, rain exposure ${EXPOSURE[lv]}`,
      };
    });
  });

  const sortOptions = computed(() => [...SORTS, ...(sort.value === 'custom' ? [{ id: 'custom', label: 'Custom', icon: 'drag_indicator' }] : [])]
    .map((o) => ({ ...o, on: sort.value === o.id })));

  const conditions = computed(() => [
    rain.value
      ? { icon: wx.value === 'heavy' ? 'thunderstorm' : 'rainy', text: wx.value === 'heavy' ? 'Heavy rain over Bras Basah' : 'Light rain near Bras Basah', solid: true }
      : { icon: 'sunny', text: 'Dry along all routes', solid: false },
    { icon: 'check_circle', text: 'NE line · normal service', solid: false },
    { icon: 'schedule', text: 'Bus 80 · +3 min delay', solid: false },
  ]);

  function moveTo(id, targetId) {
    const ids = [...displayIds.value];
    const from = ids.indexOf(id);
    const to = ids.indexOf(targetId);
    if (from < 0 || to < 0 || from === to) return;
    ids.splice(from, 1);
    ids.splice(to, 0, id);
    order.value = ids;
    sort.value = 'custom';
  }

  function moveBy(id, delta) {
    const ids = [...displayIds.value];
    const i = ids.indexOf(id);
    const j = i + delta;
    if (j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    buzz();
    order.value = ids;
    sort.value = 'custom';
  }

  function pin(id) {
    buzz();
    pinned.value = pinned.value.includes(id) ? pinned.value.filter((x) => x !== id) : [...pinned.value, id];
  }

  return {
    sort, sortOptions, cards, conditions, hover, drag,
    setSort: (id) => { buzz(); sort.value = id; },
    pin, moveBy, moveTo,
  };
}
