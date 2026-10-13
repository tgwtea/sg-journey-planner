<script setup>
import { inject } from 'vue';

const ui = inject('ui');

// Weather simulation switch from the mockup header.
const wxOptions = [
  { id: 'clear', label: 'Clear', icon: 'sunny' },
  { id: 'light', label: 'Light rain', icon: 'rainy' },
  { id: 'heavy', label: 'Heavy rain', icon: 'thunderstorm' },
];
</script>

<template>
  <header class="rw-header rw-glass">
    <RouterLink to="/" class="rw-brand" aria-label="SG Journey Planner home">
      <span class="rw-logo"><span class="material-symbols-outlined">alt_route</span></span>
      <span class="rw-brand-name">RouteWise</span>
    </RouterLink>

    <div class="flex-grow-1"></div>

    <div role="radiogroup" aria-label="Weather simulation" class="rw-wx-switch">
      <button
        v-for="opt in wxOptions"
        :key="opt.id"
        role="radio"
        :aria-checked="ui.wx === opt.id"
        :aria-label="opt.label"
        :title="opt.label"
        class="rw-pill"
        :class="{ 'is-on': ui.wx === opt.id }"
        @click="ui.wx = opt.id"
      >
        <span class="material-symbols-outlined" style="font-size: 18px">{{ opt.icon }}</span>
        <span class="rw-wx-label">{{ opt.label }}</span>
      </button>
    </div>

    <button class="rw-icon-btn" aria-label="Toggle dark mode" @click="ui.dark = !ui.dark">
      <span class="material-symbols-outlined" style="font-size: 21px">{{ ui.dark ? 'light_mode' : 'dark_mode' }}</span>
    </button>
  </header>
</template>

<style scoped>
.rw-header {
  position: fixed; top: 14px; left: 14px; right: 14px; z-index: 50;
  max-width: 1180px; margin: 0 auto; height: 60px; border-radius: 9999px;
  display: flex; align-items: center; gap: 8px; padding: 0 9px;
}
.rw-brand { display: flex; align-items: center; gap: 10px; color: var(--ink); text-decoration: none; flex: none; }
.rw-logo {
  width: 40px; height: 40px; border-radius: 50%;
  background: var(--solid); color: var(--onSolid); display: grid; place-items: center;
}
.rw-logo .material-symbols-outlined { font-size: 22px; }
.rw-brand-name { font-weight: 600; font-size: 17px; letter-spacing: -.02em; }
.rw-wx-switch { display: flex; gap: 2px; padding: 4px; border-radius: 9999px; background: var(--chip); flex: none; }
.rw-wx-switch .rw-pill { background: transparent; color: var(--ink2); padding: 0 12px; }
.rw-wx-switch .rw-pill.is-on { background: var(--solid); color: var(--onSolid); }

/* Mockup: brand name hides under 720px; weather labels show only when there is room. */
@media (max-width: 719px) {
  .rw-brand-name { display: none; }
}
@media (max-width: 879px) {
  .rw-wx-label { display: none; }
}
</style>
