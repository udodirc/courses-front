<template>
  <form @submit.prevent="submit" class="login-form">
    <h2>Вход в админ-панель</h2>

    <label>
      Email
      <input v-model="email" type="email" placeholder="Введите email" required />
    </label>

    <label>
      Пароль
      <input v-model="password" type="password" placeholder="Введите пароль" required />
    </label>

    <button type="submit" :disabled="loading">
      <span v-if="loading">Вход...</span>
      <span v-else>Войти</span>
    </button>

    <p v-if="error" class="error">{{ error }}</p>
  </form>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useAuthStore } from '../../store/admin/auth/auth.store.ts';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

async function submit() {
  loading.value = true;
  error.value = '';
  try {
    await auth.login(email.value, password.value);
    router.push('/admin/dashboard');
  } catch {
    error.value = 'Ошибка авторизации. Проверьте email и пароль.';
  } finally {
    loading.value = false;
  }
}
</script>