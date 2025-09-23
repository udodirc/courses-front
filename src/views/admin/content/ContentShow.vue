<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useContentStoreWithGetters } from '../../../store/admin/content/content.store';
import BaseShow from '../../../components/BaseShow.vue';

const route = useRoute();
const contentStore = useContentStoreWithGetters();

const contentId = Number(route.params.id);
const content = contentStore.currentContent; // просто используем computed как есть
const loading = contentStore.loading; // тоже computed
const error = contentStore.error;

onMounted(async () => {
  if (!isNaN(contentId)) {
    await contentStore.fetchItem(contentId);
  } else {
    contentStore.error = 'Некорректный ID контента';
  }
});
</script>

<template>
  <BaseShow
      label="Контент"
      :item="content"
      :itemId="contentId"
      :loading="loading"
      :error="error"
      :exclude="['updatedAt', 'menu_id']"
  />
</template>