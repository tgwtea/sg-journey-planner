<script setup>
import { routes } from '../router';

const tabs = routes.filter((r) => r.meta?.label);
</script>

<template>
  <nav aria-label="Main" class="rw-tabs rw-glass">
    <RouterLink
      v-for="tab in tabs"
      :key="tab.name"
      :to="tab.path"
      class="rw-tab"
      active-class=""
      exact-active-class="is-on"
      :aria-label="tab.meta.label"
      :title="tab.meta.label"
    >
      <span class="material-symbols-outlined" style="font-size: 22px">{{ tab.meta.icon }}</span>
      <span class="rw-tab-label">{{ tab.meta.label }}</span>
    </RouterLink>
  </nav>
</template>

<style scoped>
.rw-tabs {
  position: fixed; left: 0; right: 0; bottom: 18px; z-index: 55;
  margin: 0 auto; width: max-content; max-width: calc(100% - 24px);
  display: flex; gap: 4px; padding: 6px; border-radius: 9999px;
  box-shadow: var(--glassShHi);
}
.rw-tab {
  height: 48px; min-width: 48px; padding: 0; border-radius: 9999px;
  color: var(--ink2); text-decoration: none;
  display: flex; align-items: center; justify-content: center; gap: 7px;
  font-size: 14px; font-weight: 500;
  transition: background .25s, color .25s, padding .25s;
}
.rw-tab:hover { color: var(--ink); }
.rw-tab-label { display: none; }
/* The mockup shows the label on the active tab only. */
.rw-tab.is-on { background: var(--solid); color: var(--onSolid); padding: 0 18px; }
.rw-tab.is-on .rw-tab-label { display: inline; }
</style>
