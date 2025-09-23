<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { FilterSchemaItem as SchemaItem } from '../types/Filters.ts';

type FilterItem = { field: string; value: string | number | null };

const props = defineProps<{
  schema: SchemaItem[];
  filters: FilterItem[];
}>();

const emit = defineEmits<{
  (e: 'update:filters', value: FilterItem[]): void;
  (e: 'apply', value: FilterItem[]): void;
  (e: 'reset'): void;
}>();

// Локальные фильтры
const localFilters = ref<FilterItem[]>(
    props.schema.map(f => ({
      field: f.field,
      value: props.filters.find(fl => fl.field === f.field)?.value ?? null
    }))
);

// Синхронизация с внешними filters
watch(
    () => props.filters,
    newFilters => {
      const next = props.schema.map(f => ({
        field: f.field,
        value: newFilters.find(fl => fl.field === f.field)?.value ?? null
      }));
      if (JSON.stringify(next) !== JSON.stringify(localFilters.value)) {
        localFilters.value = next;
      }
    },
    { deep: true }
);

// Группировка по колонкам
const columns = computed(() => {
  const left: FilterSchemaItem[] = [];
  const middle: FilterSchemaItem[] = [];
  props.schema.forEach(f => {
    if (f.col === 'middle') middle.push(f);
    else left.push(f);
  });
  return { left, middle };
});

// Применить фильтры
function applyFilters() {
  emit('update:filters', [...localFilters.value]);
  emit('apply', [...localFilters.value]);
}

// Сбросить фильтры
function resetFilters() {
  localFilters.value = props.schema.map(f => ({ field: f.field, value: null }));
  emit('update:filters', [...localFilters.value]);
  emit('reset');
}
</script>

<template>
  <div class="bg-white p-4 rounded-2xl shadow" style="margin-bottom: 100px;">
    <div class="grid grid-cols-2 gap-4 mb-4">
      <!-- Левая колонка -->
      <div class="flex flex-col gap-4">
        <div
            v-for="f in columns.left"
            :key="f.field"
            class="flex flex-col"
        >
          <label class="text-sm font-medium text-gray-700 mb-1">{{ f.label }}</label>

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
            <option v-for="opt in f.options || []" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>

          <input
              v-else-if="f.type === 'date'"
              type="date"
              v-model="localFilters.find(fl => fl.field === f.field)!.value"
              class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>
      </div>

      <!-- Правая колонка -->
      <div class="flex flex-col gap-4">
        <div
            v-for="f in columns.middle"
            :key="f.field"
            class="flex flex-col"
        >
          <label class="text-sm font-medium text-gray-700 mb-1">{{ f.label }}</label>

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
            <option v-for="opt in f.options || []" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>

          <input
              v-else-if="f.type === 'date'"
              type="date"
              v-model="localFilters.find(fl => fl.field === f.field)!.value"
              class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>
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