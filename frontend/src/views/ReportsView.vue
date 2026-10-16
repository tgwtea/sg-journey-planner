<script setup>
import { useReports } from '../composables/useReports.js';

const reps = useReports();
const SORTS = [
  { id: 'newest', label: 'Newest' },
  { id: 'oldest', label: 'Oldest' },
  { id: 'confirmed', label: 'Most confirmed' },
];
</script>

<template>
  <div class="rw-reports">
    <div style="padding-top: 8px">
      <div class="rw-mono rw-kicker">From commuters on the ground</div>
      <h1 class="rw-title">Community reports</h1>
    </div>

    <div class="rw-cols">
      <div class="rw-side">
        <section class="rw-card rw-compose">
          <div class="rw-head"><span class="material-symbols-outlined" style="font-size: 16px">edit_note</span>Quick report</div>
          <div class="rw-step">1 · Where are you?</div>
          <div class="d-flex flex-wrap" style="gap: 5px">
            <button
              v-for="p in reps.placeOptions.value"
              :key="p.id"
              class="rw-place"
              :class="{ 'is-on': reps.newStop.value === p.id }"
              :aria-pressed="reps.newStop.value === p.id"
              @click="reps.newStop.value = p.id"
            >{{ p.name }}</button>
          </div>
          <div class="rw-step" style="margin-top: 4px">2 · What is it like? Tap to post.</div>
          <div class="rw-types">
            <button v-for="t in reps.types.value" :key="t.id" class="rw-type" @click="reps.post(t.id, reps.newStop.value)">
              <span class="material-symbols-outlined" style="font-size: 22px" aria-hidden="true">{{ t.icon }}</span>{{ t.label }}
            </button>
          </div>
        </section>

        <section class="rw-card rw-hot">
          <div class="rw-head is-flush"><span class="material-symbols-outlined" style="font-size: 16px">local_fire_department</span>Hotspots · last hour</div>
          <div v-for="h in reps.hotspots.value" :key="h.id" class="rw-hot-row">
            <span class="flex-grow-1" style="font-weight: 500">{{ h.name }}</span>
            <span class="rw-mono rw-hot-n">{{ h.n }}</span>
          </div>
        </section>
      </div>

      <div class="d-flex flex-column" style="gap: 12px; min-width: 0">
        <div class="d-flex flex-wrap align-items-center" style="gap: 8px">
          <label class="rw-search">
            <span class="material-symbols-outlined" style="font-size: 20px; color: var(--ink3)">search</span>
            <input v-model="reps.query.value" placeholder="Search stop, station or note" aria-label="Search reports">
          </label>
          <div class="rw-sorts">
            <button
              v-for="o in SORTS"
              :key="o.id"
              :class="{ 'is-on': reps.sort.value === o.id }"
              :aria-pressed="reps.sort.value === o.id"
              @click="reps.sort.value = o.id"
            >{{ o.label }}</button>
          </div>
        </div>

        <div class="d-flex flex-wrap" style="gap: 6px">
          <button
            v-for="f in reps.filterChips.value"
            :key="f.id"
            class="rw-filter"
            :class="{ 'is-on': f.on }"
            :aria-pressed="f.on"
            @click="reps.setFilter(f.id)"
          >{{ f.label }}<span class="rw-mono rw-filter-n">{{ f.n }}</span></button>
        </div>

        <div v-for="r in reps.feed.value" :key="r.id" class="rw-item" :class="{ 'is-flash': r.flash }">
          <span class="rw-item-icon"><span class="material-symbols-outlined" style="font-size: 22px">{{ r.icon }}</span></span>
          <div style="min-width: 0">
            <div class="d-flex flex-wrap align-items-center" style="gap: 6px">
              <span class="rw-item-type">{{ r.label }}</span>
              <span class="rw-at">at</span>
              <span class="rw-item-stop">{{ r.stopName }}</span>
              <span v-for="c in r.chips" :key="c.t" class="rw-mono rw-code" :style="{ background: c.bg, color: c.fg }">{{ c.t }}</span>
              <span v-if="r.mine" class="rw-you">You</span>
            </div>
            <div v-if="r.note" class="rw-note">{{ r.note }}</div>
            <div class="rw-mono rw-meta">{{ r.ago }} · {{ r.confirms }} confirmed</div>
          </div>
          <button
            class="rw-confirm"
            :class="{ 'is-on': r.confirmed }"
            :aria-pressed="r.confirmed"
            :aria-label="`Still true: ${r.label} at ${r.stopName}`"
            @click="reps.confirm(r.id)"
          >
            <span class="material-symbols-outlined" style="font-size: 17px" aria-hidden="true">thumb_up</span>{{ r.confirms }}
          </button>
        </div>

        <div v-if="!reps.feed.value.length" class="rw-empty">
          <span class="material-symbols-outlined" style="font-size: 32px; color: var(--ink3)">search_off</span>
          <div class="rw-empty-title">Nothing matches</div>
          <div class="rw-empty-sub">Try another stop name, or clear the filter.</div>
          <button class="rw-clear" @click="reps.clearFilters">Clear filters</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rw-reports { display: flex; flex-direction: column; gap: 22px; animation: rwIn .5s ease both; }
