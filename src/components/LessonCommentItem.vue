<script setup lang="ts">
import { ref, computed } from 'vue';
import api from '../api';

const props = defineProps<{
  comment: any;
  adminData: any; // Данные администратора, возможно, содержащие его ID
  lessonId: number;
  // Функция для обновления всего списка после действия
  onCommentAction: (lessonId: number) => Promise<void>;
}>();

// -----------------------------
// ВЫЧИСЛЯЕМОЕ СВОЙСТВО АВТОРА
// -----------------------------
const displayAuthor = computed(() => {
  const author = props.comment.author;
  const authorType = props.comment.author_type;

  if (!author) return 'Неизвестный автор';

  if (authorType === 'App\\Models\\User') {
    return author.name;
  }

  if (authorType === 'App\\Models\\Partner') {
    const fullName = `${author.first_name || ''} ${author.last_name || ''}`.trim();
    return fullName || author.login;
  }

  return 'Автор';
});

// -----------------------------
// ЛОГИКА РЕДАКТИРОВАНИЯ
// -----------------------------
const editingCommentId = ref<number | null>(null);
const editedCommentText = ref('');
const savingComment = ref(false);
const editError = ref<string | null>(null);

const startEdit = (comment: any) => {
  cancelReply(); // Отключаем форму ответа, если она активна
  editingCommentId.value = comment.id;
  editedCommentText.value = comment.comment;
  editError.value = null;
};

const cancelEdit = () => {
  editingCommentId.value = null;
  editedCommentText.value = '';
};

const saveEditedComment = async () => {
  if (!editedCommentText.value.trim()) return;

  savingComment.value = true;
  editError.value = null;

  try {
    await api.put(`/admin/lesson-comment/${editingCommentId.value}`, {
      comment: editedCommentText.value,
    });

    // Обновляем родительский список
    await props.onCommentAction(props.lessonId);
    cancelEdit();

  } catch (e: any) {
    editError.value = e?.response?.data?.message || 'Ошибка сохранения';
  } finally {
    savingComment.value = false;
  }
};

// -----------------------------
// ЛОГИКА УДАЛЕНИЯ
// -----------------------------
const deletingCommentId = ref<number | null>(null);
const deleteError = ref<string | null>(null);

const deleteComment = async (commentId: number) => {
  if (!confirm('Вы уверены, что хотите удалить этот комментарий?')) {
    return;
  }

  deletingCommentId.value = commentId;
  deleteError.value = null;

  try {
    await api.delete(`/admin/lesson-comment/${commentId}`);

    // Обновляем родительский список
    await props.onCommentAction(props.lessonId);

  } catch (e: any) {
    deleteError.value = e?.response?.data?.message || 'Ошибка удаления';
  } finally {
    deletingCommentId.value = null;
  }
};

// -----------------------------
// ЛОГИКА ОТВЕТА (REPLY)
// -----------------------------
const replyingToId = ref<number | null>(null);
const replyText = ref('');
const sendingReply = ref(false);
const replyError = ref<string | null>(null);

const startReply = (commentId: number) => {
  cancelEdit(); // Отключаем режим редактирования
  replyingToId.value = commentId;
  replyText.value = '';
  replyError.value = null;
};

const cancelReply = () => {
  replyingToId.value = null;
  replyText.value = '';
};

const sendReply = async () => {
  if (!replyText.value.trim() || !replyingToId.value) return;

  sendingReply.value = true;
  replyError.value = null;

  try {
    // Используем АДМИНСКИЙ API-маршрут для создания ответа
    await api.post('/admin/lesson-comment', {
      lesson_id: props.lessonId,
      parent_id: replyingToId.value, // Указываем ID родительского комментария
      comment: replyText.value,
    });

    // Обновляем родительский список
    await props.onCommentAction(props.lessonId);
    cancelReply();

  } catch (e: any) {
    replyError.value = e?.response?.data?.message || 'Ошибка отправки ответа';
  } finally {
    sendingReply.value = false;
  }
};
</script>

