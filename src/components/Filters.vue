<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { FilterSchemaItem as SchemaItem } from '../types/Filters.ts';

type FilterItem = {
  field: string;
  value: string | number | null;
};

const props = defineProps<{
  schema: SchemaItem[];
  filters: FilterItem[];
}>();

const emit = defineEmits<{
  (e: 'update:filters', value: FilterItem[]): void;
  (e: 'apply', value: FilterItem[]): void;
  (e: 'reset'): void;
}>();

const showFilters = ref(false);

const toggleFilters = () => {
  showFilters.value = !showFilters.value;
};

const localFilters = ref<FilterItem[]>(
    props.schema.map(f => ({
      field: f.field,
      value: props.filters.find(fl => fl.field === f.field)?.value ?? null,
    }))
);

const filterValues = ref<Record<string, string | number>>({});

props.schema.forEach(f => {
  const val = props.filters.find(fl => fl.field === f.field)?.value;
  filterValues.value[f.field] = val ?? '';
});

watch(
    () => props.filters,
    newFilters => {
      props.schema.forEach(f => {
        const val = newFilters.find(fl => fl.field === f.field)?.value;
        filterValues.value[f.field] = val ?? '';
      });
    },
    { deep: true }
);

const columns = computed(() => {
  const left: SchemaItem[] = [];
  const middle: SchemaItem[] = [];

  props.schema.forEach(f => {
    if (f.col === 'middle') {
      middle.push(f);
    } else {
      left.push(f);
    }
  });

  return { left, middle };
});

function applyFilters() {
  localFilters.value = props.schema.map(f => ({
    field: f.field,
    value:
        filterValues.value[f.field] === ''
            ? null
            : filterValues.value[f.field],
  }));

  emit('update:filters', [...localFilters.value]);
  emit('apply', [...localFilters.value]);
}

function resetFilters() {
  props.schema.forEach(f => {
    filterValues.value[f.field] = '';
  });

  localFilters.value = props.schema.map(f => ({
    field: f.field,
    value: null,
  }));

  emit('update:filters', [...localFilters.value]);
  emit('reset');
}
</script>

<template>
  <div class="flex justify-end mb-6">
    <button
        type="button"
        class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        @click="toggleFilters"
    >
      <!-- Иконка фильтра -->
      <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          viewBox="0 0 24 24"
          fill="currentColor"
      >
        <path
            d="M3 5h18v2H3V5zm4 6h10v2H7v-2zm3 6h4v2h-4v-2z"
        />
      </svg>

      {{ showFilters ? 'Скрыть фильтры' : 'Фильтры' }}
    </button>
  </div>

  <Transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-[1000px]"
      leave-active-class="transition-all duration-300"
      leave-from-class="opacity-100 max-h-[1000px]"
      leave-to-class="opacity-0 max-h-0"
  >
    <div
        v-if="showFilters"
        class="overflow-hidden bg-white p-4 rounded-2xl shadow mb-6"
    >
      <div class="grid grid-cols-2 gap-4 mb-4">
        <!-- Левая колонка -->
        <div class="flex flex-col gap-4">
          <div
              v-for="f in columns.left"
              :key="f.field"
              class="flex flex-col"
          >
            <label class="text-sm font-medium text-gray-700 mb-1">
              {{ f.label }}
            </label>

            <input
                v-if="f.type === 'text' || f.type === 'email'"
                v-model="filterValues[f.field]"
                :type="f.type"
                class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />

            <select
                v-else-if="f.type === 'select'"
                v-model="filterValues[f.field]"
                class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="">
                -- выберите --
              </option>

              <option
                  v-for="opt in f.options || []"
                  :key="opt.value ?? opt.label"
                  :value="opt.value ?? ''"
              >
                {{ opt.label }}
              </option>
            </select>

            <input
                v-else-if="f.type === 'date'"
                type="date"
                v-model="filterValues[f.field]"
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
            <label class="text-sm font-medium text-gray-700 mb-1">
              {{ f.label }}
            </label>

            <input
                v-if="f.type === 'text' || f.type === 'email'"
                v-model="filterValues[f.field]"
                :type="f.type"
                class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />

            <select
                v-else-if="f.type === 'select'"
                v-model="filterValues[f.field]"
                class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="">
                -- выберите --
              </option>

              <option
                  v-for="opt in f.options || []"
                  :key="opt.value ?? opt.label"
                  :value="opt.value ?? ''"
              >
                {{ opt.label }}
              </option>
            </select>

            <input
                v-else-if="f.type === 'date'"
                type="date"
                v-model="filterValues[f.field]"
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
  </Transition>
</template>