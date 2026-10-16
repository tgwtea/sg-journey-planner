<script setup>
import GlassCard from '../GlassCard.vue';

// Nearby stops with shelter, weather, and the next 3 arrivals. Presentational only.
defineProps({
  // [{ id, name, chips, dist, shIcon, shLabel, wxIcon, wxLabel, wxC, arr: [{ svc, bg, fg, t, now }] }]
  stops: { type: Array, default: () => [] },
});
defineEmits(['open-stop', 'open-map']);
</script>

<template>
  <GlassCard title="Nearby stops" icon="near_me" flush>
    <template #actions>
      <button class="rw-head-link" @click="$emit('open-map')">
        Open map<span class="material-symbols-outlined" style="font-size: 17px">arrow_forward</span>
      </button>
    </template>
    <button v-for="n in stops" :key="n.id" class="rw-row" @click="$emit('open-stop', n.id)">
      <div style="min-width: 0">
        <div class="d-flex align-items-center flex-wrap" style="gap: 6px">
          <span class="rw-name">{{ n.name }}</span>
          <span v-for="c in n.chips" :key="c.t" class="rw-mono rw-code" :style="{ background: c.bg, color: c.fg }">{{ c.t }}</span>
        </div>
        <div class="rw-meta">
          <span>{{ n.dist }}</span>
          <span class="d-flex align-items-center" style="gap: 3px">
            <span class="material-symbols-outlined" style="font-size: 15px">{{ n.shIcon }}</span>{{ n.shLabel }}
          </span>
          <span class="d-flex align-items-center" :style="{ gap: '3px', color: n.wxC }">
            <span class="material-symbols-outlined" style="font-size: 15px">{{ n.wxIcon }}</span>{{ n.wxLabel }}
          </span>
        </div>
      </div>
      <div class="d-flex" style="gap: 6px">
        <div v-for="(a, i) in n.arr" :key="i" class="rw-arr">
          <span class="rw-svc" :style="{ background: a.bg, color: a.fg }">{{ a.svc }}</span>
          <span class="rw-mono rw-arr-t" :class="{ 'is-now': a.now }">{{ a.t }}</span>
        </div>
      </div>
    </button>
  </GlassCard>
</template>

<style scoped>
.rw-row {
  width: 100%; display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 12px; align-items: center; text-align: left;
  padding: 14px 0; border: 0; border-top: 1px solid var(--line); background: transparent; color: var(--ink); cursor: pointer;
}
.rw-row:active { opacity: .6; }
.rw-name { font-weight: 560; font-size: 15.5px; }
.rw-code { font-size: 10.5px; font-weight: 500; padding: 2px 6px; border-radius: 9999px; }
.rw-meta { display: flex; align-items: center; gap: 12px; margin-top: 5px; font-size: 12.5px; color: var(--ink2); flex-wrap: wrap; }
.rw-arr { display: flex; flex-direction: column; align-items: center; gap: 4px; min-width: 44px; }
.rw-svc { font-size: 11px; font-weight: 560; padding: 2px 7px; border-radius: 9999px; }
.rw-arr-t { font-size: 12.5px; font-weight: 430; }
.rw-arr-t.is-now { font-weight: 600; animation: rwBlink 1s infinite; }
</style>
