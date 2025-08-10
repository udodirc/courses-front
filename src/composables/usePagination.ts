import { ref, computed, unref, type Ref, type ComputedRef } from 'vue';

export function usePagination<T>(
    source: T[] | Ref<T[]> | ComputedRef<T[]>,
    perPage: number
) {
    const currentPage = ref(1);

    // Гарантируем массив всегда
    const items = computed<T[]>(() => {
        const value = unref(source);
        return Array.isArray(value) ? value : [];
    });

    const totalPages = computed(() => {
        return items.value.length > 0
            ? Math.ceil(items.value.length / perPage)
            : 1;
    });

    const paginatedData = computed(() => {
        const start = (currentPage.value - 1) * perPage;
        const end = start + perPage;
        return items.value.slice(start, end);
    });

    const nextPage = () => {
        if (currentPage.value < totalPages.value) {
            currentPage.value++;
        }
    };

    const prevPage = () => {
        if (currentPage.value > 1) {
            currentPage.value--;
        }
    };

    return {
        currentPage,
        paginatedData,
        totalPages,
        nextPage,
        prevPage,
    };
}