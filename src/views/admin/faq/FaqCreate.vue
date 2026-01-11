<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useEntitySave } from '../../../composables/useEntitySave';
import BaseForm from '../../../components/ui/BaseForm.vue';
import BaseTextArea from '../../../components/ui/BaseTextArea.vue';
import FormErrors from '../../../components/ui/FormErrors.vue';
import BaseInput from '../../../components/ui/BaseInput.vue';

const router = useRouter();

// модель формы
const formModel = ref({
  question: '',
  answer: '',
});

// универсальное сохранение
const { saveEntity, loading, error } = useEntitySave<typeof formModel.value>();

// сохранение
async function save() {
  try {
    const payload = {
      question: formModel.value.question,
      answer: formModel.value.answer,
    };

    await saveEntity('/admin/faq', payload);
    router.push('/admin/faq');
  } catch (e) {
    console.error('Ошибка при сохранении F.A.Q:', e);
  }
}
</script>

<template>
  <BaseForm label="Создание F.A.Q" :loading="loading" :onSubmit="save">
    <FormErrors :error="error" />

    <BaseInput v-model="formModel.question" label="Вопрос" required />
    <BaseTextArea v-model="formModel.answer" label="Ответ" required />
  </BaseForm>
</template>