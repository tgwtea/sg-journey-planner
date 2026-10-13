<script setup>
// Plain list for mock data previews: one row per item.
defineProps({
  items: { type: Array, required: true },
});
</script>

<template>
  <ul class="rw-list">
    <li v-for="item in items" :key="item.id" class="rw-row">
      <span v-if="item.icon" class="material-symbols-outlined rw-row-icon">{{ item.icon }}</span>
      <span class="rw-row-main">
        <span class="rw-row-title">{{ item.title }}</span>
        <span v-if="item.sub" class="rw-row-sub">{{ item.sub }}</span>
      </span>
      <span v-if="item.meta" class="rw-row-meta rw-mono">{{ item.meta }}</span>
    </li>
  </ul>
</template>

<style scoped>
.rw-list { list-style: none; margin: 0; padding: 0; }
.rw-row { display: flex; align-items: flex-start; gap: 12px; padding: 12px 0; border-top: 1px solid var(--line); }
.rw-row-icon { font-size: 20px; color: var(--ink2); margin-top: 1px; }
.rw-row-main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.rw-row-title { font-weight: 560; font-size: 15px; }
.rw-row-sub { font-size: 13.5px; color: var(--ink2); line-height: 1.4; }
.rw-row-meta { font-size: 12px; color: var(--ink3); white-space: nowrap; }
</style>
