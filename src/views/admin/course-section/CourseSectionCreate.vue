<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useEntitySave } from '../../../composables/useEntitySave';
import BaseForm from '../../../components/ui/BaseForm.vue';
import BaseInput from "../../../components/ui/BaseInput.vue";
import FormErrors from '../../../components/ui/FormErrors.vue';
import {useFetchList} from "../../../composables/useFetchList.ts";
import BaseSelect from "../../../components/ui/BaseSelect.vue";

const router = useRouter();

// Тип формы
interface FormModel {
  course_id: number;
  name: string;
}

const { items: courses, fetchItems: fetchCourses } = useFetchList<{ id: number; name: string }>('/admin/course');

// Инициализация формы
const formModel = ref<FormModel>(<FormModel>{
  course_id: null as number | null,
  name: '',
});

const { saveEntity, loading, error } = useEntitySave<FormModel>();

onMounted(() => {
  fetchCourses();
});

async function save() {
  try {
    await saveEntity('/admin/course-section', {
      course_id: formModel.value.course_id,
      name: formModel.value.name,
    });
    router.push('/admin/course-section');
  } catch (e) {
    console.error('Ошибка при сохранении проектов:', e);
  }
}
</script>

<template>
  <BaseForm label="Создание контента" :loading="loading" :onSubmit="save">
    <FormErrors :error="error" />
    <BaseSelect
        v-model="formModel.course_id"
        label="Родительское меню"
        :options="courses.map(course => ({ value: course.id, label: course.name }))"
    />
    <BaseInput v-model="formModel.name" label="Имя"/>
  </BaseForm>
</template>