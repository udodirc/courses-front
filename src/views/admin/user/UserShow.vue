<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../../../api';

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

const route = useRoute();
const router = useRouter();

const userId = Number(route.params.id);
const user = ref<User | null>(null);
const loading = ref(false);
const error = ref('');

async function fetchUser() {
  loading.value = true;
  try {
    const response = await api.get(`/admin/users/${userId}`);
    user.value = response.data.data;
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Ошибка при загрузке пользователя';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchUser();
});
</script>

<template>
  <div>
    <h2>Пользователь #{{ userId }}</h2>

    <p v-if="loading">Загрузка...</p>
    <p v-if="error" class="error">{{ error }}</p>

    <div v-if="user && !loading" class="user-details">
      <p><strong>ID:</strong> {{ user.id }}</p>
      <p><strong>Имя:</strong> {{ user.name }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Создан:</strong> {{ new Date(user.createdAt).toLocaleString() }}</p>
    </div>

    <p v-if="!user && !loading && !error">Пользователь не найден.</p>
  </div>
</template>

<style scoped>
.user-details {
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 8px;
  background: #f9f9f9;
  margin-top: 16px;
}

.error {
  color: red;
  margin-top: 12px;
}

.back-button {
  margin-top: 16px;
  padding: 6px 12px;
  background-color: #ddd;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}
</style>
