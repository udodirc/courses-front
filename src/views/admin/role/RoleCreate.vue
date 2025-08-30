<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useEntitySave } from '../../../composables/useEntitySave';
import BaseForm from '../../../components/ui/BaseForm.vue';
import BaseInput from '../../../components/ui/BaseInput.vue';
import FormErrors from '../../../components/ui/FormErrors.vue';

const router = useRouter();

// модель формы
const formModel = ref({
  name: '',
});

// универсальное сохранение
const { saveEntity, loading, error } = useEntitySave<typeof formModel.value>();

// сохранение роли
async function save() {
  await saveEntity('/admin/roles', formModel.value);
  router.push('/admin/roles');
}
</script>

<template>
  <BaseForm label="Создание роли" :loading="loading" :onSubmit="save">
    <FormErrors :error="error" />
    <BaseInput v-model="formModel.name" label="Имя" required />
  </BaseForm>
</template>