<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
import { useOrderStore } from '../../../store/client/order/order.store.ts';
import ItemFrontList from '../../../components/ItemFrontList.vue';
import { usePagination } from '../../../composables/usePagination';
import { useStaticContent } from '../../../composables/useStaticContent';
import Filters from '../../../components/Filters.vue';
import { useFilterList } from '../../../composables/useFilterList';
import type { FilterSchemaItem } from '../../../types/Filters.ts';

const { staticContent, loadingStatic, staticContentError, fetchStaticContent } = useStaticContent();

const orderStore = useOrderStore();
const schema = ref<FilterSchemaItem[]>([
  { field: 'order_number', label: 'Номер заказа', type: 'text', col: 'left' },
  { field: 'course', label: 'Название курса', type: 'text', col: 'middle' },
  { field: 'created_from', label: 'Создано с', type: 'date', col: 'left' },
  { field: 'created_to', label: 'Создано по', type: 'date', col: 'middle' },
  { field: 'amount', label: 'Сумма', type: 'text', col: 'left' },
]);

const baseUrl = `partner/orders`;
const { filters, applyFilters, resetFilters, toFilterObject } = useFilterList(orderStore, schema.value, baseUrl);
const { onNext, onPrev, goToPage } = usePagination(orderStore, filters, toFilterObject, '/orders');

const columns = [
  { label: 'ID', field: 'id' },
  { label: 'Номер заказа', field: 'order_number' },
  { label: 'Название курса', field: 'course_name' },
  { label: 'Сумма', field: 'amount' },
  { label: 'Валюта', field: 'currency' },
  { label: 'Статус', field: 'status' },
];

const orderList = computed(() => orderStore.items);

onMounted(async () => {
  await orderStore.fetchList({}, 1, '/partner/orders');
  await fetchStaticContent(['partners']);
  await applyFilters();
});
</script>

<template>
  <div v-if="loadingStatic">Загрузка...</div>
  <div v-else-if="staticContentError">{{ staticContentError }}</div>
  <div v-else v-html="staticContent['orders']" class="p-4 bg-white rounded shadow" style="margin-bottom: 50px;"></div>

  <Filters
      v-model:filters="filters"
      :schema="schema"
      @apply="applyFilters"
      @reset="resetFilters"
  />

  <ItemFrontList
      :items="orderList"
      :columns="columns"
      :currentPage="orderStore.currentPage"
      :totalPages="orderStore.totalPages"
      @prev="onPrev"
      @next="onNext"
      @go="goToPage"
      @refresh="applyFilters"
  />
</template>