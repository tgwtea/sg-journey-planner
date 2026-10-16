<script setup>
import { computed, inject, onMounted, ref } from 'vue';
import FeaturePlaceholder from '../components/FeaturePlaceholder.vue';
import MockList from '../components/MockList.vue';
import RwMap from '../components/RwMap.vue';
import { getLineColours, getRainZones, getRouteOptions, getStops, getTripPoints } from '../services/mockService.js';

const ui = inject('ui');

const stops = ref([]);
const zonesByWx = ref({});
const routes = ref([]);
const trip = ref(null);
const lineColours = ref({});
const selected = ref(null);
onMounted(async () => {
  [stops.value, zonesByWx.value, routes.value, trip.value, lineColours.value] = await Promise.all([
    getStops(), getRainZones(), getRouteOptions(), getTripPoints(), getLineColours(),
  ]);
});

const mapStops = computed(() => stops.value.map((s) => ({ ...s, big: (s.codes?.length || 0) > 1 })));
const zones = computed(() => zonesByWx.value[ui.wx] || []);
const firstRoute = computed(() => routes.value[0] || null);

const shelter = ['Unsheltered', 'Partly sheltered', 'Sheltered'];
const rows = computed(() => stops.value.map((s) => ({
  id: s.id,
  icon: s.kind === 'mrt' ? 'train' : 'directions_bus',
  title: s.name,
  sub: s.note,
  meta: `${s.code || s.codes.map((c) => c[1]).join(' / ')} · ${shelter[s.sh]}`,
})));
</script>

<template>
  <RwMap
    mode="full"
    :dark="ui.dark"
    :stops="mapStops"
    :selected-stop="selected"
    :zones="zones"
    :route="firstRoute?.segs || []"
    :wet-marks="ui.wx !== 'clear' ? firstRoute?.wet || [] : []"
    :trip="trip"
    :line-colours="lineColours"
    @stop-click="selected = $event"
    @recenter="selected = null"
  />
  <div class="rw-map-panel">
    <FeaturePlaceholder
      title="Rain-aware map"
      icon="map"
      summary="Nearby bus and MRT stops on a map. Each stop shows the rain forecast for its area, so you can pick a drier boarding point."
    >
      <MockList :items="rows" />
    </FeaturePlaceholder>
  </div>
</template>

<style scoped>
.rw-map-panel { position: relative; z-index: 2; width: 400px; max-width: 100%; max-height: calc(100vh - 220px); overflow: auto; border-radius: 28px; }
</style>
