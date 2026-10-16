<script setup>
// Smart departure result: "Leave now" or "Wait N min", with the reason,
// a countdown ring, and the options it compared. Presentational only.
defineProps({
  analysing: { type: Boolean, default: false },
  routeLabel: { type: String, default: '' },
  // { key, headline, reason, chips, compare, ring: { dash, text, sub }, remindAt }
  advice: { type: Object, required: true },
  remind: { type: Boolean, default: false },
  routeCount: { type: Number, default: 4 },
});
defineEmits(['compare', 'toggle-remind']);
</script>

<template>
  <section class="rw-dep rw-glass" aria-live="polite">
    <div v-if="analysing" class="rw-thinking">
      <div class="rw-mono rw-kicker">Smart departure · checking</div>
      <div class="rw-thinking-title">Checking your options…</div>
      <div class="rw-thinking-sub">{{ routeCount }} routes · 2 rain cells · 14 live arrivals · walking shelter along {{ routeLabel }}</div>
      <div class="rw-load"><div></div></div>
    </div>

    <div v-else :key="advice.key" class="rw-result">
      <div class="rw-head">
        <span class="material-symbols-outlined" style="font-size: 16px">schedule</span>Smart departure · {{ routeLabel }}
      </div>
      <div class="rw-main">
        <div class="rw-main-text">
          <div class="rw-lead">RouteWise recommends</div>
          <div class="rw-headline">{{ advice.headline }}</div>
          <div class="rw-reason">{{ advice.reason }}</div>
        </div>
        <div class="rw-ring">
          <svg viewBox="0 0 80 80" width="108" height="108" aria-hidden="true">
            <circle cx="40" cy="40" r="35" fill="none" class="rw-ring-track" />
            <circle cx="40" cy="40" r="35" fill="none" class="rw-ring-bar" :style="{ strokeDasharray: advice.ring.dash }" />
          </svg>
          <div class="rw-ring-label">
            <div>
              <div class="rw-mono rw-ring-text">{{ advice.ring.text }}</div>
              <div class="rw-ring-sub">{{ advice.ring.sub }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="rw-chips">
        <span v-for="c in advice.chips" :key="c.label" class="rw-chip">
          <span class="material-symbols-outlined" style="font-size: 16px">{{ c.icon }}</span>{{ c.label }}
        </span>
      </div>

      <div class="rw-compare">
        <div v-for="o in advice.compare" :key="o.title" class="rw-option" :class="{ 'is-pick': o.pick }">
          <div class="d-flex justify-content-between align-items-center" style="gap: 8px">
            <span class="rw-option-title">{{ o.title }}</span>
            <span v-if="o.pick" class="rw-pick">Pick</span>
          </div>
          <div class="rw-option-sub">{{ o.route }}</div>
          <div class="rw-option-sub d-flex align-items-center" style="gap: 4px">
            <span class="material-symbols-outlined" style="font-size: 15px">{{ o.expIcon }}</span>{{ o.exp }}
          </div>
          <div class="rw-mono rw-arrive">Arrive {{ o.arrive }}</div>
        </div>
      </div>

      <div class="rw-actions">
        <button class="rw-btn-solid" @click="$emit('compare')">
          Compare {{ routeCount }} routes<span class="material-symbols-outlined" style="font-size: 20px">arrow_forward</span>
        </button>
        <button class="rw-btn-remind" :class="{ 'is-on': remind }" :aria-pressed="remind" @click="$emit('toggle-remind')">
          <span class="material-symbols-outlined" style="font-size: 19px">{{ remind ? 'notifications_active' : 'notifications' }}</span>
          {{ remind ? 'Reminder set' : `Remind me at ${advice.remindAt}` }}
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.rw-dep { border-radius: 28px; padding: 22px; min-height: 260px; }
.rw-thinking { display: flex; flex-direction: column; gap: 14px; animation: rwFade .3s ease both; }
.rw-kicker { font-size: 11.5px; letter-spacing: .08em; text-transform: uppercase; color: var(--ink3); }
.rw-thinking-title { font-size: 32px; font-weight: 540; letter-spacing: -.03em; }
.rw-thinking-sub { font-size: 15px; color: var(--ink2); line-height: 1.45; }
.rw-load { height: 4px; border-radius: 9999px; background: var(--line); overflow: hidden; }
.rw-load div { height: 100%; background: var(--ink); border-radius: 9999px; animation: rwLoad 1.2s ease both; }
.rw-result { animation: rwFade .5s ease both; }
.rw-head {
  display: flex; align-items: center; gap: 6px; font-size: 11.5px; font-weight: 500; letter-spacing: .07em;
  text-transform: uppercase; color: var(--ink2); padding-bottom: 12px; border-bottom: 1px solid var(--line);
}
.rw-main { display: flex; align-items: center; gap: 22px; margin-top: 18px; flex-wrap: wrap; }
.rw-main-text { flex: 1; min-width: 220px; }
.rw-lead { font-size: 14px; color: var(--ink2); font-weight: 500; }
.rw-headline { font-size: 60px; line-height: 1; font-weight: 540; letter-spacing: -.045em; margin-top: 6px; }
.rw-reason { font-size: 15.5px; line-height: 1.5; margin-top: 12px; color: var(--ink2); text-wrap: pretty; }
.rw-ring { position: relative; width: 108px; height: 108px; flex: none; }
.rw-ring svg { transform: rotate(-90deg); }
.rw-ring-track { stroke: var(--line); stroke-width: 3px; }
.rw-ring-bar { stroke: var(--ink); stroke-width: 3px; stroke-linecap: round; transition: stroke-dasharray 1s linear; }
.rw-ring-label { position: absolute; inset: 0; display: grid; place-items: center; text-align: center; }
.rw-ring-text { font-size: 20px; font-weight: 500; }
.rw-ring-sub { font-size: 11px; color: var(--ink3); margin-top: 3px; }
.rw-chips { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 16px; }
.rw-chip { height: 30px; padding: 0 12px; border-radius: 9999px; background: var(--chip); display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 500; }
.rw-compare { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-top: 16px; }
.rw-option { border-radius: 20px; padding: 14px 16px; background: transparent; border: 1px solid var(--line); }
.rw-option.is-pick { background: var(--tint); border: 1.5px solid var(--ink); }
.rw-option-title { font-weight: 560; font-size: 15px; }
.rw-pick { font-size: 11px; font-weight: 560; letter-spacing: .04em; text-transform: uppercase; background: var(--solid); color: var(--onSolid); padding: 3px 9px; border-radius: 9999px; }
.rw-option-sub { font-size: 13px; color: var(--ink2); margin-top: 4px; }
.rw-arrive { font-size: 12.5px; margin-top: 8px; }
.rw-actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 16px; }
.rw-btn-solid {
  height: 48px; padding: 0 20px; border-radius: 9999px; border: 0; background: var(--solid); color: var(--onSolid);
  font-weight: 560; font-size: 15px; display: flex; align-items: center; gap: 8px; cursor: pointer;
}
.rw-btn-remind {
  height: 48px; padding: 0 18px; border-radius: 9999px; border: 1px solid var(--lineS); background: transparent; color: var(--ink);
  font-weight: 500; font-size: 14px; display: flex; align-items: center; gap: 7px; cursor: pointer; transition: all .2s;
}
.rw-btn-remind.is-on { background: var(--solid); color: var(--onSolid); border-color: var(--solid); }
.rw-btn-solid:active, .rw-btn-remind:active { transform: scale(.96); }
@media (max-width: 719px) {
  .rw-headline { font-size: 48px; }
}
</style>
