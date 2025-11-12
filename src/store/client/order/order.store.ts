import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { FrontOrderApi } from '../../../api/front/order/order.api.ts';
import type { Order } from '../../../types/Order.ts';

const orderApi = new FrontOrderApi();

export const useOrderStore = defineStore('order', () => {
    const order = ref<Order | null>(null);

    const items = ref<Order[]>([]);
    const loading = ref(false);
    const error = ref('');
    const currentPage = ref(1);
    const totalPages = ref(1);
    const perPage = ref(10);
    const filters = ref<Record<string, any>>({});

    async function fetchList(f: Record<string, any> = {}, page = 1, url?: string) {
        loading.value = true;
        error.value = '';
        try {
            filters.value = { ...f };
            const res = await orderApi.getList({ ...f, page, per_page: perPage.value }, url);
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

    const orderList = computed(() => items.value.map(item => ({ ...item })));

    return {
        order,
        items,
        orderList,
        loading,
        error,
        filters,
        currentPage,
        totalPages,
        perPage,
        fetchList,
    };
});