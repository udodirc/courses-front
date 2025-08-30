// composables/useFilterList.ts
import { ref } from 'vue';
import type { Ref } from 'vue';

export type FilterItem = { field: string; value: string | number };
export type SchemaItem = { field: string; label: string; type: 'text' | 'email' | 'select' | 'date'; col?: string; options?: { label: string; value: any }[] };

export function useFilterList(store: any, schema: SchemaItem[]) {
    const filters: Ref<FilterItem[]> = ref(schema.map(f => ({ field: f.field, value: '' })));

    function toFilterObject(arr: FilterItem[]) {
        return arr.reduce<Record<string, any>>((acc, f) => {
            if (f.value !== '' && f.value !== null && f.value !== undefined) acc[f.field] = f.value;
            return acc;
        }, {});
    }

    const applyFilters = () => store.fetchList(toFilterObject(filters.value), 1);

    const resetFilters = () => {
        filters.value = schema.map(f => ({ field: f.field, value: '' }));
        applyFilters();
    };

    return { filters, applyFilters, resetFilters, toFilterObject };
}