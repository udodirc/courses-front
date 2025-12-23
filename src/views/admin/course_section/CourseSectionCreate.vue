<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useEntitySave } from '../../../composables/useEntitySave';
import { useCourseStoreWithGetters } from '../../../store/admin/course/course.store.ts';

import BaseForm from '../../../components/ui/BaseForm.vue';
import BaseInput from '../../../components/ui/BaseInput.vue';
import FormErrors from '../../../components/ui/FormErrors.vue';

const router = useRouter();
const route = useRoute();

// ===== id курса из query =====
const courseId = Number(route.query.course_id);

// ===== Типы =====
interface FormModel {
  course_id: number;
  name: string;
}

// ===== Store курса =====
const courseStore = useCourseStoreWithGetters();

// ===== Форма =====
const formModel = ref<FormModel>({
  course_id: courseId,
  name: '',
});

// ===== Загрузка курса =====
onMounted(async () => {
  if (!courseId) return;

  // загрузка одного курса
  await courseStore.fetchItem(courseId);
});

// ===== Сохранение =====
const { saveEntity, loading, error } = useEntitySave<FormModel>();

async function save() {
  try {
    await saveEntity('/admin/course-section', {
      course_id: formModel.value.course_id,
      name: formModel.value.name,
    });

    router.push(`/admin/course/${courseId}`);
  } catch (e) {
    console.error('Ошибка при сохранении раздела', e);
  }
}
</script>

<template>
  <BaseForm
      label="Создание раздела"
      :loading="loading || courseStore.loading"
      :onSubmit="save"
  >
    <FormErrors :error="error || courseStore.error" />

    <!-- Курс (только отображение) -->
    <BaseInput
        :model-value="courseStore.currentCourseName.value"
        label="Курс"
        readonly
    />

    <!-- Имя раздела -->
    <BaseInput
        v-model="formModel.name"
        label="Имя"
    />
  </BaseForm>
</template>