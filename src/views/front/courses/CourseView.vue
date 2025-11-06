<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../../../api';
import { useRoute } from 'vue-router';
import seoState from '../../../seo/seo.js';

interface Course {
  id: number;
  name: string;
  short_description: string;
  description: string;
  price: number;
  url: string;
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
  createdAt: string;
}

const route = useRoute();
const course = ref<Course | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

const fetchCourse = async (slug: string | number) => {
  loading.value = true;
  error.value = null;
  try {
    const response = await api.get(`/courses/${slug}`);
    course.value = response.data.data;
    const APP_URL = import.meta.env.VITE_APP_URL || '';
    const VITE_PUBLIC_PROJECTS_OG_IMAGE_BASE_PATH = import.meta.env.VITE_PUBLIC_PROJECTS_OG_IMAGE_BASE_PATH || '';

    if (course.value) {
      const ogImage = (course.value.og_image != 'Og image')
          ? APP_URL + VITE_PUBLIC_PROJECTS_OG_IMAGE_BASE_PATH + "/" + course.value.id + "/" + course.value.og_image
          : '';

      seoState.title = course.value.meta_title || '';
      seoState.meta_description = course.value.meta_description || '';
      seoState.meta_keywords = course.value.meta_keywords || '';
      seoState.og_title = course.value.og_title || '';
      seoState.og_description = course.value.og_description || '';
      seoState.og_keywords = course.value.og_keywords || '';
      seoState.og_image =  ogImage;
      seoState.og_type = course.value.og_type || 'website';
      seoState.og_url = course.value.og_url || window.location.href;
      seoState.canonical_url = course.value.canonical_url || window.location.href;
      seoState.robots = course.value.robots || 'index, follow';
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Ошибка загрузки курса';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchCourse(route.params.slug as string);
});
</script>

<template>
  <main class="max-w-4xl mx-auto py-12 px-6">
    <div v-if="loading" class="text-gray-500 text-center">Загрузка курса...</div>
    <div v-else-if="error" class="text-red-500 text-center">{{ error }}</div>

    <div v-else-if="course">
      <h1 class="text-2xl font-bold mb-4">{{ course.name }}</h1>
      <div class="mb-6 prose" v-html="course.short_description"></div>
      <div class="mb-6 prose" v-html="course.description"></div>
    </div>

    <div v-else class="text-gray-500 text-center">Курс не найден</div>
  </main>
</template>

<style scoped>
</style>