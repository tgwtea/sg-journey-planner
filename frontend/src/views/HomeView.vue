<script setup>
import { computed, inject } from 'vue';
import { useRouter } from 'vue-router';
import WeatherHero from '../components/WeatherHero.vue';
import RwMap from '../components/RwMap.vue';
import MapWeatherChip from '../components/MapWeatherChip.vue';
import RainNextHour from '../components/home/RainNextHour.vue';
import DepartureCard from '../components/home/DepartureCard.vue';
import JourneyPlanner from '../components/home/JourneyPlanner.vue';
import NearbyStops from '../components/home/NearbyStops.vue';
import PreviewList from '../components/home/PreviewList.vue';
import { formatTime, useClock } from '../composables/useClock.js';
import { useWeatherMode } from '../composables/useWeatherMode.js';
import { useDepartureRecommendation } from '../composables/useDepartureRecommendation.js';
import { useRainMap } from '../composables/useRainMap.js';
import { useLiveArrivals } from '../composables/useLiveArrivals.js';
import { useSavedRoutes } from '../composables/useSavedRoutes.js';
import { useReports } from '../composables/useReports.js';

const ui = inject('ui');
const router = useRouter();
const { now } = useClock();
const { mode, live } = useWeatherMode();
const trip = useDepartureRecommendation();
const rain = useRainMap();
const { lineColours } = useLiveArrivals();
const { shortList } = useSavedRoutes();
const { preview } = useReports();

// Hero: live data in Live mode, demo copy when the header switch overrides it.
const isLive = computed(() => mode.value === 'live');
const greeting = computed(() => {
  const h = now.value.getHours();
  const part = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  const tail = { heavy: 'Bring an umbrella.', light: 'It is a bit drizzly out.', clear: 'The weather is steady today.' }[ui.wx];
  return `${part}. ${tail}`;
});
const liveDetails = computed(() => {
  const w = live.weather.value;
  if (!w) return '';
  const parts = [];
  if (w.validPeriod) parts.push(`Forecast ${w.validPeriod}`);
  if (w.rainfallMm != null) parts.push(`${w.rainfallMm} mm rain (5 min)`);
  return parts.join('  ·  ');
});
const hero = computed(() => {
  const f = rain.forecast.value;
  if (isLive.value || !f) {
    return {
      status: live.status.value,
      temperature: live.weather.value?.temperatureC ?? null,
      forecast: live.weather.value?.forecast || '',
      condition: live.weather.value?.condition || ui.wx,
      details: liveDetails.value,
      updatedAt: live.weather.value?.updatedAt || '',
      label: '',
    };
  }
  return {
    status: 'success',
    temperature: parseInt(f.temp, 10),
    forecast: f.title,
    condition: ui.wx,
    details: f.hl,
    updatedAt: '',
    label: `Demo · ${formatTime(now.value)}`,
  };
});

const routeLabel = computed(() => `${trip.origin.value} to ${trip.dest.value}`);

const savedItems = computed(() => shortList.value.map((r) => ({ id: r.id, icon: r.icon, title: r.label, sub: r.when, route: r.route })));
const reportItems = computed(() => preview.value.map((r) => ({ id: r.id, icon: r.icon, title: `${r.label} at ${r.stopName}`, sub: r.ago })));

function planSaved(item) {
  trip.setTrip(item.route.from, item.route.to);
  trip.plan();
}
</script>

<template>
  <div class="rw-home">
    <WeatherHero
      :status="hero.status"
      :area="live.area"
      :temperature="hero.temperature"
      :forecast="hero.forecast"
      :condition="hero.condition"
      :details="hero.details"
      :updated-at="hero.updatedAt"
      :error-message="live.errorMessage.value"
      :label="hero.label"
      :note="greeting"
      @refresh="live.refresh"
    />

    <RainNextHour :summary="rain.forecast.value?.sub || ''" :bars="rain.forecast.value?.bars || []" />

    <DepartureCard
      :analysing="trip.analysing.value"
      :route-label="routeLabel"
      :advice="trip.advice.value"
      :remind="trip.remind.value"
      :route-count="trip.routes.value.length || 4"
      @compare="router.push({ name: 'routes' })"
      @toggle-remind="trip.toggleRemind"
    />

    <JourneyPlanner
      :origin="trip.origin.value"
      :dest="trip.dest.value"
      :when="trip.when.value"
      :dest-options="trip.destOptions"
      :when-options="trip.whenOptions"
      @update:origin="trip.origin.value = $event"
      @update:dest="trip.setDest"
      @update:when="trip.setWhen"
      @swap="trip.swap"
      @plan="trip.plan"
    />

    <RwMap
      :dark="ui.dark"
      :stops="rain.mapStops.value"
      :zones="rain.zones.value"
      :route="trip.activeRoute.value?.segs || []"
      :wet-marks="ui.wx !== 'clear' ? trip.activeRoute.value?.wet || [] : []"
      :trip="rain.trip.value"
      :line-colours="lineColours"
      @stop-click="rain.openStop"
    >
      <MapWeatherChip
        :icon="rain.forecast.value?.icon"
        :text="rain.forecast.value?.chip"
        @explore="router.push({ name: 'map' })"
      />
    </RwMap>

    <NearbyStops :stops="rain.nearby.value" @open-stop="rain.openStop" @open-map="router.push({ name: 'map' })" />

    <div class="rw-pair">
      <PreviewList title="Saved" icon="bookmark" :items="savedItems" clickable @all="router.push({ name: 'saved' })" @pick="planSaved" />
      <PreviewList title="Reports" icon="forum" :items="reportItems" round-icon @all="router.push({ name: 'reports' })" />
    </div>
  </div>
</template>

<style scoped>
.rw-home { display: flex; flex-direction: column; gap: 20px; animation: rwIn .5s ease both; }
.rw-pair { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
</style>
