import { computed, ref } from 'vue';

export function usePagination<T>(dataSource: () => T[], perPage: number = 10) {
    const currentPage = ref(1);

    const totalPages = computed(() => {
        const totalItems = dataSource().length;
        return Math.ceil(totalItems / perPage);
    });

    const paginatedData = computed(() => {
        const start = (currentPage.value - 1) * perPage;
        return dataSource().slice(start, start + perPage);
    });

    function nextPage() {
        if (currentPage.value < totalPages.value) currentPage.value++;
    }

    function prevPage() {
        if (currentPage.value > 1) currentPage.value--;
    }

    return {
        currentPage,
        totalPages,
        paginatedData,
        nextPage,
        prevPage,
    };
}