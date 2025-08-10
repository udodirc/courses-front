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

const emit = defineEmits(['prev', 'next', 'view', 'edit', 'delete']);
</script>

<template>
  <BaseTable>
    <template #head>
      <th class="px-4 py-2 border-b" v-for="col in columns" :key="col.field">{{ col.label }}</th>
      <th>Действия</th>
    </template>

    <template #body>
      <tr v-for="item in (items || [])" :key="item.id" class="hover:bg-gray-50">
        <td v-for="col in columns" :key="col.field" class="px-4 py-2 border-b">
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
  />
</template>