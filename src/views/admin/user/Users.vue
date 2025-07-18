<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../../store/admin/user/user.store';

const router = useRouter();
const userStore = useUserStore();

const users = computed(() => userStore.getUserList);
const loading = computed(() => userStore.loading);
const error = computed(() => userStore.error);

function viewUser(id: number) {
  router.push(`/admin/users/${id}`);
}

function editUser(id: number) {
  router.push(`/admin/users/${id}/edit`);
}

async function deleteUser(id: number) {
  const confirmed = confirm('Удалить пользователя?');
  if (!confirmed) return;

  try {
    await userStore.deleteUser(id);
  } catch (_) {
    alert(userStore.error);
  }
}

onMounted(() => {
  userStore.fetchUserList();
});
</script>

<template>
  <div>
    <h2>Пользователи</h2>

    <p v-if="loading">Загрузка...</p>
    <p v-if="error" class="error">{{ error }}</p>

    <table v-if="!loading && users.length" class="user-table">
      <thead>
      <tr>
        <th>ID</th>
        <th>Имя</th>
        <th>Email</th>
        <th>Создан</th>
        <th>Действия</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="user in users" :key="user.id">
        <td>{{ user.id }}</td>
        <td>{{ user.name }}</td>
        <td>{{ user.email }}</td>
        <td>{{ new Date(user.createdAt).toLocaleString() }}</td>
        <td>
          <button @click="viewUser(user.id)" class="icon-button" title="Посмотреть">👁️</button>
          <button @click="editUser(user.id)" class="icon-button" title="Редактировать">✏️</button>
          <button @click="deleteUser(user.id)" class="icon-button danger" title="Удалить">🗑️</button>
        </td>
      </tr>
      </tbody>
    </table>

    <p v-if="!loading && !users.length">Нет пользователей.</p>
  </div>
</template>

<style scoped>
.user-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
  font-size: 0.95rem;
}

.user-table th,
.user-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.user-table th {
  background-color: #f0f0f0;
  font-weight: bold;
}

.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  margin-right: 6px;
}

.icon-button:hover {
  opacity: 0.7;
}

.icon-button.danger {
  color: #dc2626;
}

.error {
  color: red;
  margin-top: 12px;
}
</style>