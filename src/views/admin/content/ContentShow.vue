<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useContentStore } from '../../../store/admin/content/content.store';
import BaseShow from '../../../components/BaseShow.vue';

const route = useRoute();
const contentStore = useContentStore();

const contentId = Number(route.params.id);
const content = computed(() => contentStore.currentContent);
const loading = computed(() => contentStore.loading);
const error = computed(() => contentStore.error);

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