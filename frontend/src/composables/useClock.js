import { ref } from 'vue';

// One shared 1-second clock for the whole app.
// tick counts seconds since the app started. now is the current Date.
const tick = ref(0);
const now = ref(new Date());
let timer = null;

export function formatTime(date) {
  return date.toLocaleTimeString('en-SG', { hour: 'numeric', minute: '2-digit' }).toUpperCase();
}

export function useClock() {
  if (!timer && typeof window !== 'undefined') {
    timer = setInterval(() => {
      tick.value += 1;
      now.value = new Date();
    }, 1000);
  }
  return { tick, now };
}
