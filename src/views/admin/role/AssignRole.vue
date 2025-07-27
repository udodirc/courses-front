<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../../api';

const error = ref<Record<string, string[]> | string>('');
const loading = ref(false);
const router = useRouter();

const roles = ref<{ id: number; name: string }[]>([]);
const users = ref<{ id: number; name: string }[]>([]);

// Данные формы
const selectedUserId = ref<number | ''>('');
const selectedRoleId = ref<number | ''>('');

async function fetchRoles() {
  try {
    const response = await api.get('/admin/roles');
    roles.value = response.data.data;
  } catch (e) {
    console.error('Ошибка загрузки ролей');
  }
}

async function fetchUsers() {
  try {
    const response = await api.get('/admin/users');
    users.value = response.data.data;
  } catch (e) {
    console.error('Ошибка загрузки пользователей');
  }
}

async function save() {
  loading.value = true;
  error.value = '';

  try {
    await api.post('/admin/roles/assign', {
      id: selectedUserId.value,
      role: selectedRoleId.value,
    });
    router.push('/admin/users');
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

onMounted(() => {
  fetchRoles();
  fetchUsers();
});
</script>

<template>
  <div class="max-w-xl mx-auto p-6 bg-white rounded shadow">
    <h2 class="text-2xl font-semibold mb-6">Назначение роли пользователю</h2>

    <!-- Ошибки -->
    <div v-if="error && typeof error === 'object'" class="mb-4 text-red-600 text-sm space-y-1">
      <div v-for="(messages, field) in error" :key="field">
        {{ Array.isArray(messages) ? messages[0] : messages }}
      </div>
    </div>

    <form @submit.prevent="save" class="space-y-4">
      <!-- Выбор пользователя -->
      <div>
        <label for="user" class="block font-semibold mb-1">Пользователь</label>
        <select
            id="user"
            v-model="selectedUserId"
            required
            class="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option disabled value="">Выберите пользователя</option>
          <option v-for="user in users" :key="user.id" :value="user.id">
            {{ user.name }}
          </option>
        </select>
      </div>

      <!-- Выбор роли -->
      <div>
        <label for="role" class="block font-semibold mb-1">Роль</label>
        <select
            id="role"
            v-model="selectedRoleId"
            required
            class="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option disabled value="">Выберите роль</option>
          <option v-for="role in roles" :key="role.id" :value="role.name">
            {{ role.name }}
          </option>
        </select>
      </div>

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