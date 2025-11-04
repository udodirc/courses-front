<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCourseSectionStoreWithGetters } from '../../../store/admin/course_section/course_section.store.ts';
import ItemList from '../../../components/ItemList.vue';
import Filters from '../../../components/Filters.vue';
import { useFilterList } from '../../../composables/useFilterList';
import { usePagination } from '../../../composables/usePagination';
import type { FilterSchemaItem } from '../../../types/Filters.ts';

const courseSectionStore = useCourseSectionStoreWithGetters();

// схема фильтров
const schema = ref<FilterSchemaItem[]>([
  { field: 'name', label: 'Имя', type: 'text', col: 'left' },
  { field: 'course', label: 'Курс', type: 'text', col: 'middle' },
  { field: 'created_from', label: 'Создано с', type: 'date', col: 'left' },
  { field: 'created_to', label: 'Создано по', type: 'date', col: 'middle' },
  { field: 'status', label: 'Статус', type: 'select', col: 'left', options: [
      { label: 'Активный', value: 1 },
      { label: 'Неактивный', value: 0 },
    ] },
]);

// composables
const { filters, applyFilters, resetFilters, toFilterObject } = useFilterList(courseSectionStore, schema.value);
const { onNext, onPrev, goToPage } = usePagination(courseSectionStore, filters, toFilterObject);

// загрузка данных
onMounted(async () => {
  await applyFilters();
});

// колонки для таблицы
const columns = [
  { label: 'ID', field: 'id' },
  { label: 'Курс', field: 'course_name' },
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
          to="/admin/course-section/create"
          class="inline-block mb-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
      >
        Создать
      </router-link>

      <ItemList
          :key="courseSectionStore.currentPage.value"
          :items="courseSectionStore.courseSectionList.value"
          :columns="columns"
          :basePath="'/admin/course-section'"
          :deleteItem="courseSectionStore.deleteItem"
          :currentPage="courseSectionStore.currentPage.value"
          :totalPages="courseSectionStore.totalPages.value"
          @next="onNext"
          @prev="onPrev"
          @go="goToPage"
          @refresh="applyFilters"
      />
    </main>
  </div>
</template>