import type { Ref } from 'vue';
import type { FilterItem } from './useFilterList';

export function usePagination(
    store: any,
    url?: string,
    filters?: Ref<FilterItem[]>,
    toFilterObject?: (arr: FilterItem[]) => Record<string, any>
) {
    const onNext = async () => {
        const current = store.currentPage?.value ?? store.currentPage;
        const total = store.totalPages?.value ?? store.totalPages;

        if (current < total) {
            const params = filters && toFilterObject ? toFilterObject(filters.value) : {};
            await store.fetchList(params, current + 1, url); // передаем url
        }
    };

    const onPrev = async () => {
        const current = store.currentPage?.value ?? store.currentPage;

        if (current > 1) {
            const params = filters && toFilterObject ? toFilterObject(filters.value) : {};
            await store.fetchList(params, current - 1, url);
        }
    };

    const goToPage = async (page: number) => {
        const params = filters && toFilterObject ? toFilterObject(filters.value) : {};
        await store.fetchList(params, page, url);
    };

    return { onNext, onPrev, goToPage };
}
