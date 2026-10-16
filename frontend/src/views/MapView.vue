<script setup>
import { computed, onMounted, ref } from 'vue';
import FeaturePlaceholder from '../components/FeaturePlaceholder.vue';
import MockList from '../components/MockList.vue';
import { getNearbyStops } from '../services/mockService.js';

// OneMap - amanda
import { useTemplateRef } from 'vue'
import OneMap from '../components/OneMap.vue';
const oneMapRef = useTemplateRef('oneMap')

const stops = ref([]);

onMounted(async () => { 
  stops.value = await getNearbyStops();

  // OneMap - amanda
  oneMapRef.value?.initialiseOneMap()
});

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
    summary="Nearby bus and MRT stops on a map. Each stop shows the rain forecast for its area, so you can pick a drier boarding point."
  >
    <MockList :items="rows" />
  </FeaturePlaceholder>

  <!-- OneMap - amanda -->
  <OneMap ref="oneMap" />

</template>
