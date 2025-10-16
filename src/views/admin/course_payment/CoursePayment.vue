// Menu.vue (script setup)
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCoursePaymentStoreWithGetters } from '../../../store/admin/course_payment/course_payment.store.ts';
import ItemList from '../../../components/ItemList.vue';
import Filters from '../../../components/Filters.vue';
import { useFilterList } from '../../../composables/useFilterList';
import { usePagination } from '../../../composables/usePagination';
import type { FilterSchemaItem } from '../../../types/Filters.ts';

const paymentStore = useCoursePaymentStoreWithGetters();

// схема фильтров
const schema = ref<FilterSchemaItem[]>([
  { field: 'created_from', label: 'Создано с', type: 'date', col: 'left' },
  { field: 'created_to', label: 'Создано по', type: 'date', col: 'middle' },
]);

// composables
const { filters, applyFilters, resetFilters, toFilterObject } = useFilterList(paymentStore, schema.value);
const { onNext, onPrev, goToPage } = usePagination(paymentStore, filters, toFilterObject);

// загрузка меню и добавление в schema
onMounted(async () => {
  applyFilters();
});

// колонки для таблицы
const columns = [
  { label: 'ID', field: 'id' },
  { label: 'Название', field: 'course_name' },
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