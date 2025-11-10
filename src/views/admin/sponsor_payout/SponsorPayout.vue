// SponsorPayout.vue (script setup)
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSponsorPayoutStoreWithGetters } from '../../../store/admin/sponsor_payout/sponsor_payout.store.ts';
import ItemList from '../../../components/ItemList.vue';
import Filters from '../../../components/Filters.vue';
import { useFilterList } from '../../../composables/useFilterList';
import { usePagination } from '../../../composables/usePagination';
import type { FilterSchemaItem } from '../../../types/Filters.ts';
import { useFetchList } from '../../../composables/useFetchList';

const sponsorPayoutStore = useSponsorPayoutStoreWithGetters();
const route = useRoute();
const router = useRouter();
const { items: levels, fetchItems: fetchLevels } = useFetchList<{ id: number; level: string }>('/admin/levels');

// схема фильтров
const schema = ref<FilterSchemaItem[]>([
  { field: 'customer', label: 'Покупатель', type: 'text', col: 'left' },
  { field: 'sponsor', label: 'Спонсор', type: 'text', col: 'middle' },
  { field: 'amount', label: 'Сумма', type: 'text', col: 'left' },
  { field: 'percentage', label: 'Процент', type: 'text', col: 'middle' },
  { field: 'created_from', label: 'Создано с', type: 'date', col: 'left' },
  { field: 'created_to', label: 'Создано по', type: 'date', col: 'middle' },
  { field: 'level', label: 'Уровень', type: 'select', col: 'left' },
]);

// composables
const { filters, applyFilters: rawApplyFilters, resetFilters } = useFilterList(sponsorPayoutStore, schema.value);
const { onNext, onPrev, goToPage } = usePagination(sponsorPayoutStore, filters, (arr) => {
  return arr.reduce<Record<string, any>>((acc, f) => {
    if (f.value !== '' && f.value !== null && f.value !== undefined) acc[f.field] = f.value;
    return acc;
  }, {});
});

// --- Обёртка для applyFilters с синхронизацией с URL ---
function applyFilters() {
  rawApplyFilters();

  const query: Record<string, string> = {};
  filters.value.forEach(f => {
    if (f.value !== null && f.value !== '') query[f.field] = String(f.value);
  });
  router.replace({ query });
}

// --- Подстановка фильтров из URL при монтировании ---
onMounted(async () => {
  await fetchLevels();
  const levelFilter = schema.value.find(f => f.field === 'level');
  if (levelFilter) {
    levelFilter.options = levels.value.map(m => ({ label: m.level, value: m.id }));
  }

  // Подставляем query-параметры в фильтры
  let hasQuery = false;
  filters.value.forEach(f => {
    const queryValue = route.query[f.field];
    if (queryValue !== undefined) {
      f.value = queryValue as string;
      hasQuery = true;
    }
  });

  // Применяем фильтры
  applyFilters();
});

// колонки для таблицы
const columns = [
  { label: 'ID', field: 'id' },
  { label: 'Название курса', field: 'course_name' },
  { label: 'Цена курса', field: 'course_price' },
  { label: 'Покупатель', field: 'partner_name' },
  { label: 'Спонсор', field: 'sponsor_name' },
  { label: 'Сумма', field: 'amount' },
  { label: 'Процент', field: 'percentage' },
  { label: 'Уровень', field: 'level' },
];
</script>
<template>
  <div class="w-full h-screen overflow-x-hidden border-t flex flex-col">
    <main class="w-full flex-grow p-6">
      <h1 class="text-3xl text-black pb-6">Спонсорские выплаты</h1>

      <!-- Фильтры -->
      <Filters
          v-model:filters="filters"
          :schema="schema"
          @apply="applyFilters"
          @reset="resetFilters"
      />

      <ItemList
          :key="sponsorPayoutStore.currentPage.value"
          :items="sponsorPayoutStore.sponsorPayoutList.value"
          :columns="columns"
          :basePath="'/admin/sponsor-payouts'"
          :deleteItem="sponsorPayoutStore.deleteItem"
          :currentPage="sponsorPayoutStore.currentPage.value"
          :totalPages="sponsorPayoutStore.totalPages.value"
          :showActions="false"
          @next="onNext"
          @prev="onPrev"
          @go="goToPage"
          @refresh="applyFilters"
      />
    </main>
  </div>
</template>