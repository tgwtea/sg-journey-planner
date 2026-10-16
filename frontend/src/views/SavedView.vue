<script setup>
import { useRouter } from 'vue-router';
import { useSavedRoutes } from '../composables/useSavedRoutes.js';
import { useDepartureRecommendation } from '../composables/useDepartureRecommendation.js';

const router = useRouter();
const saved = useSavedRoutes();
const trip = useDepartureRecommendation();

// The SMU to VivoCity trip opens the route comparison. Other trips plan on Home.
function openTrip(route) {
  trip.setTrip(route.from, route.to);
  if (route.to === 'VivoCity') {
    router.push({ name: 'routes' });
  } else {
    router.push({ name: 'home' });
    trip.plan();
  }
}

function viewAlertRoute(alert) {
  const r = saved.routeOf(alert.route);
  if (!r) return;
  trip.setTrip(r.from, r.to);
  router.push({ name: r.to === 'VivoCity' ? 'routes' : 'home' });
}
</script>

<template>
  <div class="rw-saved">
    <div class="rw-top">
      <div>
        <div class="rw-mono rw-kicker">For regular trips</div>
        <h1 class="rw-title">Saved routes and alerts</h1>
      </div>
      <div class="rw-summary">{{ saved.alertSummary.value }}</div>
    </div>

    <div class="rw-cols">
      <section class="d-flex flex-column" style="gap: 12px">
        <div class="rw-sec"><span class="material-symbols-outlined" style="font-size: 16px">notifications</span>Forecast alerts</div>
        <div v-for="a in saved.alerts.value" :key="a.id" class="rw-card rw-alert">
          <div class="d-flex align-items-start" style="gap: 12px">
            <span class="rw-alert-icon"><span class="material-symbols-outlined" style="font-size: 22px">{{ a.icon }}</span></span>
            <div class="flex-grow-1" style="min-width: 0">
              <div class="rw-mono rw-when">{{ a.when }}</div>
              <div class="rw-alert-title">{{ a.title }}</div>
            </div>
            <button class="rw-dismiss" aria-label="Dismiss alert" @click="saved.dismiss(a.id)">
              <span class="material-symbols-outlined" style="font-size: 19px">close</span>
            </button>
          </div>
          <div class="rw-body">{{ a.body }}</div>
          <div class="d-flex flex-wrap" style="gap: 6px">
            <button class="rw-btn-solid" @click="saved.act(a.id)">{{ a.act }}</button>
            <button class="rw-btn-line" @click="viewAlertRoute(a)">View route</button>
          </div>
        </div>
        <div v-if="!saved.alerts.value.length" class="rw-empty">
          <span class="material-symbols-outlined" style="font-size: 30px">notifications_paused</span>
          <div class="rw-empty-title">All clear, no alerts</div>
          <div class="rw-body">We will warn you if rain heads for one of your regular trips.</div>
          <button class="rw-btn-line rw-btn-sm" @click="saved.restore">Restore demo alerts</button>
        </div>
      </section>

      <section class="d-flex flex-column" style="gap: 12px">
        <div class="rw-sec"><span class="material-symbols-outlined" style="font-size: 16px">bookmark</span>Your routes</div>
        <div class="rw-grid">
          <div v-for="r in saved.cards.value" :key="r.id" class="rw-card rw-route" :class="{ 'is-pinned': r.pinned }">
            <div class="d-flex align-items-start" style="gap: 8px">
              <div class="flex-grow-1" style="min-width: 0">
                <div class="rw-route-name">{{ r.name }}</div>
                <div class="rw-route-trip">{{ r.from }} <span class="rw-arrow">to</span> {{ r.to }}</div>
              </div>
              <button class="rw-pin" :class="{ 'is-on': r.pinned }" :aria-pressed="r.pinned" aria-label="Pin favourite" @click="saved.togglePin(r.id)">
                <span class="material-symbols-outlined" style="font-size: 18px">push_pin</span>
              </button>
            </div>
            <div class="d-flex align-items-center" style="gap: 4px">
              <span
                v-for="(l, i) in r.legs"
                :key="i"
                class="rw-leg"
                :class="`is-${l.kind}`"
                :style="{ background: l.bg, color: l.fg }"
              ><span class="material-symbols-outlined" style="font-size: 14px">{{ l.icon }}</span>{{ l.text }}</span>
              <span class="flex-grow-1"></span>
              <span class="rw-dur">{{ r.dur }}</span>
            </div>
            <div class="rw-time"><span class="material-symbols-outlined" style="font-size: 16px">schedule</span>{{ r.when }}</div>
            <div class="rw-fc" :class="{ 'is-warn': r.warn }">
              <span class="material-symbols-outlined" style="font-size: 17px">{{ r.forecastIcon }}</span>{{ r.forecast }}
            </div>
            <div class="rw-foot">
              <button
                role="switch"
                class="rw-switch"
                :class="{ 'is-on': r.alertOn }"
                :aria-checked="r.alertOn"
                :aria-label="`Rain alerts for ${r.name}`"
                @click="saved.toggleAlert(r.id)"
              ><span class="rw-knob"></span></button>
              <span class="rw-switch-label">Rain alerts</span>
              <span class="flex-grow-1"></span>
              <button class="rw-btn-solid rw-btn-sm" @click="openTrip(r.route)">Plan</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.rw-saved { display: flex; flex-direction: column; gap: 24px; animation: rwIn .5s ease both; }
