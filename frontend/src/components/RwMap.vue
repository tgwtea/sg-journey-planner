<script setup>
import { markRaw, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Presentational Leaflet map with OneMap tiles. It draws what it gets and emits clicks.
// The data (stops, rain zones, routes) comes from the feature composables.
const props = defineProps({
  // 'card' = embedded card (Home, Routes). 'full' = full-screen (Map).
  mode: { type: String, default: 'card' },
  dark: { type: Boolean, default: false },
  // { rain, mrt, bus, route } booleans.
  layers: { type: Object, default: () => ({ rain: true, mrt: true, bus: true, route: true }) },
  // [{ id, name, kind: 'mrt' | 'bus', lat, lng, wet, big }]
  stops: { type: Array, default: () => [] },
  selectedStop: { type: String, default: null },
  // [{ lat, lng, r (metres), lvl: 'heavy' | 'light', label }]
  zones: { type: Array, default: () => [] },
  // The highlighted route: [{ k: 'walk' | 'bus' | 'rail', l, pts: [[lat, lng], ...] }]
  route: { type: Array, default: () => [] },
  // Other routes, drawn faint: an array of segment arrays.
  faintRoutes: { type: Array, default: () => [] },
  // [[lat, lng], ...] exposed-walk markers.
  wetMarks: { type: Array, default: () => [] },
  // { origin: { name, lat, lng }, dest: { name, lat, lng } }
  trip: { type: Object, default: null },
  // { NE: ['#9900AA', '#fff'], ... }
  lineColours: { type: Object, default: () => ({}) },
});
const emit = defineEmits(['stop-click', 'recenter']);

const TILES = 'https://www.onemap.gov.sg/maps/tiles/{style}/{z}/{x}/{y}.png';
const ATTRIBUTION = '<img src="https://www.onemap.gov.sg/web-assets/images/logo/om_logo.png" style="height:20px;width:20px;" alt="" />'
  + '&nbsp;<a href="https://www.onemap.gov.sg/" target="_blank" rel="noopener noreferrer">OneMap</a>'
  + '&nbsp;&copy;&nbsp;contributors&nbsp;&#124;&nbsp;<a href="https://www.sla.gov.sg/" target="_blank" rel="noopener noreferrer">Singapore Land Authority</a>';
const SG_BOUNDS = L.latLngBounds([1.144, 103.535], [1.494, 104.502]);
const HOME_BOUNDS = L.latLngBounds([1.2625, 103.8195], [1.3065, 103.8575]);

const el = ref(null);
let map = null;
let tiles = null;
const groups = {};

function tileLayer(dark) {
  return L.tileLayer(TILES, {
    style: dark ? 'Night' : 'Default',
    minZoom: 11, maxZoom: 19, detectRetina: true, attribution: ATTRIBUTION,
  });
}

function divMarker(lat, lng, html, className, size, extra = {}) {
  return L.marker([lat, lng], {
    icon: L.divIcon({ html, className, iconSize: size, iconAnchor: [size[0] / 2, size[1] / 2] }),
    ...extra,
  });
}

function drawZones() {
  const g = groups.zones.clearLayers();
  if (!props.layers.rain) return;
  for (const z of props.zones) {
    const heavy = z.lvl === 'heavy';
    L.circle([z.lat, z.lng], { radius: z.r, className: `rw-zone ${heavy ? 'is-heavy' : ''}`, interactive: false }).addTo(g);
    L.circle([z.lat, z.lng], { radius: z.r * 0.6, className: `rw-zone-core ${heavy ? 'is-heavy' : ''}`, interactive: false }).addTo(g);
    const labelLat = z.lat + (z.r * 0.62) / 111320;
    divMarker(labelLat, z.lng, `<span>${z.label}</span>`, 'rw-zone-label', [z.label.length * 7 + 28, 26], { interactive: false, keyboard: false }).addTo(g);
  }
}

function segStyle(seg) {
  if (seg.k === 'walk') return { className: 'rw-seg rw-seg-walk', weight: 4, dashArray: '0.1 9' };
  if (seg.k === 'bus') return { className: 'rw-seg rw-seg-bus', weight: 6 };
  return { className: 'rw-seg rw-seg-rail', weight: 7, color: props.lineColours[seg.l]?.[0] || '#888' };
}

function drawRoutes() {
  const g = groups.routes.clearLayers();
  if (!props.layers.route) return;
  for (const segs of props.faintRoutes) {
    for (const seg of segs) {
      L.polyline(seg.pts, { className: 'rw-seg-faint', weight: 3.5, dashArray: seg.k === 'walk' ? '0.1 8' : null, interactive: false }).addTo(g);
    }
  }
  for (const seg of props.route) {
    L.polyline(seg.pts, { className: 'rw-seg-casing', weight: seg.k === 'walk' ? 9 : seg.k === 'bus' ? 12 : 13, interactive: false }).addTo(g);
  }
  for (const seg of props.route) {
    L.polyline(seg.pts, { ...segStyle(seg), lineCap: 'round', lineJoin: 'round', interactive: false }).addTo(g);
  }
  for (const seg of props.route.filter((s) => s.k !== 'walk')) {
    L.polyline(seg.pts, { className: 'rw-seg-flow', weight: 2.2, dashArray: '2 22', interactive: false }).addTo(g);
  }
  for (const [lat, lng] of props.wetMarks) {
    divMarker(lat, lng, '<span class="material-symbols-outlined">rainy</span>', 'rw-wet-mark', [26, 26], { interactive: false, keyboard: false }).addTo(g);
  }
}

function drawStops() {
  const g = groups.stops.clearLayers();
  for (const s of props.stops) {
    const isBus = s.kind === 'bus';
    if (isBus ? !props.layers.bus : !props.layers.mrt) continue;
    const sel = s.id === props.selectedStop;
    const dot = isBus
      ? '<span class="rw-stop-bus"><span class="material-symbols-outlined">directions_bus</span></span>'
      : `<span class="rw-stop-mrt ${s.big ? 'is-big' : ''}"></span>`;
    const html = `${sel ? '<span class="rw-stop-ring"></span>' : ''}${dot}`
      + `${s.wet ? '<span class="rw-stop-wet"></span>' : ''}`
      + `${!isBus || sel ? `<span class="rw-stop-name">${s.name}</span>` : ''}`;
    const m = divMarker(s.lat, s.lng, html, `rw-stop ${sel ? 'is-sel' : ''}`, [40, 40], {
      title: `${s.name} ${isBus ? 'bus stop' : 'MRT station'}`,
      alt: s.name,
      riseOnHover: true,
      zIndexOffset: sel ? 1000 : 0,
    });
    m.on('click', () => emit('stop-click', s.id));
    m.addTo(g);
  }
}

function drawTrip() {
  const g = groups.trip.clearLayers();
  if (!props.trip) return;
  const { origin, dest } = props.trip;
  divMarker(origin.lat, origin.lng, `<span class="rw-me-pulse"></span><span class="rw-me"></span><span class="rw-trip-name">${origin.name}</span>`, 'rw-trip', [24, 24], { interactive: false, keyboard: false }).addTo(g);
  divMarker(dest.lat, dest.lng, `<span class="rw-dest">B</span><span class="rw-trip-name">${dest.name}</span>`, 'rw-trip', [24, 24], { interactive: false, keyboard: false }).addTo(g);
}

function focusSelected() {
  const s = props.stops.find((x) => x.id === props.selectedStop);
  if (s) map.flyTo([s.lat, s.lng], 16, { duration: 0.7 });
}

function recenter() {
  map.flyToBounds(HOME_BOUNDS, { duration: 0.7 });
  emit('recenter');
}

onMounted(() => {
  const full = props.mode === 'full';
  map = markRaw(L.map(el.value, {
    zoomControl: false,
    attributionControl: true,
    scrollWheelZoom: full,
    maxBounds: SG_BOUNDS,
    maxBoundsViscosity: 1,
    minZoom: 11,
  }));
  map.attributionControl.setPrefix(false);
  map.fitBounds(HOME_BOUNDS);
  tiles = tileLayer(props.dark).addTo(map);
  for (const name of ['zones', 'routes', 'stops', 'trip']) groups[name] = L.layerGroup().addTo(map);
  drawZones();
  drawRoutes();
  drawStops();
  drawTrip();
  focusSelected();
});

onBeforeUnmount(() => {
  map?.remove();
  map = null;
});

watch(() => props.dark, (dark) => {
  if (!map) return;
  tiles.remove();
  tiles = tileLayer(dark).addTo(map);
});
watch(() => [props.zones, props.layers.rain], () => map && drawZones(), { deep: true });
watch(() => [props.route, props.faintRoutes, props.wetMarks, props.layers.route], () => map && drawRoutes(), { deep: true });
watch(() => [props.stops, props.selectedStop, props.layers.mrt, props.layers.bus], () => map && drawStops(), { deep: true });
watch(() => props.trip, () => map && drawTrip(), { deep: true });
watch(() => props.selectedStop, () => map && focusSelected());

const zoomIn = () => map?.zoomIn();
const zoomOut = () => map?.zoomOut();

defineExpose({ zoomIn, zoomOut, recenter: () => map && recenter() });
</script>

<template>
  <div class="rw-map" :class="mode === 'full' ? 'is-full' : 'is-card'">
    <div ref="el" class="rw-map-canvas"></div>
    <div class="rw-map-zoom">
      <button aria-label="Zoom in" @click="zoomIn"><span class="material-symbols-outlined" style="font-size: 21px">add</span></button>
      <button aria-label="Zoom out" @click="zoomOut"><span class="material-symbols-outlined" style="font-size: 21px">remove</span></button>
      <button aria-label="Recenter" @click="recenter()"><span class="material-symbols-outlined" style="font-size: 20px">my_location</span></button>
    </div>
    <!-- Overlays from the parent view: legend, weather chip, tracing label. -->
    <slot />
  </div>
</template>

<style scoped>
.rw-map { position: relative; overflow: hidden; background: var(--land); transition: background .8s; }
.rw-map.is-card { height: 360px; border-radius: 28px; border: 1px solid var(--glassBd); box-shadow: var(--glassSh); }
.rw-map.is-full { position: fixed; inset: 0; z-index: 1; }
.rw-map-canvas { position: absolute; inset: 0; background: var(--land); font-family: inherit; }
.rw-map-zoom { position: absolute; z-index: 500; top: 14px; right: 14px; display: flex; flex-direction: column; gap: 6px; }
.rw-map.is-full .rw-map-zoom { top: 90px; right: max(14px, calc(50vw - 590px)); }
.rw-map-zoom button {
  width: 42px; height: 42px; border-radius: 50%; border: 1px solid var(--glassBd); background: var(--glassHi);
  backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); color: var(--ink);
  display: grid; place-items: center; cursor: pointer; box-shadow: var(--glassSh);
}
.rw-map-zoom button:active { transform: scale(.9); }
@media (max-width: 879px) {
  .rw-map.is-card { height: 300px; }
}

