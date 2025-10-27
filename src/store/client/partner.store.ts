import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../../api';
import { PartnerApi } from '../../api/admin/partner/partner.api';
import type { Partner } from '../../types/Partner';

const partnerApi = new PartnerApi();

export const usePartnerStore = defineStore('partner', () => {
    // === авторизация ===
    const user = ref<Partner | null>(null);
    const token = ref(localStorage.getItem('partner_token') || '');
    const isAuthenticated = computed(() => !!token.value);

    // === список партнёров ===
    const items = ref<Partner[]>([]);
    const loading = ref(false);
    const error = ref('');
    const currentPage = ref(1);
    const totalPages = ref(1);
    const perPage = ref(10);
    const filters = ref<Record<string, any>>({});

    // === действия ===
    async function login(login: string, password: string) {
        try {
            const response = await api.post('/login', { login, password });
            token.value = response.data.token;
            localStorage.setItem('partner_token', token.value);
            await fetchUser();

            if (user.value?.id) {
                localStorage.setItem('partner_id', user.value.id.toString());
            }
        } catch (error: any) {
            console.error('Login error:', error.response?.data || error.message);
            throw error;
        }
    }

    async function register(sponsor: string, login: string, email: string, password: string) {
        try {
            const response = await api.post('/register', { sponsor, login, email, password });
            token.value = response.data.token;
            localStorage.setItem('partner_token', token.value);
            await fetchUser();
        } catch (error: any) {
            console.error('Register error:', error.response?.data || error.message);
            throw error;
        }
    }

    async function fetchUser() {
        if (!token.value) return;
        try {
            const response = await api.get('/partner/me', {
                headers: { Authorization: `Bearer ${token.value}` },
            });
            user.value = response.data;
        } catch (error) {
            console.error('Fetch user error:', error);
            logout();
        }
    }

    function logout() {
        token.value = '';
        user.value = null;
        localStorage.removeItem('partner_token');
    }

    // === список партнёров ===
    async function fetchList(f: Record<string, any> = {}, page = 1, url: string) {
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

    // === вычисляемые ===
    const partnerList = computed(() =>
        items.value.map(item => ({
            ...item
        }))
    );

    return {
        // auth
        user,
        token,
        isAuthenticated,
        login,
        register,
        fetchUser,
        logout,

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
    };
});