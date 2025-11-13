import { ref } from 'vue';
import type { Ref } from 'vue';

export type FilterSchemaItem = { field: string; label: string; type: 'text' | 'email' | 'select' | 'date'; col?: string; options?: { label: string; value: any }[] };
export type FilterItem = { field: string; value: string | number };

export function useFilterList(store: any, schema: FilterSchemaItem[], baseUrl: string = '') {
    const filters: Ref<FilterItem[]> = ref(schema.map(f => ({ field: f.field, value: '' })));

    function toFilterObject(arr: FilterItem[]): Record<string, any> {
        return arr.reduce<Record<string, any>>((acc, f) => {
            if (f.value !== '' && f.value !== null && f.value !== undefined) acc[f.field] = f.value;
            return acc;
        }, {});
    }

    // ✅ Теперь applyFilters передает baseUrl
    const applyFilters = () => store.fetchList(toFilterObject(filters.value), 1, baseUrl);

    const resetFilters = () => {
        filters.value = schema.map(f => ({ field: f.field, value: '' }));
        applyFilters();
    };

    return { filters, applyFilters, resetFilters, toFilterObject };
}