/* Leaflet draws these elements outside the scoped template, so the rules use :deep(). */
.rw-map :deep(.leaflet-tile-pane) { opacity: .92; filter: saturate(.75); }
.rw-map :deep(.leaflet-control-attribution) { font-size: 10.5px; background: var(--glassHi); color: var(--ink2); border-radius: 9999px 0 0 0; padding: 2px 8px; }
.rw-map :deep(.leaflet-control-attribution a) { color: var(--ink2); }
.rw-map.is-full :deep(.leaflet-bottom) { bottom: 80px; }

.rw-map :deep(.rw-zone) { fill: var(--rain); fill-opacity: .08; stroke: var(--rain); stroke-width: 1.2px; stroke-dasharray: 3 7; stroke-opacity: .5; transition: fill-opacity .8s; }
.rw-map :deep(.rw-zone.is-heavy) { fill-opacity: .14; }
.rw-map :deep(.rw-zone-core) { fill: var(--rain); fill-opacity: .08; stroke: none; }
.rw-map :deep(.rw-zone-core.is-heavy) { fill-opacity: .16; }
.rw-map :deep(.rw-zone-label) { display: grid; place-items: center; }
.rw-map :deep(.rw-zone-label span) { background: var(--solid); color: var(--onSolid); border-radius: 13px; height: 26px; padding: 0 14px; display: flex; align-items: center; font-size: 12.5px; font-weight: 500; white-space: nowrap; }

