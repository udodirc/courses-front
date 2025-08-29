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

const localFilters = ref<FilterItem[]>(
    props.schema.map(f => ({
      field: f.field,
      value: props.filters.find(fl => fl.field === f.field)?.value || ''
    }))
);

watch(
    () => props.filters,
    newFilters => {
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

function applyFilters() {
  emit('update:filters', [...localFilters.value]);
  emit('apply', [...localFilters.value]);
}

function resetFilters() {
  localFilters.value = props.schema.map(f => ({ field: f.field, value: '' }));
  emit('update:filters', [...localFilters.value]);
  emit('reset');
}
</script>

<template>
  <div class="bg-white p-4 rounded-2xl shadow mb-6">
    <div class="grid grid-cols-3 gap-4 mb-4">
      <div
          v-for="f in props.schema"
          :key="f.field"
          class="flex flex-col"
      >
        <label class="text-sm font-medium text-gray-700 mb-1">
          {{ f.label }}
        </label>

        <input
            v-if="f.type === 'text' || f.type === 'email'"
            v-model="localFilters.find(fl => fl.field === f.field)!.value"
            :type="f.type"
            class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />

        <select
            v-else-if="f.type === 'select'"
            v-model="localFilters.find(fl => fl.field === f.field)!.value"
            class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        >
          <option value="">-- выберите --</option>
          <option
              v-for="opt in f.options || []"
              :key="opt.value"
              :value="opt.value"
          >
            {{ opt.label }}
          </option>
        </select>

        <input
            v-else-if="f.type === 'date'"
            type="date"
            v-model="localFilters.find(fl => fl.field === f.field)!.value"
            class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
      </div>
    </div>

    <div class="flex gap-3">
      <button
          type="button"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          @click="applyFilters"
      >
        Применить
      </button>
      <button
          type="button"
          class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300 transition"
          @click="resetFilters"
      >
        Сбросить
      </button>
    </div>
  </div>
</template>