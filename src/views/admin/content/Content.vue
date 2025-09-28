<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useContentStoreWithGetters } from '../../../store/admin/content/content.store';
import ItemList from '../../../components/ItemList.vue';
import Filters from '../../../components/Filters.vue';
import { useFetchList } from '../../../composables/useFetchList';
import { useFilterList } from '../../../composables/useFilterList';
import { usePagination } from '../../../composables/usePagination';
import type { FilterSchemaItem } from '../../../types/Filters.ts';

const contentStore = useContentStoreWithGetters();
const { items: menus, fetchItems: fetchMenus } = useFetchList<{ id: number; name: string }>('/admin/menu');

const schema = ref<FilterSchemaItem[]>([
  { field: 'menu_id', label: 'Меню', type: 'select', col: 'left', options: [] },
  { field: 'status', label: 'Статус', type: 'select', col: 'middle', options: [
      { label: 'Активный', value: 1 },
      { label: 'Неактивный', value: 0 },
    ] },
  { field: 'created_from', label: 'Создано с', type: 'date', col: 'left' },
  { field: 'created_to', label: 'Создано по', type: 'date', col: 'middle' },
]);

const { filters, applyFilters, resetFilters, toFilterObject } = useFilterList(contentStore, schema.value);
const { onNext, onPrev, goToPage } = usePagination(contentStore, filters, toFilterObject);

onMounted(async () => {
  await fetchMenus();
  const parentFilter = schema.value.find(f => f.field === 'menu_id');
  if (parentFilter) {
    parentFilter.options = menus.value.map(m => ({
      label: m.name,
      value: m.id as string | number, // приведение типа
    }));
  }
  applyFilters();
});

const columns = [
  { label: 'ID', field: 'id' },
  { label: 'Меню', field: 'menu_name' },
];
</script>

<template>
  <div class="w-full h-screen overflow-x-hidden border-t flex flex-col">
    <main class="w-full flex-grow p-6">
      <h1 class="text-3xl text-black pb-6">Контент</h1>

      <Filters
          v-model:filters="filters"
          :schema="schema"
          @apply="applyFilters"
          @reset="resetFilters"
      />

      <router-link
          to="/admin/content/create"
          class="inline-block mb-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
      >
        Создать
      </router-link>

      <ItemList
          :key="contentStore.currentPage.value"
          :items="contentStore.contentList.value"
          :columns="columns"
          :basePath="'/admin/content'"
          :deleteItem="contentStore.deleteItem"
          :currentPage="contentStore.currentPage.value"
          :totalPages="contentStore.totalPages.value"
          @next="onNext"
          @prev="onPrev"
          @go="goToPage"
          @refresh="applyFilters"
      />
    </main>
  </div>
</template>