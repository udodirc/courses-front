// stores/BaseStore.ts
import { type UnwrapRef } from 'vue';
import { defineStore } from 'pinia';

export interface IBaseApi<TCreate, TEntity> {
    getList: () => Promise<{ data: TEntity[] }>;
    create: (data: TCreate) => Promise<{ data: TEntity }>;
    delete: (id: number) => Promise<{ data: null }>;
    fetch: (id: number) => Promise<{ data: TEntity }>;
}

export abstract class BaseStore<TCreate, TEntity> {
    public abstract storeId: string;

    public getStore(
        api: IBaseApi<TCreate, TEntity>,
        customGetters?: Record<string, any>
    ) {
        return defineStore(this.storeId, {
            state: (): {
                items: TEntity[];
                item: TEntity | null;
                loading: boolean;
                error: string;
            } => ({
                items: [],
                item: null,
                loading: false,
                error: '',
            }),

            actions: {
                async fetchList() {
                    this.loading = true;
                    this.error = '';
                    try {
                        const res = await api.getList();
                        this.items = res.data;
                    } catch (e: any) {
                        this.error = e?.response?.data?.message || 'Ошибка загрузки';
                        throw e;
                    } finally {
                        this.loading = false;
                    }
                },

                async createItem(data: TCreate) {
                    this.loading = true;
                    this.error = '';
                    try {
                        const res = await api.create(data);
                        this.items.push(res.data);
                    } catch (e: any) {
                        this.error = e?.response?.data?.errors || 'Ошибка создания';
                        throw e;
                    } finally {
                        this.loading = false;
                    }
                },

                async deleteItem(id: number) {
                    this.loading = true;
                    this.error = '';
                    try {
                        await api.delete(id);
                        this.items = this.items.filter((i: any) => i.id !== id);
                    } catch (e: any) {
                        this.error = e?.response?.data?.message || 'Ошибка удаления';
                        throw e;
                    } finally {
                        this.loading = false;
                    }
                },

                async fetchItem(id: number) {
                    this.loading = true;
                    this.error = '';
                    try {
                        const res = await api.fetch(id);
                        this.item = res.data as UnwrapRef<TEntity>;
                    } catch (e: any) {
                        this.error = e?.response?.data?.message || 'Ошибка получения';
                        throw e;
                    } finally {
                        this.loading = false;
                    }
                },
            },

            getters: customGetters ?? {},
        });
    }
}