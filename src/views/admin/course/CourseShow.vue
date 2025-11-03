<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useCourseStoreWithGetters } from '../../../store/admin/course/course.store.ts';
import BaseShow from '../../../components/BaseShow.vue';

const route = useRoute();
const courseStore = useCourseStoreWithGetters();

const courseId = Number(route.params.id);
const course = courseStore.currentCourse;
const loading = courseStore.loading;
const error = courseStore.error;

onMounted(async () => {
  if (!isNaN(courseId)) {
    await courseStore.fetchItem(courseId);
  } else {
    courseStore.error = 'Некорректный ID курса';
  }
});
</script>

<template>
  <div>
    <BaseShow
        label="Проект"
        :item="course"
        :itemId="courseId"
        :loading="loading"
        :error="error"
        :exclude="[
        'updatedAt',
        'image_url',
        'images',
        'image_og_url',
        'image_dir',
        'image_og_dir',
        'image_all_dir',
        'image_main_url',
        'image_main_image',
        'image_og_image',
        'partner_id'
      ]"
    />
  </div>
</template>