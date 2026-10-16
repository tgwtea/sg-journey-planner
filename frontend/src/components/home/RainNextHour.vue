<script setup>
import { computed } from 'vue';
import GlassCard from '../GlassCard.vue';

// Rain chance for the next 60 minutes, in 12 bars of 5 minutes.
const props = defineProps({
  summary: { type: String, default: '' },
  bars: { type: Array, default: () => [] }, // percentages
});

const view = computed(() => props.bars.map((v) => ({
  h: `${Math.max(4, v * 0.44)}px`,
  c: v >= 60 ? 'var(--barHi)' : v >= 25 ? 'var(--barMid)' : 'var(--lineS)',
})));
const ariaLabel = computed(() => (props.bars.length
  ? `Rain chance next hour: starts at ${props.bars[0]}%, ends at ${props.bars[props.bars.length - 1]}%`
  : 'Rain chance next hour'));
</script>

<template>
  <GlassCard title="Rain · next 60 min" icon="water_drop">
    <p class="rw-summary">{{ summary }}</p>
    <div class="rw-bars" role="img" :aria-label="ariaLabel">
      <div v-for="(b, i) in view" :key="i" class="rw-bar" :style="{ height: b.h, background: b.c }"></div>
    </div>
    <div class="rw-mono rw-scale"><span>Now</span><span>+30</span><span>+60 min</span></div>
  </GlassCard>
</template>

<style scoped>
.rw-summary { font-size: 15.5px; line-height: 1.45; margin: 0; text-wrap: pretty; }
.rw-bars { display: flex; align-items: flex-end; justify-content: space-between; gap: 4px; height: 44px; margin-top: 16px; }
.rw-bar { width: 8px; flex: none; border-radius: 9999px; transition: height .8s cubic-bezier(.2,.8,.2,1), background .8s; }
.rw-scale { display: flex; justify-content: space-between; font-size: 11px; color: var(--ink3); margin-top: 8px; }
</style>
