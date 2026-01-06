import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../../../api';
import { FrontPartnerApi } from '../../../api/front/partner/partner.api.ts';
import type { Partner } from '../../../types/Partner.ts';

const partnerApi = new FrontPartnerApi();

export const usePartnerStore = defineStore('partner', () => {
    const user = ref<Partner | null>(null);
    const token = ref(localStorage.getItem('partner_token') || '');
    const isAuthenticated = computed(() => !!token.value);

    const items = ref<Partner[]>([]);
    const loading = ref(false);
    const error = ref('');
    const currentPage = ref(1);
    const totalPages = ref(1);
    const perPage = ref(10);
    const filters = ref<Record<string, any>>({});

    // === авторизация ===
    async function login(login: string, password: string) {
        try {
            const response = await api.post('/login', { login, password });
            token.value = response.data.token;
            localStorage.setItem('partner_token', token.value);
            await fetchUser();

            if (user.value?.id) localStorage.setItem('partner_id', user.value.id.toString());
        } catch (e: any) {
            console.error('Login error:', e.response?.data || e.message);
            throw e;
        }
    }

    async function register(sponsor: string, login: string, email: string, password: string) {
        try {
            const response = await api.post('/register', { sponsor, login, email, password });
            token.value = response.data.token;
            localStorage.setItem('partner_token', token.value);
            await fetchUser();
        } catch (e: any) {
            console.error('Register error:', e.response?.data || e.message);
            throw e;
        }
    }

    async function resetPassword(email: string) {
        try {
            await api.post('/password/email', { email });
        } catch (e: any) {
            console.error('Forgot password error:', e.response?.data || e.message);
            throw e;
        }
    }

    // === повторная отправка email для подтверждения ===
    async function resendVerification(login: string) {
        try {
            loading.value = true;
            await api.post('/partner/email/resend', { login });
        } catch (e: any) {
            console.error('Resend verification error:', e.response?.data || e.message);
            throw e;
        } finally {
            loading.value = false;
        }
    }

    async function fetchUser() {
        if (!token.value) return;
        try {
            const response = await api.get('/partner/me', {
                headers: { Authorization: `Bearer ${token.value}` },
            });
            user.value = response.data;
            localStorage.setItem('partner_data', JSON.stringify(user.value));
        } catch (e: any) {
            console.error('Fetch user error:', e);
            if (e.response?.data?.error === "Email not verified" || e.response?.status === 403) {
                throw e;
            }
            logout();
            throw e;
        }
    }

    function logout() {
        token.value = '';
        user.value = null;
        localStorage.removeItem('partner_token');
    }

    // === список партнёров ===
    async function fetchList(f: Record<string, any> = {}, page = 1, url?: string) {
        loading.value = true;
        error.value = '';
        try {
            filters.value = { ...f };
            const res = await partnerApi.getList({ ...f, page, per_page: perPage.value }, url);
            items.value = res.data;

            if (res.meta) {
                currentPage.value = res.meta.current_page ?? page;
                totalPages.value = res.meta.last_page ?? 1;
                perPage.value = Number(res.meta.per_page ?? perPage.value);
            } else {
                currentPage.value = page;
                totalPages.value = 1;
            }
        } catch (e: any) {
            error.value = e?.response?.data?.message || 'Ошибка загрузки';
            throw e;
        } finally {
            loading.value = false;
        }
    }

    async function fetchStats() {
        if (!user.value?.id) {
            error.value = 'Партнер не найден';
            return;
        }

        loading.value = true;
        error.value = '';
        try {
            const res = await partnerApi.stats(user.value.id);
            user.value = res.data;
        } catch (e: any) {
            error.value = e?.response?.data?.message || 'Ошибка загрузки статистики';
            throw e;
        } finally {
            loading.value = false;
        }
    }

    const partnerList = computed(() => items.value.map(item => ({ ...item })));

    return {
        // auth
        user,
        token,
        isAuthenticated,
        login,
        register,
        fetchUser,
        logout,
        resetPassword,
        resendVerification,

        // list
        items,
        partnerList,
        loading,
        error,
        filters,
        currentPage,
        totalPages,
        perPage,
        fetchList,
        fetchStats,
    };
});