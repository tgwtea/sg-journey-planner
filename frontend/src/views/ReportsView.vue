<script setup>
import { computed, onMounted, ref } from 'vue';
import FeaturePlaceholder from '../components/FeaturePlaceholder.vue';
import MockList from '../components/MockList.vue';
import { getReports, getReportTypes } from '../services/mockService.js';

const reports = ref([]);
const types = ref([]);
onMounted(async () => {
  [reports.value, types.value] = await Promise.all([getReports(), getReportTypes()]);
});

const ago = (sec) => (sec < 3600 ? `${Math.max(1, Math.round(sec / 60))} min ago` : `${Math.round(sec / 3600)} h ago`);
const rows = computed(() => reports.value.map((r) => {
  const t = types.value.find((x) => x.id === r.type) || {};
  return { id: r.id, icon: t.icon, title: `${t.label || r.type} at ${r.stop}`, sub: r.note, meta: ago(r.ageSec) };
}));
</script>

<template>
  <FeaturePlaceholder
    title="Community reports"
    icon="forum"
    summary="From commuters on the ground. Quick reports for a stop or station. Newest first."
  >
    <div class="d-flex flex-wrap gap-2 mb-3">
      <span v-for="t in types" :key="t.id" class="rw-pill">
        <span class="material-symbols-outlined" style="font-size: 18px">{{ t.icon }}</span>{{ t.label }}
      </span>
    </div>
    <MockList :items="rows" />
  </FeaturePlaceholder>
</template>
