<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '../../../store/admin/user/user.store';

const route = useRoute();
const userId = Number(route.params.id);

const userStore = useUserStore();

const user = computed(() => userStore.user);
const loading = computed(() => userStore.loading);
const error = computed(() => userStore.error);

onMounted(() => {
  userStore.fetchUser(userId);
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
</style>