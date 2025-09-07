import { defineStore } from 'pinia';

export interface IBaseApi<TCreate, TEntity> {
    getList: (
        filters?: Record<string, any>
    ) => Promise<{
        data: TEntity[];
        meta?: {
            last_page?: number;
            total?: number;
            current_page?: number;
            per_page?: number;
        };
    }>;

    create: (data: TCreate) => Promise<{ data: TEntity }>;
    delete: (id: number) => Promise<{ data: null }>;
    fetch: (id: number) => Promise<{ data: TEntity }>;
}

export abstract class BaseStore<TCreate, TEntity> {
    public abstract storeId: string;

    public getStore(
        api: IBaseApi<TCreate, TEntity>,
        customGetters?: Record<string, any>,
        options?: { perPage?: number }
    ) {
        return defineStore(this.storeId, {
            state: () => ({
                items: [] as TEntity[],
                item: null as TEntity | null,
                loading: false,
                error: '',
                filters: {} as Record<string, any>,
                currentPage: 1,
                totalPages: 1,
                perPage: options?.perPage ?? 10,
            }),

            actions: {
                async fetchList(filters: Record<string, any> = {}, page: number = 1) {
                    this.loading = true;
                    this.error = '';
                    try {
                        this.filters = { ...filters };
                        const res = await api.getList({
                            ...filters,
                            page,
                        });

                        this.items = res.data;
                        if (res.meta) {
                            this.currentPage = res.meta.current_page ?? page;
                            this.totalPages = res.meta.last_page ?? 1;
                            this.perPage = res.meta.per_page ?? this.perPage;
                        } else {
                            this.currentPage = page;
                            this.totalPages = 1;
                        }
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
                        this.item = res.data;
                    } catch (e: any) {
                        this.error = e?.response?.data?.message || 'Ошибка получения';
                        throw e;
                    } finally {
                        this.loading = false;
                    }
                },

                setPerPage(count: number) {
                    this.perPage = count;
                },
            },

            getters: customGetters ?? {},
        });
    }
}