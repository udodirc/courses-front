// src/stores/auth.ts
import { defineStore } from 'pinia';
import api from '../../../api';

interface User {
    id: number;
    name: string;
    email: string;
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as User | null,
        token: localStorage.getItem('token') || '',
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
    },
    actions: {
        async login(login: string, password: string) {
            const response = await api.post('/admin/login', { login, password });
            this.token = response.data.token;
            localStorage.setItem('token', this.token);
            await this.fetchUser();
        },
        async fetchUser() {
            if (!this.token) return;
            try {
                const response = await api.post('/admin/me');
                this.user = response.data;
            } catch {
                this.logout();
            }
        },
        logout() {
            this.token = '';
            this.user = null;
            localStorage.removeItem('token');
        },
    },
});