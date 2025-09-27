<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
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

// форма с подтверждением пароля
const formModel = ref({
  name: '',
  email: '',
  password: '',
  passwordConfirmation: '',
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

async function save() {
  if (formModel.value.password !== formModel.value.passwordConfirmation) {
    error.value = { passwordConfirmation: ['Пароли не совпадают'] };
    return;
  }

  const selectedRole = roles.value.find(r => r.name === formModel.value.role);

  try {
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
  } catch (e) {
    console.log('Ошибка сохранения пользователя', e);
  }
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
    <BaseInput
        v-model="formModel.passwordConfirmation"
        label="Повторите пароль"
        type="password"
    />

    <BaseToggle
        v-model="formModel.status"
        label="Статус"
        :activeLabel="'Активный'"
        :inactiveLabel="'Неактивный'"
    />
  </BaseForm>
</template>