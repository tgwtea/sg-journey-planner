<script setup>
import { computed } from 'vue';
import { useTour } from '../composables/useTour.js';

const tour = useTour();
const { step, active, current, total } = tour;
const isLast = computed(() => step.value === total - 1);
</script>

<template>
  <div v-if="active" :key="step" role="dialog" aria-label="Guided tour" class="rw-tour">
    <div class="d-flex align-items-center" style="gap: 10px">
      <span class="rw-mono rw-idx">{{ step + 1 }} / {{ total }}</span>
      <div class="d-flex flex-grow-1" style="gap: 3px">
        <span v-for="i in total" :key="i" class="rw-dot" :class="{ 'is-on': i - 1 <= step }"></span>
      </div>
      <button class="rw-close" aria-label="End tour" @click="tour.exit()">
        <span class="material-symbols-outlined" style="font-size: 19px">close</span>
      </button>
    </div>
    <div class="rw-title">{{ current.title }}</div>
    <div class="rw-body">{{ current.body }}</div>
    <div class="d-flex justify-content-end" style="gap: 8px; margin-top: 16px">
      <button class="rw-back" @click="tour.back()">Back</button>
      <button class="rw-next" @click="tour.next()">
        {{ isLast ? 'Finish' : 'Next' }}<span class="material-symbols-outlined" style="font-size: 19px">arrow_forward</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.rw-tour {
  position: fixed; z-index: 70; right: max(14px, calc(50vw - 590px)); bottom: 96px; width: 380px;
  background: var(--glassHi); backdrop-filter: blur(32px) saturate(170%); -webkit-backdrop-filter: blur(32px) saturate(170%);
  color: var(--ink); border-radius: 28px; padding: 20px; box-shadow: var(--glassShHi); border: 1px solid var(--glassBd);
  animation: rwUp .35s cubic-bezier(.2,.8,.2,1) both;
}
.rw-idx { font-size: 12px; color: var(--ink2); }
.rw-dot { flex: 1; height: 3px; border-radius: 9999px; background: var(--lineS); transition: background .3s; }
.rw-dot.is-on { background: var(--ink); }
.rw-close { width: 32px; height: 32px; border-radius: 50%; border: 0; background: transparent; color: var(--ink2); cursor: pointer; display: grid; place-items: center; }
.rw-title { font-size: 20px; font-weight: 560; letter-spacing: -.02em; margin-top: 10px; }
.rw-body { font-size: 14.5px; line-height: 1.5; color: var(--ink2); margin-top: 6px; text-wrap: pretty; }
.rw-back { height: 42px; padding: 0 16px; border-radius: 9999px; border: 1px solid var(--lineS); background: transparent; color: var(--ink); font-weight: 500; font-size: 14px; cursor: pointer; }
.rw-next {
  height: 42px; padding: 0 18px; border-radius: 9999px; border: 0; background: var(--solid); color: var(--onSolid);
  font-weight: 560; font-size: 14px; cursor: pointer; display: flex; align-items: center; gap: 6px;
}
.rw-next:active { transform: scale(.95); }
@media (max-width: 879px) {
  .rw-tour { left: 12px; right: 12px; bottom: 90px; width: auto; }
}
</style>
