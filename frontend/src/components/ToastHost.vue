<script setup>
import { useToast } from '../composables/useToast.js';

const { message, key } = useToast();
</script>

<template>
  <div v-if="message" :key="key" role="status" class="rw-toast">
    <span class="material-symbols-outlined" style="font-size: 19px">check_circle</span>{{ message }}
  </div>
</template>

<style scoped>
.rw-toast {
  position: fixed; z-index: 75; top: 88px; left: 50%; transform: translateX(-50%);
  background: var(--solid); color: var(--onSolid); border-radius: 9999px; padding: 11px 18px;
  font-size: 14px; font-weight: 500; display: flex; align-items: center; gap: 8px;
  box-shadow: 0 12px 30px rgba(0,0,0,.2); animation: rwFade .3s ease both; max-width: calc(100% - 24px);
}
</style>
