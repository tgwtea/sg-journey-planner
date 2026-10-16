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
  // Replaces the 'Live · updated' chip text, for example in demo mode.
  label: { type: String, default: '' },
  // A short line under the details, for example a greeting.
  note: { type: String, default: '' },
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
    <!-- Decoration from the v3 mockup: two colour blobs and a large weather icon. -->
    <span class="rw-blob rw-blob1" aria-hidden="true"></span>
    <span class="rw-blob rw-blob2" aria-hidden="true"></span>
    <span class="material-symbols-outlined rw-big-icon" aria-hidden="true">{{ status === 'error' ? 'cloud_off' : icon }}</span>

    <div class="rw-content">
    <div class="rw-live rw-mono">
      <span class="rw-dot" :class="{ 'is-off': status !== 'success' }"></span>
      <template v-if="label">{{ label }}</template>
      <template v-else-if="status === 'success'">Live · updated {{ updatedText }}</template>
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
      <div class="rw-title">{{ forecast }}</div>
      <div v-if="details" class="rw-sub">{{ details }}</div>
      <div v-if="note" class="rw-sub rw-note">{{ note }}</div>
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
    </div>
  </section>
</template>

<style scoped>
/* Hero card from design/RouteWise v3.dc.html. The palette tokens set its colours per weather state. */
.rw-hero {
  position: relative; overflow: hidden; border-radius: 36px;
  background: var(--hero); color: var(--onHero);
  padding: 24px 26px 28px;
  transition: background .8s ease, color .8s ease;
  animation: rwIn .5s ease both;
}
.rw-blob { position: absolute; border-radius: 50%; transition: background .8s ease; }
.rw-blob1 { width: 280px; height: 280px; right: -80px; top: -90px; background: var(--blob1); }
.rw-blob2 { width: 150px; height: 150px; right: -30px; bottom: -70px; background: var(--blob2); }
.rw-big-icon {
  position: absolute; right: 22px; top: 14px; font-size: 76px; color: var(--onHero);
  font-variation-settings: 'wght' 250, 'opsz' 48;
}
.rw-content { position: relative; display: flex; flex-direction: column; align-items: flex-start; max-width: calc(100% - 110px); }
.rw-live {
  display: inline-flex; align-items: center; gap: 8px; height: 30px; padding: 0 12px;
  border-radius: 9999px; background: var(--heroChip);
  font-size: 11.5px; letter-spacing: .08em; text-transform: uppercase; white-space: nowrap;
}
.rw-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--onHero); animation: rwBlink 2s infinite; }
.rw-dot.is-off { background: var(--onHero2); animation: none; }
.rw-area { font-size: 20px; font-weight: 560; letter-spacing: -.01em; margin-top: 18px; }
.rw-temp { font-size: 104px; line-height: 1.05; font-weight: 440; letter-spacing: -.055em; margin-left: -.04em; }
.rw-dim { color: var(--onHero2); }
.rw-skeleton { width: 180px; border-radius: 28px; background: var(--heroChip); }
.rw-title { font-size: 19px; font-weight: 560; }
.rw-sub { font-size: 15px; color: var(--onHero2); margin-top: 3px; max-width: 420px; text-wrap: pretty; }
.rw-note { margin-top: 14px; }
.rw-msg { font-size: 15px; margin-top: 6px; display: flex; align-items: center; gap: 8px; padding: 10px 16px; border-radius: 20px; background: var(--heroChip); }
.rw-bar { width: 160px; height: 3px; border-radius: 9999px; background: var(--heroChip); overflow: hidden; margin-top: 14px; }
.rw-bar span { display: block; height: 100%; background: var(--onHero); animation: rwLoad 1.2s ease-in-out infinite; }
.rw-refresh { margin-top: 18px; background: var(--heroChip); color: var(--onHero); }
.rw-spin { animation: rwSpin 1s linear infinite; }
@media (max-width: 719px) {
  .rw-temp { font-size: 84px; }
  .rw-big-icon { font-size: 60px; }
}
</style>