<template>
  <div class="comment-wrapper">
    <div
        class="p-2"
        :class="{ 'mt-2': props.comment.parent_id }"
    >
      <div class="font-semibold text-gray-800 comment_author flex justify-between items-center">
        <div class="flex items-center space-x-2">
          <span>{{ displayAuthor }}</span>

          <button
              v-if="editingCommentId !== props.comment.id && props.comment.author_type === 'App\\Models\\Partner'"
              @click="startReply(props.comment.id)"
              class="text-green-600 hover:underline text-sm"
          >
            Ответить
          </button>
        </div>

        <div
            class="flex items-center space-x-3"
        >
          <button
              v-if="editingCommentId !== props.comment.id"
              @click="startEdit(props.comment)"
              :disabled="deletingCommentId === props.comment.id"
              class="text-blue-600 hover:underline text-sm disabled:text-gray-500"
          >
            Редактировать
          </button>

          <button
              v-if="editingCommentId !== props.comment.id"
              @click="deleteComment(props.comment.id)"
              :disabled="deletingCommentId === props.comment.id"
              class="text-red-600 hover:underline text-sm disabled:text-gray-500"
          >
            {{ deletingCommentId === props.comment.id ? 'Удаление...' : 'Удалить' }}
          </button>
        </div>
      </div>

      <div class="text-xs text-gray-400 mt-1 mb-2">{{ props.comment.created_at }}</div>

      <div v-if="deleteError" class="text-red-500 text-sm mb-2">{{ deleteError }}</div>

      <div v-if="editingCommentId !== props.comment.id" class="text-gray-700">
        {{ props.comment.comment }}
      </div>

      <div v-else>
        <textarea
            v-model="editedCommentText"
            class="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
        ></textarea>

        <div v-if="editError" class="text-red-500 text-sm mt-1">{{ editError }}</div>

        <div class="flex space-x-2 mt-2">
          <button
              @click="saveEditedComment"
              :disabled="savingComment || !editedCommentText.trim()"
              class="px-3 py-1 bg-green-600 text-white rounded text-sm disabled:bg-gray-400"
          >
            {{ savingComment ? 'Сохранение...' : 'Сохранить' }}
          </button>
          <button
              @click="cancelEdit"
              :disabled="savingComment"
              class="px-3 py-1 bg-red-600 text-white rounded text-sm disabled:bg-gray-400"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>

    <div v-if="replyingToId === props.comment.id" class="mt-3 ml-4 p-3 border rounded-lg bg-gray-100">
        <textarea
            v-model="replyText"
            class="w-full border rounded p-2 focus:outline-none"
            placeholder="Напишите ответ..."
            rows="2"
        ></textarea>

      <div v-if="replyError" class="text-red-500 mt-1 text-sm">{{ replyError }}</div>

      <div class="flex space-x-2 mt-2 justify-end">
        <button
            @click="sendReply"
            :disabled="sendingReply || !replyText.trim()"
            class="px-3 py-1 bg-blue-600 text-white rounded text-sm disabled:bg-gray-400"
        >
          {{ sendingReply ? 'Отправка...' : 'Отправить ответ' }}
        </button>
        <button
            @click="cancelReply"
            :disabled="sendingReply"
            class="px-3 py-1 bg-gray-500 text-white rounded text-sm disabled:bg-gray-400"
        >
          Отмена
        </button>
      </div>
    </div>

    <div v-if="props.comment.replies && props.comment.replies.length" class="ml-6 border-l pl-4">
      <LessonCommentItem
          v-for="reply in props.comment.replies"
          :key="reply.id"
          :comment="reply"
          :admin-data="adminData"
          :lesson-id="lessonId"
          :on-comment-action="onCommentAction"
      />
    </div>
  </div>
</template>

<style scoped>
.comment_author {
  font-size: 14px;
}
</style>