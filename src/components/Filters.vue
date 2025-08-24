<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useFetchList } from "../composables/useFetchList";

type FilterItem = { field: string; value: string };
type FilterSchemaItem = {
  field: string;
  label: string;
  type: "text" | "email" | "select" | "date";
  col?: "left" | "middle"; // колонка
  options?: { label: string; value: string }[];
};

const props = defineProps<{
  modelValue: FilterItem[];
  schema: FilterSchemaItem[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: FilterItem[]): void;
  (e: "apply", value: FilterItem[]): void;
  (e: "reset"): void;
}>();

// локальное хранилище значений
const filterValues = ref<Record<string, string>>({});

function initFilters() {
  filterValues.value = {};
  props.modelValue.forEach(f => {
    filterValues.value[f.field] = f.value || '';
  });
}
initFilters();

watch(() => props.modelValue, initFilters, { deep: true });

// загрузка ролей (только если есть поле role)
const { items: roles, fetchItems: fetchRoles } =
    useFetchList<{ id: number; name: string }>('/admin/roles');

onMounted(() => {
  if (props.schema.find(s => s.field === 'role')) {
    fetchRoles();
  }
});

function toArray(): FilterItem[] {
  return props.schema.map(s => ({
    field: s.field,
    value: filterValues.value[s.field] || ''
  }));
}

function applyFilters() {
  const filters = toArray();
  emit("update:modelValue", filters);
  emit("apply", filters);
}

function resetFilters() {
  Object.keys(filterValues.value).forEach(k => filterValues.value[k] = '');
  emit("update:modelValue", toArray());
  emit("reset");
}
</script>

<template>
  <div class="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">

      <!-- Левая колонка (например: имя, роль) -->
      <div class="flex flex-col gap-4">
        <div v-for="f in schema.filter(s => s.col === 'left')" :key="f.field">
          <label class="block text-sm text-gray-600 mb-1">{{ f.label }}</label>

          <!-- text/email -->
          <input v-if="f.type === 'text' || f.type === 'email'"
                 v-model="filterValues[f.field]"
                 :type="f.type"
                 class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                 :placeholder="f.label" />

          <!-- select -->
          <select v-else-if="f.type === 'select'"
                  v-model="filterValues[f.field]"
                  class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300">
            <option value="">Все</option>
            <option v-for="opt in f.options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            <option v-if="f.field === 'role'" v-for="role in roles" :key="role.id" :value="role.name">
              {{ role.name }}
            </option>
          </select>

          <!-- date -->
          <input v-else-if="f.type === 'date'"
                 type="date"
                 v-model="filterValues[f.field]"
                 class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300" />
        </div>
      </div>

      <!-- Правая колонка (например: email, даты) -->
      <div class="flex flex-col gap-4">
        <div v-for="f in schema.filter(s => s.col === 'middle')" :key="f.field">
          <label class="block text-sm text-gray-600 mb-1">{{ f.label }}</label>

          <input v-if="f.type === 'text' || f.type === 'email'"
                 v-model="filterValues[f.field]"
                 :type="f.type"
                 class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                 :placeholder="f.label" />

          <input v-else-if="f.type === 'date'"
                 type="date"
                 v-model="filterValues[f.field]"
                 class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300" />
        </div>
      </div>

      <!-- Кнопки -->
      <div class="flex gap-3 justify-end">
        <button @click="applyFilters"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Применить
        </button>
        <button @click="resetFilters"
                class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
          Сбросить
        </button>
      </div>
    </div>
  </div>
</template>