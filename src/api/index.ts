import axios from 'axios';
import { useAuthStore } from '../store/admin/auth/auth.store';
import { usePartnerStore } from '../store/client/partner.store';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(config => {
    const auth = useAuthStore();
    const partner = usePartnerStore();

    if (auth.token && config.headers && config.url?.startsWith('/admin')) {
        config.headers.Authorization = `Bearer ${auth.token}`;
    } else if (partner.token && config.headers) {
        config.headers.Authorization = `Bearer ${partner.token}`;
    }

    return config;
});

export default api;