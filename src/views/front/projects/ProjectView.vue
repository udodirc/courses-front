<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../../../api';
import { useRoute } from 'vue-router';

interface Project {
  id: number;
  name: string;
  content: string;
  image_url: string;
  images: string[];
  createdAt: string;
}

const route = useRoute();
const project = ref<Project | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

// Слайдер
const currentSlide = ref(0);

const fetchProject = async (id: string | number) => {
  loading.value = true;
  error.value = null;
  try {
    const response = await api.get(`/projects/${id}`);
    project.value = response.data.data;
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Ошибка загрузки проекта';
  } finally {
    loading.value = false;
  }
};

// Навигация слайдами
const nextSlide = () => {
  if (!project.value) return;
  currentSlide.value = (currentSlide.value + 1) % project.value.images.length;
};

const prevSlide = () => {
  if (!project.value) return;
  currentSlide.value = (currentSlide.value - 1 + project.value.images.length) % project.value.images.length;
};

onMounted(() => {
  fetchProject(route.params.id as string);
});
</script>

<template>
  <main class="max-w-4xl mx-auto py-12 px-6">
    <div v-if="loading" class="text-gray-500 text-center">Загрузка проекта...</div>
    <div v-else-if="error" class="text-red-500 text-center">{{ error }}</div>

    <div v-else-if="project">
      <h1 class="text-2xl font-bold mb-4">{{ project.name }}</h1>
      <div class="mb-6 prose" v-html="project.content"></div>

      <!-- Слайдер -->
      <div v-if="project.images.length" class="relative w-full h-64 overflow-hidden rounded-lg group mb-6">
        <transition name="fade" mode="out-in">
          <img
              :src="`${project.image_url}/${project.images[currentSlide]}`"
              class="w-full h-full object-cover transition-transform duration-500 ease-in-out transform group-hover:scale-105"
              alt="project image"
              :key="currentSlide"
          />
        </transition>

        <!-- Затемнение при наведении -->
        <div class="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>

        <!-- Кнопки навигации -->
        <button
            @click="prevSlide"
            class="absolute top-1/2 left-2 -translate-y-1/2 bg-white bg-opacity-70 text-gray-700 px-2 py-1 rounded hover:bg-opacity-100 shadow"
        >
          ‹
        </button>
        <button
            @click="nextSlide"
            class="absolute top-1/2 right-2 -translate-y-1/2 bg-white bg-opacity-70 text-gray-700 px-2 py-1 rounded hover:bg-opacity-100 shadow"
        >
          ›
        </button>

        <!-- Индикаторы -->
        <div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
          <span
              v-for="(_img, idx) in project.images"
              :key="idx"
              :class="{
              'w-3 h-3 rounded-full bg-white transition-opacity duration-300': true,
              'opacity-50': idx !== currentSlide,
              'opacity-100': idx === currentSlide
            }"
          ></span>
        </div>
      </div>
    </div>

    <div v-else class="text-gray-500 text-center">
      Проект не найден
    </div>
  </main>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>