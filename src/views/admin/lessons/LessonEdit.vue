<script setup lang="ts">
import { ref, reactive, watch, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useLessonStore, useLessonStoreWithGetters } from '../../../store/admin/lesson/lesson.store.ts';
import { useErrorHandler } from '../../../composables/useErrorHandler';
import api from '../../../api';

import BaseForm from '../../../components/ui/BaseForm.vue';
import BaseInput from '../../../components/ui/BaseInput.vue';
import BaseToggle from '../../../components/ui/BaseToggle.vue';
import FormErrors from '../../../components/ui/FormErrors.vue';
import BaseTextAreaWithEditor from "../../../components/ui/BaseTextAreaWithEditor.vue";
import { UploadDirs } from '../../../config/uploads';

const route = useRoute();
const router = useRouter();
const lessonId = Number(route.params.id);
const courseId = Number(route.query.course_id);

const { currentLesson } = useLessonStoreWithGetters();
const { error, setError } = useErrorHandler();
const loading = ref(false);

// const videoFileInputRef = ref<HTMLInputElement | null>(null);

const formModel = reactive({
  name: '',
  content: '',
  video_link: '',
  duration: 0, // в секундах
  status: 1,
  free_pay: true,
  course_section_id: null as number | null,
  video: null as File | string | null,
  video_dir: '',
  video_url: '',
  video_all_dir: '',
  video_preview: '',
});

// --- Заполнение формы при загрузке данных ---
watch(currentLesson, (val) => {
  if (!val) return;

  Object.assign(formModel, {
    name: val.name,
    content: val.content,
    video_link: val.video_link,
    duration: val.duration ?? 0,
    status: val.status ?? 1,
    free_pay: val.free_pay ?? 1,
    course_section_id: val.course_section_id ?? null,
    video: val.video ?? null,
    video_dir: val.video_dir ?? '',
    video_all_dir: val.video_all_dir ?? '',
    video_preview: val.video_url
        ? `${val.video_url}/${val.video}`
        : '',
  });
});

// --- computed для duration (мм:сс) ---
const formattedDuration = computed({
  get: () => {
    const totalSeconds = formModel.duration || 0;
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  },
  set: (value: string) => {
    const [m, s] = value.split(':').map(v => parseInt(v || '0', 10));
    formModel.duration = (m || 0) * 60 + (s || 0);
  },
});

// --- Загрузка нового видео ---
// const handleVideoFileChange = (event: Event) => {
//   const target = event.target as HTMLInputElement;
//   if (!target.files || !target.files[0]) return;
//
//   const file = target.files[0];
//
//   // 🔍 Проверка формата
//   if (!file.type.startsWith('video/')) {
//     alert('Пожалуйста, выберите видеофайл.');
//     if (videoFileInputRef.value) videoFileInputRef.value.value = '';
//     return;
//   }
//
//   if (formModel.video_preview.startsWith('blob:')) {
//     URL.revokeObjectURL(formModel.video_preview);
//   }
//
//   formModel.video = file;
//   formModel.video_preview = URL.createObjectURL(file);
// };
//
// // --- Удаление видео ---
// const removeVideo = async () => {
//   try {
//     if (typeof formModel.video === 'string' && formModel.video !== '') {
//       await api.delete(`/admin/files/${formModel.video_dir}/${lessonId}` , {
//         data: { dir: formModel.video_all_dir, filename: formModel.video }
//       });
//     }
//
//     if (formModel.video_preview.startsWith('blob:'))
//       URL.revokeObjectURL(formModel.video_preview);
//
//     formModel.video = null;
//     formModel.video_preview = '';
//
//     if (videoFileInputRef.value) videoFileInputRef.value.value = '';
//   } catch (e) {
//     console.error('Ошибка при удалении видео', e);
//   }
// };

// --- Сохранение формы ---
const save = async () => {
  loading.value = true;
  error.value = null;

  try {
    const payload = new FormData();
    payload.append('name', formModel.name);
    payload.append('content', formModel.content);
    payload.append('video_link', formModel.video_link);
    payload.append('duration', String(formModel.duration));
    payload.append('status', String(formModel.status));
    payload.append('free_pay', formModel.free_pay ? '1' : '0');

    if (formModel.course_section_id) {
      payload.append('course_section_id', String(formModel.course_section_id));
    }

    // if (formModel.video instanceof File) {
    //   payload.append('video', formModel.video);
    // } else if (formModel.video === null) {
    //   payload.append('video', '');
    // }

    await api.post(`/admin/lessons/${lessonId}`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    router.push(`/admin/course/${courseId}`);
  } catch (e: any) {
    setError(e);
  } finally {
    loading.value = false;
  }
};

// --- При монтировании ---
onMounted(() => {
  if (!isNaN(lessonId)) {
    useLessonStore().fetchItem(lessonId);
  } else {
    error.value = { general: ['Некорректный ID урока'] };
  }
});
console.log(formModel.video_preview);
</script>

<template>
  <BaseForm label="Редактировать урок" :loading="loading" :onSubmit="save">
    <FormErrors :error="error" />

    <BaseInput v-model="formModel.name" label="Имя" required class="mb-4" />
    <BaseTextAreaWithEditor
        v-model="formModel.content"
        label="Контент"
        :imageDir="UploadDirs.LESSONS"
        required
        class="w-full mb-4" />
    <BaseInput v-model="formModel.video_link" label="Ссылка на видео" class="mb-4" />

    <BaseInput
        v-model="formattedDuration"
        label="Длительность (мин:сек)"
        placeholder="Например: 02:15"
        required
        class="mb-4"
    />

    <BaseToggle
        v-model="formModel.status"
        label="Статус"
        :activeLabel="'Активный'"
        :inactiveLabel="'Неактивный'"
        class="mb-4"
    />

    <BaseToggle
        v-model="formModel.free_pay"
        label="Бесплатный просмотр"
        :activeLabel="'Активный'"
        :inactiveLabel="'Неактивный'"
        class="mb-4"
    />

    <!-- Видео урок -->
<!--    <div class="mb-4">-->
<!--      <label class="block text-sm text-gray-600 mb-1">Видео урок</label>-->

<!--      <label-->
<!--          class="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg shadow cursor-pointer hover:bg-green-700 transition"-->
<!--      >-->
<!--        <span>Выбрать видео</span>-->
<!--        <input-->
<!--            ref="videoFileInputRef"-->
<!--            type="file"-->
<!--            accept="video/*"-->
<!--            class="hidden"-->
<!--            @change="handleVideoFileChange"-->
<!--        />-->
<!--      </label>-->

<!--      &lt;!&ndash; Превью видео &ndash;&gt;-->
<!--      <div v-if="Boolean(formModel.video)" class="relative group mt-3">-->
<!--      <video-->
<!--            :src="formModel.video_preview"-->
<!--            controls-->
<!--            class="w-full max-h-64 rounded-lg border"-->
<!--        ></video>-->

<!--        <button-->
<!--            type="button"-->
<!--            class="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"-->
<!--            @click="removeVideo"-->
<!--        >-->
<!--          ✕ Удалить-->
<!--        </button>-->
<!--      </div>-->
<!--    </div>-->
  </BaseForm>
</template>