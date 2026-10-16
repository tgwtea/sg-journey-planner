<script setup>
import GlassCard from '../GlassCard.vue';

// A short list card with an "All" link: Saved and Reports on Home. Presentational only.
defineProps({
  title: { type: String, required: true },
  icon: { type: String, required: true },
  // [{ id, icon, title, sub }]
  items: { type: Array, default: () => [] },
  // true: rows are buttons that emit 'pick'. false: rows are plain.
  clickable: { type: Boolean, default: false },
  // Show the icon in a round chip (Reports) or plain (Saved).
  roundIcon: { type: Boolean, default: false },
});
defineEmits(['all', 'pick']);
</script>

<template>
  <GlassCard :title="title" :icon="icon" flush>
    <template #actions>
      <button class="rw-head-link" :aria-label="`All ${title.toLowerCase()}`" @click="$emit('all')">All</button>
    </template>
    <component
      :is="clickable ? 'button' : 'div'"
      v-for="item in items"
      :key="item.id"
      class="rw-row"
      :class="{ 'is-btn': clickable }"
      @click="clickable && $emit('pick', item)"
    >
      <span v-if="roundIcon" class="rw-round"><span class="material-symbols-outlined" style="font-size: 17px">{{ item.icon }}</span></span>
      <span v-else class="material-symbols-outlined rw-icon">{{ item.icon }}</span>
      <span class="rw-text">
        <span class="rw-title">{{ item.title }}</span>
        <span class="rw-sub" :class="{ 'rw-mono': roundIcon }">{{ item.sub }}</span>
      </span>
    </component>
  </GlassCard>
</template>

<style scoped>
.rw-row {
  width: 100%; display: flex; align-items: center; gap: 12px; padding: 12px 0; border: 0; border-top: 1px solid var(--line);
  background: transparent; color: var(--ink); text-align: left;
}
.rw-row.is-btn { cursor: pointer; }
.rw-row.is-btn:active { opacity: .6; }
.rw-icon { font-size: 19px; color: var(--ink2); }
.rw-round { width: 32px; height: 32px; border-radius: 50%; background: var(--chip); display: grid; place-items: center; flex: none; }
.rw-text { flex: 1; min-width: 0; }
.rw-title { display: block; font-weight: 500; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.rw-sub { display: block; font-size: 12.5px; color: var(--ink2); margin-top: 1px; }
.rw-sub.rw-mono { font-size: 11.5px; color: var(--ink3); margin-top: 2px; }
</style>
