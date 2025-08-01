<script setup lang="ts">
import { onMounted, computed} from 'vue';
import { useRouter } from 'vue-router';
import { useRoleStore } from '../../../store/admin/role/role.store';
import { usePagination } from '../../../composables/usePagination';
import { PAGINATION } from '../../../config/pagination';
import type { Role } from '../../../types/Role.ts';

const router = useRouter();
const roleStore = useRoleStore();

const perPage = PAGINATION.userPerPage;
const { currentPage, paginatedData, totalPages, nextPage, prevPage } =
    usePagination<Role>(() => roleStore.getRoleList, perPage);

const loading = computed(() => roleStore.loading);
const error = computed(() => roleStore.error);

function viewRole(id: number) {
  router.push(`/admin/roles/${id}`);
}

function editRole(id: number) {
  router.push(`/admin/roles/${id}/edit`);
}

async function deleteRole(id: number) {
  if (!confirm('Удалить роль?')) return;
  await roleStore.deleteItem(id);
}

onMounted(() => roleStore.fetchList());
</script>

<template>
  <div class="max-w-5xl mx-auto p-6 bg-white rounded shadow">
    <h2 class="text-2xl font-semibold mb-4">Роли</h2>

    <p v-if="loading" class="text-gray-600 mb-2">Загрузка...</p>
    <p v-if="error" class="text-red-600 mb-4">{{ error }}</p>

    <router-link
        to="/admin/roles/create"
        class="inline-block mb-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
    >
      Создать роль
    </router-link>

    <table
        v-if="!loading && paginatedData.length"
        class="w-full border text-sm border-collapse border-gray-200"
    >
      <thead class="bg-gray-100 text-left">
      <tr>
        <th class="px-4 py-2 border-b">ID</th>
        <th class="px-4 py-2 border-b">Имя</th>
        <th class="px-4 py-2 border-b">Создан</th>
        <th class="px-4 py-2 border-b">Действия</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="role in paginatedData" :key="role.id" class="hover:bg-gray-50">
        <td class="px-4 py-2 border-b">{{ role.id }}</td>
        <td class="px-4 py-2 border-b">{{ role.name }}</td>
        <td class="px-4 py-2 border-b">{{ new Date(role.createdAt).toLocaleString() }}</td>
        <td class="px-4 py-2 border-b">
          <button @click="viewRole(role.id)" class="text-blue-500 hover:underline mr-2" title="Посмотреть">👁️</button>
          <button @click="editRole(role.id)" class="text-yellow-500 hover:underline mr-2" title="Редактировать">✏️</button>
          <button @click="deleteRole(role.id)" class="text-red-600 hover:underline" title="Удалить">🗑️</button>
        </td>
      </tr>
      </tbody>
    </table>

    <div
        v-if="!loading && totalPages > 1"
        class="flex justify-center items-center gap-6 mt-6"
    >
      <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        ← Назад
      </button>

      <div class="flex items-center space-x-1 text-sm text-gray-700">
        <span>Страница</span>
        <span class="font-semibold text-gray-900">{{ currentPage }}</span>
        <span>из</span>
        <span class="font-semibold text-gray-900">{{ totalPages }}</span>
      </div>

      <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        Вперёд →
      </button>
    </div>

  </div>
</template>