<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore, useUserStoreWithGetters } from '../../../store/admin/user/user.store';
import { useFetchList } from "../../../composables/useFetchList.ts";
import { useEntitySave } from '../../../composables/useEntitySave';

import BaseInput from '../../../components/ui/BaseInput.vue';
import BaseSelect from '../../../components/ui/BaseSelect.vue';
import BaseForm from '../../../components/ui/BaseForm.vue';
import FormErrors from "../../../components/ui/FormErrors.vue";
import BaseToggle from "../../../components/ui/BaseToggle.vue";

const route = useRoute();
const router = useRouter();
const userId = Number(route.params.id);

const userStore = useUserStore();
const { currentUser } = useUserStoreWithGetters();

// модель формы
const formModel = ref({
  name: '',
  email: '',
  password: '',
  role: null as string | null,
  status: true,
});

// загрузка ролей
const { items: roles, fetchItems: fetchRoles } = useFetchList<{ id: number; name: string }>('/admin/roles');

// универсальное сохранение
const { saveEntity, loading, error } = useEntitySave<typeof formModel.value>();

// заполнение формы при изменении currentUser
watch(currentUser, (val) => {
  if (val) {
    formModel.value.name = val.name;
    formModel.value.email = val.email;
    formModel.value.role = val.role?.name ?? null;
    formModel.value.status = val.status ?? 1;
  }
});

// сохранение
async function save() {
  const selectedRole = roles.value.find(r => r.name === formModel.value.role);

  await saveEntity(
      '/admin/users',
      {
        ...formModel.value,
        role: selectedRole?.name ?? null,
        status: formModel.value.status,
      },
      { id: userId }
  );

  router.push('/admin/users');
}

onMounted(() => {
  fetchRoles();
  userStore.fetchItem(userId);
});
</script>

<template>
  <BaseForm label="Редактировать пользователя" :loading="loading" :onSubmit="save">
    <FormErrors :error="error" />

    <BaseSelect
        v-model="formModel.role"
        label="Роль"
        :options="roles.map(r => ({ value: r.name, label: r.name }))"
        required
    />

    <BaseInput v-model="formModel.name" label="Имя" required />
    <BaseInput v-model="formModel.email" label="Email" type="email" required />
    <BaseInput v-model="formModel.password" label="Пароль" type="password" />

    <BaseToggle
        v-model="formModel.status"
        label="Статус"
        :activeLabel="'Активный'"
        :inactiveLabel="'Неактивный'"
    />
  </BaseForm>
</template>