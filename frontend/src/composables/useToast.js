import { ref } from 'vue';

// One shared toast message at the top of the screen.
const message = ref('');
const key = ref(0);
let timer = null;

export function buzz() {
  try { navigator.vibrate?.(12); } catch { /* not supported */ }
}

export function useToast() {
  function show(text) {
    buzz();
    message.value = text;
    key.value += 1;
    clearTimeout(timer);
    timer = setTimeout(() => { message.value = ''; }, 2600);
  }
  return { message, key, show };
}
