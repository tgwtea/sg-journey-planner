<script setup>
// One route option card. Presentational only: it shows a card view model
// from useRouteComparison and emits the user's actions.
defineProps({
  card: { type: Object, required: true },
  hovered: { type: Boolean, default: false },
  dragging: { type: Boolean, default: false },
});
defineEmits(['pin', 'up', 'down', 'map', 'enter', 'leave', 'dragstart', 'dragover', 'dragend']);
</script>

<template>
  <article
    class="rw-rcard"
    :class="{ 'is-best': card.isBest, 'is-hover': hovered, 'is-drag': dragging }"
    draggable="true"
    :aria-label="card.aria"
    @dragstart="$emit('dragstart', $event)"
    @dragover.prevent="$emit('dragover')"
    @drop.prevent
    @dragend="$emit('dragend')"
    @mouseenter="$emit('enter')"
    @mouseleave="$emit('leave')"
  >
    <div class="d-flex align-items-center" style="gap: 8px">
      <span class="rw-mono rw-rank">{{ card.rank }}</span>
      <div class="d-flex flex-wrap flex-grow-1" style="gap: 4px">
        <span v-for="b in card.badges" :key="b.label" class="rw-badge" :class="{ 'is-solid': b.solid }">{{ b.label }}</span>
      </div>
      <button class="rw-round" :class="{ 'is-on': card.pinned }" :aria-pressed="card.pinned" aria-label="Pin route" @click="$emit('pin')">
        <span class="material-symbols-outlined" style="font-size: 18px">push_pin</span>
      </button>
    </div>

    <div>
      <div class="d-flex align-items-baseline" style="gap: 6px">
        <span class="rw-dur">{{ card.dur }}</span><span class="rw-min">min</span>
        <span class="flex-grow-1"></span>
        <span class="rw-mono rw-arr">Arr {{ card.arrive }}</span>
      </div>
      <div class="rw-name">{{ card.name }}</div>
      <div class="rw-via">{{ card.via }}</div>
    </div>

    <div class="d-flex" style="gap: 4px">
      <div
        v-for="(l, i) in card.legs"
        :key="i"
        class="rw-leg"
        :class="`is-${l.kind}`"
        :style="{ flexGrow: l.grow, background: l.bg, color: l.fg }"
      >
        <span class="material-symbols-outlined" style="font-size: 15px">{{ l.icon }}</span>{{ l.text }}
      </div>
    </div>

    <div class="rw-stats">
      <div><div class="rw-stat-k">Transfers</div><div class="rw-stat-v">{{ card.tr }}</div></div>
      <div><div class="rw-stat-k">Walk</div><div class="rw-stat-v">{{ card.walk }}</div></div>
      <div><div class="rw-stat-k">Fare</div><div class="rw-stat-v">{{ card.fare }}</div></div>
    </div>

    <div class="rw-next">
      <span class="rw-next-dot"></span>
      <span class="rw-next-label">{{ card.nextLabel }}</span>
      <span class="rw-mono rw-next-t">{{ card.nextT }}</span>
    </div>

    <div class="d-flex align-items-center flex-wrap" style="gap: 8px">
      <div class="d-flex" aria-hidden="true">
        <span v-for="n in 3" :key="n" class="material-symbols-outlined rw-drop" :class="{ 'is-on': n <= card.exposure }">water_drop</span>
      </div>
      <span class="rw-exp">{{ card.expLabel }}</span>
      <span class="flex-grow-1"></span>
      <span class="rw-comfort" :class="`lv-${card.exposure}`">{{ card.comfort }}</span>
    </div>

    <div class="rw-foot">
      <button class="rw-round" aria-label="Move up" @click="$emit('up')"><span class="material-symbols-outlined" style="font-size: 18px">arrow_upward</span></button>
      <button class="rw-round" aria-label="Move down" @click="$emit('down')"><span class="material-symbols-outlined" style="font-size: 18px">arrow_downward</span></button>
      <span class="flex-grow-1"></span>
      <button class="rw-map-btn" @click="$emit('map')"><span class="material-symbols-outlined" style="font-size: 18px">map</span>View on map</button>
    </div>
  </article>