.rw-top { display: flex; align-items: flex-end; justify-content: space-between; gap: 12px; flex-wrap: wrap; padding-top: 8px; }
.rw-kicker { font-size: 11.5px; letter-spacing: .08em; text-transform: uppercase; color: var(--ink2); }
.rw-title { margin: 4px 0 0; font-size: 34px; font-weight: 540; letter-spacing: -.035em; }
.rw-summary { font-size: 14px; color: var(--ink2); }
.rw-cols { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.6fr); gap: 20px; align-items: start; }
.rw-sec { display: flex; align-items: center; gap: 6px; font-size: 11.5px; font-weight: 500; letter-spacing: .07em; text-transform: uppercase; color: var(--ink2); padding: 0 4px; }
.rw-card {
  background: var(--glass); backdrop-filter: blur(28px) saturate(170%); -webkit-backdrop-filter: blur(28px) saturate(170%);
  border: 1px solid var(--glassBd); box-shadow: var(--glassSh); border-radius: 28px; padding: 18px 20px; display: flex; flex-direction: column;
}
.rw-alert { gap: 12px; animation: rwUp .4s ease both; }
.rw-alert-icon { width: 42px; height: 42px; border-radius: 50%; background: var(--chip); display: grid; place-items: center; flex: none; }
.rw-when { font-size: 11px; color: var(--ink3); text-transform: uppercase; letter-spacing: .07em; }
.rw-alert-title { font-weight: 560; font-size: 16.5px; line-height: 1.3; margin-top: 3px; text-wrap: pretty; }
.rw-dismiss { width: 32px; height: 32px; border-radius: 50%; border: 0; background: transparent; color: var(--ink3); display: grid; place-items: center; cursor: pointer; }
.rw-body { font-size: 14px; color: var(--ink2); line-height: 1.5; text-wrap: pretty; }
.rw-btn-solid { height: 38px; padding: 0 15px; border-radius: 9999px; border: 0; background: var(--solid); color: var(--onSolid); font-weight: 560; font-size: 13.5px; cursor: pointer; }
.rw-btn-solid:active { transform: scale(.95); }
.rw-btn-line { height: 38px; padding: 0 15px; border-radius: 9999px; border: 1px solid var(--lineS); background: transparent; color: var(--ink); font-weight: 500; font-size: 13.5px; cursor: pointer; }
.rw-btn-sm { height: 36px; font-size: 13px; padding: 0 14px; }
.rw-empty {
  border: 1px dashed var(--lineS); border-radius: 28px; padding: 24px; display: flex; flex-direction: column; align-items: flex-start; gap: 8px;
  animation: rwUp .4s ease both; background: var(--glass); backdrop-filter: blur(28px); -webkit-backdrop-filter: blur(28px);
}
.rw-empty-title { font-weight: 560; font-size: 17px; }
.rw-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr)); gap: 16px; }
.rw-route { gap: 14px; outline: 1.5px solid transparent; outline-offset: -1px; transition: outline-color .2s; }
.rw-route.is-pinned { outline-color: var(--lineS); }
.rw-route-name { font-size: 12.5px; color: var(--ink3); }
.rw-route-trip { font-weight: 560; font-size: 17px; line-height: 1.25; margin-top: 3px; }
.rw-arrow { color: var(--ink3); font-weight: 430; }
.rw-pin {
  width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--line); background: transparent; color: var(--ink2);
  display: grid; place-items: center; cursor: pointer; flex: none; transition: all .2s;
}
.rw-pin.is-on { background: var(--solid); color: var(--onSolid); }
.rw-pin:active { transform: scale(.85) rotate(-20deg); }
.rw-leg { height: 26px; min-width: 32px; padding: 0 8px; border-radius: 9999px; display: inline-flex; align-items: center; justify-content: center; gap: 2px; font-size: 11.5px; font-weight: 560; }
.rw-leg.is-walk { background: var(--chip); color: var(--ink2); }
.rw-dur { font-weight: 560; font-size: 15px; }
.rw-time { display: flex; align-items: center; gap: 5px; font-size: 13px; color: var(--ink2); }
.rw-fc { display: flex; align-items: center; gap: 7px; padding: 8px 13px; border-radius: 9999px; background: var(--chip); border: 1px solid transparent; font-size: 13px; font-weight: 500; }
.rw-fc.is-warn { border-color: var(--lineS); }
.rw-foot { display: flex; align-items: center; gap: 10px; border-top: 1px solid var(--line); padding-top: 14px; }
.rw-switch { width: 44px; height: 26px; border-radius: 9999px; border: 0; background: var(--lineS); position: relative; cursor: pointer; transition: background .2s; flex: none; }
.rw-switch.is-on { background: var(--solid); }
.rw-knob {
  position: absolute; top: 3px; left: 3px; width: 20px; height: 20px; border-radius: 50%; background: #fff;
  transition: transform .25s cubic-bezier(.3,1.4,.5,1); box-shadow: 0 1px 3px rgba(0,0,0,.25);
}
.rw-switch.is-on .rw-knob { transform: translateX(18px); background: var(--onSolid); }
.rw-switch-label { font-size: 13px; color: var(--ink2); }
@media (max-width: 879px) {
  .rw-cols { grid-template-columns: 1fr; }
}
</style>
