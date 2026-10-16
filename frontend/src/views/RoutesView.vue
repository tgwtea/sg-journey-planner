<script setup>
import { computed, inject } from 'vue';
import { useRouter } from 'vue-router';
import RwMap from '../components/RwMap.vue';
import MapWeatherChip from '../components/MapWeatherChip.vue';
import RouteCard from '../components/routes/RouteCard.vue';
import { formatTime, useClock } from '../composables/useClock.js';
import { useDepartureRecommendation } from '../composables/useDepartureRecommendation.js';
import { useRouteComparison } from '../composables/useRouteComparison.js';
import { useRainMap } from '../composables/useRainMap.js';
import { useLiveArrivals } from '../composables/useLiveArrivals.js';
import { buzz } from '../composables/useToast.js';

const ui = inject('ui');
const router = useRouter();
const { now } = useClock();
const trip = useDepartureRecommendation();
const cmp = useRouteComparison();
const rain = useRainMap();
const { lineColours } = useLiveArrivals();

const whenLabel = computed(() => trip.whenOptions.find((w) => w.id === trip.when.value)?.label || '');

// The map traces the hovered card, or else the selected route. Other routes are faint.
const activeId = computed(() => cmp.hover.value || trip.selectedRoute.value);
const activeRoute = computed(() => trip.routes.value.find((r) => r.id === activeId.value) || null);
const faintRoutes = computed(() => trip.routes.value.filter((r) => r.id !== activeId.value).map((r) => r.segs));
const tracing = computed(() => (cmp.hover.value ? trip.routes.value.find((r) => r.id === cmp.hover.value)?.name : ''));

let lastOver = null;
function onDragStart(e, id) {
  try {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  } catch { /* some browsers block dataTransfer */ }
  buzz();
  cmp.drag.value = id;
  cmp.hover.value = id;
}
function onDragOver(id) {
  if (!cmp.drag.value || cmp.drag.value === id || lastOver === id) return;
  lastOver = id;
  cmp.moveTo(cmp.drag.value, id);
  setTimeout(() => { lastOver = null; }, 250);
}
function onDragEnd() {
  cmp.drag.value = null;
  buzz();
}
function viewOnMap(id) {
  buzz();
  trip.selectedRoute.value = id;
  rain.selectedStop.value = null;
  cmp.hover.value = null;
  router.push({ name: 'map' });
}
</script>

