<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../../../api';
import { useRoute } from 'vue-router';
// seoState импорт и логика удалены

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

interface Lessons {
  id: number;
  course_section_id: number;
  course_section_name: string;
  name: string;
  content: string;
  duration: number;
  formatted_duration: string;
  free_pay: boolean;
  status: boolean;
  createdAt: string;
}

interface LessonGroup {
  section: string;
  lessons: Lessons[];
  open: boolean; // состояние аккордеона
}

const route = useRoute();
const courseId = Number(route.params.id);
const course = ref<Course | null>(null);
const groupedLessons = ref<LessonGroup[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const fetchCourse = async (id: number) => {
  loading.value = true;
  error.value = null;
  try {
    // Используем id, так как мы берем его из route.params.id
    const response = await api.get(`/admin/course/${id}`);
    course.value = response.data.data;
    const APP_URL = import.meta.env.VITE_APP_URL || '';
    const VITE_PUBLIC_PROJECTS_OG_IMAGE_BASE_PATH = import.meta.env.VITE_PUBLIC_PROJECTS_OG_IMAGE_BASE_PATH || '';

    if (course.value) {
      const ogImage = (course.value.og_image != 'Og image')
          ? APP_URL + VITE_PUBLIC_PROJECTS_OG_IMAGE_BASE_PATH + "/" + course.value.id + "/" + course.value.og_image
          : '';
      // SEO логика удалена
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Ошибка загрузки курса';
  } finally {
    loading.value = false;
  }
};

const fetchLessons = async (id: number) => {
  loading.value = true;
  error.value = null;
  try {
    const response = await api.get(`/admin/lessons/course/${id}`);

    const rawLessons = response.data.data as Lessons[];

    // Группировка уроков по разделам и добавляем состояние "open"
    const grouped: LessonGroup[] = rawLessons.reduce((acc, lesson) => {
      const sectionName = lesson.course_section_name || 'Без раздела';
      let group = acc.find(g => g.section === sectionName);
      if (!group) {
        group = { section: sectionName, lessons: [], open: false };
        acc.push(group);
      }
      group.lessons.push(lesson);
      return acc;
    }, [] as LessonGroup[]);

    groupedLessons.value = grouped;
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Ошибка загрузки уроков';
  } finally {
    loading.value = false;
  }
};

// 🔥 ФУНКЦИЯ: Переключение аккордеона
const toggleSection = (group: LessonGroup) => {
  group.open = !group.open;
};

onMounted(async () => {
  await fetchCourse(courseId);
  if (course.value) {
    await fetchLessons(course.value.id);
  }
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

      <div v-for="group in groupedLessons" :key="group.section" class="mb-4 border rounded-lg overflow-hidden">
        <button
            @click="toggleSection(group)"
            class="w-full text-left bg-gray-100 px-4 py-2 font-semibold flex justify-between items-center"
        >
          <span>{{ group.section }} ({{ group.lessons.length }})</span>
          <span>{{ group.open ? '−' : '+' }}</span>
        </button>

        <ul v-show="group.open" class="transition max-h-[2000px] duration-300 overflow-hidden">
          <li
              v-for="lesson in group.lessons"
              :key="lesson.id"
              class="flex justify-between items-center px-4 py-3 border-t hover:bg-gray-50 transition"
          >
            <span>{{ lesson.name }}</span>
            <span class="text-gray-500 text-sm">{{ lesson.formatted_duration }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div v-else class="text-gray-500 text-center">Курс не найден</div>
  </main>
</template>

<style scoped>
ul {
  transition: max-height 0.3s ease-in-out;
}
</style>