import { defineStore } from 'pinia';
import api from '../../api'; // общий axios

interface Partner {
    id: number;
    name: string;
    login: string;
}

export const usePartnerStore = defineStore('partner', {
    state: () => ({
        user: null as Partner | null,
        token: localStorage.getItem('partner_token') || '', // авто-загрузка
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
    },
    actions: {
        // Вход
        async login(login: string, password: string) {
            try {
                const response = await api.post('/login', { login, password });
                this.token = response.data.token;
                localStorage.setItem('partner_token', this.token);
                await this.fetchUser();
            } catch (error: any) {
                console.error('Partner login error:', error.response?.data || error.message);
                throw error;
            }
        },

        // Регистрация
        async register(sponsor: string, login: string, email: string, password: string) {
            try {
                const response = await api.post('/register', { sponsor, login, email, password });
                this.token = response.data.token;
                localStorage.setItem('partner_token', this.token);
                await this.fetchUser();
            } catch (error: any) {
                console.error('Partner register error:', error.response?.data || error.message);
                throw error;
            }
        },

        // Восстановление пароля
        async forgotPassword(email: string) {
            try {
                await api.post('/forgot-password', { email });
            } catch (error: any) {
                console.error('Partner forgot password error:', error.response?.data || error.message);
                throw error;
            }
        },

        // Получение данных пользователя
        async fetchUser() {
            if (!this.token) return;
            try {
                const response = await api.get('/partner/me');
                this.user = response.data;
            } catch (error) {
                console.error('Fetch partner user error:', error);
                this.logout();
            }
        },

        // Выход
        logout() {
            this.token = '';
            this.user = null;
            localStorage.removeItem('partner_token');
        },
    },
    persist: true,
});