<template>
  <div class="rw-routes">
    <div class="rw-top">
      <button class="rw-back" aria-label="Back to dashboard" @click="router.push({ name: 'home' })">
        <span class="material-symbols-outlined" style="font-size: 22px">arrow_back</span>
      </button>
      <div style="min-width: 0">
        <div class="rw-mono rw-kicker">{{ whenLabel }} · {{ formatTime(now) }} · {{ cmp.cards.value.length }} options</div>
        <h1 class="rw-title">
          <span>{{ trip.origin.value }}</span>
          <span class="material-symbols-outlined rw-arrow" aria-label="to">arrow_forward</span>
          <span>{{ trip.dest.value }}</span>
        </h1>
      </div>
    </div>
    <div class="d-flex flex-wrap" style="gap: 6px">
      <span v-for="c in cmp.conditions.value" :key="c.text" class="rw-cond" :class="{ 'is-solid': c.solid }">
        <span class="material-symbols-outlined" style="font-size: 17px">{{ c.icon }}</span>{{ c.text }}
      </span>
    </div>

    <RwMap
      :dark="ui.dark"
      :stops="rain.mapStops.value"
      :zones="rain.zones.value"
      :route="activeRoute?.segs || []"
      :faint-routes="faintRoutes"
      :wet-marks="ui.wx !== 'clear' ? activeRoute?.wet || [] : []"
      :trip="rain.trip.value"
      :line-colours="lineColours"
      @stop-click="rain.openStop"
    >
      <div v-if="tracing" class="rw-tracing">
        <span class="material-symbols-outlined" style="font-size: 17px">alt_route</span>Tracing: {{ tracing }}
      </div>
      <MapWeatherChip :icon="rain.forecast.value?.icon" :text="rain.forecast.value?.chip" @explore="router.push({ name: 'map' })" />
    </RwMap>

    <div class="d-flex flex-wrap align-items-center" style="gap: 6px">
      <span class="rw-sort-label">Sort by</span>
      <button
        v-for="o in cmp.sortOptions.value"
        :key="o.id"
        class="rw-sort"
        :class="{ 'is-on': o.on }"
        :aria-pressed="o.on"
        @click="cmp.setSort(o.id)"
      >
        <span class="material-symbols-outlined" style="font-size: 17px" aria-hidden="true">{{ o.icon }}</span>{{ o.label }}
      </button>
    </div>
    <div class="rw-hint">
      <span class="material-symbols-outlined" style="font-size: 17px">drag_indicator</span>
      Drag cards to set your own priority · pin to keep on top · hover to trace on the map
    </div>

    <TransitionGroup tag="div" name="rw-card" class="rw-grid">
      <RouteCard
        v-for="card in cmp.cards.value"
        :key="card.id"
        :card="card"
        :hovered="cmp.hover.value === card.id"
        :dragging="cmp.drag.value === card.id"
        @pin="cmp.pin(card.id)"
        @up="cmp.moveBy(card.id, -1)"
        @down="cmp.moveBy(card.id, 1)"
        @map="viewOnMap(card.id)"
        @enter="!cmp.drag.value && (cmp.hover.value = card.id)"
        @leave="!cmp.drag.value && (cmp.hover.value = null)"
        @dragstart="onDragStart($event, card.id)"
        @dragover="onDragOver(card.id)"
        @dragend="onDragEnd"
      />
    </TransitionGroup>
  </div>
</template>

<style scoped>
.rw-routes { display: flex; flex-direction: column; gap: 16px; animation: rwIn .5s ease both; }
.rw-top { display: flex; align-items: center; gap: 14px; padding-top: 8px; }
.rw-back {
  width: 46px; height: 46px; border-radius: 50%; border: 1px solid var(--glassBd); background: var(--glass);
  backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); color: var(--ink); display: grid; place-items: center; cursor: pointer; flex: none;
}
.rw-kicker { font-size: 11.5px; letter-spacing: .08em; text-transform: uppercase; color: var(--ink2); }
.rw-title { font-size: 30px; font-weight: 540; letter-spacing: -.03em; line-height: 1.15; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin: 2px 0 0; }
.rw-arrow { font-size: 24px; color: var(--ink3); }
.rw-cond {
  height: 32px; padding: 0 13px; border-radius: 9999px; background: var(--glass); color: var(--ink); border: 1px solid var(--glassBd);
  display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 500;
}
.rw-cond.is-solid { background: var(--solid); color: var(--onSolid); border-color: var(--solid); }
.rw-tracing {
  position: absolute; z-index: 500; top: 14px; left: 50%; transform: translateX(-50%); background: var(--solid); color: var(--onSolid);
  border-radius: 9999px; padding: 8px 14px; font-size: 13px; font-weight: 500; display: flex; align-items: center; gap: 6px;
  animation: rwFade .25s ease both; white-space: nowrap;
}
.rw-sort-label { font-size: 13px; color: var(--ink3); margin-right: 4px; }
.rw-sort {
  height: 36px; padding: 0 14px; border-radius: 9999px; border: 1px solid var(--lineS); background: transparent; color: var(--ink);
  font-size: 13.5px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all .2s;
}
.rw-sort.is-on { background: var(--solid); color: var(--onSolid); border-color: var(--solid); }
.rw-sort:active { transform: scale(.95); }
.rw-hint { font-size: 13px; color: var(--ink2); display: flex; align-items: center; gap: 6px; }
.rw-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 340px), 1fr)); gap: 16px; }
/* Cards slide to their new place when the order changes (Vue's FLIP move transition). */
.rw-card-move { transition: transform .45s cubic-bezier(.2,.8,.2,1); }
</style>
