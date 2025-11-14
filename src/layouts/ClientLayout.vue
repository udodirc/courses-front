<script setup lang="ts">
import { ref, computed } from "vue";
import { RouterView, RouterLink, useRoute, useRouter } from "vue-router";
import { usePartnerStore } from '../store/client/partner/partner.store.ts';
import '../../public/styles/admin.css';

const route = useRoute();
const router = useRouter();
const partner = usePartnerStore();

// Состояния для управления UI
const expanded = ref<string | null>(null);
const sidebarOpen = ref(true); // НОВОЕ: Состояние для переключения сайдбара на десктопе
const mobileOpen = ref(false); // Состояние для мобильного меню

// Логика
function logout() {
  partner.logout();
  router.push("/");
}

function toggleExpand(name: string) {
  expanded.value = expanded.value === name ? null : name;
}

// НОВОЕ: Функция для переключения сайдбара
function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value;
}

// Типизация меню
interface MenuItem {
  name: string;
  path?: string;
  icon?: string;
  children?: MenuItem[];
}

// Полное меню
const allMenu: MenuItem[] = [
  { name: "Профиль", path: "/partner/profile", icon: "fas fa-tachometer-alt" },
  {
    name: "Партнерская программа",
    icon: "fas fa-user",
    children: [
      { name: "Партнеры", path: "/partner/structure" },
      { name: "Лично приглашеные", path: "/partner/invited-partners" },
      { name: "Статистика", path: "/partner/stats" },
      { name: "Запросы на вывод", path: "/partner/withdrawals" },
    ],
  },
  {
    name: "Курсы",
    icon: "fas fa-user",
    children: [
      { name: "Все курсы", path: "/partner/courses" },
      { name: "Мои курсы", path: "/partner/my-courses" },
      { name: "Заказы", path: "/partner/orders" },
    ],
  },
];

// Фильтруем меню (оставлено как есть, без фильтрации по ролям)
const menu = computed<MenuItem[]>(() => {
  return allMenu
      .map(item => {
        if (item.children) {
          return { ...item };
        }
        return item;
      });
});
</script>

<template>
  <div class="bg-gray-100 font-family-karla flex min-h-screen">

    <aside
        v-if="sidebarOpen"
        class="relative bg-sidebar h-screen w-64 shadow-xl transition-all duration-300 transform -translate-x-0 hidden sm:block"
    >
      <div class="p-6">
        <RouterLink
            to="/partner/profile"
            class="text-white text-3xl font-semibold uppercase hover:text-gray-300"
        >
          Личный кабинет
        </RouterLink>
      </div>

      <nav class="text-white text-base font-semibold pt-3">
        <template v-for="item in menu" :key="item.name">
          <RouterLink
              v-if="!item.children"
              :key="item.name + '-link'"
              :to="item.path!"
              class="flex items-center py-4 pl-6 nav-item opacity-75 hover:opacity-100"
              :class="{ 'active-nav-link': route.path === item.path }"
          >
            <i :class="[item.icon, 'mr-3']"></i>
            {{ item.name }}
          </RouterLink>

          <div v-else :key="item.name + '-submenu'">
            <div
                @click="toggleExpand(item.name)"
                class="flex items-center justify-between py-4 pl-6 pr-4 cursor-pointer hover:opacity-100"
                :class="{ 'active-nav-link': expanded === item.name }"
            >
              <div class="flex items-center">
                <i :class="[item.icon, 'mr-3']"></i>
                {{ item.name }}
              </div>
              <span>{{ expanded === item.name ? '▲' : '▼' }}</span>
            </div>
            <div v-if="expanded === item.name" class="ml-6">
              <RouterLink
                  v-for="sub in item.children"
                  :key="sub.path + '-sub'"
                  :to="sub.path!"
                  class="block py-2 pl-3 text-sm opacity-75 hover:opacity-100"
                  :class="{ 'active-nav-link': route.path === sub.path }"
              >
                {{ sub.name }}
              </RouterLink>
            </div>
          </div>
        </template>
      </nav>

      <button
          @click="logout"
          class="absolute w-full bottom-0 upgrade-btn text-white flex items-center justify-center py-4"
      >
        <i class="fas fa-sign-out-alt mr-3"></i>
        Выйти
      </button>
    </aside>

    <div class="relative w-full flex flex-col h-screen overflow-y-hidden">

      <header class="w-full items-center bg-white py-2 px-6 flex sm:flex">

        <button
            @click="toggleSidebar"
            class="text-xl mr-4 p-2 rounded-lg hover:bg-gray-200 focus:outline-none hidden sm:block"
        >
          <i :class="sidebarOpen ? 'fas fa-times' : 'fas fa-bars'"></i>
        </button>

        <h1 class="text-xl font-bold">Личный кабинет</h1>
      </header>

      <header class="w-full bg-sidebar py-5 px-6 sm:hidden">
        <div class="flex items-center justify-between">
          <RouterLink
              to="/profile"
              class="text-white text-3xl font-semibold uppercase hover:text-gray-300"
          >
            Личный кабинет
          </RouterLink>
          <button @click="mobileOpen = !mobileOpen" class="text-white text-3xl">
            <i v-if="!mobileOpen" class="fas fa-bars"></i>
            <i v-else class="fas fa-times"></i>
          </button>
        </div>

        <nav v-if="mobileOpen" class="flex flex-col pt-4">
          <template v-for="item in menu" :key="item.name + '-mobile'">
            <RouterLink
                v-if="!item.children"
                :key="item.name + '-link-mobile'"
                :to="item.path!"
                class="flex items-center text-white py-2 pl-4 nav-item"
                :class="{ 'active-nav-link': route.path === item.path }"
            >
              <i :class="[item.icon, 'mr-3']"></i>
              {{ item.name }}
            </RouterLink>

            <div v-else :key="item.name + '-submenu-mobile'" class="pl-4">
              <div
                  @click="toggleExpand(item.name)"
                  class="flex justify-between items-center py-2 cursor-pointer text-white"
              >
                <span>{{ item.name }}</span>
                <span>{{ expanded === item.name ? "▲" : "▼" }}</span>
              </div>
              <div v-if="expanded === item.name" class="ml-4">
                <RouterLink
                    v-for="sub in item.children"
                    :key="sub.path + '-sub-mobile'"
                    :to="sub.path!"
                    class="block text-white py-1 pl-3"
                    :class="{ 'active-nav-link': route.path === sub.path }"
                >
                  {{ sub.name }}
                </RouterLink>
              </div>
            </div>
          </template>
        </nav>
      </header>

      <div class="w-full h-screen overflow-x-hidden border-t flex flex-col">
        <main class="w-full flex-grow p-6">
          <RouterView />
        </main>
        <footer class="w-full bg-white text-right p-4">© Личный кабинет</footer>
      </div>
    </div>
  </div>
</template>