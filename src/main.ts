import { createApp } from 'vue';
import App from './App.vue';
import './style.css';

import pinia from './store';
import piniaPersistedstate from 'pinia-plugin-persistedstate';
import router from './router';

import { useAuthStore } from './store/admin/auth/auth.store';

const app = createApp(App);
pinia.use(piniaPersistedstate);
app.use(pinia);

const auth = useAuthStore();

auth.fetchUser().finally(() => {
    app.use(router);
    app.mount('#app');
});