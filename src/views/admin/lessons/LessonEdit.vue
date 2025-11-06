<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useLessonStore, useLessonStoreWithGetters } from '../../../store/admin/lesson/lesson.store.ts';
import { useErrorHandler } from '../../../composables/useErrorHandler';
import api from '../../../api';

import BaseForm from '../../../components/ui/BaseForm.vue';
import BaseInput from '../../../components/ui/BaseInput.vue';
import BaseToggle from '../../../components/ui/BaseToggle.vue';
import FormErrors from '../../../components/ui/FormErrors.vue';
import BaseTextAreaWithEditor from "../../../components/ui/BaseTextAreaWithEditor.vue";

const route = useRoute();
const router = useRouter();
const lessonId = Number(route.params.id);

// Используем store с геттерами
const { currentLesson } = useLessonStoreWithGetters();
const { error, setError } = useErrorHandler();
const loading = ref(false);

// реактивная модель формы
const formModel = reactive({
  name: '',
  content: '',
  duration: '',
  status: 1,
  free_pay: 1,
  course_section_id: null as number | null,
});

// при изменении currentMenu заполняем форму
watch(currentLesson, (val) => {
  if (!val) return;
  Object.assign(formModel, {
    name: val.name,
    content: val.content,
    duration: val.duration,
    status: val.status ?? 1,
    free_pay: val.free_pay ?? 1,
    course_section_id: val.course_section_id ?? null,
  });
});

// сохранение формы
const save = async () => {
  loading.value = true;
  error.value = null;

  try {
    await api.put(`/admin/lessons/${lessonId}`, { ...formModel });
    router.push('/admin/lessons');
  } catch (e: any) {
    setError(e);
  } finally {
    loading.value = false;
  }
};

// загрузка данных меню при монтировании
onMounted(() => {
  if (!isNaN(lessonId)) {
    useLessonStore().fetchItem(lessonId);
  } else {
    error.value = { general: ['Некорректный ID урока'] };
  }
});
</script>

<template>
  <BaseForm label="Редактировать урок" :loading="loading" :onSubmit="save">
    <FormErrors :error="error" />

    <BaseInput v-model="formModel.name" label="Имя" required class="mb-4" />
    <BaseTextAreaWithEditor v-model="formModel.content" label="Контент" required class="w-full mb-4" />
    <BaseInput v-model="formModel.duration" label="Длительность" required class="mb-4" />

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
  </BaseForm>
</template>