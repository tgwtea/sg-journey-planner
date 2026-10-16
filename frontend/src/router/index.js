import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

// The 5 screens of the mockup bottom tab bar.
// `meta.icon` is a Material Symbols name; `meta.width` is the column width
// that the mockup uses for each screen.
export const routes = [
  { path: '/', name: 'home', component: HomeView, meta: { label: 'Home', icon: 'home', width: '680px' } },
  { path: '/routes', name: 'routes', component: () => import('../views/RoutesView.vue'), meta: { label: 'Routes', icon: 'alt_route', width: '1080px' } },
  { path: '/map', name: 'map', component: () => import('../views/MapView.vue'), meta: { label: 'Map', icon: 'map', width: '1180px' } },
  { path: '/saved', name: 'saved', component: () => import('../views/SavedView.vue'), meta: { label: 'Saved', icon: 'bookmark', width: '1180px' } },
  { path: '/reports', name: 'reports', component: () => import('../views/ReportsView.vue'), meta: { label: 'Reports', icon: 'forum', width: '1180px' } },
  
  // catch-all route pattern used in Vue Router (Vue 3) to match any URL path that does not match your defined routes
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});
