<script setup>
import { inject } from 'vue';
import { useWeatherMode } from '../composables/useWeatherMode.js';
import { useTour } from '../composables/useTour.js';
import { buzz } from '../composables/useToast.js';

const ui = inject('ui');
const { mode, auto, setMode, toggleAuto } = useWeatherMode();
const tour = useTour();

// Weather switch from the mockup header, plus 'Live' to follow real data.
const wxOptions = [
  { id: 'live', label: 'Live', icon: 'sensors' },
  { id: 'clear', label: 'Clear', icon: 'sunny' },
  { id: 'light', label: 'Light rain', icon: 'rainy' },
  { id: 'heavy', label: 'Heavy rain', icon: 'thunderstorm' },
];

function pick(id) { buzz(); setMode(id); }
function onAuto() { buzz(); toggleAuto(); }
function onDark() { buzz(); ui.dark = !ui.dark; }
</script>

<template>
  <header class="rw-header rw-glass">
    <RouterLink to="/" class="rw-brand" aria-label="RouteWise home">
      <span class="rw-logo"><span class="material-symbols-outlined">alt_route</span></span>
      <span class="rw-brand-name">RouteWise</span>
    </RouterLink>

    <div class="flex-grow-1"></div>

    <div role="radiogroup" aria-label="Weather" class="rw-wx-switch">
      <button
        v-for="opt in wxOptions"
        :key="opt.id"
        role="radio"
        :aria-checked="!auto && mode === opt.id"
        :aria-label="opt.label"
        :title="opt.label"
        class="rw-pill"
        :class="{ 'is-on': !auto && mode === opt.id }"
        @click="pick(opt.id)"
      >
        <span class="material-symbols-outlined" style="font-size: 19px">{{ opt.icon }}</span>
        <span class="rw-wx-label">{{ opt.label }}</span>
      </button>
    </div>

    <button
      class="rw-auto rw-wide-only"
      :class="{ 'is-on': auto }"
      :aria-pressed="auto"
      title="Cycle weather automatically"
      @click="onAuto"
    >
      <span class="rw-auto-dot"></span>Auto
    </button>
    <button class="rw-icon-btn rw-wide-only" aria-label="Start guided tour" title="Guided tour" @click="tour.start()">
      <span class="material-symbols-outlined" style="font-size: 21px">explore</span>
    </button>
    <button class="rw-icon-btn" aria-label="Toggle dark mode" @click="onDark">
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
.rw-wx-switch .rw-pill { background: transparent; color: var(--ink2); padding: 0 12px; transition: background .3s, color .3s; }
.rw-wx-switch .rw-pill.is-on { background: var(--solid); color: var(--onSolid); }
.rw-auto {
  height: 44px; padding: 0 14px; border-radius: 9999px; border: 1px solid var(--line);
  background: transparent; color: var(--ink); font-size: 13.5px; font-weight: 500;
  display: flex; align-items: center; gap: 8px; cursor: pointer; flex: none; transition: all .2s;
}
.rw-auto:active { transform: scale(.95); }
.rw-auto-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--ink3); }
.rw-auto.is-on { background: var(--solid); color: var(--onSolid); border-color: var(--solid); }
.rw-auto.is-on .rw-auto-dot { background: var(--onSolid); animation: rwBlink 1s infinite; }

/* Mockup: Auto and the tour button show at 880px and up. Labels show at 720px and up. */
@media (max-width: 879px) {
  .rw-wide-only { display: none; }
}
@media (max-width: 719px) {
  .rw-brand-name, .rw-wx-label { display: none; }
  .rw-wx-switch .rw-pill { padding: 0 10px; }
}
</style>
