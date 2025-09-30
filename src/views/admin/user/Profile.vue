<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { UserApi } from '../../../api/admin/user/user.api';
import BaseInput from '../../../components/ui/BaseInput.vue';
import BaseForm from '../../../components/ui/BaseForm.vue';
import FormErrors from '../../../components/ui/FormErrors.vue';

const router = useRouter();
const userApi = new UserApi();

// Форма редактирования профиля
const formModel = ref({
  name: '',
  email: '',
  password: '',
  passwordConfirmation: '',
});

const loading = ref(false);
const error = ref<string | Record<string, string[]>>('');

// Получение профиля текущего пользователя
async function fetchProfile() {
  loading.value = true;
  error.value = '';

  try {
    const res = await userApi.profileUser(); // возвращает { data: User }
    formModel.value.name = res.data.name;
    formModel.value.email = res.data.email;
  } catch (e: any) {
    console.error('Ошибка получения профиля', e);
    error.value = e?.response?.data?.message || 'Ошибка получения профиля';
  } finally {
    loading.value = false;
  }
}

// Сохранение профиля
async function save() {
  loading.value = true;
  error.value = '';

  if (formModel.value.password !== formModel.value.passwordConfirmation) {
    error.value = { passwordConfirmation: ['Пароли не совпадают'] };
    loading.value = false;
    return;
  }
  try {
    await userApi.updateProfile(formModel.value);
    router.push('/admin/content');
  } catch (e: any) {
    console.error('Ошибка сохранения профиля', e);
    error.value = e?.response?.data?.message || 'Ошибка сохранения';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchProfile();
});
</script>

<template>
  <BaseForm label="Редактировать профиль" :loading="loading" :onSubmit="save">
    <FormErrors :error="error" />

    <BaseInput v-model="formModel.name" label="Имя" required />
    <BaseInput v-model="formModel.email" label="Email" type="email" required />
    <BaseInput v-model="formModel.password" label="Пароль" type="password" placeholder="Оставьте пустым, чтобы не менять" />
    <BaseInput
        v-model="formModel.passwordConfirmation"
        label="Подтверждение пароля"
        type="password"
    />
  </BaseForm>
</template>