.rw-map :deep(.rw-seg-faint) { stroke: var(--ink3); stroke-opacity: .45; fill: none; stroke-linecap: round; stroke-linejoin: round; }
.rw-map :deep(.rw-seg-casing) { stroke: var(--surf); fill: none; stroke-linecap: round; stroke-linejoin: round; }
.rw-map :deep(.rw-seg-walk) { stroke: var(--ink); }
.rw-map :deep(.rw-seg-bus) { stroke: var(--ink); }
.rw-map :deep(.rw-seg-flow) { stroke: #fff; stroke-opacity: .85; fill: none; stroke-linecap: round; animation: rwDash 1.4s linear infinite; }
.rw-map :deep(.rw-wet-mark) { display: grid; place-items: center; width: 26px; height: 26px; border-radius: 50%; background: var(--solid); color: var(--onSolid); border: 3px solid var(--surf); }
.rw-map :deep(.rw-wet-mark .material-symbols-outlined) { font-size: 15px; }

.rw-map :deep(.rw-stop) { display: grid; place-items: center; cursor: pointer; }
.rw-map :deep(.rw-stop:focus-visible) { outline: 2px solid var(--ink); outline-offset: 2px; border-radius: 50%; }
.rw-map :deep(.rw-stop-mrt) { width: 14px; height: 14px; border-radius: 50%; background: var(--surf); border: 2.5px solid var(--ink); transition: border-width .2s; }
.rw-map :deep(.rw-stop-mrt.is-big) { width: 18px; height: 18px; }
.rw-map :deep(.rw-stop.is-sel .rw-stop-mrt) { border-width: 4px; }
.rw-map :deep(.rw-stop-bus) { width: 20px; height: 20px; border-radius: 50%; background: var(--solid); color: var(--onSolid); border: 2px solid var(--surf); display: grid; place-items: center; }
.rw-map :deep(.rw-stop-bus .material-symbols-outlined) { font-size: 13px; }
.rw-map :deep(.rw-stop-ring) { position: absolute; left: 6px; top: 6px; width: 28px; height: 28px; border-radius: 50%; border: 2.5px solid var(--ink); animation: rwRing 1.6s ease-out infinite; }
.rw-map :deep(.rw-stop-wet) { position: absolute; left: 25px; top: 6px; width: 9px; height: 9px; border-radius: 50%; background: var(--rain); border: 1.5px solid var(--surf); }
.rw-map :deep(.rw-stop-name),
.rw-map :deep(.rw-trip-name) {
  position: absolute; left: 34px; top: 10px; white-space: nowrap; color: var(--ink); font-size: 14px; font-weight: 560;
  text-shadow: 0 0 3px var(--halo), 0 0 3px var(--halo), 0 0 3px var(--halo);
}
.rw-map :deep(.rw-trip-name) { left: 28px; top: 3px; font-size: 13px; }
.rw-map :deep(.rw-me) { position: absolute; left: 4px; top: 4px; width: 16px; height: 16px; border-radius: 50%; background: var(--ink); border: 3px solid var(--surf); }
.rw-map :deep(.rw-me-pulse) { position: absolute; left: 2px; top: 2px; width: 20px; height: 20px; border-radius: 50%; background: var(--ink); opacity: .3; animation: rwRing 2.2s ease-out infinite; }
.rw-map :deep(.rw-dest) { position: absolute; inset: 0; border-radius: 50%; background: var(--solid); color: var(--onSolid); border: 3px solid var(--surf); display: grid; place-items: center; font-size: 12.5px; font-weight: 600; }
</style>
