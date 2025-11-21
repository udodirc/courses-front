<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../../../api';
import { useLessonComments } from '../../../composables/useLessonComments';
import LessonCommentItem from '../../../components/LessonCommentItem.vue';

const route = useRoute();
const lessonId = Number(route.params.id);

const lesson = ref<any | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const raw = localStorage.getItem('admin_data');
const adminData = raw ? JSON.parse(raw) : null;

const fetchLesson = async () => {
  loading.value = true;
  try {
    const { data } = await api.get(`/admin/lessons/${lessonId}`);
    lesson.value = data.data;

    await fetchComments(lessonId);

  } catch (e: any) {
    error.value = 'Не удалось загрузить урок';
  } finally {
    loading.value = false;
  }
};

const videoSrc = computed(() => {
  if (!lesson.value) return '';
  if (lesson.value.video_url && lesson.value.video)
    return `${lesson.value.video_url}/${lesson.value.video}`;
  if (lesson.value.video_preview)
    return lesson.value.video_preview;
  return '';
});

const {
  comments,
  loading: commentsLoading,
  error: commentsError,
  fetchComments, // Эту функцию мы передаем вниз для обновления
} = useLessonComments();

const newComment = ref('');
const sending = ref(false);
const sendError = ref<string | null>(null);

const sendComment = async () => {
  if (!newComment.value.trim()) return;

  sending.value = true;
  sendError.value = null;

  try {
    await api.post('/admin/lesson-comment', {
      lesson_id: lessonId,
      comment: newComment.value,
    });

    newComment.value = '';

    await fetchComments(lessonId);

  } catch (e: any) {
    sendError.value = e?.response?.data?.message || 'Ошибка отправки';
  } finally {
    sending.value = false;
  }
};

// ❌ УДАЛЕНА вся дублирующая логика редактирования/удаления (editingCommentId, deleteComment и т.д.)

onMounted(fetchLesson);
</script>

<template>
  <div class="p-6">
    <div v-if="loading" class="text-gray-500 text-center py-10">
      Загрузка урока...
    </div>

    <div v-else-if="error" class="text-red-500 text-center py-10">
      {{ error }}
    </div>

    <div v-else-if="lesson" class="max-w-4xl mx-auto space-y-6">
      <div class="text-sm text-gray-500">
        Курс: <span class="font-semibold text-gray-800">{{ lesson.course_name }}</span>
      </div>

      <h1 class="text-3xl font-bold text-gray-900">
        {{ lesson.name }}
      </h1>

      <div v-if="videoSrc" class="mt-4">
        <video
            :src="videoSrc"
            controls
            preload="metadata"
            class="w-full max-h-[500px] rounded-lg border shadow-sm bg-black"
        >
          Ваш браузер не поддерживает видео.
        </video>
      </div>

      <div v-else class="bg-gray-100 text-gray-500 text-center py-8 rounded-lg">
        🎥 Видео недоступно
      </div>

      <div class="text-gray-500 text-sm">
        Длительность: {{ lesson.formatted_duration }}
      </div>

      <div
          class="prose prose-gray max-w-none border-t pt-6"
          v-html="lesson.content"
      ></div>

      <div class="mt-10 border-t pt-6">

        <h2 class="text-2xl font-semibold mb-4">Комментарии</h2>

        <div v-if="commentsError[lessonId]" class="text-red-500">
          {{ commentsError[lessonId] }}
        </div>

        <div v-else-if="commentsLoading[lessonId]" class="text-gray-400">
          Загрузка комментариев...
        </div>

        <div v-else>
          <div v-if="comments[lessonId]?.length" class="space-y-4">

            <LessonCommentItem
                v-for="c in comments[lessonId]"
                :key="c.id"
                :comment="c"
                :admin-data="adminData"
                :lesson-id="lessonId"
                :on-comment-action="fetchComments"
                class="bg-gray-50 border rounded-lg shadow-sm"
            />

          </div>

          <div v-else class="text-gray-400 italic">
            Нет комментариев
          </div>
        </div>

        <div class="mt-6 p-4 border rounded-lg bg-white shadow-sm">
          <textarea
              v-model="newComment"
              class="w-full border rounded p-3 focus:outline-none"
              placeholder="Напишите комментарий..."
              rows="3"
          ></textarea>

          <div v-if="sendError" class="text-red-500 mt-1">{{ sendError }}</div>

          <button
              @click="sendComment"
              :disabled="sending"
              class="mt-3 px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
          >
            {{ sending ? 'Отправка...' : 'Отправить' }}
          </button>
        </div>

      </div>
    </div>

    <div v-else class="text-red-500 text-center py-10">
      Урок не найден
    </div>
  </div>
</template>

<style scoped>
.prose :where(img, video) {
  max-width: 100%;
  border-radius: 8px;
}
.comment_author {
  font-size: 14px;
}
</style>