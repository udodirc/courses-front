<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useLessonCommentsStoreWithGetters } from '../../../store/admin/lesson_comments/lesson_comments.store.ts';
import ItemList from '../../../components/ItemList.vue';
import Filters from '../../../components/Filters.vue';
import { useFilterList } from '../../../composables/useFilterList.ts';
import { usePagination } from '../../../composables/usePagination.ts';
import type { FilterSchemaItem } from '../../../types/Filters.ts';

const lessonCommentsStore = useLessonCommentsStoreWithGetters();
const listID = 'lesson_comments';

// схема фильтров
const schema = ref<FilterSchemaItem[]>([
  { field: 'user', label: 'Имя администратора', type: 'text', col: 'left' },
  { field: 'partner', label: 'Имя партнера', type: 'text', col: 'middle' },
  { field: 'lesson', label: 'Название урока', type: 'text', col: 'left' },
  { field: 'reply_status', label: 'Статус', type: 'select', col: 'middle', options: [
      { label: 'Активный', value: 1 },
      { label: 'Неактивный', value: 0 },
    ] },
  { field: 'created_from', label: 'Создано с', type: 'date', col: 'left' },
  { field: 'created_to', label: 'Создано по', type: 'date', col: 'middle' },
]);

// composables
const { filters, applyFilters, resetFilters, toFilterObject } = useFilterList(lessonCommentsStore, schema.value);
const { onNext, onPrev, goToPage } = usePagination(lessonCommentsStore, filters, toFilterObject);

// загрузка данных
onMounted(async () => {
  await applyFilters();
});

// колонки для таблицы
const columns = [
  { label: 'ID', field: 'lesson_id' },
  { label: 'Название урока', field: 'lesson' },
];
</script>

<template>
  <div class="w-full h-screen overflow-x-hidden border-t flex flex-col">
    <main class="w-full flex-grow p-6">
      <h1 class="text-3xl text-black pb-6">Коментарии к урокам</h1>

      <!-- Фильтры -->
      <Filters
          v-model:filters="filters"
          :schema="schema"
          @apply="applyFilters"
          @reset="resetFilters"
      />

      <ItemList
          :listID="listID"
          :key="lessonCommentsStore.currentPage.value"
          :items="lessonCommentsStore.lessonCommentsList.value"
          :columns="columns"
          :basePath="'/admin/lesson-comment'"
          :deleteItem="lessonCommentsStore.deleteItem"
          :currentPage="lessonCommentsStore.currentPage.value"
          :totalPages="lessonCommentsStore.totalPages.value"
          @next="onNext"
          @prev="onPrev"
          @go="goToPage"
          @refresh="applyFilters"
      />
    </main>
  </div>
</template>