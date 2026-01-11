<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../../../api';
import BasePagination from '../../../components/BasePagination.vue';

interface Course {
  id: number;
  name: string;
  short_description: string;
  price: number;
  url: string;
  image_main_image: string;
  image_main_url: string;
  main_preview: string,
  createdAt: string;
}

const courses = ref<Course[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const currentPage = ref(1);
const totalPages = ref(1);

const fetchCourses = async (page = 1) => {
  loading.value = true;
  error.value = null;

  try {
    const response = await api.get(`/partner/courses?page=${page}`);
    courses.value = response.data.data;

    currentPage.value = response.data.meta.current_page;
    totalPages.value = response.data.meta.last_page;
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Ошибка загрузки курсов';
  } finally {
    loading.value = false;
  }
};

onMounted(() => fetchCourses());

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) fetchCourses(page);
};
const prevPage = () => goToPage(currentPage.value - 1);
const nextPage = () => goToPage(currentPage.value + 1);

const getCourseImage = (course: Course) => {
  const main_image = course.image_main_image
      ? `${course.image_main_url}/${course.image_main_image}`
      : '';
  return main_image || '/placeholder.png';
};
</script>

<template>
  <main class="max-w-7xl mx-auto py-12 px-6">
    <div v-if="loading" class="text-gray-500 text-center">Загрузка курсов...</div>
    <div v-else-if="error" class="text-red-500 text-center">{{ error }}</div>
    <div v-else>
      <div v-if="courses.length === 0" class="text-gray-500 text-center">
        Курсы не найдены
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <router-link
            v-for="course in courses"
            :key="course.id"
            :to="`/partner/courses/${course.url}`"
            class="bg-white rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-1 transition duration-300 overflow-hidden flex flex-col"
        >
          <!-- Изображение -->
          <img
              :src="getCourseImage(course)"
              alt=""
              class="w-full h-48 object-cover"
          />

          <!-- Контент -->
          <div class="p-4 flex-1 flex flex-col justify-between">
            <div>
              <h2 class="font-semibold text-lg mb-1 line-clamp-2">{{ course.name }}</h2>
              <p class="text-gray-600 text-sm mb-2 line-clamp-3">{{ course.short_description }}</p>
            </div>
            <div class="mt-auto flex items-center justify-end">
              <span class="font-bold text-indigo-600 text-lg">${{ course.price }}</span>
            </div>
          </div>
        </router-link>
      </div>

      <!-- Пагинация -->
      <div class="mt-8">
        <BasePagination
            :current-page="currentPage"
            :total-pages="totalPages"
            @go="goToPage"
            @prev="prevPage"
            @next="nextPage"
        />
      </div>
    </div>
  </main>
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