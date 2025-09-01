<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useContentStore } from '../../../store/admin/content/content.store';
import ItemList from '../../../components/ItemList.vue';
import Filters from '../../../components/Filters.vue';
import { useFetchList } from '../../../composables/useFetchList';
import { useFilterList, type SchemaItem } from '../../../composables/useFilterList';
import { usePagination } from '../../../composables/usePagination';

const contentStore = useContentStore();

// загрузка всех меню для селекта родителя
const { items: menus, fetchItems: fetchMenus } = useFetchList<{ id: number; name: string }>('/admin/menu');

// схема фильтров
const schema = ref<SchemaItem[]>([
  { field: 'menu_id', label: 'Меню', type: 'select', col: 'left', options: [] },
  { field: 'created_from', label: 'Создано с', type: 'date', col: 'left' },
  { field: 'created_to', label: 'Создано по', type: 'date', col: 'left' },
]);

// composables
const { filters, applyFilters, resetFilters, toFilterObject } = useFilterList(contentStore, schema.value);
const { onNext, onPrev, goToPage } = usePagination(contentStore, filters, toFilterObject);

// загрузка меню и добавление в schema
onMounted(async () => {
  await fetchMenus();
  const parentFilter = schema.value.find(f => f.field === 'menu_id');
  if (parentFilter) {
    parentFilter.options = menus.value.map(m => ({ label: m.name, value: m.id }));
  }
  applyFilters();
});

// колонки для таблицы
const columns = [
  { label: 'ID', field: 'id' },
  { label: 'Меню', field: 'menu_name' },
];
</script>

<template>
  <div class="w-full h-screen overflow-x-hidden border-t flex flex-col">
    <main class="w-full flex-grow p-6">
      <h1 class="text-3xl text-black pb-6">Контент</h1>

      <!-- Фильтры -->
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
          :items="contentStore.getContentList"
          :columns="columns"
          :basePath="'/admin/content'"
          :deleteItem="contentStore.deleteItem"
          :currentPage="contentStore.currentPage"
          :totalPages="contentStore.totalPages"
          @next="onNext"
          @prev="onPrev"
          @go="goToPage"
      />
    </main>
  </div>
</template>