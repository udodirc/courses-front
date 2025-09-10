<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useProjectStore } from '../../../store/admin/project/project.store';
import BaseShow from '../../../components/BaseShow.vue';

const route = useRoute();
const projectStore = useProjectStore();

const projectId = Number(route.params.id);
const project = computed(() => projectStore.currentProject);
const loading = computed(() => projectStore.loading);
const error = computed(() => projectStore.error);

onMounted(async () => {
  if (!isNaN(projectId)) {
    await projectStore.fetchItem(projectId);
  } else {
    projectStore.error = 'Некорректный ID проекта';
  }
});
</script>

<template>
  <BaseShow
      label="Проект"
      :item="project"
      :itemId="projectId"
      :loading="loading"
      :error="error"
      :exclude="['updatedAt']"
  />
</template>