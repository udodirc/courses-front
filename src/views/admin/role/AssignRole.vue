<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useFetchList } from '../../../composables/useFetchList';
import { useEntitySave } from '../../../composables/useEntitySave';
import BaseForm from '../../../components/ui/BaseForm.vue';
import BaseSelect from '../../../components/ui/BaseSelect.vue';
import FormErrors from '../../../components/ui/FormErrors.vue';

const router = useRouter();

// Загружаем список пользователей и ролей
const { items: users, fetchItems: fetchUsers } = useFetchList<{ id: number; name: string }>('/admin/users');
const { items: roles, fetchItems: fetchRoles } = useFetchList<{ id: number; name: string }>('/admin/roles');

// Модель формы
const formModel = ref({
  userId: null as number | null,
  roleId: null as number | null,
});

// Вычисляем имя роли для отправки на API
const selectedRoleName = computed(() => {
  const role = roles.value.find(r => r.id === formModel.value.roleId);
  return role?.name || null;
});

interface AssignRoleDto {
  id: number | null;
  role: string | null;
}

const { saveEntity, loading, error } = useEntitySave<AssignRoleDto>();

async function save() {
  await saveEntity('/admin/roles/assign', {
    id: formModel.value.userId,
    role: selectedRoleName.value,
  });
  router.push('/admin/roles');
}

// Загрузка данных
onMounted(() => {
  fetchUsers();
  fetchRoles();
});
</script>

<template>
  <BaseForm label="Назначить роль" :loading="loading" :onSubmit="save">
    <FormErrors :error="error" />

    <BaseSelect
        v-model="formModel.userId"
        label="Пользователь"
        :options="users.map(user => ({ value: user.id, label: user.name }))"
        required
    />

    <BaseSelect
        v-model="formModel.roleId"
        label="Роль"
        :options="roles.map(role => ({ value: role.id, label: role.name }))"
        required
    />

  </BaseForm>
</template>