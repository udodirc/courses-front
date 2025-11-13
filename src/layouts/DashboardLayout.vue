<script setup lang="ts">
import { ref, computed } from "vue";
import { RouterView, RouterLink, useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../store/admin/auth/auth.store";
import "../../public/styles/admin.css";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const expanded = ref<string | null>(null);
const sidebarOpen = ref(true);
const mobileOpen = ref(false);

function logout() {
  auth.logout();
  router.push("/admin/login");
}

function toggleExpand(name: string) {
  expanded.value = expanded.value === name ? null : name;
}

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value;
}

interface MenuItem {
  name: string;
  path?: string;
  icon?: string;
  superadmin?: boolean;
  children?: MenuItem[];
  class?: string;
}

const allMenu: MenuItem[] = [
  { name: "Профиль", path: "/admin/profile", icon: "fas fa-tachometer-alt" },
  { name: "Пользователи", path: "/admin/users", icon: "fas fa-users", superadmin: true },
  {
    name: "Роли",
    icon: "fas fa-user-shield",
    superadmin: true,
    children: [
      { name: "Все роли", path: "/admin/roles" },
      { name: "Назначить роль", path: "/admin/roles/assign-role" },
    ],
  },
  {
    name: "Права доступа",
    icon: "fas fa-key",
    superadmin: true,
    children: [
      { name: "Дать доступ", path: "/admin/permissions/give-permissions" },
      { name: "Создать права", path: "/admin/permissions/create-permissions" },
    ],
  },
  {
    name: "Партнеры",
    icon: "fas fa-user",
    superadmin: true,
    children: [
      { name: "Партнеры", path: "/admin/partners" },
      { name: "Уровни", path: "/admin/levels" },
    ],
  },
  {
    name: "Бухгалтерия",
    icon: "fa fa-money",
    superadmin: true,
    children: [
      { name: "Оплаченные курсы", path: "/admin/courses-payments" },
      { name: "Спонсорские выплаты", path: "/admin/sponsors-payouts" },
      { name: "Заказы", path: "/admin/order" },
    ],
  },
  {
    name: "Курсы",
    icon: "fa fa-book",
    superadmin: true,
    children: [
      { name: "Курсы", path: "/admin/courses" },
      { name: "Разделы курсов", path: "/admin/course-section" },
      { name: "Уроки", path: "/admin/lessons" },
    ],
  },
  { name: "Меню", path: "/admin/menus", icon: "fas fa-bars" },
  { name: "Контент", path: "/admin/content", icon: "fas fa-file-alt" },
  { name: "Статичный контент", path: "/admin/static-content", icon: "fas fa-clone" },
  { name: "Проекты", path: "/admin/projects", icon: "fas fa-folder-open" },
  { name: "Настройки", path: "/admin/settings", icon: "fas fa-cogs" },
];

const menu = computed<MenuItem[]>(() => {
  return allMenu
      .filter((item) => !item.superadmin || auth.user?.is_superadmin)
      .map((item) => {
        if (item.children) {
          const filteredChildren = item.children.filter(
              (_) => !item.superadmin || auth.user?.is_superadmin
          );
          return { ...item, children: filteredChildren };
        }
        return item;
      });
});
</script>

<template>
  <div class="flex min-h-screen bg-gray-100 font-family-karla">

    <!-- SIDEBAR -->
    <aside
        v-if="sidebarOpen"
        class="bg-sidebar w-64 text-white flex flex-col justify-between shadow-xl hidden sm:flex"
    >
      <!-- Верхняя часть -->
      <div>
        <div class="p-6">
          <RouterLink
              to="/admin/content"
              class="text-white text-3xl font-semibold uppercase hover:text-gray-300"
          >
            Админка
          </RouterLink>
        </div>

        <nav class="text-white text-base font-semibold pt-3">
          <template v-for="item in menu" :key="item.name">
            <!-- Обычный пункт -->
            <RouterLink
                v-if="!item.children"
                :to="item.path!"
                class="flex items-center py-4 pl-6 nav-item opacity-75 hover:opacity-100"
                :class="[{ 'active-nav-link': route.path === item.path }, item.class]"
            >
              <i :class="[item.icon, 'mr-3']"></i>
              {{ item.name }}
            </RouterLink>

            <!-- Подменю -->
            <div v-else>
              <div
                  @click="toggleExpand(item.name)"
                  class="flex items-center justify-between py-4 pl-6 pr-4 cursor-pointer hover:opacity-100"
                  :class="{ 'active-nav-link': expanded === item.name }"
              >
                <div class="flex items-center">
                  <i :class="[item.icon, 'mr-3']"></i>
                  {{ item.name }}
                </div>
                <span>{{ expanded === item.name ? "▲" : "▼" }}</span>
              </div>
              <div v-if="expanded === item.name" class="ml-8">
                <RouterLink
                    v-for="sub in item.children"
                    :key="sub.path"
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
      </div>

      <!-- Кнопка выхода -->
      <button
          @click="logout"
          class="w-full text-white flex items-center justify-center py-4 hover:bg-gray-700"
      >
        <i class="fas fa-sign-out-alt mr-3"></i>
        Выйти
      </button>
    </aside>

    <!-- MAIN CONTENT -->
    <div class="flex flex-col flex-1 min-h-screen">
      <!-- HEADER -->
      <header class="bg-white py-2 px-6 flex items-center shadow">
        <button
            @click="toggleSidebar"
            class="text-xl mr-4 p-2 rounded-lg hover:bg-gray-200 focus:outline-none"
        >
          <i :class="sidebarOpen ? 'fas fa-times' : 'fas fa-bars'"></i>
        </button>
        <h1 class="text-xl font-bold">Админка</h1>
      </header>

      <!-- CONTENT -->
      <main class="flex-grow p-6 overflow-y-auto">
        <RouterView />
      </main>

      <!-- FOOTER -->
      <footer class="bg-white text-right p-4 shadow-inner">© Admin</footer>
    </div>
  </div>
</template>

<style scoped>

</style>