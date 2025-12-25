<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../../../api';
import { useLessonComments } from '../../../composables/useLessonComments';
import PartnerLessonCommentItem from '../../../components/PartnerLessonCommentItem.vue';

const route = useRoute();
const lessonId = Number(route.params.id);

const lesson = ref<any | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const partnerId = Number(localStorage.getItem('partner_id'));
const token = localStorage.getItem('partner_token'); // JWT токен для Authorization

const fetchLesson = async () => {
  loading.value = true;
  try {
    const { data } = await api.get(`/partner/lessons/${lessonId}`);
    lesson.value = data.data;

    await fetchComments(lessonId);

  } catch (e: any) {
    error.value = 'Не удалось загрузить урок';
  } finally {
    loading.value = false;
  }
};

// -----------------------------
// ВИДЕО через Blob
// -----------------------------
const videoUrl = ref<string | null>(null);
const APP_URL = import.meta.env.VITE_APP_URL || '';
const fetchVideo = async () => {
  if (!lesson.value || !token) return;

  try {
    const response = await fetch(`${APP_URL}/partner/lessons/${lessonId}/video`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error('Ошибка загрузки видео:', response.status, response.statusText);
      return;
    }

    const blob = await response.blob();
    videoUrl.value = URL.createObjectURL(blob);

  } catch (err) {
    console.error('Ошибка при fetch видео:', err);
  }
};

// -----------------------------
// Комментарии
// -----------------------------
const {
  comments,
  loading: commentsLoading,
  error: commentsError,
  fetchComments,
} = useLessonComments('partner');

const newComment = ref('');
const sending = ref(false);
const sendError = ref<string | null>(null);

const sendComment = async () => {
  if (!newComment.value.trim()) return;

  sending.value = true;
  sendError.value = null;

  try {
    await api.post('/partner/lesson-comment', {
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

onMounted(async () => {
  await fetchLesson();
  await fetchVideo();
});
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

      <h1 class="text-3xl font-bold text-gray-900">{{ lesson.name }}</h1>

      <!-- ВИДЕО -->
      <video
          v-if="videoUrl"
          :src="videoUrl"
          controls
          preload="metadata"
          class="w-full max-h-[500px] rounded-lg border shadow-sm bg-black"
      >
        Ваш браузер не поддерживает видео
      </video>

      <div v-else class="bg-gray-100 text-gray-500 text-center py-8 rounded-lg">
        🎥 Видео недоступно
      </div>

      <div class="text-gray-500 text-sm">
        Длительность: {{ lesson.formatted_duration }}
      </div>

      <div class="prose prose-gray max-w-none border-t pt-6" v-html="lesson.content"></div>

      <!-- Комментарии -->
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
            <PartnerLessonCommentItem
                v-for="c in comments[lessonId]"
                :key="c.id"
                :comment="c"
                :partner-id="partnerId"
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