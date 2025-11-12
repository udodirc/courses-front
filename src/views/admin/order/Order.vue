<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useOrderStoreWithGetters } from '../../../store/admin/order/order.store.ts';
import ItemList from '../../../components/ItemList.vue';
import Filters from '../../../components/Filters.vue';
import { useFilterList } from '../../../composables/useFilterList.ts';
import { usePagination } from '../../../composables/usePagination.ts';
import type { FilterSchemaItem } from '../../../types/Filters.ts';
import { useFetchList } from '../../../composables/useFetchList';

// Указываем тип, который соответствует ответу бэкенда
type StatusOption = { label: string; value: string };

const orderStore = useOrderStoreWithGetters();
// ✅ Используем новый тип StatusOption
const { items: statuses, fetchItems: fetchStatuses } = useFetchList<StatusOption>('/admin/order/statuses');
const { items: currencies, fetchItems: fetchCurrencies } = useFetchList<StatusOption>('/admin/order/currencies');

// схема фильтров
const schema = ref<FilterSchemaItem[]>([
  { field: 'order_number', label: 'Номер заказа', type: 'text', col: 'left' },
  { field: 'course', label: 'Название курса', type: 'text', col: 'middle' },
  { field: 'partner', label: 'Логин партнера', type: 'text', col: 'left' },
  { field: 'amount', label: 'Сумма', type: 'text', col: 'middle' },
  { field: 'pay_status', label: 'Статус', type: 'select', col: 'left', options: [] },
  { field: 'currency', label: 'Валюта', type: 'select', col: 'middle', options: [] },
  { field: 'created_from', label: 'Создано с', type: 'date', col: 'left' },
  { field: 'created_to', label: 'Создано по', type: 'date', col: 'middle' },
]);

// composables
const { filters, applyFilters, resetFilters, toFilterObject } = useFilterList(orderStore, schema.value);
const { onNext, onPrev, goToPage } = usePagination(orderStore, filters, toFilterObject);

// загрузка данных
onMounted(async () => {
  await fetchStatuses();
  await fetchCurrencies();

  const statusFilter = schema.value.find(f => f.field === 'pay_status');

  if (statusFilter) {
    statusFilter.options = statuses.value;
  }

  const currencyFilter = schema.value.find(f => f.field === 'currency');

  if (currencyFilter) {
    currencyFilter.options = currencies.value;
  }

  await applyFilters();
});

// колонки для таблицы
const columns = [
  { label: 'ID', field: 'id' },
  { label: 'Номер заказа', field: 'order_number' },
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
          :basePath="'/admin/order'"
          :deleteItem="orderStore.deleteItem"
          :currentPage="orderStore.currentPage.value"
          :totalPages="orderStore.totalPages.value"
          :showActions="false"
          @next="onNext"
          @prev="onPrev"
          @go="goToPage"
          @refresh="applyFilters"
      />
    </main>
  </div>
</template>