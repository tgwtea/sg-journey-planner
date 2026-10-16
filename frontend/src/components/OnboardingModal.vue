<script setup>
import { useTour } from '../composables/useTour.js';

const { onboarding, closeOnboarding } = useTour();

const lineColours = ['#D42E12', '#009645', '#9900AA', '#FA9E0D', '#005EC4'];
const points = [
  { icon: 'alt_route', strong: 'Routes, live timings and weather', rest: ' on one screen.' },
  { icon: 'timer', strong: 'Leave now or wait?', rest: ' RouteWise tells you, and why.' },
  { icon: 'forum', strong: 'Reports from people at the stop', rest: ': wet, crowded, long queue.' },
];
</script>

<template>
  <div v-if="onboarding" class="rw-scrim">
    <div role="dialog" aria-label="Welcome to RouteWise" class="rw-modal">
      <div class="d-flex" style="gap: 5px">
        <span v-for="c in lineColours" :key="c" class="rw-line" :style="{ background: c }"></span>
      </div>
      <div>
        <div class="rw-mono rw-kicker">Good morning</div>
        <div class="rw-title">Meet RouteWise.<br>Rain-smart commuting.</div>
      </div>
      <div class="d-flex flex-column">
        <div v-for="p in points" :key="p.icon" class="rw-point">
          <span class="material-symbols-outlined" style="font-size: 22px">{{ p.icon }}</span>
          <div><span style="font-weight: 560">{{ p.strong }}</span>{{ p.rest }}</div>
        </div>
      </div>
      <div class="d-flex flex-wrap" style="gap: 8px">
        <button class="rw-primary" @click="closeOnboarding(true)">
          <span class="material-symbols-outlined" style="font-size: 20px">explore</span>Take the 1-min tour
        </button>
        <button class="rw-secondary" @click="closeOnboarding(false)">Explore on my own</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rw-scrim {
  position: fixed; inset: 0; z-index: 80; background: rgba(14,18,24,.18);
  backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
  display: grid; place-items: center; padding: 16px; animation: rwFade .3s ease both;
}
.rw-modal {
  width: min(500px, 100%); background: var(--glassHi);
  backdrop-filter: blur(36px) saturate(170%); -webkit-backdrop-filter: blur(36px) saturate(170%);
  border: 1px solid var(--glassBd); color: var(--ink); border-radius: 32px; padding: 28px;
  box-shadow: var(--glassShHi); animation: rwUp .5s cubic-bezier(.2,.8,.2,1) both;
  display: flex; flex-direction: column; gap: 18px;
}
.rw-line { height: 4px; width: 32px; border-radius: 9999px; }
.rw-kicker { font-size: 11.5px; letter-spacing: .08em; text-transform: uppercase; color: var(--ink2); }
.rw-title { font-size: 36px; font-weight: 540; letter-spacing: -.04em; line-height: 1.05; margin-top: 8px; }
.rw-point { display: flex; gap: 14px; align-items: center; padding: 12px 0; border-top: 1px solid var(--line); font-size: 15px; line-height: 1.4; }
.rw-primary {
  flex: 1 1 200px; height: 52px; border-radius: 9999px; border: 0; background: var(--solid); color: var(--onSolid);
  font-weight: 560; font-size: 15.5px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
}
.rw-primary:active { transform: scale(.97); }
.rw-secondary {
  flex: 1 1 140px; height: 52px; border-radius: 9999px; border: 1px solid var(--lineS);
  background: transparent; color: var(--ink); font-weight: 500; font-size: 15px; cursor: pointer;
}
</style>
