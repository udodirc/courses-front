// src/api/index.ts
import axios from 'axios';
import {setActivePinia} from 'pinia';
import pinia from '../store'; // импортируем pinia

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://mlm-site.local:8084/api',
});

api.interceptors.request.use(async config => {
    setActivePinia(pinia);
    const auth = (await import('../store/admin/auth/auth.store.ts')).useAuthStore();

    if (auth.token && config.headers) {
        config.headers.Authorization = `Bearer ${auth.token}`;
    }
    return config;
});

export default api;