import { ref } from "vue";
import api from "../api"; // твой axios instance

export function useFetchList<T>(defaultUrl?: string) {
    const items = ref<T[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const fetchItems = async (url?: string) => {
        loading.value = true;
        error.value = null;
        try {
            const res = await api.get(url || defaultUrl!);
            items.value = res.data.data;
        } catch (e) {
            console.error(`Ошибка загрузки с ${url || defaultUrl}`, e);
            error.value = "Ошибка загрузки данных";
        } finally {
            loading.value = false;
        }
    };

    const updateItem = async (id: number | string, payload: Partial<T>) => {
        loading.value = true;
        error.value = null;
        try {
            await api.put(`${defaultUrl}/${id}`, payload);

            // локально обновляем items
            const idx = items.value.findIndex((i: any) => i.id === id);
            if (idx !== -1) {
                items.value[idx] = { ...items.value[idx], ...payload };
            }
        } catch (e) {
            console.error(`Ошибка обновления ${id}`, e);
            error.value = "Ошибка сохранения";
        } finally {
            loading.value = false;
        }
    };

    return { items, fetchItems, updateItem, loading, error };
}