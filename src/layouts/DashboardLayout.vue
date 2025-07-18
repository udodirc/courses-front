<script setup lang="ts">
import { RouterView, RouterLink, useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../store/admin/auth/auth.store';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

function logout() {
  auth.logout();
  router.push('/admin/login');
}

const menu = [
  { name: 'Админ панель', path: '/admin/dashboard' },
  { name: 'Пользователи', path: '/admin/users' },
  { name: 'Роли', path: '/admin/roles' },
  { name: 'Настройки', path: '/admin/settings' },
];
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 class="text-xl font-semibold">Админ-панель</h1>
      <button @click="logout" class="bg-red-600 text-white shadow mb-4 px-6 py-4 flex justify-between items-center rounded">Выйти</button>
    </header>

    <!-- Body -->
    <div class="flex flex-1">
      <!-- Sidebar -->
      <aside class="w-64 bg-black text-white p-4 border-r text-sm">
        <h2 class="font-bold mb-4">Меню</h2>
        <nav class="space-y-2">
          <RouterLink
              v-for="item in menu"
              :key="item.path"
              :to="item.path"
              class="block px-3 py-2 rounded hover:bg-gray-800 transition"
              :class="{ 'bg-gray-800 font-semibold': route.path === item.path }"
          >
            {{ item.name }}
          </RouterLink>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-6 bg-white">
        <RouterView />
      </main>
    </div>

    <!-- Footer -->
    <footer class="bg-gray-100 text-center text-sm text-gray-500 py-4">
      &copy; Админка.
    </footer>
  </div>
</template>