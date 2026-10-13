<script setup>
import { computed, inject, onMounted, ref, watch } from 'vue';
import WeatherHero from '../components/WeatherHero.vue';
import GlassCard from '../components/GlassCard.vue';
import FeaturePlaceholder from '../components/FeaturePlaceholder.vue';
import MockList from '../components/MockList.vue';
import { useWeather } from '../composables/useWeather.js';
import { getNearbyStops } from '../services/mockService.js';

const ui = inject('ui');

// "Bras Basah" in the mockup is not a forecast area. "City" is the nearest one.
const { area, status, weather, errorMessage, refresh } = useWeather('City');

// When live data arrives, let it drive the sky look.
watch(
  () => weather.value?.condition,
  (condition) => {
    if (condition) ui.wx = condition;
  },
);

// Mock data until transport fixtures exist.
const stops = ref([]);
onMounted(async () => { stops.value = (await getNearbyStops()).slice(0, 3); });

onMounted(refresh);
const nearbyRows = computed(() => stops.value.map((s) => ({
  id: s.id, icon: s.kind === 'mrt' ? 'train' : 'directions_bus', title: s.name, sub: s.note, meta: s.code,
})));

const details = computed(() => {
  const w = weather.value;
  if (!w) return '';
  const parts = [];
  if (w.validPeriod) parts.push(`Forecast ${w.validPeriod}`);
  if (w.rainfallMm != null) parts.push(`${w.rainfallMm} mm rain (5 min)`);
  return parts.join('  ·  ');
});
</script>

<template>
  <div class="d-flex flex-column gap-4">
    <WeatherHero
      :status="status"
      :area="area"
      :temperature="weather?.temperatureC ?? null"
      :forecast="weather?.forecast || ''"
      :condition="weather?.condition || ui.wx"
      :details="details"
      :updated-at="weather?.updatedAt || ''"
      :error-message="errorMessage"
      @refresh="refresh"
    />

    <GlassCard title="Rain · next 60 min" icon="water_drop">
      <p class="rw-copy">
        Rain information for your area shows here. The rain chart from the mockup needs a
        near-term rain source. See docs/WEATHER_API.md.
      </p>
    </GlassCard>

    <FeaturePlaceholder
      title="Smart departure"
      icon="schedule"
      owner="Tan Guan Wei"
      summary="Enter an origin and a destination. RouteWise recommends whether to leave now or wait, and shows the main reason."
    >
      <MockList :items="nearbyRows" />
    </FeaturePlaceholder>
  </div>
</template>

<style scoped>
.rw-copy { font-size: 15.5px; line-height: 1.45; margin: 0; color: var(--ink2); }
</style>
