<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '../../../store/admin/user/user.store';

const route = useRoute();
const userStore = useUserStore();

const userId = Number(route.params.id);
const user = computed(() => userStore.currentUser);
const loading = computed(() => userStore.loading);
const error = computed(() => userStore.error);

onMounted(async () => {
  if (!isNaN(userId)) {
    await userStore.fetchItem(userId);
  } else {
    userStore.error = 'Некорректный ID пользователя';
  }
});
</script>

<template>
  <div class="max-w-3xl mx-auto p-6 bg-white rounded shadow">
    <h2 class="text-xl font-semibold mb-4">Пользователь #{{ userId }}</h2>

    <p v-if="loading" class="text-gray-600">Загрузка...</p>
    <p v-else-if="error" class="text-red-600">{{ error }}</p>

    <div
        v-else-if="user"
        class="border border-gray-200 p-4 rounded bg-gray-50 space-y-2"
    >
      <p><strong>ID:</strong> {{ user.id }}</p>
      <p><strong>Имя:</strong> {{ user.name }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Создан:</strong> {{ new Date(user.createdAt).toLocaleString() }}</p>
    </div>

    <p v-else class="text-gray-500">Пользователь не найден.</p>
  </div>
</template>