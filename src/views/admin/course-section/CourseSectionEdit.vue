<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useCourseSectionStore, useCourseSectionStoreWithGetters } from '../../../store/admin/course_section/course_section.store.ts';
import { useErrorHandler } from '../../../composables/useErrorHandler';
import api from '../../../api';

import BaseForm from '../../../components/ui/BaseForm.vue';
import BaseInput from '../../../components/ui/BaseInput.vue';
import BaseToggle from '../../../components/ui/BaseToggle.vue';
import FormErrors from '../../../components/ui/FormErrors.vue';

const route = useRoute();
const router = useRouter();
const courseSectionId = Number(route.params.id);

// Используем store с геттерами
const { currentCourseSection } = useCourseSectionStoreWithGetters();
const { error, setError } = useErrorHandler();
const loading = ref(false);

// реактивная модель формы
const formModel = reactive({
  name: '',
  url: '',
  status: 1,
  course_id: null as number | null,
});

// при изменении currentMenu заполняем форму
watch(currentCourseSection, (val) => {
  if (!val) return;
  Object.assign(formModel, {
    name: val.name,
    status: val.status ?? 1,
    course_id: val.course_id ?? null,
  });
});

// сохранение формы
const save = async () => {
  loading.value = true;
  error.value = null;

  try {
    await api.put(`/admin/course-section/${courseSectionId}`, { ...formModel });
    router.push('/admin/course-section');
  } catch (e: any) {
    setError(e);
  } finally {
    loading.value = false;
  }
};

// загрузка данных меню при монтировании
onMounted(() => {
  if (!isNaN(courseSectionId)) {
    useCourseSectionStore().fetchItem(courseSectionId);
  } else {
    error.value = { general: ['Некорректный ID раздела курса'] };
  }
});
</script>

<template>
  <BaseForm label="Редактировать раздел курса" :loading="loading" :onSubmit="save">
    <FormErrors :error="error" />

    <BaseInput v-model="formModel.name" label="Имя" required class="mb-4" />

    <BaseToggle
        v-model="formModel.status"
        label="Статус"
        :activeLabel="'Активный'"
        :inactiveLabel="'Неактивный'"
        class="mb-4"
    />
  </BaseForm>
</template>