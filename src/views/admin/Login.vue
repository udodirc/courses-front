<template>
  <form @submit.prevent="submit">
    <input v-model="login" placeholder="Login" required />
    <input v-model="password" type="password" placeholder="Password" required />
    <button type="submit" :disabled="loading">Войти</button>
    <p v-if="error">{{ error }}</p>
  </form>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useAuthStore } from '../../store/admin/auth/auth.store.ts';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

const login = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

async function submit() {
  loading.value = true;
  error.value = '';
  try {
    await auth.login(login.value, password.value);
    router.push('/dashboard'); // или другая защищённая страница
  } catch (e) {
    error.value = 'Ошибка авторизации';
  } finally {
    loading.value = false;
  }
}
</script>