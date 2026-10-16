<!-- youtube tutorial: https://www.youtube.com/watch?v=_c4z1GeKi_4 -->
<!-- OneMap WMS doc: https://www.onemap.gov.sg/docs/maps/ -->

<script setup>
import { ref } from 'vue';
import L from 'leaflet';

// defineProps({
//   items: { type: Array, required: true },
// });

// Explicitly expose function to the parent
defineExpose({
  initialiseOneMap
})

// const lat = ref(0);
// const lng = ref(0);

const map = ref();
const mapContainer = ref();
let sw = L.latLng(1.144, 103.535);
let ne = L.latLng(1.494, 104.502);
let bounds = L.latLngBounds(sw, ne);

function initialiseOneMap() {
  // OneMap WMS view 
  map.value = L.map(mapContainer.value).setView([1.2868108, 103.8545349], 16).setMaxBounds(bounds);
  L.tileLayer.wms('https://www.onemap.gov.sg/maps/tiles/Default/{z}/{x}/{y}.png', {
    layers: 'Default',
    format: "image/png",
    version: "1.0.0",
    WMTVER:  "1.0.0",
    crs: L.CRS.EPSG4326,
    maxZoom: 18,
    minZoom: 11,
    /** DO NOT REMOVE the OneMap attribution below **/
    attribution: '<img src="https://www.onemap.gov.sg/web-assets/images/logo/om_logo.png" style="height:20px;width:20px;"/>&nbsp;<a href="https://www.onemap.gov.sg/" target="_blank" rel="noopener noreferrer">OneMap</a>&nbsp;&copy;&nbsp;contributors&nbsp;&#124;&nbsp;<a href="https://www.sla.gov.sg/" target="_blank" rel="noopener noreferrer">Singapore Land Authority</a>'
  }).addTo(map.value);
}

// function getLocation() {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition((position) => {
//       lat.value = position.coords.latitude;
//       lng.value = position.coords.longitude;
//     })
//   }
// }

</script>

<template>
  <div ref="mapContainer" style="width: 100vw; height: 100vh"></div>
</template>

<style scoped>

</style>
