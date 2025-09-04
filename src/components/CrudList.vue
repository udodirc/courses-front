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

const emit = defineEmits(['prev', 'next', 'go', 'view', 'edit', 'toggleStatus', 'delete']);
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
        <td class="flex gap-2 justify-center">
          <!-- Просмотр -->
          <button
              @click="$emit('view', item.id)"
              title="Просмотр"
              class="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z" />
            </svg>
          </button>

          <!-- Редактировать -->
          <button
              @click="$emit('edit', item.id)"
              title="Редактировать"
              class="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <!-- Лист бумаги -->
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <!-- Линия сгиба листа -->
              <polyline points="14 2 14 8 20 8"/>
              <!-- Карандаш -->
              <path d="M16.5 7.5l-6 6L12 16l6-6-1.5-2.5z"/>
            </svg>
          </button>

          <!-- Переключить статус -->
          <button
              v-if="item.canToggleStatus"
              @click="$emit('toggleStatus', item.id)"
              :class="item.status ? 'text-green-600' : 'text-red-600'"
              title="Переключить статус"
              class="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100 transition"
          >
            <svg v-if="item.status" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 5a1 1 0 01.707.293l5 5a1 1 0 11-1.414 1.414L10 7.414 5.707 11.707a1 1 0 11-1.414-1.414l5-5A1 1 0 0110 5z" clip-rule="evenodd" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 15a1 1 0 01-.707-.293l-5-5a1 1 0 011.414-1.414L10 12.586l4.293-4.293a1 1 0 111.414 1.414l-5 5A1 1 0 0110 15z" clip-rule="evenodd" />
            </svg>
          </button>

          <!-- Удалить -->
          <button
              @click="$emit('delete', item.id)"
              title="Удалить"
              class="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
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