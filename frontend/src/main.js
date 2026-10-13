import { createApp } from 'vue';

// Bootstrap first, then the mockup styles, so the mockup tokens win.
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/tokens.css';
import './styles/base.css';

import App from './App.vue';
import router from './router';

createApp(App).use(router).mount('#app');
