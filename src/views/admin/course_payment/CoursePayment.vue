// CoursePayment.vue (script setup)
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCoursePaymentStoreWithGetters } from '../../../store/admin/course_payment/course_payment.store.ts';
import ItemList from '../../../components/ItemList.vue';
import Filters from '../../../components/Filters.vue';
import { useFilterList } from '../../../composables/useFilterList';
import { usePagination } from '../../../composables/usePagination';
import type { FilterSchemaItem } from '../../../types/Filters.ts';

const paymentStore = useCoursePaymentStoreWithGetters();
const route = useRoute();
const router = useRouter();

// схема фильтров
const schema = ref<FilterSchemaItem[]>([
  { field: 'course', label: 'Курс', type: 'text', col: 'left' },
  { field: 'customer', label: 'Покупатель', type: 'text', col: 'middle' },
  { field: 'created_from', label: 'Создано с', type: 'date', col: 'left' },
  { field: 'created_to', label: 'Создано по', type: 'date', col: 'middle' },
  { field: 'status', label: 'Статус', type: 'select', col: 'left', options: [
      { label: 'Активный', value: 1 },
      { label: 'Неактивный', value: 0 },
  ]},
]);

// composables
const { filters, applyFilters: rawApplyFilters, resetFilters } = useFilterList(paymentStore, schema.value);
const { onNext, onPrev, goToPage } = usePagination(paymentStore, filters, (arr) => {
  return arr.reduce<Record<string, any>>((acc, f) => {
    if (f.value !== '' && f.value !== null && f.value !== undefined) acc[f.field] = f.value;
    return acc;
  }, {});
});

// --- Обёртка для applyFilters с синхронизацией с URL ---
function applyFilters() {
  rawApplyFilters();

  // Обновляем URL
  const query: Record<string, string> = {};
  filters.value.forEach(f => {
    if (f.value !== null && f.value !== '') query[f.field] = String(f.value);
  });
  router.replace({ query });
}

// --- Подстановка фильтров из URL при монтировании ---
onMounted(() => {
  let hasQuery = false;

  filters.value.forEach(f => {
    const queryValue = route.query[f.field];
    if (queryValue !== undefined) {
      f.value = queryValue as string;
      hasQuery = true;
    }
  });

  // Если есть хотя бы один query-параметр — сразу применяем фильтры
  if (hasQuery) {
    applyFilters();
  } else {
    // Иначе обычная загрузка без фильтров
    applyFilters();
  }
});

// колонки для таблицы
const columns = [
  { label: 'ID', field: 'id' },
  { label: 'Название курса', field: 'course_name' },
  { label: 'Покупатель', field: 'partner_name' },
  { label: 'Сумма', field: 'amount' },
];
</script>
<template>
  <div class="w-full h-screen overflow-x-hidden border-t flex flex-col">
    <main class="w-full flex-grow p-6">
      <h1 class="text-3xl text-black pb-6">Оплаченные курсы</h1>

      <!-- Фильтры -->
      <Filters
          v-model:filters="filters"
          :schema="schema"
          @apply="applyFilters"
          @reset="resetFilters"
      />

      <ItemList
          :key="paymentStore.currentPage.value"
          :items="paymentStore.coursePaymentList.value"
          :columns="columns"
          :basePath="'/admin/courses-payments'"
          :deleteItem="paymentStore.deleteItem"
          :currentPage="paymentStore.currentPage.value"
          :totalPages="paymentStore.totalPages.value"
          :showActions="false"
          @next="onNext"
          @prev="onPrev"
          @go="goToPage"
          @refresh="applyFilters"
      />
    </main>
  </div>
</template>