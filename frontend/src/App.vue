<script setup>
import { computed, provide, reactive } from 'vue';
import { useRoute } from 'vue-router';
import AppHeader from './components/AppHeader.vue';
import BottomTabBar from './components/BottomTabBar.vue';
import SkyCanvas from './components/SkyCanvas.vue';
import ToastHost from './components/ToastHost.vue';
import OnboardingModal from './components/OnboardingModal.vue';
import TourCard from './components/TourCard.vue';
import { useWeatherMode } from './composables/useWeatherMode.js';
import { useTour } from './composables/useTour.js';

const { wx } = useWeatherMode();
useTour();

// Shared UI state. wx is the current condition: live, or the header override.
const ui = reactive({ dark: false, wx, pal: 'vivid' });
provide('ui', ui);

const route = useRoute();
const columnWidth = computed(() => route.meta.width || '1180px');
</script>

<template>
  <div data-rwroot="1" :data-rw="ui.dark ? 'dark' : 'light'" :data-pal="ui.pal" :data-wx="ui.wx" class="rw-root">
    <SkyCanvas :wx="ui.wx" :dark="ui.dark" />
    <AppHeader />
    <main class="rw-main" :style="{ maxWidth: columnWidth }">
      <RouterView />
    </main>
    <BottomTabBar />
    <TourCard />
    <OnboardingModal />
    <ToastHost />
  </div>
</template>

<style scoped>
.rw-root {
  min-height: 100vh;
  position: relative;
  background: var(--sky, var(--bg));
  background-attachment: fixed;
  color: var(--ink);
  transition: color .6s ease, background .8s ease;
}
.rw-main {
  position: relative;
  z-index: 1;
  margin: 0 auto;
  padding: 100px 24px 130px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
@media (max-width: 879px) {
  .rw-main { padding: 90px 14px 120px; }
}
</style>
