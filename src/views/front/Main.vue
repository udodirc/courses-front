<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import api from '../../api';

interface ContentData {
  id: number;
  name: string;
  content: string;
}

const route = useRoute();
const content = ref<ContentData | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

const fetchContent = async (name: string) => {
  loading.value = true;
  error.value = null;

  try {
    const response = await api.get(`/static_content/main`);
    content.value = response.data.data;
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Ошибка загрузки контента';
    content.value = null;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchContent(route.params.name as string);
});

watch(() => route.params.name, (newName) => {
  fetchContent(newName as string);
});
</script>

<template>
  <div v-if="loading">Загрузка...</div>
  <div v-else-if="error" class="text-red-500">{{ error }}</div>
  <div v-else-if="content" v-html="content.content"></div>
  <div v-else>Контент не найден</div>
</template>