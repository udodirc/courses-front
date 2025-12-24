<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import {useRoute, useRouter} from 'vue-router';
import { useEntitySave } from '../../../composables/useEntitySave';
import { useFetchList } from '../../../composables/useFetchList.ts';
import BaseForm from '../../../components/ui/BaseForm.vue';
import BaseInput from '../../../components/ui/BaseInput.vue';
import FormErrors from '../../../components/ui/FormErrors.vue';
import BaseTextAreaWithEditor from '../../../components/ui/BaseTextAreaWithEditor.vue';
import BaseToggle from '../../../components/ui/BaseToggle.vue';
// import BaseFileUpload from '../../../components/ui/BaseFileUpload.vue';
import { useCourseStoreWithGetters } from '../../../store/admin/course/course.store.ts';
import { useCourseSectionStoreWithGetters } from '../../../store/admin/course_section/course_section.store.ts';

const router = useRouter();
const route = useRoute();
const courseId = Number(route.query.course_id);
const courseSectionId = Number(route.query.section_id);

const courseStore = useCourseStoreWithGetters();
const currentCourseSection = useCourseSectionStoreWithGetters();

interface FormModel {
  course_id: number | null;
  course_section_id: number | null;
  name: string;
  content: string;
  video_link: string;
  duration: number;
  free_pay: boolean;
  video: File | null; // Добавили видео
}

const formModel = ref<FormModel>({
  course_id: null,
  course_section_id: null,
  name: '',
  content: '',
  video_link: '',
  duration: 0,
  free_pay: false,
  video: null,
});

const { items: sections, fetchItems: fetchSections } = useFetchList<{ id: number; name: string }>('/admin/course_section');

const { saveEntity, loading, error } = useEntitySave<FormModel>();

watch(
    () => formModel.value.course_id,
    async (newCourseId) => {
      if (newCourseId) {
        await fetchSections({ course_id: newCourseId });
        formModel.value.course_section_id = null;
      } else {
        sections.value = [];
      }
    }
);

const formattedDuration = computed({
  get: () => {
    const totalSeconds = formModel.value.duration || 0;
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  },
  set: (value: string) => {
    const [m, s] = value.split(':').map(v => parseInt(v || '0', 10));
    formModel.value.duration = (m || 0) * 60 + (s || 0);
  },
});

// Загрузка видео
// const videoPreview = ref<string>('');
// const videoFileInputRef = ref<HTMLInputElement | null>(null);

// const handleVideoFileChange = (event: Event) => {
//   const target = event.target as HTMLInputElement;
//   if (target.files && target.files[0]) {
//     formModel.value.video = target.files[0];
//     videoPreview.value = URL.createObjectURL(target.files[0]);
//   }
// };
//
// const removeVideo = () => {
//   formModel.value.video = null;
//   if (videoPreview.value.startsWith('blob:')) URL.revokeObjectURL(videoPreview.value);
//   videoPreview.value = '';
//   if (videoFileInputRef.value) videoFileInputRef.value.value = '';
// };

// ===== Загрузка курса =====
onMounted(async () => {
  if ((!courseId) || (!courseSectionId)) return;

  // загрузка одного курса
  await courseStore.fetchItem(courseId);

  await currentCourseSection.fetchItem(courseSectionId);
});

async function save() {
  try {
    const payload = new FormData();
    payload.append('course_id', String(courseId));
    payload.append('course_section_id', String(courseSectionId));
    payload.append('name', formModel.value.name);
    payload.append('content', formModel.value.content);
    payload.append('video_link', formModel.value.video_link);
    payload.append('duration', String(formModel.value.duration));
    payload.append('free_pay', formModel.value.free_pay ? '1' : '0');

    // if (formModel.value.video) {
    //   payload.append('video', formModel.value.video);
    // }

    await saveEntity('/admin/lessons', payload);
    router.push(`/admin/course/${courseId}`);
  } catch (e) {
    console.error('Ошибка при сохранении урока:', e);
  }
}
</script>

<template>
  <BaseForm label="Создание урока" :loading="loading" :onSubmit="save">
    <FormErrors :error="error" />

    <div class="mb-4">
      <label class="block text-sm mb-1">
        Курс
      </label>
      <div class="text-base font-medium">
        {{ courseStore.currentCourseName.value }}
      </div>
    </div>

    <div class="mb-4">
      <label class="block text-sm mb-1">
        Раздел курса
      </label>
      <div class="text-base font-medium">
        {{ currentCourseSection.currentCourseSectionName.value }}
      </div>
    </div>

    <BaseInput v-model="formModel.name" label="Имя" required class="mb-4" />
    <BaseTextAreaWithEditor v-model="formModel.content" label="Контент" required class="w-full mb-4" />
    <BaseInput v-model="formModel.video_link" label="Ссылка на видео" required class="mb-4" />

    <BaseInput
        v-model="formattedDuration"
        label="Длительность (мин:сек)"
        placeholder="Например: 02:15"
        required
        class="mb-4"
    />

    <BaseToggle
        v-model="formModel.free_pay"
        label="Бесплатный просмотр"
        activeLabel="Активный"
        inactiveLabel="Неактивный"
        class="mb-4"
    />

    <!-- Видео -->
<!--    <div class="mb-4">-->
<!--      <label class="block text-sm text-gray-600 mb-1">Загрузить видео урок</label>-->

<!--      <BaseFileUpload-->
<!--          v-model="formModel.video"-->
<!--          label="Выбрать видео"-->
<!--          accept="video/*"-->
<!--          @change="handleVideoFileChange"-->
<!--          ref="videoFileInputRef"-->
<!--      />-->

<!--      <video-->
<!--          v-if="videoPreview"-->
<!--          :src="videoPreview"-->
<!--          controls-->
<!--          class="mt-2 w-full max-h-64"-->
<!--      ></video>-->
<!--      <button-->
<!--          v-if="videoPreview"-->
<!--          type="button"-->
<!--          class="mt-2 text-red-500"-->
<!--          @click="removeVideo"-->
<!--      >-->
<!--        Удалить видео-->
<!--      </button>-->
<!--    </div>-->
  </BaseForm>
</template>