import { createApp } from 'vue';
import App from './App.vue';
//import './style.css';

import pinia from './store';
import piniaPersistedstate from 'pinia-plugin-persistedstate';
import router from './router';

import { useAuthStore } from './store/admin/auth/auth.store';

import PrimeVue from 'primevue/config';
import MultiSelect from 'primevue/multiselect';

// import 'primevue/resources/themes/lara-light-blue/theme.css'; // ✅ корректная тема
// import 'primevue/resources/primevue.min.css';
// import 'primeicons/primeicons.css';

const app = createApp(App);
app.use(PrimeVue);
app.component('MultiSelect', MultiSelect);
pinia.use(piniaPersistedstate);
app.use(pinia);

const auth = useAuthStore();

auth.fetchUser().finally(() => {
    app.use(router);
    app.mount('#app');
});