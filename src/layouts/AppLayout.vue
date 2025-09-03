<template>
  <component :is="currentLayout">
    <router-view />
  </component>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// Определяем асинхронные компоненты макетов
const AdminLayout = defineAsyncComponent(() => import('./DashboardLayout.vue'));
const FrontendLayout = defineAsyncComponent(() => import('./FrontendLayout.vue'));

// Вычисляемое свойство для выбора макета
const currentLayout = computed(() => {
  const layout = route.meta.layout;
  if (layout === 'admin') {
    return AdminLayout;
  } else if (layout === 'front') {
    return FrontendLayout;
  } else {
    return FrontendLayout;
  }
});
</script>