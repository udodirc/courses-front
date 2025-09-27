import type { Ref } from 'vue';
import type { FilterItem } from './useFilterList';

export function usePagination(
    store: any,
    filters: Ref<FilterItem[]>,
    toFilterObject: (arr: FilterItem[]) => Record<string, any>
) {
    const onNext = async () => {
        const current = store.currentPage?.value ?? store.currentPage;
        const total = store.totalPages?.value ?? store.totalPages;

        if (current < total) {
            await store.fetchList(toFilterObject(filters.value), current + 1);
        }
    };

    const onPrev = async () => {
        const current = store.currentPage?.value ?? store.currentPage;
        if (current > 1) {
            await store.fetchList(toFilterObject(filters.value), current - 1);
        }
    };

    const goToPage = async (page: number) => {
        await store.fetchList(toFilterObject(filters.value), page);
    };

    return { onNext, onPrev, goToPage };
}