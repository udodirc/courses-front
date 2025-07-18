import { defineStore } from 'pinia';
import type { Role } from '../../../types/Role';
import {RoleApi} from "../../../api/admin/role/role.api.ts";

const roleApi = new RoleApi();

export const useRoleStore = defineStore('admin-role', {
    state: () => ({
        roleList: [] as Role[],
        role: null as Role | null,
        loading: false,
        error: '',
    }),

    actions: {
        async fetchRoleList() {
            this.loading = true;
            this.error = '';
            try {
                const response = await roleApi.getRoleList();
                this.roleList = response.data;
            } catch (e: any) {
                this.error = e?.response?.data?.message || 'Ошибка загрузки';
                throw e;
            } finally {
                this.loading = false;
            }
        },
        async fetchRole(id: number) {
            this.loading = true;
            this.error = '';
            try {
                const response = await roleApi.fetchRole(id);
                this.role = response.data;
            } catch (e: any) {
                this.error = e?.response?.data?.message || 'Ошибка загрузки';
                throw e;
            } finally {
                this.loading = false;
            }
        },
        async createRole(data: { name: string; }) {
            this.loading = true;
            this.error = '';
            try {
                const response = await roleApi.createRole(data);
                this.roleList.push(response.data);
            } catch (e: any) {
                this.error = e?.response?.data?.exception || e?.exception || 'Ошибка';
                throw e;
            } finally {
                this.loading = false;
            }
        },
        async deleteRole(id: number) {
            this.loading = true;
            this.error = '';
            try {
                await roleApi.deleteRole(id);
                this.roleList = this.roleList.filter(role => role.id !== id);
            } catch (e: any) {
                this.error = e?.response?.data?.message || 'Ошибка удаления';
                throw e;
            } finally {
                this.loading = false;
            }
        },
    },

    getters: {
        getRoleList: (state) => state.roleList,
    },
});