<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../../../api';

const route = useRoute();
const lessonId = Number(route.params.id);

const lesson = ref<any | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const fetchLesson = async () => {
  loading.value = true;
  try {
    const { data } = await api.get(`/partner/lessons/${lessonId}`);
    lesson.value = data.data;
  } catch (e: any) {
    console.error('Ошибка загрузки урока:', e);
    error.value = 'Не удалось загрузить урок';
  } finally {
    loading.value = false;
  }
};

// 🎬 Формируем ссылку на видео
const videoSrc = computed(() => {
  if (!lesson.value) return '';
  if (lesson.value.video_url && lesson.value.video)
    return `${lesson.value.video_url}/${lesson.value.video}`;
  if (lesson.value.video_preview)
    return lesson.value.video_preview;
  return '';
});

onMounted(fetchLesson);
</script>

<template>
  <div class="p-6">
    <div v-if="loading" class="text-gray-500 text-center py-10">
      Загрузка урока...
    </div>

    <div v-else-if="error" class="text-red-500 text-center py-10">
      {{ error }}
    </div>

    <div v-else-if="lesson" class="max-w-4xl mx-auto space-y-6">
      <!-- Название курса -->
      <div class="text-sm text-gray-500">
        Курс: <span class="font-semibold text-gray-800">{{ lesson.course_name }}</span>
      </div>

      <!-- Название урока -->
      <h1 class="text-3xl font-bold text-gray-900">
        {{ lesson.name }}
      </h1>

      <!-- Видео урока -->
      <div v-if="videoSrc" class="mt-4">
        <video
            :src="videoSrc"
            controls
            preload="metadata"
            class="w-full max-h-[500px] rounded-lg border shadow-sm bg-black"
        >
          Ваш браузер не поддерживает видео.
        </video>
      </div>

      <div v-else class="bg-gray-100 text-gray-500 text-center py-8 rounded-lg">
        🎥 Видео недоступно
      </div>

      <!-- Длительность -->
      <div class="text-gray-500 text-sm">
        Длительность: {{ lesson.formatted_duration }}
      </div>

      <!-- Контент урока -->
      <div
          class="prose prose-gray max-w-none border-t pt-6"
          v-html="lesson.content"
      ></div>
    </div>

    <div v-else class="text-red-500 text-center py-10">
      Урок не найден
    </div>
  </div>
</template>

<style scoped>
.prose :where(img, video) {
  max-width: 100%;
  border-radius: 8px;
}
</style>