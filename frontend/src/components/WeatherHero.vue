<script setup>
import { computed } from 'vue';

// Presentational only. It renders what it gets and emits `refresh`.
// The data comes from composables/useWeather.js.
const props = defineProps({
  // 'idle' | 'loading' | 'success' | 'empty' | 'error'
  status: { type: String, default: 'idle' },
  area: { type: String, default: 'City' },
  temperature: { type: [Number, null], default: null },
  forecast: { type: String, default: '' },
  // 'clear' | 'light' | 'heavy'
  condition: { type: String, default: 'clear' },
  details: { type: String, default: '' },
  updatedAt: { type: String, default: '' },
  errorMessage: { type: String, default: '' },
});
defineEmits(['refresh']);

const icon = computed(() => ({ clear: 'sunny', light: 'rainy', heavy: 'thunderstorm' })[props.condition] || 'cloud');
const tempText = computed(() => (props.temperature == null ? '–°' : `${Math.round(props.temperature)}°`));
const updatedText = computed(() => {
  if (!props.updatedAt) return '';
  const d = new Date(props.updatedAt);
  return Number.isNaN(d.getTime()) ? props.updatedAt : d.toLocaleTimeString('en-SG', { hour: 'numeric', minute: '2-digit' });
});
</script>

<template>
  <section class="rw-hero" :aria-busy="status === 'loading'" aria-live="polite">
    <div class="rw-live rw-mono">
      <span class="rw-dot" :class="{ 'is-off': status !== 'success' }"></span>
      <template v-if="status === 'success'">Live · updated {{ updatedText }}</template>
      <template v-else-if="status === 'loading'">Loading weather…</template>
      <template v-else-if="status === 'error'">Weather unavailable</template>
      <template v-else-if="status === 'empty'">No data for this area</template>
      <template v-else>Weather not loaded</template>
    </div>

    <div class="rw-area">{{ area }}</div>

    <!-- Loading -->
    <template v-if="status === 'loading'">
      <div class="rw-temp rw-skeleton" aria-hidden="true">&nbsp;</div>
      <div class="rw-bar" aria-hidden="true"><span></span></div>
    </template>

    <!-- Success -->
    <template v-else-if="status === 'success'">
      <div class="rw-temp">{{ tempText }}</div>
      <div class="rw-title">
        <span class="material-symbols-outlined">{{ icon }}</span>{{ forecast }}
      </div>
      <div v-if="details" class="rw-sub">{{ details }}</div>
    </template>

    <!-- Empty -->
    <template v-else-if="status === 'empty'">
      <div class="rw-temp rw-dim">–°</div>
      <div class="rw-sub">The weather service returned no reading for {{ area }}.</div>
    </template>

    <!-- Error -->
    <template v-else-if="status === 'error'">
      <div class="rw-temp rw-dim">–°</div>
      <div class="rw-msg" role="alert">
        <span class="material-symbols-outlined">cloud_off</span>
        {{ errorMessage || 'We could not load the weather. Try again.' }}
      </div>
    </template>

    <!-- Idle -->
    <template v-else>
      <div class="rw-temp rw-dim">–°</div>
      <div class="rw-sub">Press refresh to load the live weather.</div>
    </template>

    <button class="rw-pill rw-refresh" :disabled="status === 'loading'" @click="$emit('refresh')">
      <span class="material-symbols-outlined" :class="{ 'rw-spin': status === 'loading' }" style="font-size: 18px">refresh</span>
      Refresh
    </button>
  </section>
</template>

<style scoped>
.rw-hero { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 18px 0 6px; animation: rwIn .5s ease both; }
.rw-live { font-size: 11.5px; letter-spacing: .08em; text-transform: uppercase; color: var(--ink2); display: flex; align-items: center; gap: 8px; }
.rw-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--ink); animation: rwBlink 2s infinite; }
.rw-dot.is-off { background: var(--ink3); animation: none; }
.rw-area { font-size: 22px; font-weight: 500; letter-spacing: -.01em; margin-top: 16px; }
.rw-temp { font-size: 104px; line-height: 1.1; font-weight: 420; letter-spacing: -.055em; margin-top: 6px; padding-left: .14em; }
.rw-dim { color: var(--ink3); }
.rw-skeleton { width: 180px; border-radius: 28px; background: var(--chip); }
.rw-title { font-size: 19px; font-weight: 500; margin-top: 6px; display: flex; align-items: center; gap: 8px; }
.rw-sub { font-size: 15px; color: var(--ink2); margin-top: 6px; max-width: 420px; text-wrap: balance; }
.rw-msg { font-size: 15px; color: var(--ink); margin-top: 6px; display: flex; align-items: center; gap: 8px; padding: 10px 16px; border-radius: 20px; border: 1px dashed var(--lineS); }
.rw-bar { width: 160px; height: 3px; border-radius: 9999px; background: var(--chip); overflow: hidden; margin-top: 14px; }
.rw-bar span { display: block; height: 100%; background: var(--ink); animation: rwLoad 1.2s ease-in-out infinite; }
.rw-refresh { margin-top: 18px; }
.rw-spin { animation: rwSpin 1s linear infinite; }
@media (max-width: 719px) {
  .rw-temp { font-size: 84px; }
}
</style>
