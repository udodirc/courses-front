<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../../store/admin/user/user.store';
import { useErrorHandler } from '../../../composables/useErrorHandler';
import { useFetchList } from "../../../composables/useFetchList.ts";
import BaseForm from '../../../components/ui/BaseForm.vue';
import BaseInput from '../../../components/ui/BaseInput.vue';
import BaseSelect from "../../../components/ui/BaseSelect.vue";
import FormErrors from "../../../components/ui/FormErrors.vue";

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
  error.value = null;
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
  <BaseForm label="Создание пользователя" :loading="loading" :onSubmit="save">
    <FormErrors :error="error" />
    <BaseSelect
        v-model="selectedRoleId"
        label="Роль"
        :options="roles.map(role => ({ value: role.id, label: role.name }))"
        required
    />
    <BaseInput v-model="name" label="Имя" required />
    <BaseInput v-model="email" label="Email" type="email" required />
    <BaseInput v-model="password" label="Пароль" type="password" required />
  </BaseForm>
</template>