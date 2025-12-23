<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import BaseShow from '../../../components/BaseShow.vue';
import {useCourseSectionStoreWithGetters} from "../../../store/admin/course_section/course_section.store.ts";

const route = useRoute();
const courseSectionStore = useCourseSectionStoreWithGetters();

const courseSectionId = Number(route.params.id);
const courseSection = courseSectionStore.currentCourseSection;
const loading = courseSectionStore.loading;
const error = courseSectionStore.error;

onMounted(async () => {
  if (!isNaN(courseSectionId)) {
    await courseSectionStore.fetchItem(courseSectionId);
  } else {
    courseSectionStore.error = 'Некорректный ID раздела курса';
  }
});
</script>
<template>
  <BaseShow
      label="Раздел курса"
      :item="courseSection"
      :itemId="courseSectionId"
      :loading="loading"
      :error="error"
      :exclude="['updatedAt', 'course_id']"
  />
</template>