<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useOrderStoreWithGetters } from '../../../store/admin/order/order.store.ts';
import ItemList from '../../../components/ItemList.vue';
import Filters from '../../../components/Filters.vue';
import { useFilterList } from '../../../composables/useFilterList.ts';
import { usePagination } from '../../../composables/usePagination.ts';
import type { FilterSchemaItem } from '../../../types/Filters.ts';

const orderStore = useOrderStoreWithGetters();

// схема фильтров
const schema = ref<FilterSchemaItem[]>([
  { field: 'order_number', label: 'Имя', type: 'text', col: 'left' },
  { field: 'course_id', label: 'Раздел курса', type: 'text', col: 'middle' },
  { field: 'created_from', label: 'Создано с', type: 'date', col: 'left' },
  { field: 'created_to', label: 'Создано по', type: 'date', col: 'middle' },
  { field: 'status', label: 'Статус', type: 'select', col: 'left', options: [
      { label: 'Активный', value: 1 },
      { label: 'Неактивный', value: 0 },
    ] },
]);

// composables
const { filters, applyFilters, resetFilters, toFilterObject } = useFilterList(orderStore, schema.value);
const { onNext, onPrev, goToPage } = usePagination(orderStore, filters, toFilterObject);

// загрузка данных
onMounted(async () => {
  await applyFilters();
});

// колонки для таблицы
const columns = [
  { label: 'ID', field: 'id' },
  { label: 'Название курса', field: 'course_name' },
  { label: 'Покупатель', field: 'partner_name' },
  { label: 'Сумма', field: 'amount' },
  { label: 'Валюта', field: 'currency' },
  { label: 'Статус', field: 'status' },
];
</script>

<template>
  <div class="w-full h-screen overflow-x-hidden border-t flex flex-col">
    <main class="w-full flex-grow p-6">
      <h1 class="text-3xl text-black pb-6">Уроки</h1>

      <!-- Фильтры -->
      <Filters
          v-model:filters="filters"
          :schema="schema"
          @apply="applyFilters"
          @reset="resetFilters"
      />

      <ItemList
          :key="orderStore.currentPage.value"
          :items="orderStore.orderList.value"
          :columns="columns"
          :basePath="'/admin/orders'"
          :deleteItem="orderStore.deleteItem"
          :currentPage="orderStore.currentPage.value"
          :totalPages="orderStore.totalPages.value"
          @next="onNext"
          @prev="onPrev"
          @go="goToPage"
          @refresh="applyFilters"
      />
    </main>
  </div>
</template>