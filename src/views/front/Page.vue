<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import api from '../../api'; // твой axios instance

const route = useRoute();
const content = ref<{ id: number; menu_name: string; content: string } | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

const fetchContent = async (slug: string) => {
  loading.value = true;
  error.value = null;

  try {
    const response = await api.get(`/${slug}`);
    content.value = response.data.data;
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Ошибка загрузки контента';
    content.value = null;
  } finally {
    loading.value = false;
  }
};

// при монтировании
onMounted(() => {
  fetchContent(route.params.slug as string);
});

// если пользователь перешёл на другой slug, подгружаем заново
watch(() => route.params.slug, (newSlug) => {
  fetchContent(newSlug as string);
});
</script>

<template>
  <main class="max-w-4xl mx-auto py-12 px-6">
    <div v-if="loading" class="text-gray-500 text-center">Загрузка контента...</div>

    <div v-else-if="error" class="text-red-500 text-center">{{ error }}</div>

    <div v-else-if="content">
      <h1 class="text-3xl font-bold mb-6">{{ content.menu_name }}</h1>
      <div class="prose" v-html="content.content"></div>
    </div>

    <div v-else class="text-gray-500 text-center">
      Контент не найден
    </div>
  </main>
</template>

<style scoped>
.prose {
  line-height: 1.7;
  font-size: 1rem;
  color: #333;
}
</style>