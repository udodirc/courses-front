<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useMenuStore } from '../../../store/admin/menu/menu.store';
import BaseShow from '../../../components/BaseShow.vue';

const route = useRoute();
const menuStore = useMenuStore();

const menuId = Number(route.params.id);
const role = computed(() => menuStore.currentMenu);
const loading = computed(() => menuStore.loading);
const error = computed(() => menuStore.error);

onMounted(async () => {
  if (!isNaN(menuId)) {
    await menuStore.fetchItem(menuId);
  } else {
    menuStore.error = 'Некорректный ID меню';
  }
});
</script>

<template>
  <div class="max-w-3xl mx-auto p-6 bg-white rounded shadow">
    <h2 class="text-xl font-semibold mb-4">Меню #{{ menuId }}</h2>

    <p v-if="loading" class="text-gray-600">Загрузка...</p>
    <p v-else-if="error" class="text-red-600">{{ error }}</p>

    <!-- ✅ Используем переиспользуемый компонент -->
    <BaseShow v-else :item="role" :exclude="['updatedAt']" />
  </div>
</template>