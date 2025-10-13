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
  'canDelete',
  'delete',
]);
</script>

<template>
  <BaseTable :key="currentPage">
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
          <template v-if="col.field === 'login'">
            <a
                :href="`/${item.structure}`"
                class="text-blue-600 hover:underline"
                @click.prevent="$emit('view', item.id)"
            >
              {{ col.format
                ? col.format(col.field.split('.').reduce((acc, key) => acc?.[key], item), item)
                : col.field.split('.').reduce((acc, key) => acc?.[key], item)
              }}
            </a>
          </template>
          <template v-else>
            {{ col.format
              ? col.format(col.field.split('.').reduce((acc, key) => acc?.[key], item), item)
              : col.field.split('.').reduce((acc, key) => acc?.[key], item)
            }}
          </template>
        </td>

        <!-- Действия -->
        <td class="flex gap-2 justify-center">
          <button @click="$emit('view', item.id)">👁</button>
          <button @click="$emit('edit', item.id)">✏️</button>
          <button
              v-if="item.canToggleStatus"
              @click="$emit('toggleStatus', item.id)"
              :class="item.status ? 'text-green-600' : 'text-red-600'"
          >
            {{ item.status ? '✅' : '❌' }}
          </button>
          <button
              v-if="item.canChangeOrder"
              @click="$emit('changeOrderUp', item.id)"
              :disabled="i === 0"
          >⬆️</button>
          <button
              v-if="item.canChangeOrder"
              @click="$emit('changeOrderDown', item.id)"
              :disabled="i === items.length - 1"
          >⬇️</button>
          <button
              v-if="item.canDelete"
              @click="$emit('delete', item.id)"
          >❌</button>
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