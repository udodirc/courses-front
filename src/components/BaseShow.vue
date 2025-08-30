<script setup lang="ts">
import { computed } from 'vue';
import { fieldLabels } from '../utils/fieldLabels';

const props = defineProps<{
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
  ...(props.labels || {}),
}));

const visibleFields = computed(() => {
  if (!props.item) return {};
  const exclude = props.exclude || [];
  return Object.fromEntries(
      Object.entries(props.item).filter(([key]) => !exclude.includes(key))
  );
});
</script>

<template>
  <div class="max-w-3xl mx-auto p-6 bg-white rounded shadow">
    <h2 class="text-xl font-semibold mb-4">{{ label }} #{{ itemId }}</h2>
    <p v-if="loading" class="text-gray-600">Загрузка...</p>
    <p v-else-if="error" class="text-red-600">{{ error }}</p>
    <div
        v-if="props.item"
        class="border border-gray-200 p-4 rounded bg-gray-50 space-y-2"
    >
      <div v-for="(value, key) in visibleFields" :key="key">
        <span v-if="key == 'parent_name'">Родительское меню:</span>
        <span v-else-if="key == 'permissions'">Права:</span>
        <span v-else>
          {{ mergedLabels[key] || key }}:
        </span>&nbsp;
        <span v-if="typeof value !== 'object'">
          {{ key.includes('At') ? new Date(value).toLocaleString() : value }}
        </span>
        <span v-else>
          {{ value?.name || JSON.stringify(value) }}
        </span>
      </div>
    </div>

    <p v-else class="text-gray-500">Данные не найдены.</p>
  </div>
</template>