<script setup>
import GlassCard from './GlassCard.vue';
import MockBadge from './MockBadge.vue';

// Card for a screen that a team member still has to build.
// The default slot holds a simple preview of the mock data.
defineProps({
  title: { type: String, required: true },
  icon: { type: String, default: 'construction' },
  owner: { type: String, required: true },
  summary: { type: String, required: true },
  mock: { type: Boolean, default: true },
});
</script>

<template>
  <GlassCard :title="title" :icon="icon">
    <template v-if="mock" #actions><MockBadge /></template>
    <p class="rw-summary">{{ summary }}</p>
    <div v-if="$slots.default" class="rw-preview"><slot /></div>
    <p class="rw-owner rw-mono">Owner · {{ owner }}</p>
  </GlassCard>
</template>

<style scoped>
.rw-summary { font-size: 15.5px; line-height: 1.45; margin: 0; text-wrap: pretty; }
.rw-preview { margin-top: 14px; }
.rw-owner { font-size: 11.5px; letter-spacing: .06em; text-transform: uppercase; color: var(--ink3); margin: 14px 0 0; }
</style>
