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
//   closeStop()
//   layers        ref({ rain, mrt, bus, route }), toggleLayer(id)
//   stopQuery     ref(''), stopList computed([...]) search results for the Map panel
//   stopDetail    computed(null | { id, name, kindIcon, kindLabel, chips, wxIcon, wxLabel, shIcon, shLabel, note, arr: [...] })
// Shared map, stop, and weather data used by the Home and Map screens.

import { computed, ref, watch } from 'vue';
import router from '../router';
import { useWeatherMode } from './useWeatherMode.js';
import { useLiveArrivals } from './useLiveArrivals.js';
import { buzz } from './useToast.js';
import { useTour } from './useTour.js';
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
const layers = ref({ rain: true, mrt: true, bus: true, route: true });
const stopQuery = ref('');
const userLoc = ref(null);
const locationStatus = ref('idle');
const locationError = ref('');
let loaded = false;

const LOAD_LABELS = ['Seats available', 'Seats available', 'Standing', 'Limited standing'];
const LOAD_COLOURS = ['var(--lineS)', 'var(--lineS)', 'var(--ink2)', 'var(--ink)'];
const NEARBY_COUNT = 8;
const NEARBY_RADIUS_M = 2500;

// Distance in metres between two points (haversine).
function metres(lat1, lng1, lat2, lng2) {
  const earthRadius = 6371000;
  const degreesToRadians = Math.PI / 180;
  const latitude1 = lat1 * degreesToRadians;
  const latitude2 = lat2 * degreesToRadians;
  const latitudeDifference = (lat2 - lat1) * degreesToRadians;
  const longitudeDifference = (lng2 - lng1) * degreesToRadians;

  const distancePart = Math.sin(latitudeDifference / 2) ** 2
    + Math.cos(latitude1) * Math.cos(latitude2)
    * Math.sin(longitudeDifference / 2) ** 2;

  return 2 * earthRadius * Math.asin(Math.sqrt(distancePart));
}

function formatDistance(distance) {
  if (distance < 1000) {
    return `${Math.round(distance / 10) * 10} m`;
  }
  return `${(distance / 1000).toFixed(1)} km`;
}

