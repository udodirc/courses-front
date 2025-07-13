<script setup lang="ts">
import { RouterView, RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../store/admin/auth/auth.store';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

function logout() {
  auth.logout();
  router.push('/admin/login');
}

const menu = [
  { name: 'Админ панель', path: '/admin/dashboard'},
  { name: 'Пользователи', path: '/admin/users' },
  { name: 'Настройки', path: '/admin/settings' },
];
</script>

<template>
  <div class="layout">
    <aside>
      <h2>Меню</h2>
      <nav>
        <RouterLink
            v-for="item in menu"
            :key="item.path"
            :to="item.path"
            :class="{ 'bg-gray-200 font-semibold': route.path === item.path }"
        >
          {{ item.name }}
        </RouterLink>
      </nav>
    </aside>

    <header class="header">
      <h1>Админ-панель</h1>
      <button @click="logout" class="logout-button">Выйти</button>
    </header>

    <main>
      <RouterView />
    </main>

    <footer>
      &copy; 2025 Админка. Все права защищены.
    </footer>
  </div>
</template>