<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';

// Full-screen animated sky from the mockup startSky(): gradient, clouds, sun, rain.
// Vivid palette only. It eases toward the colours for the current weather and theme.
const props = defineProps({
  wx: { type: String, default: 'clear' }, // 'clear' | 'light' | 'heavy'
  dark: { type: Boolean, default: false },
});

const SKY = {
  day: { clear: ['#FFC46B', '#FFDDAE', '#FFF1DE'], light: ['#9DBDFF', '#CFE0FF', '#E8F0FF'], heavy: ['#6F62E8', '#B3AAFF', '#ECE9FF'] },
  night: { clear: ['#2A1F55', '#1F1840', '#1A1530'], light: ['#173063', '#122242', '#0E1A30'], heavy: ['#2B2080', '#1A1550', '#110E26'] },
};

const canvas = ref(null);
let raf = 0;
let onResize = null;

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lerp = (a, b, t) => a + (b - a) * t;
const rgb = (a) => `rgb(${a[0] | 0},${a[1] | 0},${a[2] | 0})`;

onMounted(() => {
  const c = canvas.value;
  const ctx = c.getContext('2d');
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  onResize = () => {
    const d = Math.min(2, window.devicePixelRatio || 1);
    c.width = innerWidth * d;
    c.height = innerHeight * d;
    ctx.setTransform(d, 0, 0, d, 0, 0);
  };
  onResize();
  window.addEventListener('resize', onResize);

  const cur = { stops: null, cloud: null, ca: 0, sun: 0 };
  const clouds = Array.from({ length: 7 }, (_, i) => ({
    x: Math.random(), y: 0.05 + Math.random() * 0.6, r: 0.22 + Math.random() * 0.22,
    v: (0.00004 + Math.random() * 0.00008) * (i % 2 ? 1 : -1),
  }));
  const drops = [];
  const mk = (init) => ({
    x: Math.random() * (innerWidth + 200) - 100,
    y: init ? Math.random() * innerHeight : -30 - Math.random() * 120,
    v: 8 + Math.random() * 8, l: 12 + Math.random() * 18, w: 0.6 + Math.random() * 0.7, a: 0.04 + Math.random() * 0.1,
  });

  const loop = () => {
    const { wx, dark } = props;
    const target = SKY[dark ? 'night' : 'day'][wx].map(hex);
    const cloudColour = dark ? [110, 96, 190] : wx === 'heavy' ? [190, 180, 255] : wx === 'light' ? [255, 255, 255] : [255, 236, 205];
    const cloudAlpha = dark ? 0.22 : wx === 'heavy' ? 0.45 : 0.55;
    const sunTarget = wx === 'clear' ? 1 : 0;

    if (!cur.stops) {
      cur.stops = target.map((a) => a.slice());
      cur.cloud = cloudColour.slice();
      cur.ca = cloudAlpha;
    }
    const e = reduce ? 1 : 0.03;
    cur.stops.forEach((st, i) => st.forEach((v, j) => { st[j] = lerp(v, target[i][j], e); }));
    cur.cloud.forEach((v, j) => { cur.cloud[j] = lerp(v, cloudColour[j], e); });
    cur.sun = lerp(cur.sun, sunTarget, e);
    cur.ca = lerp(cur.ca, cloudAlpha, e);

    const W = innerWidth;
    const H = innerHeight;
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, rgb(cur.stops[0]));
    g.addColorStop(0.5, rgb(cur.stops[1]));
    g.addColorStop(1, rgb(cur.stops[2]));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    if (cur.sun > 0.01) {
      const R = Math.max(140, Math.min(W, H) * 0.24);
      const x = W * 0.84;
      const y = H * 0.12;
      const sg = ctx.createRadialGradient(x, y, 0, x, y, R);
      const sc = dark ? '255,210,130' : '255,168,72';
      sg.addColorStop(0, `rgba(${sc},${cur.sun * (dark ? 0.55 : 0.9)})`);
      sg.addColorStop(0.72, `rgba(${sc},${cur.sun * (dark ? 0.5 : 0.82)})`);
      sg.addColorStop(1, `rgba(${sc},0)`);
      ctx.fillStyle = sg;
      ctx.beginPath();
      ctx.arc(x, y, R, 0, Math.PI * 2);
      ctx.fill();
    }

    const cc = cur.cloud.map((v) => v | 0).join(',');
    for (const cl of clouds) {
      if (!reduce) {
        cl.x += cl.v;
        if (cl.x > 1.4) cl.x = -0.4;
        if (cl.x < -0.4) cl.x = 1.4;
      }
      const R = cl.r * Math.max(W, H);
      const x = cl.x * W;
      const y = cl.y * H;
      const rg = ctx.createRadialGradient(x, y, 0, x, y, R);
      rg.addColorStop(0, `rgba(${cc},${cur.ca})`);
      rg.addColorStop(1, `rgba(${cc},0)`);
      ctx.fillStyle = rg;
      ctx.beginPath();
      ctx.ellipse(x, y, R, R * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    const dropTarget = Math.round((wx === 'heavy' ? 160 : wx === 'light' ? 55 : 0) * (reduce ? 0.2 : 1));
    while (drops.length < dropTarget) drops.push(mk(drops.length < dropTarget * 0.5));
    if (drops.length > dropTarget) drops.splice(0, Math.min(5, drops.length - dropTarget));
    const col = dark ? '205,215,228' : wx === 'heavy' ? '60,48,170' : '50,90,200';
    const sp = wx === 'heavy' ? 1.2 : 0.85;
    ctx.lineCap = 'round';
    for (const d of drops) {
      d.y += d.v * sp * (reduce ? 0.15 : 1);
      d.x += d.v * 0.14 * sp;
      if (d.y > H + 20) Object.assign(d, mk(false));
      ctx.strokeStyle = `rgba(${col},${d.a})`;
      ctx.lineWidth = d.w;
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x - d.l * 0.14, d.y - d.l);
      ctx.stroke();
    }
    raf = requestAnimationFrame(loop);
  };
  loop();
});

onBeforeUnmount(() => {
  cancelAnimationFrame(raf);
  if (onResize) window.removeEventListener('resize', onResize);
});
</script>

<template>
  <canvas ref="canvas" class="rw-sky" aria-hidden="true"></canvas>
</template>

<style scoped>
.rw-sky { position: fixed; inset: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 0; }
</style>
