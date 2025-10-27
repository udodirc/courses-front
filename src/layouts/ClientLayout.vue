<script setup lang="ts">
import { ref, computed } from "vue";
import { RouterView, RouterLink, useRoute, useRouter } from "vue-router";
import { usePartnerStore } from '../store/client/partner.store';
import '../../public/styles/admin.css';

const route = useRoute();
const router = useRouter();
const partner = usePartnerStore();

function logout() {
  partner.logout();
  router.push("/");
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
    ],
  },
];

const expanded = ref<string | null>(null);
const mobileOpen = ref(false);

function toggleExpand(name: string) {
  expanded.value = expanded.value === name ? null : name;
}

// Фильтруем меню для обычных админов
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
  <div class="bg-gray-100 font-family-karla flex">
    <!-- Sidebar -->
    <aside class="relative bg-sidebar h-screen w-64 hidden sm:block shadow-xl">
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
          <!-- Обычный пункт -->
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

          <!-- Пункт с подменю -->
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

      <!-- Logout -->
      <button
          @click="logout"
          class="absolute w-full bottom-0 upgrade-btn text-white flex items-center justify-center py-4"
      >
        <i class="fas fa-sign-out-alt mr-3"></i>
        Выйти
      </button>
    </aside>

    <!-- Content -->
    <div class="relative w-full flex flex-col h-screen overflow-y-hidden">
      <!-- Header -->
      <header class="w-full items-center bg-white py-2 px-6 hidden sm:flex">
        <h1 class="text-xl font-bold">Личный кабинет</h1>
      </header>

      <!-- Mobile Header -->
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

        <!-- Mobile Nav -->
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

      <!-- Main -->
      <div class="w-full h-screen overflow-x-hidden border-t flex flex-col">
        <main class="w-full flex-grow p-6">
          <RouterView />
        </main>
        <footer class="w-full bg-white text-right p-4">© Личный кабинет</footer>
      </div>
    </div>
  </div>
</template>