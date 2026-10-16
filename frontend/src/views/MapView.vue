<script setup>
import { computed, inject } from 'vue';
import { useRouter } from 'vue-router';
import RwMap from '../components/RwMap.vue';
import MapWeatherChip from '../components/MapWeatherChip.vue';
import StopDetail from '../components/map/StopDetail.vue';
import { formatTime, useClock } from '../composables/useClock.js';
import { useRainMap } from '../composables/useRainMap.js';
import { useDepartureRecommendation } from '../composables/useDepartureRecommendation.js';
import { useLiveArrivals } from '../composables/useLiveArrivals.js';
import { useReports } from '../composables/useReports.js';
import { buzz } from '../composables/useToast.js';

const ui = inject('ui');
const router = useRouter();
const { now } = useClock();
const rain = useRainMap();
const trip = useDepartureRecommendation();
const { lineColours } = useLiveArrivals();
const reps = useReports();

const LAYERS = [
  { id: 'rain', label: 'Rain', icon: 'rainy' },
  { id: 'mrt', label: 'MRT', icon: 'train' },
  { id: 'bus', label: 'Bus stops', icon: 'directions_bus' },
  { id: 'route', label: 'Route', icon: 'alt_route' },
];

const active = computed(() => trip.activeRoute.value);

// The newest 3 reports for the open stop.
const stopReports = computed(() => {
  const id = rain.selectedStop.value;
  if (!id) return [];
  return reps.reports.value
    .filter((r) => r.stop === id)
    .sort((a, b) => b.at - a.at)
    .slice(0, 3)
    .map((r) => ({ id: r.id, label: reps.typeOf(r.type).label, icon: reps.typeOf(r.type).icon, ago: reps.ago(r.at), note: r.note, flash: reps.flash.value === r.id }));
});

function pickRoute(id) {
  buzz();
  trip.selectedRoute.value = id;
  if (!rain.layers.value.route) rain.toggleLayer('route');
}

function planFromHere() {
  trip.setTrip(rain.stopDetail.value.name, trip.dest.value);
  router.push({ name: 'home' });
  trip.plan();
}
</script>

