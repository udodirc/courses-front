<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '../../../store/admin/user/user.store.js';
import ItemList from '../../../components/ItemList.vue';

const userStore = useUserStore();

// фильтры
const filterName = ref('');
const filterEmail = ref('');
const filterRole = ref('');

// применить фильтры
const applyFilters = () => {
  userStore.fetchList({
    name: filterName.value,
    email: filterEmail.value,
    role: filterRole.value,
  }, 1);
};

// пагинация
const onNext = () => {
  if (userStore.currentPage < userStore.totalPages) {
    userStore.fetchList({ ...userStore.filters }, userStore.currentPage + 1);
  }
};

const onPrev = () => {
  if (userStore.currentPage > 1) {
    userStore.fetchList({ ...userStore.filters }, userStore.currentPage - 1);
  }
};
console.log(userStore.totalPages);
onMounted(() => {
  applyFilters();
});

// колонки
const columns = [
  { label: 'ID', field: 'id' },
  { label: 'Имя', field: 'name' },
  { label: 'Email', field: 'email' },
  { label: 'Роль', field: 'role.name' },
];
</script>

<template>
  <div class="max-w-5xl mx-auto p-6 bg-white rounded shadow">
    <h2 class="text-2xl font-semibold mb-4">Пользователи</h2>

    <!-- Фильтры -->
    <div class="flex gap-4 mb-4">
      <input v-model="filterName" placeholder="Имя" class="border rounded px-2 py-1" />
      <input v-model="filterEmail" placeholder="Email" class="border rounded px-2 py-1" />
      <input v-model="filterRole" placeholder="Роль" class="border rounded px-2 py-1" />
      <button @click="applyFilters" class="px-4 py-2 bg-blue-500 text-white rounded">Поиск</button>
    </div>

    <router-link
        to="/admin/users/create"
        class="inline-block mb-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
    >
      Создать
    </router-link>

    <ItemList
        :itemsSource="() => userStore.getUserList"
        :columns="columns"
        :basePath="'/admin/users'"
        :deleteItem="userStore.deleteItem"
        :perPage="userStore.perPage"
        :currentPage="userStore.currentPage"
        :totalPages="userStore.totalPages"
        @next="onNext"
        @prev="onPrev"
    />
  </div>
</template>