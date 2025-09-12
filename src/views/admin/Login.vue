<template>
  <div class="w-screen h-screen flex items-center justify-center bg-gray-100">
    <form @submit.prevent="submit" class="w-full max-w-sm bg-white p-8 rounded-xl shadow-lg space-y-6">
      <h2 class="text-2xl font-semibold text-gray-800 text-center">Вход в админ-панель</h2>

      <!-- Email -->
      <div class="flex flex-col">
        <label class="mb-1 text-gray-700 font-medium">Email</label>
        <input
            v-model="email"
            type="email"
            placeholder="Введите email"
            required
            class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
      </div>

      <!-- Пароль -->
      <div class="flex flex-col">
        <label class="mb-1 text-gray-700 font-medium">Пароль</label>
        <input
            v-model="password"
            type="password"
            placeholder="Введите пароль"
            required
            class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
      </div>

      <!-- Ошибка -->
      <p v-if="error" class="text-red-600 text-sm text-center">{{ error }}</p>

      <!-- Кнопка -->
      <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ loading ? 'Вход...' : 'Войти' }}
      </button>
    </form>
  </div>
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
    router.push('/admin/content');
  } catch {
    error.value = 'Ошибка авторизации. Проверьте email и пароль.';
  } finally {
    loading.value = false;
  }
}
</script>