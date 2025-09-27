<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useProjectStoreWithGetters } from '../../../store/admin/project/project.store';
import BaseShow from '../../../components/BaseShow.vue';

const route = useRoute();
const projectStore = useProjectStoreWithGetters();

const projectId = Number(route.params.id);
const project = projectStore.currentProject;
const loading = projectStore.loading;
const error = projectStore.error;

onMounted(async () => {
  if (!isNaN(projectId)) {
    await projectStore.fetchItem(projectId);
  } else {
    projectStore.error = 'Некорректный ID проекта';
  }
});
</script>

<template>
  <div>
    <BaseShow
        label="Проект"
        :item="project"
        :itemId="projectId"
        :loading="loading"
        :error="error"
        :exclude="['updatedAt', 'image_url', 'images', 'image_og_url', 'image_dir', 'image_og_dir', 'image_all_dir']"
    />

    <!-- Блок картинок -->
    <div v-if="project?.images?.length" class="mt-6 flex justify-center">
      <div class="max-w-3xl p-6 bg-white rounded shadow flex flex-wrap gap-4 justify-center">
        <h3 class="w-full text-sm font-medium text-gray-700 mb-4">Изображения</h3>
        <div
            v-for="img in project.images"
            :key="img"
            class="w-48 h-48"
        >
          <img
              :src="`${project.image_url}/${img}`"
              alt="Project image"
              class="w-48 h-48 object-cover rounded border"
          />
        </div>
      </div>
    </div>
  </div>
</template>