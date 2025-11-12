<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useLessonStoreWithGetters } from '@/store/admin/lesson/lesson.store';

const route = useRoute();
const { fetchItem, currentLesson, loading } = useLessonStoreWithGetters();

const lessonId = Number(route.params.id);

onMounted(async () => {
  await fetchItem(lessonId);
});

const lesson = computed(() => currentLesson.value);
</script>

<template>
  <div class="p-6">
    <div v-if="loading" class="text-gray-500 text-center py-10">
      Загрузка урока...
    </div>

    <div v-else-if="lesson" class="max-w-4xl mx-auto space-y-6">
      <!-- Название курса -->
      <div class="text-sm text-gray-500">
        <span>Курс:</span>
        <span class="font-semibold text-gray-800">{{ lesson.course_name }}</span>
      </div>

      <!-- Название урока -->
      <h1 class="text-3xl font-bold text-gray-900">
        {{ lesson.name }}
      </h1>

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
