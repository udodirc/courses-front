<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../../store/admin/user/user.store';
import { useErrorHandler } from '../../../composables/useErrorHandler';
import { useFetchList } from "../../../composables/useFetchList.ts";

import BaseForm from '../../../components/ui/BaseForm.vue';
import BaseInput from '../../../components/ui/BaseInput.vue';
import FormErrors from '../../../components/ui/FormErrors.vue';

const router = useRouter();
const userStore = useUserStore();
const { items: roles, fetchItems: fetchRoles } = useFetchList<{ id: number; name: string }>('/admin/roles');
const { error, setError } = useErrorHandler();

const name = ref('');
const email = ref('');
const password = ref('');
const selectedRoleId = ref<number | null>(null);

const loading = ref(false);

const selectedRoleName = computed(() => {
  const role = roles.value.find(r => r.id === selectedRoleId.value);
  return role?.name || null;
});

async function save() {
  error.value = '';
  loading.value = true;

  try {
    await userStore.createItem({
      name: name.value,
      email: email.value,
      password: password.value,
      role: selectedRoleName.value,
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
});
</script>

<template>
  <div>
    <h2 class="text-2xl mb-4">Создание пользователя</h2>

    <FormErrors :error="error" />

    <BaseForm :loading="loading" :onSubmit="save">
      <label class="block mb-4">
        <span class="block font-medium mb-1">Роль</span>
        <select v-model="selectedRoleId" required class="w-full border rounded px-3 py-2">
          <option disabled value="">Выберите роль</option>
          <option v-for="role in roles" :key="role.id" :value="role.id">
            {{ role.name }}
          </option>
        </select>
      </label>

      <BaseInput v-model="name" label="Имя" required />
      <BaseInput v-model="email" label="Email" type="email" required />
      <BaseInput v-model="password" label="Пароль" type="password" required />
    </BaseForm>
  </div>
</template>

<style scoped>
</style>