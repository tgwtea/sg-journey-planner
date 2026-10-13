<script setup>
import { computed, provide, reactive } from 'vue';
import { useRoute } from 'vue-router';
import AppHeader from './components/AppHeader.vue';
import BottomTabBar from './components/BottomTabBar.vue';

// App-wide UI state (not weather data).
// `wx` is the sky look: 'clear' | 'light' | 'heavy'.
// The header switch sets it for demos. Live weather can set it later.
// `pal` is the colour palette: 'vivid' (default) | 'calm'.
const ui = reactive({ dark: false, wx: 'clear', pal: 'vivid' });
provide('ui', ui);

const route = useRoute();
const columnWidth = computed(() => route.meta.width || '1180px');
</script>

<template>
  <div data-rwroot="1" :data-rw="ui.dark ? 'dark' : 'light'" :data-pal="ui.pal" :data-wx="ui.wx" class="rw-root">
    <AppHeader />
    <main class="rw-main" :style="{ maxWidth: columnWidth }">
      <RouterView />
    </main>
    <BottomTabBar />
  </div>
</template>

<style scoped>
.rw-root {
  min-height: 100vh;
  position: relative;
  background: var(--sky, var(--bg));
  background-attachment: fixed;
  color: var(--ink);
  transition: color .4s ease;
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
