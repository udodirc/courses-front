<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useRoleStore } from '../../../store/admin/role/role.store';
import BaseShow from '../../../components/BaseShow.vue';

const route = useRoute();
const roleStore = useRoleStore();

const roleId = Number(route.params.id);
const role = computed(() => roleStore.currentRole);
const loading = computed(() => roleStore.loading);
const error = computed(() => roleStore.error);

onMounted(async () => {
  if (!isNaN(roleId)) {
    await roleStore.fetchItem(roleId);
  } else {
    roleStore.error = 'Некорректный ID роли';
  }
});
</script>

<template>
  <div class="max-w-3xl mx-auto p-6 bg-white rounded shadow">
    <h2 class="text-xl font-semibold mb-4">Роль #{{ roleId }}</h2>

    <p v-if="loading" class="text-gray-600">Загрузка...</p>
    <p v-else-if="error" class="text-red-600">{{ error }}</p>

    <!-- ✅ Используем переиспользуемый компонент -->
    <BaseShow v-else :item="role" :exclude="['updatedAt']" />
  </div>
</template>