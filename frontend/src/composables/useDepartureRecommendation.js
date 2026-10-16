// OWNER: Tan Guan Wei (Smart Departure Recommender).
//
// DEMO STUB. It copies the mockup: the advice depends only on the demo weather
// and a countdown. Replace the body with the real flow: route options, live
// timings, rain exposure, and a rule-based score. Keep the return shape.
//
// Trip state (shared with other screens):
//   origin, dest, when       refs
//   routes                   ref([...]) route options (mockService shape)
//   selectedRoute            ref(route id) the route shown on the maps
//   activeRoute              computed(route | null)
//   setTrip(from, to), swap(), setDest(name), setWhen(id)
//   plan()                   run the recommendation (shows 'analysing' first)
//   analysing                ref(boolean)
//
// Advice:
//   advice  computed({ key, headline, reason, chips, compare, ring: { dash, text, sub }, remindAt })
//   remind  ref(boolean), toggleRemind()
//   destOptions, whenOptions  option lists for the planner

import { computed, ref, watch } from 'vue';
import { formatTime, useClock } from './useClock.js';
import { useWeatherMode } from './useWeatherMode.js';
import { useLiveArrivals } from './useLiveArrivals.js';
import { useToast, buzz } from './useToast.js';
import { useTour } from './useTour.js';
import { getRouteOptions } from '../services/mockService.js';

export const DEST_OPTIONS = ['VivoCity', 'Changi Airport', 'Tampines Hub', 'Jurong East'];
export const WHEN_OPTIONS = [
  { id: 'now', label: 'Depart now' },
  { id: 'later', label: 'Leave at 9:00 AM' },
  { id: 'arrive', label: 'Arrive by 9:30 AM' },
];
const RING = 219.9; // circumference of the countdown ring (r = 35)

const origin = ref('SMU / Bras Basah');
const dest = ref('VivoCity');
const when = ref('now');
const routes = ref([]);
const selectedRoute = ref('ne');
const analysing = ref(false);
const remind = ref(false);
const anchor = ref(0); // clock tick when the countdown started
let planTimer = null;
let started = false;

export function useDepartureRecommendation() {
  const { tick, now } = useClock();
  const { wx } = useWeatherMode();
  const { nextIn, label } = useLiveArrivals();
  const toast = useToast();

  function plan() {
    buzz();
    analysing.value = true;
    clearTimeout(planTimer);
    planTimer = setTimeout(() => {
      analysing.value = false;
      anchor.value = tick.value;
    }, 1200);
  }

  if (!started) {
    started = true;
    getRouteOptions().then((r) => { routes.value = r; });
    watch(wx, () => { anchor.value = tick.value; });
    const { step } = useTour();
    watch(step, (i) => {
      if (i !== 1) return;
      origin.value = 'SMU / Bras Basah';
      dest.value = 'VivoCity';
      plan();
    });
  }

  const at = (sec) => formatTime(new Date(now.value.getTime() + sec * 1000));

  const advice = computed(() => {
    const w = wx.value;
    const rain = w !== 'clear';
    const total = w === 'heavy' ? 480 : w === 'light' ? 240 : 0;
    const remain = Math.max(0, total - (tick.value - anchor.value));
    const waiting = remain > 0;
    const neNext = nextIn(240, 40);
    const neText = label(neNext) === 'Arr' ? 'arriving' : `in ${label(neNext)}`;
    const pad = (n) => String(n).padStart(2, '0');

    let reason;
    if (waiting) {
      reason = w === 'heavy'
        ? 'Rain near your walking segment should ease, and the next route has fewer transfers.'
        : 'Drizzle over Bras Basah clears in a few minutes, and you still catch an NE train with zero transfers.';
    } else {
      reason = rain
        ? `Rain over Bras Basah has eased. Go now: the NE train from Dhoby Ghaut is ${neText}.`
        : `Shorter wait: the next NE train from Dhoby Ghaut is ${neText}, and your walk is dry all the way.`;
    }

    const chips = waiting
      ? (w === 'heavy'
        ? [{ icon: 'umbrella', label: 'Less rain exposure' }, { icon: 'sync_alt', label: 'Fewer transfers' }]
        : [{ icon: 'umbrella', label: 'Less rain exposure' }, { icon: 'event_available', label: 'Better arrival timing' }])
      : [{ icon: 'timer', label: 'Shorter wait' }, { icon: 'sync_alt', label: 'Fewer transfers' }];

    const compare = waiting
      ? [
        { title: 'Leave now', route: 'EW + NE · 1 transfer', exp: w === 'heavy' ? 'About 6 min in heavy rain' : 'About 5 min in drizzle', expIcon: 'rainy', arrive: at(26 * 60), pick: false },
        { title: `Leave ${at(remain)}`, route: 'NE direct · 0 transfers', exp: w === 'heavy' ? 'About 1 min, light drizzle' : 'Dry by then', expIcon: 'umbrella', arrive: at(remain + 22 * 60), pick: true },
      ]
      : [{ title: 'Go now · NE direct', route: 'Walk 5 min to Dhoby Ghaut NE6 · 0 transfers', exp: rain ? 'Rain has eased' : 'Dry walk', expIcon: 'check_circle', arrive: at(22 * 60), pick: true }];

    return {
      key: (waiting ? 'w' : 'g') + w,
      headline: waiting ? `Wait ${Math.ceil(remain / 60)} min` : 'Leave now',
      reason,
      chips,
      compare,
      ring: waiting
        ? { dash: `${((remain / total) * RING).toFixed(1)} ${RING}`, text: `${Math.floor(remain / 60)}:${pad(remain % 60)}`, sub: `leave ${at(remain)}` }
        : { dash: `${RING} ${RING}`, text: label(neNext) === 'Arr' ? 'Now' : label(neNext), sub: 'next NE train' },
      remindAt: at(remain),
    };
  });

  const activeRoute = computed(() => routes.value.find((r) => r.id === selectedRoute.value) || null);

  function toggleRemind() {
    remind.value = !remind.value;
    if (remind.value) toast.show(`We will remind you at ${advice.value.remindAt}.`);
  }

  return {
    origin, dest, when, routes, selectedRoute, activeRoute, analysing, remind, advice,
    destOptions: DEST_OPTIONS,
    whenOptions: WHEN_OPTIONS,
    plan,
    toggleRemind,
    setTrip: (from, to) => { origin.value = from; dest.value = to; },
    setDest: (name) => { buzz(); dest.value = name; },
    setWhen: (id) => { when.value = id; },
    swap: () => { buzz(); [origin.value, dest.value] = [dest.value, origin.value]; },
  };
}
