<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRoleStore } from '../../../store/admin/role/role.store';
import { useErrorHandler } from '../../../composables/useErrorHandler';
import { storeToRefs } from 'pinia';
import api from '../../../api';

import BaseInput from '../../../components/ui/BaseInput.vue';
import BaseForm from '../../../components/ui/BaseForm.vue';
import FormErrors from '../../../components/ui/FormErrors.vue';

const route = useRoute();
const router = useRouter();
const roleId = Number(route.params.id);

const name = ref('');
const loading = ref(false);
const { error, setError } = useErrorHandler();

const roleStore = useRoleStore();
const { currentRole } = storeToRefs(roleStore);

watch(currentRole, (val) => {
  if (val) {
    name.value = val.name;
  }
});

async function save() {
  loading.value = true;
  error.value = null;

  try {
    await api.put(`/admin/roles/${roleId}`, {
      name: name.value,
    });
    router.push('/admin/roles');
  } catch (e: any) {
    setError(e);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  roleStore.fetchItem(roleId);
});
</script>

<template>
  <BaseForm label="Редактировать роль" :loading="loading" :onSubmit="save">
    <FormErrors :error="error" />
    <BaseInput v-model="name" label="Имя" required />
  </BaseForm>
</template>