export function useRainMap() {
  const { wx, mode, live } = useWeatherMode();
  const { lineColours, arrival, label } = useLiveArrivals();

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
    if (wx.value !== 'clear') return { label: 'Cloudy', icon: 'cloud', c: 'var(--ink2)' };
    return { label: 'Fair', icon: 'sunny', c: 'var(--ink2)' };
  }

  function setLocation(lat, lng) {
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
      locationStatus.value = 'error';
      locationError.value = 'The selected location is invalid.';
      return false;
    }
    userLoc.value = { lat, lng };
    locationStatus.value = 'located';
    locationError.value = '';
    return true;
  }

  function locate() {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      locationStatus.value = 'unavailable';
      locationError.value = 'Location is not available in this browser.';
      return Promise.resolve(false);
    }

    locationStatus.value = 'loading';
    locationError.value = '';
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          resolve(setLocation(latitude, longitude));
        },
        (error) => resolve(handleLocationError(error)),
        { timeout: 8000, maximumAge: 60000 },
      );
    });
  }

  function handleLocationError(error) {
    if (error.code === error.PERMISSION_DENIED) {
      locationStatus.value = 'denied';
      locationError.value = 'Location permission was denied.';
    } else {
      locationStatus.value = 'error';
      locationError.value = 'Could not determine your location.';
    }
    return false;
  }

  function place(id) {
    return stops.value.find((stop) => stop.id === id)
      || extra.value.find((stop) => stop.id === id);
  }

  function chips(p) {
    if (p.codes?.length) {
      return p.codes.map(([l, t]) => ({ t, bg: lineColours.value[l]?.[0], fg: lineColours.value[l]?.[1] }));
    }
    return [{ t: p.code, bg: 'var(--chip)', fg: 'var(--ink)' }];
  }

  const mapStops = computed(() => stops.value.map((stop) => ({
    id: stop.id,
    name: stop.name,
    kind: stop.kind,
    lat: stop.lat,
    lng: stop.lng,
    wet: Boolean(rainAt(stop.lat, stop.lng)),
    big: (stop.codes?.length || 0) > 1,
  })));

  const nearby = computed(() => {
    const nearbyStops = [];
    for (const nearbyStop of nearbyDefs.value) {
      const stop = place(nearbyStop.id);
      if (stop) nearbyStops.push(describe(stop, nearbyStop.dist));
    }
    return nearbyStops;
  });

  function describe(p, dist) {
    const w = wxInfo(rainAt(p.lat, p.lng));
    const shelter = p.sh ?? 0;
    return {
      id: p.id, name: p.name, chips: chips(p), dist,
      shIcon: SHELTER_ICONS[shelter], shLabel: SHELTER_LABELS[shelter],
      wxIcon: w.icon, wxLabel: w.label, wxC: w.c,
      arr: (p.arr || []).slice(0, 3).map(arrival),
    };
  }

  const nearbyStops = computed(() => {
    if (!userLoc.value) return nearby.value;
    const nearbyStops = [];
    const latitude = userLoc.value.lat;
    const longitude = userLoc.value.lng;

    for (const stop of stops.value) {
      const distance = metres(latitude, longitude, stop.lat, stop.lng);
      if (distance <= NEARBY_RADIUS_M) {
        nearbyStops.push({ stop, distance });
      }
    }

    nearbyStops.sort((first, second) => first.distance - second.distance);
    return nearbyStops
      .slice(0, NEARBY_COUNT)
      .map(({ stop, distance }) => describe(stop, formatDistance(distance)));
  });

  function weatherAt(lat, lng) {
    const level = rainAt(lat, lng);
    const current = mode.value === 'live' ? live.weather.value : null;
    const weatherInfo = wxInfo(level);

    return {
      ...weatherInfo,
      level,
      condition: current?.condition || wx.value,
      forecast: current?.forecast || null,
      area: current?.area || null,
      validPeriod: current?.validPeriod || null,
      updatedAt: current?.updatedAt || null,
      forecastSource: current ? 'data.gov.sg' : 'demo',
      rainSource: 'demo-zones',
    };
  }

  const stopList = computed(() => {
    const q = stopQuery.value.trim().toLowerCase();
    return stops.value
      .filter((stop) => !q || stop.name.toLowerCase().includes(q))
      .map((stop) => {
        const weatherInfo = wxInfo(rainAt(stop.lat, stop.lng));
        const kindIcon = stop.kind === 'bus' ? 'directions_bus' : 'train';
        return {
          id: stop.id,
          name: stop.name,
          chips: chips(stop),
          kindIcon,
          wxIcon: weatherInfo.icon,
          wxLabel: weatherInfo.label,
          wxC: weatherInfo.c,
        };
      });
  });

  const stopDetail = computed(() => {
    const stop = selectedStop.value && place(selectedStop.value);
    if (!stop || stop.lat == null) return null;
    const weatherInfo = wxInfo(rainAt(stop.lat, stop.lng));

    return {
      id: stop.id,
      name: stop.name,
      kindIcon: stop.kind === 'bus' ? 'directions_bus' : 'train',
      kindLabel: stop.kind === 'bus' ? 'Bus stop' : 'MRT station',
      chips: chips(stop),
      wxIcon: weatherInfo.icon,
      wxLabel: weatherInfo.label,
      shIcon: SHELTER_ICONS[stop.sh ?? 0],
      shLabel: SHELTER_LABELS[stop.sh ?? 0],
      note: stop.note || '',
      arr: (stop.arr || []).map((arrivalInfo) => {
        const nextArrival = arrival(arrivalInfo);
        return {
          ...nextArrival,
          d: arrivalInfo.d,
          t2: label(nextArrival.sec + arrivalInfo.p),
          load: LOAD_LABELS[arrivalInfo.l],
          loadC: LOAD_COLOURS[arrivalInfo.l],
        };
      }),
    };
  });

  if (!loaded) {
    loaded = true;
    // Tour step 6 opens Dhoby Ghaut. Step 5 shows the whole map.
    watch(useTour().step, (step) => {
      if (step === 5) selectedStop.value = null;
      if (step === 6) selectedStop.value = 'dhoby';
    });

    Promise.all([
      getStops(),
      getExtraPlaces(),
      getRainZones(),
      getNearbyStops(),
      getTripPoints(),
      getWeatherCopy(),
    ]).then(([loadedStops, loadedPlaces, loadedZones, loadedNearby, loadedTrip, loadedWeather]) => {
      stops.value = loadedStops;
      extra.value = loadedPlaces;
      zonesByWx.value = loadedZones;
      nearbyDefs.value = loadedNearby;
      trip.value = loadedTrip;
      copyByWx.value = loadedWeather;
    });

    locate();
  }

  function toggleLayer(id) {
    buzz();
    layers.value = { ...layers.value, [id]: !layers.value[id] };
  }

  function openStop(id) {
    buzz();
    selectedStop.value = id;
    router.push({ name: 'map' });
  }

  return {
    stops, zones, forecast, mapStops, trip, nearby: nearbyStops, selectedStop, layers, stopQuery, stopList, stopDetail,
    userLoc, locationStatus, locationError,
    rainAt, weatherAt, wxInfo, place, chips, openStop, toggleLayer, locate, setLocation,
    closeStop: () => { selectedStop.value = null; },
  };
}
