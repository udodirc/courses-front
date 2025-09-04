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

// кастомные отображаемые названия для некоторых полей
const customLabels: Record<string, string> = {
  parent_name: 'Родительское меню',
  permissions: 'Права',
  menu_name: 'Меню',
  content: 'Контент',
  status: 'Статус',
};

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
    <div v-if="props.item" class="border border-gray-200 p-4 rounded bg-gray-50 space-y-2">
      <div v-for="(value, key) in visibleFields" :key="key" class="flex">
        <span class="font-medium mr-2">
          {{ customLabels[key] || mergedLabels[key] || key }}:
        </span>
              <span>
          <!-- если поле статус -->
          <template v-if="key === 'status'">
            {{ value == 1 ? 'Активный' : 'Неактивный' }}
          </template>

                <!-- если не статус -->
          <template v-else>
            {{
              value == null
                  ? ''
                  : typeof value !== 'object'
                      ? (key.includes('At') ? new Date(value).toLocaleString() : value)
                      : value?.name || JSON.stringify(value)
            }}
          </template>
        </span>
      </div>
    </div>
    <p v-else class="text-gray-500">Данные не найдены.</p>
  </div>
</template>