<script setup>
import GlassCard from '../GlassCard.vue';

// Origin, destination, departure time, and the Plan route button. Presentational only.
defineProps({
  origin: { type: String, default: '' },
  dest: { type: String, default: '' },
  when: { type: String, default: 'now' },
  destOptions: { type: Array, default: () => [] },
  whenOptions: { type: Array, default: () => [] },
});
defineEmits(['update:origin', 'update:dest', 'update:when', 'swap', 'plan']);
</script>

<template>
  <GlassCard title="Plan a journey" icon="route">
    <template #actions><span class="rw-modes">Bus · MRT · walking</span></template>
    <div class="rw-fields">
      <div class="d-flex flex-column" style="gap: 8px">
        <label class="rw-field">
          <span class="rw-from-dot"></span>
          <span class="rw-field-label">From</span>
          <input :value="origin" aria-label="Origin" @change="$emit('update:origin', $event.target.value)">
          <span class="material-symbols-outlined rw-field-icon" title="Use my location">my_location</span>
        </label>
        <label class="rw-field">
          <span class="rw-to-dot"></span>
          <span class="rw-field-label">To</span>
          <input :value="dest" aria-label="Destination" placeholder="Where to?" @change="$emit('update:dest', $event.target.value)">
        </label>
      </div>
      <button class="rw-swap" aria-label="Swap origin and destination" @click="$emit('swap')">
        <span class="material-symbols-outlined" style="font-size: 22px">swap_vert</span>
      </button>
    </div>

    <div class="rw-popular">
      <span class="rw-popular-label">Popular</span>
      <button
        v-for="d in destOptions"
        :key="d"
        class="rw-dest-chip"
        :class="{ 'is-on': dest === d }"
        @click="$emit('update:dest', d)"
      >{{ d }}</button>
    </div>

    <div class="rw-bottom">
      <div class="rw-when">
        <button
          v-for="w in whenOptions"
          :key="w.id"
          :aria-pressed="when === w.id"
          :class="{ 'is-on': when === w.id }"
          @click="$emit('update:when', w.id)"
        >{{ w.label }}</button>
      </div>
      <div class="flex-grow-1"></div>
      <button class="rw-plan" @click="$emit('plan')">
        Plan route<span class="material-symbols-outlined" style="font-size: 21px">arrow_forward</span>
      </button>
    </div>
  </GlassCard>
</template>

<style scoped>
.rw-modes { text-transform: none; letter-spacing: 0; color: var(--ink3); font-weight: 430; font-size: 13px; }
.rw-fields { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 10px; align-items: center; }
.rw-field {
  display: flex; align-items: center; gap: 12px; background: var(--field); border: 1px solid var(--line);
  border-radius: 9999px; padding: 0 18px; height: 52px; margin: 0;
}
.rw-field input { flex: 1; border: 0; background: transparent; font-size: 16px; font-weight: 500; color: var(--ink); outline: none; min-width: 0; }
.rw-from-dot { width: 11px; height: 11px; border-radius: 50%; border: 2px solid var(--ink); flex: none; }
.rw-to-dot { width: 11px; height: 11px; border-radius: 3px; background: var(--ink); flex: none; }
.rw-field-label { font-size: 12.5px; color: var(--ink3); width: 32px; flex: none; }
.rw-field-icon { font-size: 20px; color: var(--ink3); }
.rw-swap {
  width: 46px; height: 46px; border-radius: 50%; border: 1px solid var(--line); background: var(--field); color: var(--ink);
  cursor: pointer; display: grid; place-items: center; transition: transform .3s;
}
.rw-swap:active { transform: rotate(180deg) scale(.9); }
.rw-popular { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; margin-top: 14px; }
.rw-popular-label { font-size: 13px; color: var(--ink3); margin-right: 4px; }
.rw-dest-chip {
  height: 32px; padding: 0 13px; border-radius: 9999px; border: 1px solid var(--line); background: transparent;
  color: var(--ink); font-size: 13px; font-weight: 500; cursor: pointer; transition: all .2s;
}
.rw-dest-chip.is-on { background: var(--solid); color: var(--onSolid); border-color: var(--solid); }
.rw-dest-chip:active { transform: scale(.94); }
.rw-bottom { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; margin-top: 16px; }
.rw-when { display: flex; gap: 2px; padding: 4px; border-radius: 9999px; background: var(--chip); flex-wrap: wrap; }
.rw-when button {
  height: 36px; padding: 0 13px; border-radius: 9999px; border: 0; background: transparent; color: var(--ink2);
  font-size: 13.5px; font-weight: 500; cursor: pointer; transition: all .2s;
}
.rw-when button.is-on { background: var(--glassHi); color: var(--ink); box-shadow: 0 1px 4px rgba(0,0,0,.1); }
.rw-plan {
  height: 50px; padding: 0 24px; border-radius: 9999px; border: 0; background: var(--solid); color: var(--onSolid);
  font-weight: 560; font-size: 15.5px; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: transform .12s;
}
.rw-plan:active { transform: scale(.95); }
</style>