<template>
  <RwMap
    mode="full"
    :dark="ui.dark"
    :layers="rain.layers.value"
    :stops="rain.mapStops.value"
    :selected-stop="rain.selectedStop.value"
    :zones="rain.zones.value"
    :route="active?.segs || []"
    :wet-marks="ui.wx !== 'clear' ? active?.wet || [] : []"
    :trip="rain.trip.value"
    :line-colours="lineColours"
    @stop-click="rain.openStop"
    @recenter="rain.closeStop"
  >
    <div class="rw-legend">
      <div><span class="rw-key rw-key-walk"></span>Walking</div>
      <div><span class="rw-key" style="background: #9900AA"></span>MRT</div>
      <div><span class="rw-key" style="background: var(--ink)"></span>Bus</div>
      <div><span class="rw-key-zone"></span>Rain zone</div>
      <div><span class="material-symbols-outlined" style="font-size: 16px; margin: 0 5px">rainy</span>Exposed walk</div>
    </div>
    <MapWeatherChip class="rw-map-wx" :icon="rain.forecast.value?.icon" :text="rain.forecast.value?.chip" :show-explore="false" />
  </RwMap>

  <aside class="rw-panel" aria-label="Map panel">
    <div>
      <div class="rw-mono rw-kicker">Central Singapore · {{ formatTime(now) }}</div>
      <h1 class="rw-title">Map</h1>
    </div>
    <div class="d-flex flex-wrap" style="gap: 6px">
      <button
        v-for="l in LAYERS"
        :key="l.id"
        class="rw-chip"
        :class="{ 'is-on': rain.layers.value[l.id] }"
        :aria-pressed="rain.layers.value[l.id]"
        @click="rain.toggleLayer(l.id)"
      >
        <span class="material-symbols-outlined" style="font-size: 17px" aria-hidden="true">{{ l.icon }}</span>{{ l.label }}
      </button>
    </div>
    <div>
      <div class="rw-overlay-label">Route overlay · {{ trip.origin.value }} to {{ trip.dest.value }}</div>
      <div class="d-flex flex-wrap" style="gap: 6px">
        <button
          v-for="r in trip.routes.value"
          :key="r.id"
          class="rw-chip rw-chip-sm"
          :class="{ 'is-on': trip.selectedRoute.value === r.id }"
          :aria-pressed="trip.selectedRoute.value === r.id"
          @click="pickRoute(r.id)"
        >{{ r.name }}</button>
      </div>
    </div>

    <StopDetail
      v-if="rain.stopDetail.value"
      :key="rain.stopDetail.value.id"
      :stop="rain.stopDetail.value"
      :reports="stopReports"
      :types="reps.types.value"
      @close="rain.closeStop"
      @report="reps.post($event, rain.stopDetail.value.id)"
      @plan="planFromHere"
    />
    <div v-else class="d-flex flex-column" style="gap: 10px">
      <div class="rw-tip">
        <span class="material-symbols-outlined" style="font-size: 21px; color: var(--ink)">touch_app</span>
        Tap a pin on the map, or pick a stop below, for live arrivals, shelter, weather and reports.
      </div>
      <label class="rw-search">
        <span class="material-symbols-outlined" style="font-size: 20px; color: var(--ink3)">search</span>
        <input v-model="rain.stopQuery.value" placeholder="Search stops or stations" aria-label="Search stops">
      </label>
      <div>
        <button v-for="n in rain.stopList.value" :key="n.id" class="rw-stop-row" @click="rain.openStop(n.id)">
          <span class="material-symbols-outlined" style="font-size: 20px; color: var(--ink2)">{{ n.kindIcon }}</span>
          <span class="rw-stop-name">
            <span>{{ n.name }}</span>
            <span v-for="c in n.chips" :key="c.t" class="rw-mono rw-code" :style="{ background: c.bg, color: c.fg }">{{ c.t }}</span>
          </span>
          <span class="rw-stop-wx" :style="{ color: n.wxC }">
            <span class="material-symbols-outlined" style="font-size: 16px">{{ n.wxIcon }}</span>{{ n.wxLabel }}
          </span>
        </button>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.rw-panel {
  position: fixed; z-index: 20; top: 90px; bottom: 96px; left: max(14px, calc(50vw - 590px)); width: 400px;
  background: var(--glassHi); backdrop-filter: blur(32px) saturate(170%); -webkit-backdrop-filter: blur(32px) saturate(170%);
  border: 1px solid var(--glassBd); box-shadow: var(--glassShHi); border-radius: 28px; overflow: auto; padding: 20px;
  display: flex; flex-direction: column; gap: 18px; animation: rwSlide .45s cubic-bezier(.2,.8,.2,1) both;
}
.rw-kicker { font-size: 11.5px; letter-spacing: .08em; text-transform: uppercase; color: var(--ink2); }
.rw-title { margin: 4px 0 0; font-size: 30px; font-weight: 540; letter-spacing: -.03em; }
.rw-chip {
  height: 34px; padding: 0 13px; border-radius: 9999px; border: 1px solid var(--lineS); background: transparent; color: var(--ink);
  font-size: 13px; font-weight: 500; display: flex; align-items: center; gap: 6px; cursor: pointer; transition: all .2s;
}
.rw-chip.is-on { background: var(--solid); color: var(--onSolid); border-color: var(--solid); }
.rw-chip:active { transform: scale(.95); }
.rw-chip-sm { height: 32px; padding: 0 12px; }
.rw-overlay-label { font-size: 12.5px; color: var(--ink3); margin-bottom: 8px; }
.rw-tip { display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-radius: 20px; background: var(--chip); color: var(--ink2); font-size: 13.5px; line-height: 1.4; }
.rw-search { display: flex; align-items: center; gap: 8px; height: 46px; padding: 0 16px; border-radius: 9999px; border: 1px solid var(--line); background: var(--field); margin: 0; }
.rw-search input { flex: 1; border: 0; background: transparent; outline: none; font-size: 15px; color: var(--ink); min-width: 0; }
.rw-stop-row {
  width: 100%; display: flex; align-items: center; gap: 10px; padding: 12px 2px; border: 0; border-top: 1px solid var(--line);
  background: transparent; color: var(--ink); cursor: pointer; text-align: left;
}
.rw-stop-row:first-child { border-top: 0; }
.rw-stop-row:active { opacity: .6; }
.rw-stop-name { flex: 1; min-width: 0; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; font-weight: 500; font-size: 14.5px; }
.rw-code { font-size: 10.5px; font-weight: 500; padding: 2px 6px; border-radius: 9999px; }
.rw-stop-wx { display: flex; align-items: center; gap: 3px; font-size: 12px; }

.rw-legend {
  position: absolute; z-index: 500; right: max(14px, calc(50vw - 590px)); bottom: 96px;
  background: var(--glassHi); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border: 1px solid var(--glassBd);
  box-shadow: var(--glassSh); border-radius: 22px; padding: 12px 16px; display: flex; flex-direction: column; gap: 7px; font-size: 12px; font-weight: 500;
}
.rw-legend > div { display: flex; align-items: center; gap: 8px; }
.rw-key { width: 26px; height: 5px; border-radius: 9999px; }
.rw-key-walk { height: 0; border-top: 3px dotted var(--ink); border-radius: 0; }
.rw-key-zone { width: 14px; height: 14px; border-radius: 50%; background: var(--rain); opacity: .35; margin: 0 6px; }
.rw-map-wx { left: calc(max(14px, calc(50vw - 590px)) + 418px); bottom: 96px; }

@media (max-width: 879px) {
  .rw-panel { top: auto; left: 12px; right: 12px; bottom: 90px; width: auto; max-height: 48vh; }
  .rw-legend, .rw-map-wx { display: none; }
}
</style>
