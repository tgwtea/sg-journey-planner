// OWNER: Tan Guan Wei (Smart Departure Recommender: live transport timings).
//
// DEMO STUB. It fakes live arrivals from a fixed schedule (period p, offset o)
// and the shared clock. Replace the body with real LTA DataMall arrivals
// (through the backend). Keep the return shape, so the views do not change.
//
// Returns:
//   lineColours  ref({ NE: ['#9900AA', '#fff'], ... })
//   nextIn(p, o) seconds until the next departure
//   label(sec)   'Arr' or 'N min'
//   arrival(a)   { svc, bg, fg, t, now, sec } for one schedule row { s, p, o }

import { ref } from 'vue';
import { useClock } from './useClock.js';
import { getLineColours } from '../services/mockService.js';

const lineColours = ref({});
let loaded = false;

export function useLiveArrivals() {
  const { tick } = useClock();
  if (!loaded) {
    loaded = true;
    getLineColours().then((l) => { lineColours.value = l; });
  }

  const nextIn = (p, o) => p - ((tick.value + o) % p);
  const label = (sec) => (sec < 45 ? 'Arr' : `${Math.ceil(sec / 60)} min`);

  function serviceColour(s) {
    const c = lineColours.value[s];
    return c ? { bg: c[0], fg: c[1] } : { bg: 'var(--solid)', fg: 'var(--onSolid)' };
  }

  function arrival(a) {
    const sec = nextIn(a.p, a.o);
    const t = label(sec);
    return { svc: a.s, ...serviceColour(a.s), t, now: t === 'Arr', sec };
  }

  return { lineColours, nextIn, label, arrival, serviceColour };
}
