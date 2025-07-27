<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useRoleStore } from '../../../store/admin/role/role.store';

const route = useRoute();
const roleId = Number(route.params.id);

const roleStore = useRoleStore();

const role = computed(() => roleStore.role);
const loading = computed(() => roleStore.loading);
const error = computed(() => roleStore.error);

onMounted(() => {
  roleStore.fetchRole(roleId);
});
</script>

<template>
  <div>
    <h2>Роль #{{ roleId }}</h2>

    <p v-if="loading">Загрузка...</p>
    <p v-if="error" class="error">{{ error }}</p>

    <div v-if="role && !loading" class="user-details">
      <p><strong>ID:</strong> {{ role.id }}</p>
      <p><strong>Имя:</strong> {{ role.name }}</p>
      <p><strong>Создан:</strong> {{ new Date(role.createdAt).toLocaleString() }}</p>
    </div>

    <p v-if="!role && !loading && !error">Роль не найден.</p>
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