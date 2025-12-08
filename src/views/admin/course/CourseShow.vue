<script setup lang="ts">
import {onMounted, ref} from 'vue';
import { useRoute } from 'vue-router';
import { useCourseStoreWithGetters } from '../../../store/admin/course/course.store.ts';
import api from "../../../api";

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
  open: boolean;
}

const route = useRoute();
const courseStore = useCourseStoreWithGetters();
const courseId = Number(route.params.id);
const course = courseStore.currentCourse;
const loading = courseStore.loading;
const error = courseStore.error;
const groupedLessons = ref<LessonGroup[]>([]);

const fetchLessons = async (id: number) => {
  courseStore.loading = true;

  try {
    const response = await api.get(`/admin/lessons/course/${id}`);
    const rawLessons = response.data.data as Lessons[];

    const grouped: LessonGroup[] = rawLessons.reduce((acc: LessonGroup[], lesson) => {
      const sectionName = lesson.course_section_name || 'Без раздела';

      let group = acc.find(g => g.section === sectionName);
      if (!group) {
        group = { section: sectionName, lessons: [], open: false };
        acc.push(group);
      }

      group.lessons.push(lesson);
      return acc;
    }, []);

    groupedLessons.value = grouped;
  } catch (err: any) {
    courseStore.error = err.response?.data?.message || 'Ошибка загрузки уроков';
  } finally {
    courseStore.loading = false;
  }
};

const toggleSection = (group: LessonGroup) => {
  group.open = !group.open;
};

onMounted(async () => {
  if (!isNaN(courseId)) {
    await courseStore.fetchItem(courseId);
    await fetchLessons(courseId);
  } else {
    courseStore.error = 'Некорректный ID курса';
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

      <!-- Аккордеон уроков -->
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
            <span>{{ lesson.name }}</span>
            <span class="text-gray-500 text-sm">{{ lesson.formatted_duration }}</span>
          </li>
        </ul>
      </div>
    </div>
  </main>
</template>