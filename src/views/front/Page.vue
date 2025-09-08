<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../../api';
import seoState from '../../seo/seo.js';

const route = useRoute();
const content = ref<{
  id: number;
  menu_name: string;
  content: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  og_title?: string;
  og_description?: string;
  og_keywords?: string;
  og_image?: string;
  og_type?: string;
  og_url?: string;
  canonical_url?: string;
  robots?: string;
} | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

const fetchContent = async (slug: string) => {
  loading.value = true;
  error.value = null;

  try {
    const response = await api.get(`/${slug}`);
    content.value = response.data.data;

    // Обновляем SEO-поля после получения данных
    if (content.value) {
      seoState.title = content.value.meta_title || content.value.menu_name;
      seoState.meta_description = content.value.meta_description || '';
      seoState.meta_keywords = content.value.meta_keywords || '';
      seoState.og_title = content.value.og_title || '';
      seoState.og_description = content.value.og_description || '';
      seoState.og_keywords = content.value.og_keywords || '';
      seoState.og_image = content.value.og_image || '';
      seoState.og_type = content.value.og_type || 'website'; // По умолчанию 'website'
      seoState.og_url = content.value.og_url || window.location.href; // По умолчанию текущий URL
      seoState.canonical_url = content.value.canonical_url || window.location.href; // По умолчанию текущий URL
      seoState.robots = content.value.robots || 'index, follow'; // По умолчанию 'index, follow'
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Ошибка загрузки контента';
    content.value = null;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchContent(route.params.slug as string);
});

watch(() => route.params.slug, (newSlug) => {
  fetchContent(newSlug as string);
});

// Сброс SEO-полей при unmount
onUnmounted(() => {
  seoState.title = 'Мой сайт';
  seoState.meta_description = '';
  seoState.meta_keywords = '';
  seoState.og_title = '';
  seoState.og_description = '';
  seoState.og_keywords = '';
  seoState.og_image = '';
  seoState.og_type = 'website';
  seoState.og_url = '';
  seoState.canonical_url = '';
  seoState.robots = 'index, follow';
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