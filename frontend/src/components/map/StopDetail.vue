<script setup>
// Details for one stop in the Map panel: weather, shelter, live arrivals,
// recent reports, quick report buttons, and "Plan from here". Presentational only.
defineProps({
  // From useRainMap().stopDetail
  stop: { type: Object, required: true },
  // [{ id, label, icon, ago, note, flash }]
  reports: { type: Array, default: () => [] },
  // [{ id, label, icon }]
  types: { type: Array, default: () => [] },
});
defineEmits(['close', 'report', 'plan']);
</script>

<template>
  <div class="rw-detail">
    <div class="d-flex align-items-start" style="gap: 12px">
      <span class="rw-kind"><span class="material-symbols-outlined" style="font-size: 24px">{{ stop.kindIcon }}</span></span>
      <div class="flex-grow-1" style="min-width: 0">
        <h2 class="rw-name">{{ stop.name }}</h2>
        <div class="d-flex flex-wrap align-items-center" style="gap: 4px; margin-top: 6px">
          <span class="rw-kind-label">{{ stop.kindLabel }}</span>
          <span v-for="c in stop.chips" :key="c.t" class="rw-mono rw-code" :style="{ background: c.bg, color: c.fg }">{{ c.t }}</span>
        </div>
      </div>
      <button class="rw-round" aria-label="Close stop details" @click="$emit('close')">
        <span class="material-symbols-outlined" style="font-size: 19px">close</span>
      </button>
    </div>

    <div class="rw-facts">
      <div class="rw-fact">
        <div class="rw-fact-k">Weather here</div>
        <div class="rw-fact-v"><span class="material-symbols-outlined" style="font-size: 19px">{{ stop.wxIcon }}</span>{{ stop.wxLabel }}</div>
      </div>
      <div class="rw-fact">
        <div class="rw-fact-k">Shelter</div>
        <div class="rw-fact-v"><span class="material-symbols-outlined" style="font-size: 19px">{{ stop.shIcon }}</span>{{ stop.shLabel }}</div>
      </div>
    </div>
    <div class="rw-note">{{ stop.note }}</div>

    <div>
      <div class="rw-sec"><span class="rw-live-dot"></span>Live arrivals</div>
      <div v-for="(a, i) in stop.arr" :key="i" class="rw-arr">
        <span class="rw-svc" :style="{ background: a.bg, color: a.fg }">{{ a.svc }}</span>
        <span style="min-width: 0">
          <span class="rw-dir">{{ a.d }}</span>
          <span class="rw-load"><span class="rw-load-dot" :style="{ background: a.loadC }"></span>{{ a.load }}</span>
        </span>
        <span class="rw-mono rw-t" :class="{ 'is-now': a.now }">{{ a.t }}</span>
        <span class="rw-mono rw-t2">{{ a.t2 }}</span>
      </div>
    </div>

    <div>
      <div class="rw-sec">Recent reports</div>
      <div v-if="reports.length" class="d-flex flex-column" style="gap: 6px">
        <div v-for="r in reports" :key="r.id" class="rw-rep" :class="{ 'is-flash': r.flash }">
          <span class="rw-rep-icon"><span class="material-symbols-outlined" style="font-size: 16px">{{ r.icon }}</span></span>
          <div>
            <div class="rw-rep-title">{{ r.label }} <span class="rw-mono rw-rep-ago">· {{ r.ago }}</span></div>
            <div class="rw-rep-note">{{ r.note || 'No comment' }}</div>
          </div>
        </div>
      </div>
      <div v-else class="rw-empty">No reports in the last hour. Be the first.</div>
    </div>

    <div>
      <div class="rw-sec">Quick report · one tap</div>
      <div class="d-flex flex-wrap" style="gap: 5px">
        <button v-for="t in types" :key="t.id" class="rw-quick" @click="$emit('report', t.id)">
          <span class="material-symbols-outlined" style="font-size: 16px" aria-hidden="true">{{ t.icon }}</span>{{ t.label }}
        </button>
      </div>
    </div>

    <button class="rw-plan" @click="$emit('plan')">
      <span class="material-symbols-outlined" style="font-size: 20px">trip_origin</span>Plan from here
    </button>
  </div>
