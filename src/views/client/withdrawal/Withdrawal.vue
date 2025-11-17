<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
import { useWithdrawalStore } from '../../../store/client/withdrawal/withdrawal.store.ts';
import ItemFrontList from '../../../components/ItemFrontList.vue';
import { usePagination } from '../../../composables/usePagination';
import { useStaticContent } from '../../../composables/useStaticContent';
import Filters from '../../../components/Filters.vue';
import { useFilterList } from '../../../composables/useFilterList';
import type { FilterSchemaItem } from '../../../types/Filters.ts';

const { staticContent, loadingStatic, staticContentError, fetchStaticContent } = useStaticContent();

const withdrawalStore = useWithdrawalStore();
const schema = ref<FilterSchemaItem[]>([
  { field: 'created_from', label: 'Создано с', type: 'date', col: 'left' },
  { field: 'created_to', label: 'Создано по', type: 'date', col: 'middle' },
  { field: 'amount', label: 'Сумма', type: 'text', col: 'left' },
  //{ field: 'withdrawal_status', label: 'Статус', type: 'select', col: 'left', options: [] },
]);

// ✅ ИСПРАВЛЕНИЕ 1: Корректный baseUrl для выводов средств
const baseUrl = `/partner/withdrawals`;
const { filters, applyFilters, resetFilters, toFilterObject } = useFilterList(withdrawalStore, schema.value, baseUrl);

// ✅ ИСПРАВЛЕНИЕ 2: Корректный base_url для usePagination
const { onNext, onPrev, goToPage } = usePagination(withdrawalStore, filters, toFilterObject, baseUrl);

const columns = [
  { label: 'ID', field: 'id' },
  { label: 'Сумма', field: 'amount' },
  //{ label: 'Валюта', field: 'currency' },
  { label: 'Статус', field: 'status' },
];

const withdrawalList = computed(() => withdrawalStore.items);

onMounted(async () => {
  // ✅ ИСПРАВЛЕНИЕ 3: Удаление дублирующего вызова fetchList.
  // applyFilters берет на себя первичную загрузку данных.
  // await withdrawalStore.fetchList({}, 1, '/partner/withdrawals');

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

  <router-link
      to="/partner/withdrawal/create"
      class="inline-block mb-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
  >
    Создать
  </router-link>

  <ItemFrontList
      :items="withdrawalList"
      :columns="columns"
      :currentPage="withdrawalStore.currentPage"
      :totalPages="withdrawalStore.totalPages"
      @prev="onPrev"
      @next="onNext"
      @go="goToPage"
      @refresh="applyFilters"
  />
</template>