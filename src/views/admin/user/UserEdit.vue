<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../../../api';

const route = useRoute();
const router = useRouter();
const userId = Number(route.params.id);

const name = ref('');
const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref<Record<string, string[]> | string>('');
const roles = ref<{ id: number; name: string }[]>([]);
const selectedRoleId = ref<number | null>(null);

const selectedRoleName = computed(() => {
  const role = roles.value.find(r => r.id === selectedRoleId.value);
  return role?.name || null;
});

async function fetchRoles() {
  try {
    const response = await api.get('/admin/roles');
    roles.value = response.data.data;
  } catch (e) {
    console.error('Ошибка загрузки ролей');
  }
}

async function fetchUser() {
  try {
    const response = await api.get(`/admin/users/${userId}`);
    name.value = response.data.data.name;
    email.value = response.data.data.email;
    selectedRoleId.value = response.data.data.role?.id ?? null;
  } catch (e) {
    error.value = { general: ['Не удалось загрузить пользователя'] };
  }
}

async function save() {
  loading.value = true;
  error.value = '';

  try {
    await api.put(`/admin/users/${userId}`, {
      name: name.value,
      email: email.value,
      password: password.value,
      role: selectedRoleName.value,
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
  fetchUser();
});
</script>

<template>
  <div>
    <h2>Редактировать пользователя</h2>

    <!-- Вывод ошибок -->
    <ul v-if="error && typeof error === 'object'" class="text-red-600 mb-4">
      <li v-for="(messages, field) in error" :key="field">
        {{ messages[0] }}
      </li>
    </ul>

    <form @submit.prevent="save">
      <label>
        Роль
        <select v-model="selectedRoleId" required>
          <option disabled value="">Выберите роль</option>
          <option v-for="role in roles" :key="role.id" :value="role.id">
            {{ role.name }}
          </option>
        </select>
      </label>

      <label>
        Имя
        <input v-model="name" required />
      </label>

      <label>
        Email
        <input v-model="email" type="email" required />
      </label>

      <label>
        Пароль
        <input v-model="password" type="password" />
      </label>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Сохраняю...' : 'Сохранить' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
</style>