</template>

<style scoped>
.rw-rcard {
  position: relative; display: flex; flex-direction: column; gap: 16px; padding: 20px; border-radius: 28px; cursor: grab;
  background: var(--glass); backdrop-filter: blur(28px) saturate(170%); -webkit-backdrop-filter: blur(28px) saturate(170%);
  border: 1px solid var(--glassBd); box-shadow: var(--glassSh);
  outline: 1.5px solid transparent; outline-offset: -1px; transition: box-shadow .25s, outline-color .2s, opacity .2s;
}
.rw-rcard.is-hover { outline-color: var(--lineS); box-shadow: var(--glassShHi); }
.rw-rcard.is-best, .rw-rcard.is-drag { outline-color: var(--ink); }
.rw-rcard.is-drag { opacity: .55; box-shadow: var(--glassShHi); }
.rw-rank { font-size: 12.5px; color: var(--ink3); }
.rw-badge { font-size: 11.5px; font-weight: 500; padding: 3px 10px; border-radius: 9999px; border: 1px solid var(--lineS); color: var(--ink); }
.rw-badge.is-solid { background: var(--solid); color: var(--onSolid); border-color: var(--solid); }
.rw-round {
  width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--line); background: transparent; color: var(--ink);
  display: grid; place-items: center; cursor: pointer; transition: all .2s; flex: none;
}
.rw-round:active { transform: scale(.85); }
.rw-round[aria-pressed] { color: var(--ink2); }
.rw-round.is-on { background: var(--solid); color: var(--onSolid); }
.rw-dur { font-size: 46px; font-weight: 500; letter-spacing: -.045em; line-height: 1; }
.rw-min { font-size: 16px; font-weight: 500; color: var(--ink2); }
.rw-arr { font-size: 12.5px; color: var(--ink2); }
.rw-name { font-weight: 560; font-size: 15.5px; margin-top: 8px; }
.rw-via { font-size: 13px; color: var(--ink2); margin-top: 1px; }
.rw-leg {
  flex-basis: 0; min-width: 38px; height: 30px; border-radius: 9999px; display: flex; align-items: center; justify-content: center;
  gap: 3px; font-size: 12px; font-weight: 560; border: 1px solid transparent;
}
.rw-leg.is-walk { background: var(--chip); color: var(--ink2); }
.rw-leg.is-wet { background: transparent; color: var(--ink); border: 1px dashed var(--ink); }
.rw-leg.is-bus { background: var(--solid); color: var(--onSolid); }
.rw-stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
.rw-stat-k { font-size: 12px; color: var(--ink3); }
.rw-stat-v { font-weight: 560; font-size: 15px; margin-top: 2px; }
.rw-next { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 9999px; background: var(--chip); }
.rw-next-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--ink); animation: rwBlink 1.4s infinite; flex: none; }
.rw-next-label { font-size: 13px; font-weight: 500; flex: 1; }
.rw-next-t { font-size: 13.5px; font-weight: 500; }
.rw-drop { font-size: 18px; color: var(--lineS); }
.rw-drop.is-on { color: var(--ink); }
.rw-exp { font-size: 13px; font-weight: 500; }
.rw-comfort { font-size: 12px; font-weight: 500; padding: 4px 11px; border-radius: 9999px; border: 1px solid transparent; }
.rw-comfort.lv-0, .rw-comfort.lv-1 { background: var(--chip); color: var(--ink); }
.rw-comfort.lv-2 { background: transparent; color: var(--ink); border-color: var(--lineS); }
.rw-comfort.lv-3 { background: var(--solid); color: var(--onSolid); border-color: var(--solid); }
.rw-foot { display: flex; gap: 6px; align-items: center; border-top: 1px solid var(--line); padding-top: 14px; }
.rw-map-btn {
  height: 38px; padding: 0 15px; border-radius: 9999px; border: 0; background: var(--solid); color: var(--onSolid);
  font-weight: 560; font-size: 13.5px; display: flex; align-items: center; gap: 6px; cursor: pointer;
}
.rw-map-btn:active { transform: scale(.95); }
</style>
