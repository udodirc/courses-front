<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import BaseTable from './BaseTable.vue';
import BasePagination from './BasePagination.vue';
import type { Column } from '../types/Column.ts';

const { items, columns, currentPage, totalPages } = defineProps<{
  items: any[],
  columns: Column[],
  currentPage: number,
  totalPages: number,
}>();

// добавил событие "go"
const emit = defineEmits(['prev', 'next', 'go', 'view', 'edit', 'delete']);
</script>

<template>
  <BaseTable>
    <template #head>
      <th class="w-1/3 text-left py-3 px-4 uppercase font-semibold text-sm" v-for="col in columns" :key="col.field">
        {{ col.label }}
      </th>
      <th>Действия</th>
    </template>

    <template #body>
      <tr
          v-for="(item, i) in (items || [])"
          :key="item.id"
          :class="[i % 2 === 0 ? 'bg-white' : 'bg-gray-100', 'hover:bg-gray-200']"
      >
        <td v-for="col in columns" :key="col.field" class="w-1/3 text-left py-3 px-4">
          {{ col.format
            ? col.format(col.field.split('.').reduce((acc, key) => acc?.[key], item), item)
            : col.field.split('.').reduce((acc, key) => acc?.[key], item)
          }}
        </td>
        <td>
          <button @click="$emit('view', item.id)">👁</button>
          <button @click="$emit('edit', item.id)">✏</button>
          <button @click="$emit('delete', item.id)">🗑</button>
        </td>
      </tr>
    </template>
  </BaseTable>

  <BasePagination
      :currentPage="currentPage"
      :totalPages="totalPages"
      @prev="$emit('prev')"
      @next="$emit('next')"
      @go="$emit('go', $event)"
  />
</template>