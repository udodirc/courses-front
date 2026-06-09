import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { SponsorPayout } from '../../../types/SponsorPayout.ts';
import { FrontSponsorPayoutApi } from "../../../api/front/sponsor_payout/sponsor_payout.api.ts";

const sponsorPayoutApi = new FrontSponsorPayoutApi();

export const useSponsorPayoutStore = defineStore('withdrawal', () => {
    const sponsorPayout = ref<SponsorPayout | null>(null);

    const items = ref<SponsorPayout[]>([]);
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
            const res = await sponsorPayoutApi.getList({ ...f, page, per_page: perPage.value }, url);
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

    const sponsorPayoutList = computed(() => items.value.map(item => ({ ...item })));

    return {
        sponsorPayout,
        items,
        sponsorPayoutList,
        loading,
        error,
        filters,
        currentPage,
        totalPages,
        perPage,
        fetchList,
    };
});