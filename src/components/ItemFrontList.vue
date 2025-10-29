<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';
import BaseTable from './BaseTable.vue';
import BasePagination from './BasePagination.vue';
import type { Column } from '../types/Column.ts';

interface Props {
  items: any[];
  columns: Column[];
  currentPage: number;
  totalPages: number;
}

const props = defineProps<Props>();

// ✅ вот это добавляем
const emit = defineEmits(['prev', 'next', 'go']);

const mappedItems = computed(() =>
    props.items.map(item => ({
      ...item,
      // на фронте дополнительные поля не нужны
    }))
);
</script>

<template>
  <BaseTable :key="props.currentPage">
    <template #head>
      <th
          v-for="col in props.columns"
          :key="col.field"
          class="w-1/3 text-left py-3 px-4 uppercase font-semibold text-sm"
      >
        {{ col.label }}
      </th>
    </template>

    <template #body>
      <tr
          v-for="(item, i) in mappedItems"
          :key="item.id"
          :class="[i % 2 === 0 ? 'bg-white' : 'bg-gray-100', 'hover:bg-gray-200']"
      >
        <td v-for="col in props.columns" :key="col.field" class="w-1/3 text-left py-3 px-4">
          {{ item[col.field] }}
        </td>
      </tr>
    </template>
  </BaseTable>

  <BasePagination
      :currentPage="props.currentPage"
      :totalPages="props.totalPages"
      @prev="$emit('prev')"
      @next="$emit('next')"
      @go="$emit('go', $event)"
  />
</template>