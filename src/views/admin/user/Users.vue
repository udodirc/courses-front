<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../../store/admin/user/user.store';
import { usePagination } from '../../../composables/usePagination';
import { PAGINATION } from '../../../config/pagination';
import type { User } from '../../../types/User.ts';

const router = useRouter();
const userStore = useUserStore();
const perPage = PAGINATION.userPerPage;
const { currentPage, paginatedData, totalPages, nextPage, prevPage } =
    usePagination<User>(() => userStore.getUserList, perPage);

const loading = computed(() => userStore.loading);
const error = computed(() => userStore.error);

function viewUser(id: number) {
  router.push(`/admin/users/${id}`);
}

function editUser(id: number) {
  router.push(`/admin/users/${id}/edit`);
}

async function deleteUser(id: number) {
  if (!confirm('Удалить пользователя?')) return;
  await userStore.deleteItem(id);
}
onMounted(() => userStore.fetchList());
</script>

<template>
  <div class="max-w-5xl mx-auto p-6 bg-white rounded shadow">
    <h2 class="text-2xl font-semibold mb-4">Пользователи</h2>

    <p v-if="loading" class="text-gray-600 mb-2">Загрузка...</p>
    <p v-if="error" class="text-red-600 mb-4">{{ error }}</p>

    <router-link
        to="/admin/users/create"
        class="inline-block mb-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
    >
      Создать пользователя
    </router-link>

    <table
        v-if="!loading && paginatedData.length"
        class="w-full border text-sm border-collapse border-gray-200"
    >
      <thead class="bg-gray-100 text-left">
      <tr>
        <th class="px-4 py-2 border-b">ID</th>
        <th class="px-4 py-2 border-b">Имя</th>
        <th class="px-4 py-2 border-b">Email</th>
        <th class="px-4 py-2 border-b">Роль</th>
        <th class="px-4 py-2 border-b">Создан</th>
        <th class="px-4 py-2 border-b">Действия</th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="user in paginatedData"
          :key="user.id"
          class="hover:bg-gray-50"
      >
        <td class="px-4 py-2 border-b">{{ user.id }}</td>
        <td class="px-4 py-2 border-b">{{ user.name }}</td>
        <td class="px-4 py-2 border-b">{{ user.email }}</td>
        <td class="px-4 py-2 border-b">{{ user.role?.name }}</td>
        <td class="px-4 py-2 border-b">{{ new Date(user.createdAt).toLocaleString() }}</td>
        <td class="px-4 py-2 border-b">
          <button @click="viewUser(user.id)" class="text-blue-500 mr-2">👁️</button>
          <button @click="editUser(user.id)" class="text-yellow-500 mr-2">✏️</button>
          <button @click="deleteUser(user.id)" class="text-red-600">🗑️</button>
        </td>
      </tr>
      </tbody>
    </table>

    <div
        v-if="!loading && totalPages > 1"
        class="flex justify-center gap-6 mt-6"
    >
      <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="btn-pagination"
      >
        ← Назад
      </button>

      <span class="text-gray-700 text-sm">
        Страница <strong>{{ currentPage }}</strong> из <strong>{{ totalPages }}</strong>
      </span>

      <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="btn-pagination"
      >
        Вперёд →
      </button>
    </div>
  </div>
</template>

<style scoped>
.btn-pagination {
  @apply px-4 py-2 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed;
}
</style>