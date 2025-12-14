<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCourseStoreWithGetters } from '../../../store/admin/course/course.store.ts';
import api from "../../../api";

/* -------------------- TYPES -------------------- */

interface Lesson {
  id: number;
  course_section_id: number;
  name: string;
  duration: number;
  formatted_duration: string;
  status: boolean;
}

interface CourseSection {
  id: number;
  name: string;
  status: boolean;
}

interface LessonGroup {
  section_id: number;
  section: string;
  lessons: Lesson[];
  open: boolean;
  status: boolean;
}

/* -------------------- SETUP -------------------- */

const route = useRoute();
const router = useRouter();
const courseStore = useCourseStoreWithGetters();

const courseId = Number(route.params.id);
const course = courseStore.currentCourse;
const loading = courseStore.loading;
const error = courseStore.error;

const groupedLessons = ref<LessonGroup[]>([]);

/* -------------------- API -------------------- */

const fetchData = async (id: number) => {
  courseStore.loading = true;

  try {
    const [sectionsRes, lessonsRes] = await Promise.all([
      api.get(`/admin/course-section?course_id=${id}`),
      api.get(`/admin/lessons/course/${id}`)
    ]);

    const sections = sectionsRes.data.data as CourseSection[];
    const lessons = lessonsRes.data.data as Lesson[];

    groupedLessons.value = sections.map(section => {
      const sectionLessons = lessons.filter(
          l => l.course_section_id === section.id
      );

      return {
        section_id: section.id,
        section: section.name,
        lessons: sectionLessons,
        open: false,
        status: section.status
      };
    });

  } catch (err: any) {
    courseStore.error =
        err.response?.data?.message || 'Ошибка загрузки данных';
  } finally {
    courseStore.loading = false;
  }
};

/* -------------------- SECTIONS -------------------- */

const toggleSection = (group: LessonGroup) => {
  group.open = !group.open;
};

const createSection = () => {
  router.push({
    path: '/admin/course-section/create',
    query: { course_id: courseId },
  });
};

const editSection = (group: LessonGroup) => {
  router.push(`/admin/course-section/${group.section_id}/edit`);
};

const deleteSection = async (group: LessonGroup) => {
  if (!confirm(`Удалить раздел "${group.section}"?`)) return;

  try {
    await api.delete(`/admin/course-section/${group.section_id}`);
    groupedLessons.value = groupedLessons.value.filter(
        g => g.section_id !== group.section_id
    );
  } catch (e) {
    console.error('Ошибка при удалении раздела:', e);
  }
};

const toggleSectionStatus = async (group: LessonGroup) => {
  if (!group.section_id) return;

  try {
    await api.post(`/admin/course-section/status/${group.section_id}`);

    group.status = !group.status;

    // Синхронизируем статусы всех уроков внутри раздела
    group.lessons.forEach(l => (l.status = group.status));
  } catch (e) {
    console.error('Ошибка при смене статуса раздела:', e);
  }
};

/* -------------------- LESSONS -------------------- */

const editLesson = (lesson: Lesson) => {
  router.push(`/admin/lessons/${lesson.id}/edit`);
};

const deleteLesson = async (lesson: Lesson) => {
  if (!confirm(`Удалить урок "${lesson.name}"?`)) return;

  try {
    await api.delete(`/admin/lessons/${lesson.id}`);

    groupedLessons.value.forEach(group => {
      group.lessons = group.lessons.filter(l => l.id !== lesson.id);
      group.status = group.lessons.some(l => l.status);
    });
  } catch (e) {
    console.error('Ошибка при удалении урока:', e);
  }
};

const toggleLessonStatus = async (lesson: Lesson, group: LessonGroup) => {
  if (!lesson.id) return;

  try {
    await api.post(`/admin/lessons/status/${lesson.id}`);

    lesson.status = !lesson.status;

    // Обновляем статус раздела
    group.status = group.lessons.some(l => l.status);
  } catch (e) {
    console.error('Ошибка при смене статуса урока:', e);
  }
};

/* -------------------- LIFECYCLE -------------------- */

onMounted(async () => {
  if (!isNaN(courseId)) {
    await courseStore.fetchItem(courseId);
    await fetchData(courseId);
  }
});
</script>

<template>
  <main class="max-w-4xl mx-auto py-12 px-6">
    <div v-if="loading" class="text-center text-gray-500">
      Загрузка курса...
    </div>

    <div v-else-if="error" class="text-center text-red-500">
      {{ error }}
    </div>

    <div v-else-if="course">
      <h1 class="text-2xl font-bold mb-4">{{ course.name }}</h1>

      <div class="mb-6 prose" v-html="course.short_description" />
      <div class="mb-6 prose" v-html="course.description" />

      <button
          @click="createSection"
          class="mb-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        ➕ Создать раздел
      </button>

      <div
          v-for="group in groupedLessons"
          :key="group.section_id"
          class="mb-4 border rounded overflow-hidden"
      >
        <button
            @click="toggleSection(group)"
            class="w-full px-4 py-2 bg-gray-100 flex justify-between items-center font-semibold"
        >
          <span>{{ group.section }}</span>

          <div class="flex gap-2 items-center">
            <button @click.stop="toggleSectionStatus(group)">
              {{ group.status ? '✅' : '❌' }}
            </button>

            <button @click.stop="editSection(group)">✏️</button>
            <button @click.stop="deleteSection(group)">🗑</button>

            <span>{{ group.open ? '-' : '+' }}</span>
          </div>
        </button>

        <ul v-show="group.open">
          <li
              v-if="!group.lessons.length"
              class="px-4 py-3 text-gray-400 italic border-t"
          >
            Уроков пока нет
          </li>

          <li
              v-for="lesson in group.lessons"
              :key="lesson.id"
              class="px-4 py-3 border-t flex justify-between"
          >
            <span>{{ lesson.name }}</span>

            <div class="flex gap-3 items-center">
              <button @click.stop="toggleLessonStatus(lesson, group)">
                {{ lesson.status ? 'Отключить' : 'Включить' }}
              </button>
              <button @click.stop="editLesson(lesson)">✏️</button>
              <button @click.stop="deleteLesson(lesson)">🗑</button>
              <span class="text-gray-500 text-sm">
                {{ lesson.formatted_duration }}
              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </main>
</template>

<style scoped>
ul {
  transition: max-height 0.3s ease-in-out;
}
</style>