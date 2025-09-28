import axios from 'axios';
import { useAuthStore } from '../store/admin/auth/auth.store';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://mlm-site.local:8084/api',
});

api.interceptors.request.use(config => {
    const auth = useAuthStore();

    if (auth.token && config.headers) {
        config.headers.Authorization = `Bearer ${auth.token}`;
    }
    return config;
});

export default api;