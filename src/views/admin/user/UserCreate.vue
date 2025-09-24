<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useFetchList } from '../../../composables/useFetchList';
import { useEntitySave } from '../../../composables/useEntitySave';
import BaseForm from '../../../components/ui/BaseForm.vue';
import BaseInput from '../../../components/ui/BaseInput.vue';
import BaseSelect from '../../../components/ui/BaseSelect.vue';
import FormErrors from '../../../components/ui/FormErrors.vue';

const router = useRouter();
const { items: roles, fetchItems: fetchRoles } = useFetchList<{ id: number; name: string }>('/admin/roles');

// форма
const formModel = ref({
  name: '',
  email: '',
  password: '',
  roleId: null as number | null,
  role: '',
});

const { saveEntity, loading, error } = useEntitySave<typeof formModel.value>();

const selectedRoleName = computed(() => {
  const role = roles.value.find(r => r.id === formModel.value.roleId);
  formModel.value.role = role?.name ?? '';
  return formModel.value.role;
});

async function save() {
  await saveEntity('/admin/users', {
    name: formModel.value.name,
    email: formModel.value.email,
    password: formModel.value.password,
    roleId: formModel.value.roleId,
    role: selectedRoleName.value,
  });
  router.push('/admin/users');
}

// загрузка ролей для селекта
onMounted(() => {
  fetchRoles();
});
</script>

<template>
  <BaseForm label="Создание пользователя" :loading="loading" :onSubmit="save">
    <FormErrors :error="error" />
    <BaseSelect
        v-model="formModel.roleId"
        label="Роль"
        :options="roles.map(role => ({ value: role.id, label: role.name }))"
        required
    />
    <BaseInput v-model="formModel.name" label="Имя" required />
    <BaseInput v-model="formModel.email" label="Email" type="email" required />
    <BaseInput v-model="formModel.password" label="Пароль" type="password" required />
  </BaseForm>
</template>