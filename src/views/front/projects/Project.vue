<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../../../api';

interface Project {
  id: number;
  name: string;
  content: string;
  image_url: string; // базовый путь
  images: string[];  // массив файлов
  createdAt: string;
}

const projects = ref<Project[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const fetchProjects = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await api.get('/projects');
    projects.value = response.data.data;
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Ошибка загрузки проектов';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchProjects();
});

// Функция для получения полной ссылки на первую картинку
const getProjectImage = (project: Project) => {
  if (project.images.length > 0) {
    return `${project.image_url}/${project.images[0]}`;
  }
  return ''; // или какой-то плейсхолдер
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

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <router-link
            v-for="project in projects"
            :key="project.id"
            :to="`/projects/${project.id}`"
            class="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition"
        >
          <img
              :src="getProjectImage(project)"
              alt=""
              class="w-full h-48 object-cover"
          />
          <div class="p-4">
            <h2 class="font-semibold text-lg mb-2">{{ project.name }}</h2>
            <p class="text-gray-600 text-sm line-clamp-3" v-html="project.content"></p>
          </div>
        </router-link>
      </div>
    </div>
  </main>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>