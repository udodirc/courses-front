<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
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

// Управление модальным окном
const isZoomed = ref(false);

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
  if (!project.value || project.value.images.length === 0) return;
  currentSlide.value = (currentSlide.value + 1) % project.value.images.length;
};

const prevSlide = () => {
  if (!project.value || project.value.images.length === 0) return;
  currentSlide.value =
      (currentSlide.value - 1 + project.value.images.length) %
      project.value.images.length;
};

// Функция увеличения/уменьшения
const toggleZoom = () => {
  isZoomed.value = !isZoomed.value;
};

// ОБРАБОТЧИК КЛАВИАТУРЫ
const handleKeyDown = (event: KeyboardEvent) => {
  if (!isZoomed.value) return;

  if (event.key === 'ArrowLeft') {
    prevSlide();
    event.preventDefault();
  } else if (event.key === 'ArrowRight') {
    nextSlide();
    event.preventDefault();
  } else if (event.key === 'Escape') {
    toggleZoom();
  }
};

onMounted(() => {
  fetchProject(route.params.id as string);
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
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
      <div
          v-if="project.images.length"
          class="relative w-full h-96 overflow-hidden rounded-lg group mb-6"
      >
        <transition name="fade" mode="out-in">
          <img
              :src="`${project.image_url}/${project.images[currentSlide]}`"
              class="w-full h-full object-cover transition-transform duration-500 ease-in-out transform group-hover:scale-105 cursor-pointer"
              alt="project image"
              :key="currentSlide"
              @click="toggleZoom"
          />
        </transition>

        <div
            class="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
        ></div>

        <button
            @click.stop="prevSlide"
            class="absolute top-1/2 left-2 -translate-y-1/2 bg-white bg-opacity-70 text-gray-700 px-2 py-1 rounded hover:bg-opacity-100 shadow z-10"
        >
          ‹
        </button>
        <button
            @click.stop="nextSlide"
            class="absolute top-1/2 right-2 -translate-y-1/2 bg-white bg-opacity-70 text-gray-700 px-2 py-1 rounded hover:bg-opacity-100 shadow z-10"
        >
          ›
        </button>

        <div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          <span
              v-for="(_img, idx) in project.images"
              :key="idx"
              :class="{
              'w-3 h-3 rounded-full bg-white transition-opacity duration-300 cursor-pointer': true,
              'opacity-50': idx !== currentSlide,
              'opacity-100': idx === currentSlide
            }"
              @click="currentSlide = idx"
          ></span>
        </div>
      </div>

      <!-- Zoom modal -->
      <transition name="modal-fade">
        <div
            v-if="isZoomed && project.images.length"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 cursor-zoom-out p-4"
            @click="toggleZoom"
        >
          <div class="relative max-w-full max-h-full" @click.stop>
            <transition name="fade" mode="out-in">
              <img
                  :src="`${project.image_url}/${project.images[currentSlide]}`"
                  class="max-w-full max-h-screen object-contain"
                  alt="zoomed project image"
                  :key="currentSlide"
              />
            </transition>

            <!-- Close -->
            <button
                @click="toggleZoom"
                class="absolute top-4 right-4 text-white text-3xl font-bold p-2 hover:text-gray-300 transition"
            >
              &times;
            </button>

            <!-- Prev -->
            <button
                @click.stop="prevSlide"
                class="absolute top-1/2 left-4 -translate-y-1/2 text-black text-3xl p-4 hover:bg-white hover:bg-opacity-10 rounded-full transition"
            >
              ‹
            </button>

            <!-- Next -->
            <button
                @click.stop="nextSlide"
                class="absolute top-1/2 right-4 -translate-y-1/2 text-black text-3xl p-4 hover:bg-white hover:bg-opacity-10 rounded-full transition"
            >
              ›
            </button>
          </div>
        </div>
      </transition>
    </div>

    <div v-else class="text-gray-500 text-center">Проект не найден</div>
  </main>
</template>

<style scoped>
/* Плавный fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Плавный fade модалки */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>