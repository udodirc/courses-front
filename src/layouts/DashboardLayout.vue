<!-- src/layouts/DashboardLayout.vue -->
<script setup lang="ts">
import { RouterView, RouterLink, useRoute } from 'vue-router'
import { HomeIcon, UsersIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline'

const route = useRoute()

const menu = [
  { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
  { name: 'Users', path: '/users', icon: UsersIcon },
  { name: 'Settings', path: '/settings', icon: Cog6ToothIcon },
]
</script>

<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-md hidden md:block">
      <div class="p-4 text-xl font-bold border-b">MyAdmin</div>
      <nav class="p-4 space-y-2">
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

    <!-- Main content -->
    <div class="flex-1 flex flex-col">
      <!-- Header -->
      <header class="bg-white shadow-md px-6 py-4 flex items-center justify-between">
        <h1 class="text-2xl font-semibold text-gray-800 capitalize">{{ route.name }}</h1>
        <div class="flex items-center space-x-4">
          <span class="text-gray-600">admin@example.com</span>
          <button class="flex items-center gap-1 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">
            <ArrowRightOnRectangleIcon class="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-6 flex-1 overflow-y-auto">
        <RouterView />
      </main>
    </div>
  </div>
</template>