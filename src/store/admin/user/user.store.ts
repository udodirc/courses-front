import { defineStore } from 'pinia';
import { UserApi } from '../../../api/admin/user/user.api';
import type { User } from '../../../types/User';

const userApi = new UserApi();

export const useUserStore = defineStore('admin-user', {
    state: () => ({
        userList: [] as User[],
        user: null as User | null,
        loading: false,
        error: '',
    }),

    actions: {
        async fetchUserList() {
            this.loading = true;
            this.error = '';
            try {
                const response = await userApi.getUserList();
                this.userList = response.data;
            } catch (e: any) {
                this.error = e?.response?.data?.message || 'Ошибка загрузки';
                throw e;
            } finally {
                this.loading = false;
            }
        },

        async deleteUser(id: number) {
            this.loading = true;
            this.error = '';
            try {
                await userApi.deleteUser(id);
                this.userList = this.userList.filter(user => user.id !== id);
            } catch (e: any) {
                this.error = e?.response?.data?.message || 'Ошибка удаления';
                throw e;
            } finally {
                this.loading = false;
            }
        },

        async fetchUser(id: number) {
            this.loading = true;
            this.error = '';
            try {
                const response = await userApi.fetchUser(id);
                this.user = response.data;
            } catch (e: any) {
                this.error = e?.response?.data?.message || 'Ошибка загрузки';
                throw e;
            } finally {
                this.loading = false;
            }
        },
    },

    getters: {
        getUserList: (state) => state.userList,
    },
});