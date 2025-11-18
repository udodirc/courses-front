import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Withdrawal } from '../../../types/Withdrawal.ts';
import {FrontWithdrawalApi} from "../../../api/front/withdrawal/withdrawal.api.ts";

const withdrawalApi = new FrontWithdrawalApi();

export const useWithdrawalStore = defineStore('withdrawal', () => {
    const withdrawal = ref<Withdrawal | null>(null);

    const items = ref<Withdrawal[]>([]);
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
            const res = await withdrawalApi.getList({ ...f, page, per_page: perPage.value }, url);
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

    const withdrawalList = computed(() => items.value.map(item => ({ ...item })));

    return {
        withdrawal,
        items,
        withdrawalList,
        loading,
        error,
        filters,
        currentPage,
        totalPages,
        perPage,
        fetchList,
    };
});