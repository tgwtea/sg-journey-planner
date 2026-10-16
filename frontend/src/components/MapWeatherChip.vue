<script setup>
// Map overlay at the bottom left: the weather summary and an optional "Explore map" button.
defineProps({
  icon: { type: String, default: 'cloud' },
  text: { type: String, default: '' },
  showExplore: { type: Boolean, default: true },
});
defineEmits(['explore']);
</script>

<template>
  <div class="rw-wxchip-wrap">
    <div class="rw-wxchip">
      <span class="material-symbols-outlined" style="font-size: 18px">{{ icon }}</span>{{ text }}
    </div>
    <button v-if="showExplore" class="rw-explore" @click="$emit('explore')">
      <span class="material-symbols-outlined" style="font-size: 18px">open_in_full</span>Explore map
    </button>
  </div>
</template>

<style scoped>
.rw-wxchip-wrap { position: absolute; z-index: 500; left: 14px; bottom: 14px; right: 70px; display: flex; gap: 8px; align-items: center; flex-wrap: wrap; pointer-events: none; }
.rw-wxchip {
  display: flex; align-items: center; gap: 8px; background: var(--glassHi); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
  border: 1px solid var(--glassBd); box-shadow: var(--glassSh); border-radius: 9999px; padding: 9px 15px; font-size: 13px; font-weight: 500;
}
.rw-explore {
  height: 40px; padding: 0 16px; border-radius: 9999px; border: 0; background: var(--solid); color: var(--onSolid);
  font-weight: 560; font-size: 13px; display: flex; align-items: center; gap: 6px; cursor: pointer; pointer-events: auto;
}
.rw-explore:active { transform: scale(.95); }
</style>