</template>

<style scoped>
.rw-detail { display: flex; flex-direction: column; gap: 16px; border-top: 1px solid var(--line); padding-top: 18px; animation: rwFade .35s ease both; }
.rw-kind { width: 46px; height: 46px; border-radius: 50%; background: var(--solid); color: var(--onSolid); display: grid; place-items: center; flex: none; }
.rw-name { font-size: 22px; font-weight: 540; letter-spacing: -.02em; line-height: 1.15; margin: 0; }
.rw-kind-label { font-size: 12.5px; color: var(--ink2); margin-right: 4px; }
.rw-code { font-size: 10.5px; font-weight: 500; padding: 2px 6px; border-radius: 9999px; }
.rw-round { width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--line); background: transparent; color: var(--ink); display: grid; place-items: center; cursor: pointer; flex: none; }
.rw-facts { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.rw-fact { padding: 12px 14px; border-radius: 20px; background: var(--chip); }
.rw-fact-k { font-size: 12px; color: var(--ink3); }
.rw-fact-v { display: flex; align-items: center; gap: 6px; font-weight: 560; font-size: 15px; margin-top: 4px; }
.rw-note { font-size: 14px; color: var(--ink2); line-height: 1.5; text-wrap: pretty; }
.rw-sec { display: flex; align-items: center; gap: 6px; font-size: 11.5px; font-weight: 500; letter-spacing: .07em; text-transform: uppercase; color: var(--ink2); margin-bottom: 8px; }
.rw-live-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--ink); animation: rwBlink 1.4s infinite; }
.rw-arr { display: grid; grid-template-columns: 48px minmax(0, 1fr) auto auto; gap: 10px; align-items: center; padding: 11px 0; border-top: 1px solid var(--line); }
.rw-svc { font-size: 12.5px; font-weight: 560; padding: 3px 0; text-align: center; border-radius: 9999px; }
.rw-dir { display: block; font-size: 14px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.rw-load { display: flex; align-items: center; gap: 5px; font-size: 12px; color: var(--ink2); margin-top: 1px; }
.rw-load-dot { width: 6px; height: 6px; border-radius: 50%; }
.rw-t { font-size: 14.5px; font-weight: 430; }
.rw-t.is-now { font-weight: 600; animation: rwBlink 1s infinite; }
.rw-t2 { font-size: 12px; color: var(--ink3); }
.rw-rep { display: flex; gap: 10px; align-items: flex-start; padding: 6px; border-radius: 16px; }
.rw-rep.is-flash { animation: rwFlash 1.4s ease; }
.rw-rep-icon { width: 30px; height: 30px; border-radius: 50%; background: var(--chip); display: grid; place-items: center; flex: none; }
.rw-rep-title { font-size: 14px; font-weight: 500; }
.rw-rep-ago { font-weight: 430; color: var(--ink3); font-size: 11.5px; }
.rw-rep-note { font-size: 13px; color: var(--ink2); margin-top: 1px; }
.rw-empty { font-size: 13.5px; color: var(--ink2); padding: 12px 14px; border-radius: 20px; border: 1px dashed var(--lineS); }
.rw-quick {
  height: 34px; padding: 0 12px; border-radius: 9999px; border: 1px solid var(--line); background: var(--field); color: var(--ink);
  font-size: 12.5px; font-weight: 500; display: flex; align-items: center; gap: 5px; cursor: pointer;
}
.rw-quick:active { transform: scale(.92); }
.rw-plan {
  height: 48px; border-radius: 9999px; border: 0; background: var(--solid); color: var(--onSolid); font-weight: 560; font-size: 15px;
  display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; flex: none;
}
.rw-plan:active { transform: scale(.97); }
</style>
