<!-- src/layouts/DashboardLayout.vue -->
<script setup lang="ts">
import { RouterView, RouterLink, useRoute } from 'vue-router'

const route = useRoute()

const menu = [
  { name: 'Dashboard', path: '/dashboard'},
  { name: 'Users', path: '/users' },
  { name: 'Settings', path: '/settings' },
]
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
              class="flex items-center px-4 py-2 rounded hover:bg-gray-100 text-gray-700"
              :class="{ 'bg-gray-200 font-semibold': route.path === item.path }"
          >
            <component :is="item.icon" class="w-5 h-5 mr-2" />
            {{ item.name }}
          </RouterLink>
        </nav>
      </aside>

      <header>
        <h1>Админ-панель</h1>
      </header>

      <main>
        <RouterView />
      </main>

      <footer>
        &copy; 2025 Админка. Все права защищены.
      </footer>
    </div>
  </template>