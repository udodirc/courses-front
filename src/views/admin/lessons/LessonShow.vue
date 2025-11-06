<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import BaseShow from '../../../components/BaseShow.vue';
import { useLessonStoreWithGetters } from '../../../store/admin/lesson/lesson.store.ts';

const route = useRoute();
const lessonStore = useLessonStoreWithGetters();

const lessonId = Number(route.params.id);
const lesson = lessonStore.currentLesson;
const loading = lessonStore.loading;
const error = lessonStore.error;

onMounted(async () => {
  if (!isNaN(lessonId)) {
    await lessonStore.fetchItem(lessonId);
  } else {
    lessonStore.error = 'Некорректный ID раздела курса';
  }
});
</script>
<template>
  <BaseShow
      label="Урок"
      :item="lesson"
      :itemId="lessonId"
      :loading="loading"
      :error="error"
      :exclude="['updatedAt', 'course_id', 'course_section_id', 'duration']"
  />
</template>