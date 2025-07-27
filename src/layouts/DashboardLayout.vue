<script setup lang="ts">
import { ref } from 'vue';
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
  {
    name: 'Роли',
    children: [
      { name: 'Все роли', path: '/admin/roles' },
      { name: 'Назначить роль', path: '/admin/roles/assign-role' }
    ],
  },
  {
    name: 'Права доступа',
    children: [
      { name: 'Дать доступ', path: '/admin/permissions/give-permissions' },
      { name: 'Создать права', path: '/admin/permissions/create-permissions' },
    ],
  },
  { name: 'Настройки', path: '/admin/settings' },
];

const expanded = ref<string | null>(null);

function toggleExpand(name: string) {
  expanded.value = expanded.value === name ? null : name;
}
</script>

<template>
  <div class="layout">
    <!-- Sidebar -->
    <aside>
      <h2 class="font-bold text-lg mb-4">Меню</h2>
      <nav>
        <div v-for="item in menu" :key="item.name">
          <!-- Обычные пункты -->
          <RouterLink
              v-if="!item.children"
              :to="item.path"
              :class="{ 'bg-[#3e5871]': route.path === item.path }"
          >
            {{ item.name }}
          </RouterLink>

          <!-- Пункты с подменю -->
          <div v-else>
            <div
                @click="toggleExpand(item.name)"
                class="cursor-pointer flex justify-between items-center px-2 py-2 rounded hover:bg-[#3e5871]"
                :class="{ 'bg-[#3e5871] font-semibold': expanded === item.name }"
            >
              <span>{{ item.name }}</span>
              <span>{{ expanded === item.name ? '▲' : '▼' }}</span>
            </div>
            <div v-if="expanded === item.name" class="ml-2 mt-1">
              <RouterLink
                  v-for="sub in item.children"
                  :key="sub.path"
                  :to="sub.path"
                  class="text-sm pl-3 py-1 block rounded hover:bg-[#3e5871]"
                  :class="{ 'bg-[#3e5871]': route.path === sub.path }"
              >
                {{ sub.name }}
              </RouterLink>
            </div>
          </div>
        </div>
      </nav>
    </aside>

    <!-- Header -->
    <header class="header">
      <h1>Админ-панель</h1>
      <button class="logout-button" @click="logout">Выйти</button>
    </header>

    <!-- Main -->
    <main>
      <RouterView />
    </main>

    <!-- Footer -->
    <footer>
      &copy; Админка
    </footer>
  </div>
</template>
