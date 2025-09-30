<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../../../api';
import BasePagination from '../../../components/BasePagination.vue';

interface Project {
  id: number;
  name: string;
  content: string;
  url: string;
  image_url: string; // базовый путь
  images: string[];
  main_page: string;
  createdAt: string;
}

const projects = ref<Project[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

// состояние пагинации
const currentPage = ref(1);
const totalPages = ref(1);

const fetchProjects = async (page = 1) => {
  loading.value = true;
  error.value = null;

  try {
    const response = await api.get(`/projects?page=${page}`);
    projects.value = response.data.data;

    // сохраняем инфу из meta
    currentPage.value = response.data.meta.current_page;
    totalPages.value = response.data.meta.last_page;
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Ошибка загрузки проектов';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchProjects();
});

// обработчики пагинации
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    fetchProjects(page);
  }
};
const prevPage = () => goToPage(currentPage.value - 1);
const nextPage = () => goToPage(currentPage.value + 1);

// функция для получения полной ссылки на первую картинку
const getProjectImage = (project: Project) => {
  console.log(project.main_page);
  if (project.images.length > 0) {
    const main_image = (project.main_page) ? project.main_page : project.images[0];

    return `${project.image_url}/${main_image}`;
  }
  return '/placeholder.png';
};
</script>

<template>
  <main class="max-w-6xl mx-auto py-12 px-6">
    <div v-if="loading" class="text-gray-500 text-center">Загрузка проектов...</div>
    <div v-else-if="error" class="text-red-500 text-center">{{ error }}</div>
    <div v-else>
      <div v-if="projects.length === 0" class="text-gray-500 text-center">
        Проекты не найдены
      </div>

      <!-- список проектов -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <router-link
            v-for="project in projects"
            :key="project.id"
            :to="`/projects/${project.url}`"
            class="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition"
        >
          <img
              :src="getProjectImage(project)"
              alt=""
              class="w-full h-48 object-cover"
          />
          <div class="p-4">
            <h2 class="font-semibold text-lg mb-2">{{ project.name }}</h2>
          </div>
        </router-link>
      </div>

      <!-- пагинация -->
      <BasePagination
          :current-page="currentPage"
          :total-pages="totalPages"
          @go="goToPage"
          @prev="prevPage"
          @next="nextPage"
      />
    </div>
  </main>
</template>

<style scoped>
</style>