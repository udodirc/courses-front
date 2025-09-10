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

const emit = defineEmits([
  'prev',
  'next',
  'go',
  'view',
  'edit',
  'toggleStatus',
  'changeOrderUp',
  'changeOrderDown',
  'delete',
]);
</script>

<template>
  <BaseTable>
    <template #head>
      <th
          class="w-1/3 text-left py-3 px-4 uppercase font-semibold text-sm"
          v-for="col in columns"
          :key="col.field"
      >
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
        <td
            v-for="col in columns"
            :key="col.field"
            class="w-1/3 text-left py-3 px-4"
        >
          {{ col.format
            ? col.format(col.field.split('.').reduce((acc, key) => acc?.[key], item), item)
            : col.field.split('.').reduce((acc, key) => acc?.[key], item)
          }}
        </td>

        <!-- Действия -->
        <td class="flex gap-2 justify-center">
          <!-- Просмотр -->
          <button
              @click="$emit('view', item.id)"
              title="Просмотр"
              class="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100 transition"
          >
            👁
          </button>

          <!-- Редактировать -->
          <button
              @click="$emit('edit', item.id)"
              title="Редактировать"
              class="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100 transition"
          >
            ✏️
          </button>

          <!-- Переключить статус -->
          <button
              v-if="item.canToggleStatus"
              @click="$emit('toggleStatus', item.id)"
              :class="item.status ? 'text-green-600' : 'text-red-600'"
              title="Переключить статус"
              class="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100 transition"
          >
            {{ item.status ? '✅' : '❌' }}
          </button>

          <!-- Переместить вверх -->
          <button
              v-if="item.canChangeOrder"
              @click="$emit('changeOrderUp', item.id)"
              :disabled="i === 0"
              :class="['flex items-center justify-center w-8 h-8 rounded transition',
                     i === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100']"
              title="Вверх"
          >
            ⬆️
          </button>

          <!-- Переместить вниз -->
          <button
              v-if="item.canChangeOrder"
              @click="$emit('changeOrderDown', item.id)"
              :disabled="i === items.length - 1"
              :class="['flex items-center justify-center w-8 h-8 rounded transition',
                     i === items.length - 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100']"
              title="Вниз"
          >
            ⬇️
          </button>

          <!-- Удалить -->
          <button
              @click="$emit('delete', item.id)"
              title="Удалить"
              class="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100 transition"
          >
            ❌
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