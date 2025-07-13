import { defineStore } from 'pinia';

interface User {
    id: number;
    name: string;
    email: string;
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
        async login(email: string, password: string) {
            try {
                const api = (await import('../../../api')).default;
                const response = await api.post('/admin/login', { email, password });
                this.token = response.data.access_token;
                await this.fetchUser();
            } catch (error) {
                console.error('Login error:', error.response?.data || error.message);
                throw error;
            }
        },
        async fetchUser() {
            if (!this.token) return;
            try {
                const api = (await import('../../../api')).default;
                const response = await api.post('/admin/me');
                this.user = response.data;
            } catch (error) {
                console.error('Fetch user error:', error.response?.data || error.message);
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