import { defineStore } from 'pinia';
import api from '../../../api';

interface User {
    id: number;
    name: string;
    login: string;
    is_superadmin: boolean;
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as User | null,
        token: '',
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
    },
    actions: {
        async login(name: string, password: string) {
            try {
                const response = await api.post('/admin/login', { name, password });
                this.token = response.data.access_token;
                await this.fetchUser();
            } catch (error: unknown) {
                const err = error as any;
                console.error('Login error:', err.response?.data || err.message);
                throw error;
            }
        },
        async fetchUser() {
            if (!this.token) return;
            try {
                const response = await api.post('/admin/me');
                this.user = response.data;
            } catch (error) {
                const err = error as any;
                console.error('Fetch user error:', err.response?.data || err.message);
                this.logout();
            }
        },
        logout() {
            this.token = '';
            this.user = null;
        },
    },
    persist: true,
});