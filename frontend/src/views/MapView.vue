<script setup>
import { computed, onMounted, ref } from 'vue';
import FeaturePlaceholder from '../components/FeaturePlaceholder.vue';
import MockList from '../components/MockList.vue';
import { getNearbyStops } from '../services/mockService.js';

const stops = ref([]);
onMounted(async () => { stops.value = await getNearbyStops(); });

const shelter = ['Unsheltered', 'Partly sheltered', 'Sheltered'];
const rows = computed(() => stops.value.map((s) => ({
  id: s.id,
  icon: s.kind === 'mrt' ? 'train' : 'directions_bus',
  title: s.name,
  sub: s.note,
  meta: `${s.code} · ${shelter[s.sh]}`,
})));
</script>

<template>
  <FeaturePlaceholder
    title="Rain-aware map"
    icon="map"
    owner="Dillon"
    summary="Nearby bus and MRT stops on a map. Each stop shows the rain forecast for its area, so you can pick a drier boarding point."
  >
    <MockList :items="rows" />
  </FeaturePlaceholder>
</template>
