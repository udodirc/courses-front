// composables/usePagination.ts
import type { Ref } from 'vue';
import type { FilterItem } from '../composables/useFilterList'; // <- type-only import

export function usePagination(
    store: any,
    filters: Ref<FilterItem[]>,
    toFilterObject: (arr: FilterItem[]) => Record<string, any>
) {
    const onNext = () => {
        if (store.currentPage < store.totalPages) {
            store.fetchList(toFilterObject(filters.value), store.currentPage + 1);
        }
    };

    const onPrev = () => {
        if (store.currentPage > 1) {
            store.fetchList(toFilterObject(filters.value), store.currentPage - 1);
        }
    };

    const goToPage = (page: number) => {
        store.fetchList(toFilterObject(filters.value), page);
    };

    return { onNext, onPrev, goToPage };
}