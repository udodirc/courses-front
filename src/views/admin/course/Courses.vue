<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCourseStoreWithGetters } from '../../../store/admin/course/course.store.ts';
import Filters from '../../../components/Filters.vue';
import BasePagination from '../../../components/BasePagination.vue';
import { useFilterList } from '../../../composables/useFilterList';
import { usePagination } from '../../../composables/usePagination';
import type { FilterSchemaItem } from '../../../types/Filters.ts';

const courseStore = useCourseStoreWithGetters();

// схема фильтров
const schema = ref<FilterSchemaItem[]>([
  { field: 'name', label: 'Имя', type: 'text', col: 'left' },
  { field: 'status', label: 'Статус', type: 'select', col: 'middle', options: [
      { label: 'Активный', value: 1 },
      { label: 'Неактивный', value: 0 },
    ] },
  { field: 'user', label: 'Владелец', type: 'text', col: 'left' },
  { field: 'price', label: 'Цена', type: 'text', col: 'middle' },
  { field: 'created_from', label: 'Создано с', type: 'date', col: 'left' },
  { field: 'created_to', label: 'Создано по', type: 'date', col: 'middle' },
]);

// composables
const { filters, applyFilters, resetFilters, toFilterObject } = useFilterList(courseStore, schema.value);
const { onNext, onPrev, goToPage } = usePagination(courseStore, filters, toFilterObject);

// загрузка данных
onMounted(async () => {
  await applyFilters();
});
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
          to="/admin/course/create"
          class="inline-block mb-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
      >
        Создать
      </router-link>

      <!-- Если нет курсов -->
      <div v-if="courseStore.courseList.value.length === 0" class="text-gray-500 text-center py-6">
        Курсы не найдены
      </div>

      <!-- Карточки курсов -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div
            v-for="course in courseStore.courseList.value"
            :key="course.id"
            class="bg-white rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-1 transition duration-300 overflow-hidden flex flex-col"
        >
          <!-- Изображение -->
          <img
              :src="course.image_main_image ? `${course.image_main_url}/${course.image_main_image}` : '/placeholder.png'"
              alt=""
              class="w-full h-48 object-cover"
          />

          <!-- Контент -->
          <div class="p-4 flex-1 flex flex-col justify-between">
            <div>
              <h2 class="font-semibold text-lg mb-1 line-clamp-2">{{ course.name }}</h2>
              <p class="text-gray-600 text-sm mb-2 line-clamp-3">{{ course.short_description }}</p>
            </div>

            <!-- Цена и кнопки действий -->
            <div class="mt-2 flex items-center justify-between">
              <span class="font-bold text-indigo-600 text-lg">${{ course.price }}</span>
              <div class="flex space-x-2">
                <router-link
                    :to="`/admin/course/${course.id}/edit`"
                    class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                >
                  Редактировать
                </router-link>

                <button
                    @click="courseStore.deleteItem(course.id)"
                    class="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                >
                  Удалить
                </button>

                <button
                    @click="courseStore.toggleStatus(course.id)"
                    class="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs"
                >
                  {{ course.status ? 'Отключить' : 'Включить' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Пагинация -->
      <div class="mt-8">
        <BasePagination
            :current-page="courseStore.currentPage.value"
            :total-pages="courseStore.totalPages.value"
            @go="goToPage"
            @prev="onPrev"
            @next="onNext"
        />
      </div>
    </main>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>