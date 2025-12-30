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
  name: '',
  content: '',
});

// универсальное сохранение
const { saveEntity, loading, error } = useEntitySave<typeof formModel.value>();

// сохранение
async function save() {
  try {
    const payload = {
      name: formModel.value.name,
      content: formModel.value.content,
    };

    await saveEntity('/admin/static-content', payload);
    router.push('/admin/static-content');
  } catch (e) {
    console.error('Ошибка при сохранении контента:', e);
  }
}
</script>

<template>
  <BaseForm label="Создание контента" :loading="loading" :onSubmit="save">
    <FormErrors :error="error" />

    <BaseInput v-model="formModel.name" label="Имя" required />
    <BaseTextArea v-model="formModel.content" label="Контент" required />
  </BaseForm>
</template>