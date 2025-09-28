<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStaticContentStoreWithGetters } from '../../../store/admin/static-content/static-content.store';
import BaseShow from '../../../components/BaseShow.vue';

const route = useRoute();
const staticContentStore = useStaticContentStoreWithGetters();

const contentId = Number(route.params.id);
const content = staticContentStore.currentStaticContent;
const loading = staticContentStore.loading;
const error = staticContentStore.error;

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