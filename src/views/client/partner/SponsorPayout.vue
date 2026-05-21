<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
import { useSponsorPayoutStore } from '../../../store/client/sponsor_payout/sponsor_payout.store.ts';
import ItemFrontList from '../../../components/ItemFrontList.vue';
import { usePagination } from '../../../composables/usePagination';
import { useStaticContent } from '../../../composables/useStaticContent';
import Filters from '../../../components/Filters.vue';
import { useFilterList } from '../../../composables/useFilterList';
import type { FilterSchemaItem } from '../../../types/Filters.ts';

const { staticContent, loadingStatic, staticContentError, fetchStaticContent } = useStaticContent();

const sponsorPayoutStore = useSponsorPayoutStore();
const schema = ref<FilterSchemaItem[]>([
  { field: 'customer', label: 'Покупатель', type: 'text', col: 'left' },
  { field: 'amount', label: 'Сумма', type: 'text', col: 'middle' },
  { field: 'created_from', label: 'Создано с', type: 'date', col: 'left' },
  { field: 'created_to', label: 'Создано по', type: 'date', col: 'middle' },
]);

// ✅ ИСПРАВЛЕНИЕ 1: Корректный baseUrl для выводов средств
const baseUrl = `/partner/sponsor-payouts`;
const { filters, applyFilters, resetFilters, toFilterObject } = useFilterList(sponsorPayoutStore, schema.value, baseUrl);

// ✅ ИСПРАВЛЕНИЕ 2: Корректный base_url для usePagination
const { onNext, onPrev, goToPage } = usePagination(sponsorPayoutStore, filters, toFilterObject, baseUrl);

const columns = [
  { label: 'ID', field: 'id' },
  { label: 'Название курса', field: 'course_name' },
  { label: 'Цена курса', field: 'course_price' },
  { label: 'Покупатель', field: 'customer_name' },
  { label: 'Сумма', field: 'amount' },
];

const sponsorPayoutStoreList = computed(() => sponsorPayoutStore.items);

onMounted(async () => {
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
      :items="sponsorPayoutStoreList"
      :columns="columns"
      :currentPage="sponsorPayoutStore.currentPage"
      :totalPages="sponsorPayoutStore.totalPages"
      @prev="onPrev"
      @next="onNext"
      @go="goToPage"
      @refresh="applyFilters"
  />
</template>