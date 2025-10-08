<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePartnerStoreWithGetters } from '../../../store/admin/partner/partner.store';
import ItemList from '../../../components/ItemList.vue';
import Filters from '../../../components/Filters.vue';
import { useFilterList } from '../../../composables/useFilterList';
import { usePagination } from '../../../composables/usePagination';
import type { FilterSchemaItem } from '../../../types/Filters.ts';

const partnerStore = usePartnerStoreWithGetters();

// схема фильтров
const schema = ref<FilterSchemaItem[]>([
  { field: 'login', label: 'Логин', type: 'text', col: 'left' },
  { field: 'email', label: 'Email', type: 'email', col: 'middle' },
  { field: 'phone', label: 'Телефон', type: 'text', col: 'left' },
  { field: 'status', label: 'Статус', type: 'select', col: 'middle', options: [
      { label: 'Активный', value: 1 },
      { label: 'Неактивный', value: 0 },
    ] },
  { field: 'created_from', label: 'Создано с', type: 'date', col: 'left' },
  { field: 'created_to', label: 'Создано по', type: 'date', col: 'middle' },
]);

// composables
const { filters, applyFilters, resetFilters, toFilterObject } = useFilterList(partnerStore, schema.value);
const { onNext, onPrev, goToPage } = usePagination(partnerStore, filters, toFilterObject);

// загрузка ролей + установка в schema
onMounted(async () => {
  applyFilters();
});

// колонки таблицы
const columns = [
  { label: 'ID', field: 'id' },
  { label: 'Логин', field: 'login' },
  { label: 'Email', field: 'email' },
  { label: 'Телефон', field: 'phone' },
];
</script>

<template>
  <div class="w-full h-screen overflow-x-hidden border-t flex flex-col">
    <main class="w-full flex-grow p-6">
      <h1 class="text-3xl text-black pb-6">Пользователи</h1>

      <Filters
          v-model:filters="filters"
          :schema="schema"
          @apply="applyFilters"
          @reset="resetFilters"
      />

      <router-link
          to="/admin/partner/create"
          class="inline-block mb-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
      >
        Создать
      </router-link>

      <ItemList
          :key="partnerStore.currentPage.value"
          :items="partnerStore.partnerList.value"
          :columns="columns"
          :basePath="'/admin/partners'"
          :deleteItem="partnerStore.deleteItem"
          :currentPage="partnerStore.currentPage.value"
          :totalPages="partnerStore.totalPages.value"
          @next="onNext"
          @prev="onPrev"
          @go="goToPage"
          @refresh="applyFilters"
      />
    </main>
  </div>
</template>