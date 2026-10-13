import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    // Forward /api calls to the local Express server, so the browser
    // sees one origin, the same as on Vercel.
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
});
