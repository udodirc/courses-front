import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Ref } from 'vue';

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

export abstract class BaseStore<TCreate, TEntity extends Record<string, any>> {
    public abstract storeId: string;

    public getStore(
        api: IBaseApi<TCreate, TEntity>,
        options?: { perPage?: number },
        customGetters?: (state: {
            items: Ref<TEntity[]>;
            item: Ref<TEntity | null>;
            loading: Ref<boolean>;
            error: Ref<string>;
            currentPage: Ref<number>;
            totalPages: Ref<number>;
            perPage: Ref<number>;
            filters: Ref<Record<string, any>>;
        }) => Record<string, any>
    ) {
        return defineStore(this.storeId, () => {
            // state
            const items: Ref<TEntity[]> = ref([]);
            const item: Ref<TEntity | null> = ref(null);
            const loading: Ref<boolean> = ref(false);
            const error: Ref<string> = ref('');
            const filters: Ref<Record<string, any>> = ref({});
            const currentPage: Ref<number> = ref(1);
            const totalPages: Ref<number> = ref(1);
            const perPage: Ref<number> = ref(options?.perPage ?? 10);

            // actions
            async function fetchList(f: Record<string, any> = {}, page = 1) {
                loading.value = true;
                error.value = '';
                try {
                    filters.value = { ...f };
                    const res = await api.getList({ ...f, page });
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

            async function createItem(data: TCreate) {
                loading.value = true;
                error.value = '';
                try {
                    const res = await api.create(data);
                    items.value.push(res.data);
                } catch (e: any) {
                    error.value = e?.response?.data?.errors || 'Ошибка создания';
                    throw e;
                } finally {
                    loading.value = false;
                }
            }

            async function fetchItem(id: number) {
                loading.value = true;
                error.value = '';
                try {
                    const res = await api.fetch(id);
                    item.value = res.data;
                } catch (e: any) {
                    error.value = e?.response?.data?.message || 'Ошибка получения';
                    throw e;
                } finally {
                    loading.value = false;
                }
            }

            async function deleteItem(id: number) {
                loading.value = true;
                error.value = '';
                try {
                    await api.delete(id);
                    items.value = items.value.filter(i => i.id !== id);
                } catch (e: any) {
                    error.value = e?.response?.data?.message || 'Ошибка удаления';
                    throw e;
                } finally {
                    loading.value = false;
                }
            }

            async function setPerPage(count: number) {
                perPage.value = count;
                await fetchList(filters.value, 1);
            }

            // кастомные геттеры
            const getters = customGetters
                ? customGetters({ items, item, loading, error, currentPage, totalPages, perPage, filters })
                : {};

            return {
                items,
                item,
                loading,
                error,
                filters,
                currentPage,
                totalPages,
                perPage,
                fetchList,
                createItem,
                fetchItem,
                deleteItem,
                setPerPage,
                ...getters,
            };
        });
    }
}