<script setup>
// Frosted glass card from the mockup (radius 28px).
defineProps({
  title: { type: String, default: '' },
  icon: { type: String, default: '' },
  // List cards: no rule under the head, because each row has its own top rule.
  flush: { type: Boolean, default: false },
});
</script>

<template>
  <section class="rw-card rw-glass">
    <header v-if="title" class="rw-card-head" :class="{ 'is-flush': flush }">
      <span v-if="icon" class="material-symbols-outlined" style="font-size: 16px">{{ icon }}</span>
      <h2 class="rw-card-title">{{ title }}</h2>
      <span class="flex-grow-1"></span>
      <slot name="actions" />
    </header>
    <slot />
  </section>
</template>

<style scoped>
.rw-card { border-radius: 28px; padding: 18px 22px 20px; animation: rwUp .4s ease both; }
.rw-card-head {
  display: flex; align-items: center; gap: 6px;
  font-size: 11.5px; font-weight: 500; letter-spacing: .07em; text-transform: uppercase;
  color: var(--ink2); padding-bottom: 12px; margin-bottom: 14px; border-bottom: 1px solid var(--line);
}
.rw-card-head.is-flush { border-bottom: 0; padding-bottom: 4px; margin-bottom: 0; }
.rw-card-head :slotted(.rw-head-link) {
  border: 0; background: none; color: var(--ink); font-weight: 500; font-size: 13px; letter-spacing: 0;
  text-transform: none; cursor: pointer; display: flex; align-items: center; gap: 3px; padding: 6px 0;
}
.rw-card-title { font: inherit; letter-spacing: inherit; margin: 0; }
</style>
