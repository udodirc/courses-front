<script setup lang="ts">
import { ref, watch } from 'vue';

type FilterItem = { field: string; value: string | number };
type Option = { label: string; value: string | number };
type FilterSchemaItem = {
  field: string;
  label: string;
  type: 'text' | 'email' | 'select' | 'date';
  col?: 'left' | 'middle';
  options?: Option[];
};

const props = defineProps<{
  schema: FilterSchemaItem[];
  filters: FilterItem[];
}>();

const emit = defineEmits<{
  (e: 'update:filters', value: FilterItem[]): void;
  (e: 'apply', value: FilterItem[]): void;
  (e: 'reset'): void;
}>();

// локальные фильтры
const localFilters = ref<FilterItem[]>(
    props.schema.map(f => ({
      field: f.field,
      value: props.filters.find(fl => fl.field === f.field)?.value || ''
    }))
);

// синхронизация с родительскими фильтрами
watch(
    () => props.filters,
    (newFilters) => {
      const next = props.schema.map(f => ({
        field: f.field,
        value: newFilters.find(fl => fl.field === f.field)?.value || ''
      }));
      if (JSON.stringify(next) !== JSON.stringify(localFilters.value)) {
        localFilters.value = next;
      }
    },
    { deep: true }
);

// применить фильтры
function applyFilters() {
  emit('update:filters', [...localFilters.value]);
  emit('apply', [...localFilters.value]);
}

// сбросить фильтры
function resetFilters() {
  localFilters.value = props.schema.map(f => ({ field: f.field, value: '' }));
  emit('update:filters', [...localFilters.value]);
  emit('reset');
}
</script>

<template>
  <div class="space-y-4 mb-4">
    <div class="grid grid-cols-3 gap-4">
      <div v-for="f in props.schema" :key="f.field" class="flex flex-col">
        <label class="text-sm mb-1">{{ f.label }}</label>

        <input
            v-if="f.type === 'text' || f.type === 'email'"
            v-model="localFilters.find(fl => fl.field === f.field)!.value"
            :type="f.type"
            class="border rounded p-2"
        />

        <select
            v-else-if="f.type === 'select'"
            v-model="localFilters.find(fl => fl.field === f.field)!.value"
            class="border rounded p-2"
        >
          <option value="">-- выберите --</option>
          <option v-for="opt in f.options || []" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>

        <input
            v-else-if="f.type === 'date'"
            type="date"
            v-model="localFilters.find(fl => fl.field === f.field)!.value"
            class="border rounded p-2"
        />
      </div>
    </div>

    <div class="flex gap-2">
      <button
          type="button"
          class="px-4 py-2 bg-blue-600 text-white rounded"
          @click="applyFilters"
      >
        Применить
      </button>
      <button
          type="button"
          class="px-4 py-2 bg-gray-300 text-black rounded"
          @click="resetFilters"
      >
        Сбросить
      </button>
    </div>
  </div>
</template>