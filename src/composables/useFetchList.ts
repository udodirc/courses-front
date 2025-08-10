// composables/useFetchList.ts
import { ref } from 'vue';
import api from '../api';

export function useFetchList<T>(url: string) {
    const items = ref<T[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const fetchItems = async () => {
        loading.value = true;
        error.value = null;
        try {
            const res = await api.get(url);
            items.value = res.data.data;
        } catch (e) {
            console.error(`Ошибка загрузки с ${url}`, e);
            error.value = 'Ошибка загрузки данных';
        } finally {
            loading.value = false;
        }
    };

    return { items, fetchItems, loading, error };
}