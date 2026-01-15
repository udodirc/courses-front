<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useTicketWithGetters } from '../../../store/admin/ticket/ticket.store.ts';
import ItemList from '../../../components/ItemList.vue';
import Filters from '../../../components/Filters.vue';
import { useFilterList } from '../../../composables/useFilterList';
import { usePagination } from '../../../composables/usePagination';
import type { FilterSchemaItem } from '../../../types/Filters.ts';
import type { Ticket } from '../../../types/Ticket.ts';

const ticketStore = useTicketWithGetters();

// схема фильтров
const schema = ref<FilterSchemaItem[]>([
  { field: 'text', label: 'Вопрос', type: 'text', col: 'left' },
  { field: 'status', label: 'Статус', type: 'select', col: 'middle', options: [
      { label: 'Есть ответ', value: 2 },
      { label: 'Нет ответа', value: 1 },
      { label: 'Архив', value: 0 },
    ] },
  { field: 'created_from', label: 'Создано с', type: 'date', col: 'left' },
  { field: 'created_to', label: 'Создано по', type: 'date', col: 'middle' },
]);

// composables
const { filters, applyFilters, resetFilters, toFilterObject } = useFilterList(ticketStore, schema.value);
const { onNext, onPrev, goToPage } = usePagination(ticketStore, filters, toFilterObject);

// загрузка списка
onMounted(() => {
  applyFilters();
});

// колонки для таблицы
const columns: { label: string; field: keyof Ticket | string }[] = [
  { label: 'ID', field: 'id' },
  { label: 'Автор', field: 'author' },
  { label: 'Вопрос', field: 'text' },
];
</script>

<template>
  <div class="w-full h-screen overflow-x-hidden border-t flex flex-col">
    <main class="w-full flex-grow p-6">
      <h1 class="text-3xl text-black pb-6">Запросы</h1>

      <!-- Фильтры -->
      <Filters
          v-model:filters="filters"
          :schema="schema"
          @apply="applyFilters"
          @reset="resetFilters"
      />

      <router-link
          to="/admin/static-content/create"
          class="inline-block mb-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
      >
        Создать
      </router-link>

     <ItemList
          :key="ticketStore.currentPage.value"
          :items="ticketStore.ticketList.value"
          :columns="columns"
          :basePath="'/admin/tickets'"
          :deleteItem="ticketStore.deleteItem"
          :currentPage="ticketStore.currentPage.value"
          :totalPages="ticketStore.totalPages.value"
          @next="onNext"
          @prev="onPrev"
          @go="goToPage"
          @refresh="applyFilters"
      />
    </main>
  </div>
</template>