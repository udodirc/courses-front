<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import api from '../../../api';
import { usePartnerStore } from '../../../store/client/partner/partner.store.ts';

interface Course {
  id: number;
  name: string;
  short_description: string;
  description: string;
  price: number;
  currency?: string;
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
}

interface LessonGroup {
  section: string;
  lessons: Lessons[];
  open: boolean;
}

const route = useRoute();
const partnerStore = usePartnerStore();
const { user } = storeToRefs(partnerStore);

const course = ref<Course | null>(null);
const groupedLessons = ref<LessonGroup[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const userLoading = ref(false);

const fetchCourse = async (slug: string | number) => {
  loading.value = true;
  error.value = null;
  try {
    const response = await api.get(`/courses/${slug}`);
    course.value = response.data.data;
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
    const response = await api.get(`/lessons/course/${id}`);
    const rawLessons = response.data.data as Lessons[];

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

const toggleSection = (group: LessonGroup) => {
  group.open = !group.open;
};

onMounted(async () => {
  userLoading.value = true;
  if (partnerStore.token && !user.value) {
    try {
      await partnerStore.fetchUser();
    } catch (e) {
      console.error('Ошибка загрузки пользователя', e);
    }
  }
  userLoading.value = false;

  await fetchCourse(route.params.slug as string);
  if (course.value) {
    await fetchLessons(course.value.id);
  }
});
</script>

<template>
  <main class="max-w-4xl mx-auto py-12 px-6">
    <div v-if="loading || userLoading" class="text-gray-500 text-center">Загрузка курса...</div>
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
          <span>{{ group.section }}</span>
          <span>{{ group.open ? '-' : '+' }}</span>
        </button>
        <ul v-show="group.open" class="transition max-h-[2000px] duration-300 overflow-hidden">
          <li
              v-for="lesson in group.lessons"
              :key="lesson.id"
              class="flex justify-between items-center px-4 py-3 border-t hover:bg-gray-50 transition"
          >
            <router-link
                :to="`/partner/lesson/${lesson.id}`"
            >
              <span>{{ lesson.name }}</span>
            </router-link>
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