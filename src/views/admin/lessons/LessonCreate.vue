<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useEntitySave } from '../../../composables/useEntitySave';
import { useFetchList } from '../../../composables/useFetchList.ts';
import BaseForm from '../../../components/ui/BaseForm.vue';
import BaseInput from '../../../components/ui/BaseInput.vue';
import FormErrors from '../../../components/ui/FormErrors.vue';
import BaseSelect from '../../../components/ui/BaseSelect.vue';
import BaseTextAreaWithEditor from '../../../components/ui/BaseTextAreaWithEditor.vue';
import BaseToggle from '../../../components/ui/BaseToggle.vue';

const router = useRouter();

interface FormModel {
  course_id: number | null;
  course_section_id: number | null;
  name: string;
  content: string;
  duration: number;
  free_pay: boolean;
}

const formModel = ref<FormModel>({
  course_id: null,
  course_section_id: null,
  name: '',
  content: '',
  duration: 0,
  free_pay: 1,
});

const { items: courses, fetchItems: fetchCourses } = useFetchList<{ id: number; name: string }>('/admin/course');
const { items: sections, fetchItems: fetchSections } = useFetchList<{ id: number; name: string }>('/admin/course-section');

const { saveEntity, loading, error } = useEntitySave<FormModel>();

onMounted(() => fetchCourses());

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
    const minutes = Math.floor(totalSeconds / 60)
        .toString()
        .padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  },
  set: (value: string) => {
    const [m, s] = value.split(':').map(v => parseInt(v || '0', 10));
    formModel.value.duration = (m || 0) * 60 + (s || 0);
  },
});

async function save() {
  try {
    await saveEntity('/admin/lessons', formModel.value);
    router.push('/admin/lessons');
  } catch (e) {
    console.error('Ошибка при сохранении урока:', e);
  }
}
</script>

<template>
  <BaseForm label="Создание урока" :loading="loading" :onSubmit="save">
    <FormErrors :error="error" />

    <BaseSelect
        v-model="formModel.course_id"
        label="Курс"
        :options="courses.map(c => ({ value: c.id, label: c.name }))"
    />

    <BaseSelect
        v-model="formModel.course_section_id"
        label="Раздел курса"
        :options="sections.map(s => ({ value: s.id, label: s.name }))"
        :disabled="!formModel.course_id"
    />

    <BaseInput v-model="formModel.name" label="Имя" required class="mb-4" />
    <BaseTextAreaWithEditor v-model="formModel.content" label="Контент" required class="w-full mb-4" />

    <!-- 🔥 Duration отображается как ММ:СС -->
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
  </BaseForm>
</template>