<script setup lang="ts">
import { computed } from 'vue';
import { fieldLabels } from '../utils/fieldLabels';

const props = defineProps<{
  item: Record<string, any>;
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
  <div
      v-if="props.item"
      class="border border-gray-200 p-4 rounded bg-gray-50 space-y-2"
  >
    <div v-for="(value, key) in visibleFields" :key="key">
      <strong>{{ mergedLabels[key] || key }}:</strong>
      <span v-if="typeof value !== 'object'">
        {{ key.includes('At') ? new Date(value).toLocaleString() : value }}
      </span>
      <span v-else>
        {{ value?.name || JSON.stringify(value) }}
      </span>
    </div>
  </div>

  <p v-else class="text-gray-500">Данные не найдены.</p>
</template>