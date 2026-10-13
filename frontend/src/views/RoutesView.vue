<script setup>
import { computed, onMounted, ref } from 'vue';
import FeaturePlaceholder from '../components/FeaturePlaceholder.vue';
import MockList from '../components/MockList.vue';
import { getRouteOptions } from '../services/mockService.js';

const options = ref([]);
onMounted(async () => { options.value = await getRouteOptions(); });

const rows = computed(() => options.value.map((r) => ({
  id: r.id,
  icon: 'alt_route',
  title: r.name,
  sub: `${r.via} · ${r.tr} transfer(s) · ${r.walk} m walk · ${r.exp} min exposed`,
  meta: `${r.dur} min · ${r.fare}`,
})));
</script>

<template>
  <FeaturePlaceholder
    title="Compare routes"
    icon="alt_route"
    summary="Every option side by side: time, transfers, walking, live departures, rain exposure and comfort."
  >
    <MockList :items="rows" />
  </FeaturePlaceholder>
</template>
