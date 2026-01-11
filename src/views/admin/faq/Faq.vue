<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useFaqStoreWithGetters } from '../../../store/admin/faq/faq.store.ts';
import ItemList from '../../../components/ItemList.vue';
import Filters from '../../../components/Filters.vue';
import { useFilterList } from '../../../composables/useFilterList';
import { usePagination } from '../../../composables/usePagination';
import type { FilterSchemaItem } from '../../../types/Filters.ts';
import type { Faq } from '../../../types/Faq.ts';

const faqStore = useFaqStoreWithGetters();

// схема фильтров
const schema = ref<FilterSchemaItem[]>([
  { field: 'question', label: 'Вопрос', type: 'text', col: 'left' },
  { field: 'status', label: 'Статус', type: 'select', col: 'middle', options: [
      { label: 'Активный', value: 1 },
      { label: 'Неактивный', value: 0 },
    ] },
  { field: 'created_from', label: 'Создано с', type: 'date', col: 'left' },
  { field: 'created_to', label: 'Создано по', type: 'date', col: 'middle' },
]);

// composables
const { filters, applyFilters, resetFilters, toFilterObject } = useFilterList(faqStore, schema.value);
const { onNext, onPrev, goToPage } = usePagination(faqStore, filters, toFilterObject);

// загрузка списка
onMounted(() => {
  applyFilters();
});

// колонки для таблицы
const columns: { label: string; field: keyof Faq | string }[] = [
  { label: 'ID', field: 'id' },
  { label: 'Вопрос', field: 'question' },
];
</script>

<template>
  <div class="w-full h-screen overflow-x-hidden border-t flex flex-col">
    <main class="w-full flex-grow p-6">
      <h1 class="text-3xl text-black pb-6">Статичный контент</h1>

      <!-- Фильтры -->
      <Filters
          v-model:filters="filters"
          :schema="schema"
          @apply="applyFilters"
          @reset="resetFilters"
      />

      <router-link
          to="/admin/faq/create"
          class="inline-block mb-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
      >
        Создать
      </router-link>

     <ItemList
          :key="faqStore.currentPage.value"
          :items="faqStore.faqList.value"
          :columns="columns"
          :basePath="'/admin/faq'"
          :deleteItem="faqStore.deleteItem"
          :currentPage="faqStore.currentPage.value"
          :totalPages="faqStore.totalPages.value"
          @next="onNext"
          @prev="onPrev"
          @go="goToPage"
          @refresh="applyFilters"
      />
    </main>
  </div>
</template>