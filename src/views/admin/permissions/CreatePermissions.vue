<script setup lang="ts">
import { useRouter } from 'vue-router';

import {ref} from "vue";
import api from '../../../api';

const error = ref<Record<string, string[]> | string>('');
const loading = ref(false);
const router = useRouter();

async function save() {
  loading.value = true;
  error.value = '';

  try {
    await api.post('/admin/permissions', {
    });

    router.push('/admin/roles');
  } catch (e: any) {
    const errors = e?.response?.data?.errors;
    if (errors && typeof errors === 'object') {
      error.value = errors;
    } else {
      error.value = { general: ['Ошибка при сохранении'] };
    }
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="max-w-xl mx-auto p-6 bg-white rounded shadow">
    <h2 class="text-2xl font-semibold mb-6">Создать права</h2>

    <!-- Ошибки -->
    <div v-if="error && typeof error === 'object'" class="mb-4 text-red-600 text-sm space-y-1">
      <div v-for="(messages, field) in error" :key="field">
        {{ Array.isArray(messages) ? messages[0] : messages }}
      </div>
    </div>

    <form @submit.prevent="save" class="space-y-4">
      <!-- Кнопка -->
      <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50"
      >
        {{ loading ? 'Сохранение...' : 'Сохранить' }}
      </button>
    </form>
  </div>
</template>

<style scoped>

</style>