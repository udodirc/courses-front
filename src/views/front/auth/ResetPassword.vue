<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../../../api' // твой axios-инстанс

const route = useRoute()
const router = useRouter()

// поля формы
const password = ref('')
const passwordConfirmation = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const success = ref(false)

// токен из query-параметра (или из path, если так настроен backend)
const token = route.query.token as string || ''

const submit = async () => {
  error.value = null

  if (!password.value || password.value.length < 8) {
    error.value = 'Пароль должен содержать минимум 8 символов'
    return
  }

  if (password.value !== passwordConfirmation.value) {
    error.value = 'Пароли не совпадают'
    return
  }

  if (!token) {
    error.value = 'Отсутствует токен сброса пароля'
    return
  }

  loading.value = true
  try {
    await api.post('/password/reset', {
      token: token,
      password: password.value,
      password_confirmation: passwordConfirmation.value
    })

    success.value = true

    // можно через 2 секунды перенаправить на логин
    setTimeout(() => router.push('/login'), 2000)
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Ошибка при сбросе пароля'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded-2xl">
    <h1 class="text-2xl font-bold mb-6 text-center">Сброс пароля</h1>

    <div v-if="success" class="text-green-600 text-center">
      Пароль успешно изменён! <br />
      Сейчас вы будете перенаправлены на страницу входа.
    </div>

    <form v-else @submit.prevent="submit" class="space-y-4">
      <div>
        <label class="block mb-1 font-medium">Новый пароль</label>
        <input
            type="password"
            v-model="password"
            class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Введите новый пароль"
        />
      </div>

      <div>
        <label class="block mb-1 font-medium">Повторите пароль</label>
        <input
            type="password"
            v-model="passwordConfirmation"
            class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Повторите пароль"
        />
      </div>

      <p v-if="error" class="text-red-600 text-sm text-center">{{ error }}</p>

      <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {{ loading ? 'Отправка...' : 'Сбросить пароль' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
body {
  background: #f9fafb;
}
</style>