import axios from 'axios';
import { useAuthStore } from '../store/admin/auth/auth.store';
import { usePartnerStore } from '../store/client/partner.store';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(config => {
    const authToken = useAuthStore().token;
    const partnerToken = usePartnerStore().token;

    if (config.url?.startsWith('/admin') && authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
    } else if (partnerToken) {
        config.headers.Authorization = `Bearer ${partnerToken}`;
    }

    return config;
});

export default api;