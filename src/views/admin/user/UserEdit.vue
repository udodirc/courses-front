<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useUserStore } from '../../../store/admin/user/user.store';
import { useErrorHandler } from '../../../composables/useErrorHandler';
import { useFetchList } from "../../../composables/useFetchList.ts";
import api from '../../../api';

import BaseInput from '../../../components/ui/BaseInput.vue';
import BaseSelect from '../../../components/ui/BaseSelect.vue';
import BaseForm from '../../../components/ui/BaseForm.vue';
import FormErrors from '../../../components/ui/FormErrors.vue';

const route = useRoute();
const router = useRouter();
const userId = Number(route.params.id);

const name = ref('');
const email = ref('');
const password = ref('');
const selectedRoleId = ref<number | null>(null);
const loading = ref(false);

const { error, setError } = useErrorHandler();
const { items: roles, fetchItems: fetchRoles } = useFetchList<{ id: number; name: string }>('/admin/roles');

const userStore = useUserStore();
const { currentUser } = storeToRefs(userStore);

watch(currentUser, (val) => {
  if (val) {
    name.value = val.name;
    email.value = val.email;
    selectedRoleId.value = val.role?.id ?? null;
  }
});

async function save() {
  loading.value = true;
  error.value = '';

  try {
    const selectedRole = roles.value.find(r => r.id === selectedRoleId.value);
    await api.put(`/admin/users/${userId}`, {
      name: name.value,
      email: email.value,
      password: password.value || undefined,
      role: selectedRole?.name,
    });
    router.push('/admin/users');
  } catch (e: any) {
    setError(e);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchRoles();
  userStore.fetchItem(userId);
});
</script>

<template>
  <div>
    <h2 class="text-2xl mb-4">Редактировать пользователя</h2>
    <FormErrors :error="error" />

    <BaseForm :loading="loading" :onSubmit="save">
      <BaseSelect
          v-model="selectedRoleId"
          label="Роль"
          :options="roles.map(role => ({ value: role.id, label: role.name }))"
          required
      />

      <BaseInput v-model="name" label="Имя" required />
      <BaseInput v-model="email" label="Email" type="email" required />
      <BaseInput v-model="password" label="Пароль" type="password" />
    </BaseForm>
  </div>
</template>