// OWNER: Dillon (Rain-Aware Route Finder: stops, map, weather matching).
//
// DEMO STUB. Rain zones are fixed circles per demo condition, and a stop is
// "in rain" when it is inside a circle. Replace the body with real stop data
// (LTA) and real forecast areas (data.gov.sg). Keep the return shape.
//
// Returns:
//   stops         ref([...])           all map stops (mockService shape)
//   zones         computed([...])      rain cells for the current weather
//   forecast      computed({ title, temp, hl, sub, icon, chip, bars }) demo copy for the current weather
//   mapStops      computed([...])      stops for RwMap: { id, name, kind, lat, lng, wet, big }
//   trip          ref({ origin, dest }) trip end points for the map
//   nearby        computed([...])      nearby stops for Home, with weather and arrivals
//   selectedStop  ref(id | null)
//   rainAt(lat, lng)  'heavy' | 'light' | null
//   wxInfo(level)     { label, icon, c }
//   place(id)         a stop or extra place
//   chips(place)      line/code chips [{ t, bg, fg }]
//   openStop(id)      select a stop and open the Map screen

import { computed, ref } from 'vue';
import router from '../router';
import { useWeatherMode } from './useWeatherMode.js';
import { useLiveArrivals } from './useLiveArrivals.js';
import { buzz } from './useToast.js';
import { getExtraPlaces, getNearbyStops, getRainZones, getStops, getTripPoints, getWeatherCopy } from '../services/mockService.js';

export const SHELTER_LABELS = ['Unsheltered', 'Partly sheltered', 'Sheltered'];
export const SHELTER_ICONS = ['umbrella', 'roofing', 'roofing'];

const stops = ref([]);
const extra = ref([]);
const zonesByWx = ref({});
const copyByWx = ref({});
const nearbyDefs = ref([]);
const trip = ref(null);
const selectedStop = ref(null);
let loaded = false;

// Distance in metres between two points (haversine).
function metres(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLng = (lng2 - lng1) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function useRainMap() {
  const { wx } = useWeatherMode();
  const { lineColours, arrival } = useLiveArrivals();

  if (!loaded) {
    loaded = true;
    Promise.all([getStops(), getExtraPlaces(), getRainZones(), getNearbyStops(), getTripPoints(), getWeatherCopy()])
      .then(([s, e, z, n, t, c]) => {
        copyByWx.value = c;
        stops.value = s;
        extra.value = e;
        zonesByWx.value = z;
        nearbyDefs.value = n;
        trip.value = t;
      });
  }

  const zones = computed(() => zonesByWx.value[wx.value] || []);
  const forecast = computed(() => copyByWx.value[wx.value] || null);

  function rainAt(lat, lng) {
    let best = null;
    for (const z of zones.value) {
      if (metres(lat, lng, z.lat, z.lng) < z.r) {
        if (z.lvl === 'heavy') return 'heavy';
        best = 'light';
      }
    }
    return best;
  }

  function wxInfo(level) {
    if (level === 'heavy') return { label: 'Heavy rain', icon: 'thunderstorm', c: 'var(--ink)' };
    if (level === 'light') return { label: 'Light rain', icon: 'rainy', c: 'var(--ink)' };
    return wx.value !== 'clear'
      ? { label: 'Cloudy', icon: 'cloud', c: 'var(--ink2)' }
      : { label: 'Fair', icon: 'sunny', c: 'var(--ink2)' };
  }

  const place = (id) => stops.value.find((s) => s.id === id) || extra.value.find((s) => s.id === id);

  function chips(p) {
    if (p.codes?.length) {
      return p.codes.map(([l, t]) => ({ t, bg: lineColours.value[l]?.[0], fg: lineColours.value[l]?.[1] }));
    }
    return [{ t: p.code, bg: 'var(--chip)', fg: 'var(--ink)' }];
  }

  const mapStops = computed(() => stops.value.map((s) => ({
    id: s.id, name: s.name, kind: s.kind, lat: s.lat, lng: s.lng,
    wet: !!rainAt(s.lat, s.lng), big: (s.codes?.length || 0) > 1,
  })));

  const nearby = computed(() => nearbyDefs.value.map(({ id, dist }) => {
    const p = place(id);
    if (!p) return null;
    const w = wxInfo(rainAt(p.lat, p.lng));
    return {
      id, name: p.name, chips: chips(p), dist,
      shIcon: SHELTER_ICONS[p.sh], shLabel: SHELTER_LABELS[p.sh],
      wxIcon: w.icon, wxLabel: w.label, wxC: w.c,
      arr: p.arr.slice(0, 3).map(arrival),
    };
  }).filter(Boolean));

  function openStop(id) {
    buzz();
    selectedStop.value = id;
    router.push({ name: 'map' });
  }

  return { stops, zones, forecast, mapStops, trip, nearby, selectedStop, rainAt, wxInfo, place, chips, openStop };
}
