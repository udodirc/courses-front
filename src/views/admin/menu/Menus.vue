<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useMenuStore } from '../../../store/admin/menu/menu.store';
import { usePagination } from '../../../composables/usePagination';
import { PAGINATION } from '../../../config/pagination';
import type { Menu } from '../../../types/Menu.ts';

const router = useRouter();
const menuStore = useMenuStore();
const perPage = PAGINATION.userPerPage;
const { currentPage, paginatedData, totalPages, nextPage, prevPage } =
    usePagination<Menu>(() => menuStore.getMenuList, perPage);

const loading = computed(() => menuStore.loading);
const error = computed(() => menuStore.error);

function viewMenu(id: number) {
  router.push(`/admin/users/${id}`);
}

function editMenu(id: number) {
  router.push(`/admin/users/${id}/edit`);
}

async function deleteMenu(id: number) {
  if (!confirm('Удалить меню?')) return;
  await menuStore.deleteItem(id);
}
onMounted(() => menuStore.fetchList());
</script>

<template>
  <div class="max-w-5xl mx-auto p-6 bg-white rounded shadow">
    <h2 class="text-2xl font-semibold mb-4">Меню</h2>

    <p v-if="loading" class="text-gray-600 mb-2">Загрузка...</p>
    <p v-if="error" class="text-red-600 mb-4">{{ error }}</p>

    <router-link
        to="/admin/menu/create"
        class="inline-block mb-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
    >
      Создать меню
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
      <tr
          v-for="menu in paginatedData"
          :key="menu.id"
          class="hover:bg-gray-50"
      >
        <td class="px-4 py-2 border-b">{{ menu.id }}</td>
        <td class="px-4 py-2 border-b">{{ menu.name }}</td>
        <td class="px-4 py-2 border-b">{{ new Date(menu.createdAt).toLocaleString() }}</td>
        <td class="px-4 py-2 border-b">
          <button @click="viewMenu(menu.id)" class="text-blue-500 mr-2">👁️</button>
          <button @click="editMenu(menu.id)" class="text-yellow-500 mr-2">✏️</button>
          <button @click="deleteMenu(menu.id)" class="text-red-600">🗑️</button>
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
</style>