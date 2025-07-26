<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../../store/admin/user/user.store';
import { PAGINATION } from '../../../config/pagination';

const router = useRouter();
const userStore = useUserStore();

const currentPage = ref(1);
const perPage = PAGINATION.userPerPage;

const users = computed(() => userStore.getUserList);
const loading = computed(() => userStore.loading);
const error = computed(() => userStore.error);

const totalUsers = computed(() => users.value.length);
const totalPages = computed(() => Math.ceil(totalUsers.value / perPage));

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return users.value.slice(start, start + perPage);
});

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
    await userStore.deleteItem(id);
    // если на текущей странице больше нет данных, вернуться назад
    if (paginatedUsers.value.length === 0 && currentPage.value > 1) {
      currentPage.value--;
    }
  } catch (_) {
    alert(userStore.error);
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

onMounted(() => {
 userStore.fetchList();
});
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
        v-if="!loading && paginatedUsers.length"
        class="w-full border text-sm border-collapse border-gray-200 rounded overflow-hidden"
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
      <tr v-for="user in paginatedUsers" :key="user.id" class="hover:bg-gray-50">
        <td class="px-4 py-2 border-b">{{ user.id }}</td>
        <td class="px-4 py-2 border-b">{{ user.name }}</td>
        <td class="px-4 py-2 border-b">{{ user.email }}</td>
        <td class="px-4 py-2 border-b">{{ user.role?.name ?? '' }}</td>
        <td class="px-4 py-2 border-b">{{ new Date(user.createdAt).toLocaleString() }}</td>
        <td class="px-4 py-2 border-b">
          <button @click="viewUser(user.id)" class="text-blue-500 hover:underline mr-2" title="Посмотреть">👁️</button>
          <button @click="editUser(user.id)" class="text-yellow-500 hover:underline mr-2" title="Редактировать">✏️</button>
          <button @click="deleteUser(user.id)" class="text-red-600 hover:underline" title="Удалить">🗑️</button>
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