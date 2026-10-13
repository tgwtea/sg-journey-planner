<script setup>
import { computed, onMounted, ref } from 'vue';
import FeaturePlaceholder from '../components/FeaturePlaceholder.vue';
import MockList from '../components/MockList.vue';
import { getAlerts, getSavedRoutes } from '../services/mockService.js';

const saved = ref([]);
const alerts = ref([]);
onMounted(async () => {
  [saved.value, alerts.value] = await Promise.all([getSavedRoutes(), getAlerts()]);
});

const alertRows = computed(() => alerts.value.map((a) => ({ id: a.id, icon: a.icon, title: a.title, sub: a.body, meta: a.when })));
const savedRows = computed(() => saved.value.map((r) => ({ id: r.id, icon: 'bookmark', title: r.name, sub: `${r.from} to ${r.to}`, meta: `${r.when} · ${r.dur}` })));
</script>

<template>
  <div class="row g-4">
    <div class="col-12 col-lg-5">
      <FeaturePlaceholder
        title="Forecast alerts"
        icon="notifications"
        owner="Woody"
        summary="RouteWise warns you when rain is forecast near the usual time of a saved trip."
      >
        <MockList :items="alertRows" />
      </FeaturePlaceholder>
    </div>
    <div class="col-12 col-lg-7">
      <FeaturePlaceholder
        title="Saved routes"
        icon="bookmark"
        owner="Woody"
        summary="For habitual trips. Save a route and its usual time."
      >
        <MockList :items="savedRows" />
      </FeaturePlaceholder>
    </div>
  </div>
</template>
