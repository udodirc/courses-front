<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useCourseStoreWithGetters } from "../../../store/admin/course/course.store.ts";
import Filters from "../../../components/Filters.vue";
import BasePagination from "../../../components/BasePagination.vue";
import { useFilterList } from "../../../composables/useFilterList";
import { usePagination } from "../../../composables/usePagination";
import type { FilterSchemaItem } from "../../../types/Filters.ts";
import api from "../../../api";

const courseStore = useCourseStoreWithGetters();

// схема фильтров
const schema = ref<FilterSchemaItem[]>([
  { field: "name", label: "Имя", type: "text", col: "left" },
  {
    field: "status",
    label: "Статус",
    type: "select",
    col: "middle",
    options: [
      { label: "Активный", value: 1 },
      { label: "Неактивный", value: 0 },
    ],
  },
  { field: "user", label: "Владелец", type: "text", col: "left" },
  { field: "price", label: "Цена", type: "text", col: "middle" },
  { field: "created_from", label: "Создано с", type: "date", col: "left" },
  { field: "created_to", label: "Создано по", type: "date", col: "middle" },
]);

// composables
const { filters, applyFilters, resetFilters, toFilterObject } = useFilterList(
    courseStore,
    schema.value
);
const { onNext, onPrev, goToPage } = usePagination(
    courseStore,
    filters,
    toFilterObject
);

// загрузка данных
onMounted(async () => {
  await applyFilters();
});

// формирование URL изображения
const getCourseImage = (course: any) => {
  const main_image = course.image_main_image
      ? `${course.image_main_url}/${course.image_main_image}`
      : "";
  return main_image || "/placeholder.png";
};

const toggleStatus = async (id: number) => {
  try {
    await api.post(`/admin/course/status/${id}`);

    await applyFilters();

  } catch (error) {
    console.error("Ошибка обновления статуса:", error);
    alert("Не удалось обновить статус");
  }
};

const deleteFn = async (id: number) => {
  try {
    await courseStore.deleteItem(id);

    if (courseStore.courseList.value.length === 0) {
      if (courseStore.currentPage.value > 1) {
        await goToPage(courseStore.currentPage.value - 1);
      } else {
        await applyFilters();
      }
    }

  } catch (error) {
    console.error("Ошибка удаления курса:", error);
    alert("Не удалось удалить курс.");
  }
};

const destroy = async (id: number) => {
  if (confirm('Вы уверены, что хотите удалить этот курс?')) {
    await deleteFn(id);
  }
};
</script>

<template>
  <div class="w-full h-screen overflow-x-hidden border-t flex flex-col">
    <main class="w-full flex-grow p-6">
      <h1 class="text-3xl text-black pb-6">Проекты</h1>

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

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div
            v-for="course in courseStore.courseList.value"
            :key="course.id"
            class="bg-white rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-1 transition duration-300 overflow-hidden flex flex-col"
        >
          <img
              :src="getCourseImage(course)"
              alt=""
              class="w-full h-48 object-cover"
          />

          <div class="p-4 flex-1 flex flex-col justify-between">
            <div>
              <h2 class="font-semibold text-lg mb-1 line-clamp-2">
                {{ course.name }}
              </h2>
              <p class="text-gray-600 text-sm mb-2 line-clamp-3">
                {{ course.short_description }}
              </p>
            </div>

            <div class="mt-4 flex justify-between items-center">
    <span class="font-bold text-indigo-600 text-lg">
        ${{ course.price }}
    </span>

              <div class="flex items-center space-x-3">

                <button
                    v-if="course.canToggleStatus"
                    @click="toggleStatus(course.id)"
                    class="text-xl"
                    title="Изменить статус"
                >
                  <svg
                      v-if="course.status"
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6 text-green-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                  >
                    <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                        clip-rule="evenodd"
                    />
                  </svg>

                  <svg
                      v-else
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6 text-red-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                  >
                    <path
                        fill-rule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                    />
                  </svg>
                </button>

                <router-link
                    :to="`/admin/course/${course.id}/edit`"
                    class="text-blue-600 hover:underline"
                >
                  Редактировать
                </router-link>

                <button
                    @click.prevent="destroy(course.id)"
                    class="text-red-600 hover:text-red-800 transition duration-150"
                    title="Удалить курс"
                >
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                  >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

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