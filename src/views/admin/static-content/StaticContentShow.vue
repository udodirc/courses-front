<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useStaticContentStore } from '../../../store/admin/static-content/static-content.store';
import BaseShow from '../../../components/BaseShow.vue';

const route = useRoute();
const staticContentStore = useStaticContentStore();

const contentId = Number(route.params.id);
const content = computed(() => staticContentStore.currentStaticContent);
const loading = computed(() => staticContentStore.loading);
const error = computed(() => staticContentStore.error);

onMounted(async () => {
  if (!isNaN(contentId)) {
    await staticContentStore.fetchItem(contentId);
  } else {
    staticContentStore.error = 'Некорректный ID контента';
  }
});
</script>

<template>
  <BaseShow
      label="Статичный контент"
      :item="content"
      :itemId="contentId"
      :loading="loading"
      :error="error"
      :exclude="['updatedAt']"
  />
</template>