.rw-kicker { font-size: 11.5px; letter-spacing: .08em; text-transform: uppercase; color: var(--ink2); }
.rw-title { margin: 4px 0 0; font-size: 34px; font-weight: 540; letter-spacing: -.035em; }
.rw-cols { display: grid; grid-template-columns: minmax(0, 380px) minmax(0, 1fr); gap: 20px; align-items: start; }
.rw-side { display: flex; flex-direction: column; gap: 16px; position: sticky; top: 94px; }
.rw-card {
  background: var(--glass); backdrop-filter: blur(28px) saturate(170%); -webkit-backdrop-filter: blur(28px) saturate(170%);
  border: 1px solid var(--glassBd); box-shadow: var(--glassSh); border-radius: 28px;
}
.rw-compose { padding: 18px 20px 20px; display: flex; flex-direction: column; gap: 12px; }
.rw-hot { padding: 18px 20px 8px; }
.rw-head {
  display: flex; align-items: center; gap: 6px; font-size: 11.5px; font-weight: 500; letter-spacing: .07em; text-transform: uppercase;
  color: var(--ink2); padding-bottom: 12px; border-bottom: 1px solid var(--line);
}
.rw-head.is-flush { border-bottom: 0; padding-bottom: 4px; }
.rw-step { font-size: 13px; color: var(--ink2); }
.rw-place {
  height: 32px; padding: 0 12px; border-radius: 9999px; border: 1px solid var(--line); background: transparent; color: var(--ink);
  font-size: 12.5px; font-weight: 500; cursor: pointer; transition: all .15s;
}
.rw-place.is-on { background: var(--solid); color: var(--onSolid); border-color: var(--solid); }
.rw-types { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; }
.rw-type {
  height: 72px; border-radius: 20px; border: 1px solid var(--line); background: var(--field); color: var(--ink);
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; font-size: 12.5px; font-weight: 500;
  cursor: pointer; transition: transform .12s;
}
.rw-type:active { transform: scale(.92); }
.rw-hot-row { display: flex; align-items: center; gap: 8px; font-size: 14px; padding: 11px 0; border-top: 1px solid var(--line); }
.rw-hot-n { color: var(--ink2); font-size: 12.5px; }
.rw-search {
  flex: 1 1 220px; display: flex; align-items: center; gap: 8px; height: 46px; padding: 0 16px; border-radius: 9999px; margin: 0;
  border: 1px solid var(--glassBd); background: var(--glass); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
}
.rw-search input { flex: 1; border: 0; background: transparent; outline: none; font-size: 15px; color: var(--ink); min-width: 0; }
.rw-sorts { display: flex; gap: 2px; padding: 4px; border-radius: 9999px; background: var(--glass); border: 1px solid var(--glassBd); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); }
.rw-sorts button { height: 36px; padding: 0 13px; border-radius: 9999px; border: 0; background: transparent; color: var(--ink2); font-size: 13px; font-weight: 500; cursor: pointer; transition: all .2s; }
.rw-sorts button.is-on { background: var(--solid); color: var(--onSolid); }
.rw-filter {
  height: 34px; padding: 0 13px; border-radius: 9999px; border: 1px solid var(--lineS); background: transparent; color: var(--ink);
  font-size: 13px; font-weight: 500; display: flex; align-items: center; gap: 6px; cursor: pointer; transition: all .15s;
}
.rw-filter.is-on { background: var(--solid); color: var(--onSolid); border-color: var(--solid); }
.rw-filter-n { font-size: 11px; opacity: .65; }
.rw-item {
  display: grid; grid-template-columns: 44px minmax(0, 1fr) auto; gap: 14px; align-items: start; padding: 16px 18px;
  background: var(--glass); backdrop-filter: blur(28px) saturate(170%); -webkit-backdrop-filter: blur(28px) saturate(170%);
  border: 1px solid var(--glassBd); box-shadow: var(--glassSh); border-radius: 24px;
}
.rw-item.is-flash { animation: rwFlash 1.4s ease, rwUp .35s ease; }
.rw-item-icon { width: 44px; height: 44px; border-radius: 50%; background: var(--chip); display: grid; place-items: center; }
.rw-item-type { font-weight: 560; font-size: 16px; }
.rw-at { font-size: 14px; color: var(--ink3); }
.rw-item-stop { font-weight: 500; font-size: 15px; }
.rw-code { font-size: 10.5px; font-weight: 500; padding: 2px 6px; border-radius: 9999px; }
.rw-you { font-size: 10.5px; font-weight: 560; padding: 2px 8px; border-radius: 9999px; background: var(--solid); color: var(--onSolid); }
.rw-note { font-size: 14px; color: var(--ink2); margin-top: 4px; line-height: 1.45; text-wrap: pretty; }
.rw-meta { font-size: 11.5px; color: var(--ink3); margin-top: 6px; }
.rw-confirm {
  height: 38px; padding: 0 13px; border-radius: 9999px; border: 1px solid var(--line); background: transparent; color: var(--ink);
  display: flex; align-items: center; gap: 6px; font-weight: 560; font-size: 13px; cursor: pointer; transition: all .15s;
}
.rw-confirm.is-on { background: var(--solid); color: var(--onSolid); border-color: var(--solid); }
.rw-confirm:active { transform: scale(.9); }
.rw-empty {
  border: 1px dashed var(--lineS); border-radius: 28px; padding: 30px; display: flex; flex-direction: column; align-items: center; gap: 8px;
  text-align: center; background: var(--glass); backdrop-filter: blur(28px); -webkit-backdrop-filter: blur(28px);
}
.rw-empty-title { font-weight: 560; font-size: 17px; }
.rw-empty-sub { font-size: 14px; color: var(--ink2); }
.rw-clear { height: 36px; padding: 0 14px; border-radius: 9999px; border: 1px solid var(--lineS); background: transparent; color: var(--ink); font-weight: 500; font-size: 13px; cursor: pointer; }
@media (max-width: 879px) {
  .rw-cols { grid-template-columns: 1fr; }
  .rw-side { position: static; }
}
</style>
