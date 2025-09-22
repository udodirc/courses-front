<script setup lang="ts">
import { computed } from 'vue';
import { fieldLabels } from '../utils/fieldLabels';

const { item, itemId, label, loading, error, labels, exclude } = defineProps<{
  item: Record<string, any> | null;
  itemId?: number | string;
  label: string;
  loading: boolean;
  error: string;
  labels?: Record<string, string>;
  exclude?: string[];
}>();

const mergedLabels = computed(() => ({
  ...fieldLabels,
  ...(labels || {}),
}));

const customLabels: Record<string, string> = {
  parent_name: 'Родительское меню',
  permissions: 'Права',
  menu_name: 'Меню',
  content: 'Контент',
  status: 'Статус',
};

// visibleFields с фильтром exclude
const visibleFields = computed(() => {
  if (!item) return {};
  const excludeKeys = exclude || [];
  return Object.fromEntries(
      Object.entries(item).filter(([key]) => !excludeKeys.includes(key))
  );
});

// helper для рендеринга значения
// helper для рендеринга значения
const renderValue = (key: string | number, value: any) => {
  const keyStr = String(key); // Явное приведение к строке
  if (keyStr === 'status') {
    return value == 1 ? 'Активный' : 'Неактивный';
  }
  if (value == null) return '';
  if (typeof value !== 'object') {
    return keyStr.includes('At') ? new Date(value).toLocaleString() : value;
  }
  return value?.name || JSON.stringify(value);
};
</script>

<template>
  <div class="max-w-3xl mx-auto p-6 bg-white rounded shadow">
    <h2 class="text-xl font-semibold mb-4">{{ label }} #{{ itemId }}</h2>
    <p v-if="loading" class="text-gray-600">Загрузка...</p>
    <p v-else-if="error" class="text-red-600">{{ error }}</p>

    <div v-if="item" class="border border-gray-200 p-4 rounded bg-gray-50 space-y-2">
      <div v-for="(value, key) in visibleFields" :key="key" class="flex">
        <span class="font-bold mr-2">
          {{ customLabels[key] || mergedLabels[key] || key }}:
        </span>
        <span>{{ renderValue(key, value) }}</span>
      </div>
    </div>

    <p v-else class="text-gray-500">Данные не найдены.</p>
  </div>
</template>