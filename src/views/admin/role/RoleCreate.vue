<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useRoleStore } from '../../../store/admin/role/role.store';
import { useErrorHandler } from '../../../composables/useErrorHandler';

import BaseForm from '../../../components/ui/BaseForm.vue';
import BaseInput from '../../../components/ui/BaseInput.vue';
import FormErrors from '../../../components/ui/FormErrors.vue';

const router = useRouter();
const roleStore = useRoleStore();
const { error, setError } = useErrorHandler();

const name = ref('');
const loading = ref(false);

async function save() {
  error.value = null;
  loading.value = true;

  try {
    await roleStore.createItem({
      name: name.value,
    });
    router.push('/admin/roles');
  } catch (e: any) {
    setError(e);
  } finally {
    loading.value = false;
  }
}
</script>
<template>
  <BaseForm label="Создание роли" :loading="loading" :onSubmit="save">
    <FormErrors :error="error" />
    <BaseInput v-model="name" label="Имя" required />
  </BaseForm>
</template>