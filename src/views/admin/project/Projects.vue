<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useProjectStore } from '../../../store/admin/project/project.store';
import ItemList from '../../../components/ItemList.vue';
import Filters from '../../../components/Filters.vue';
import { useFilterList, type SchemaItem } from '../../../composables/useFilterList';
import { usePagination } from '../../../composables/usePagination';

const projectStore = useProjectStore();

// схема фильтров
const schema = ref<SchemaItem[]>([
  { field: 'name', label: 'Имя', type: 'text', col: 'left' },
  { field: 'status', label: 'Статус', type: 'select', col: 'middle', options: [
      { label: 'Активный', value: 1 },
      { label: 'Неактивный', value: 0 },
    ] },
  { field: 'created_from', label: 'Создано с', type: 'date', col: 'left' },
  { field: 'created_to', label: 'Создано по', type: 'date', col: 'middle' },
]);

// composables
const { filters, applyFilters, resetFilters, toFilterObject } = useFilterList(projectStore, schema.value);
const { onNext, onPrev, goToPage } = usePagination(projectStore, filters, toFilterObject);

// загрузка меню и добавление в schema
onMounted(async () => {
  applyFilters();
});

// колонки для таблицы
const columns = [
  { label: 'ID', field: 'id' },
  { label: 'Имя', field: 'name' },
];
</script>

<template>
  <div class="w-full h-screen overflow-x-hidden border-t flex flex-col">
    <main class="w-full flex-grow p-6">
      <h1 class="text-3xl text-black pb-6">Проекты</h1>

      <!-- Фильтры -->
      <Filters
          v-model:filters="filters"
          :schema="schema"
          @apply="applyFilters"
          @reset="resetFilters"
      />

      <router-link
          to="/admin/project/create"
          class="inline-block mb-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
      >
        Создать
      </router-link>

      <ItemList
          :items="projectStore.getProjectList"
          :columns="columns"
          :basePath="'/admin/project'"
          :deleteItem="projectStore.deleteItem"
          :currentPage="projectStore.currentPage"
          :totalPages="projectStore.totalPages"
          @next="onNext"
          @prev="onPrev"
          @go="goToPage"
          @refresh="applyFilters"
      />
    </main>
  </div>
</template>