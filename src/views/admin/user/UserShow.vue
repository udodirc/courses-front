<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '../../../store/admin/user/user.store';
import BaseShow from '../../../components/BaseShow.vue';

const route = useRoute();
const userStore = useUserStore();

const userId = Number(route.params.id);
const user = computed(() => userStore.currentUser);
const loading = computed(() => userStore.loading);
const error = computed(() => userStore.error);

onMounted(async () => {
  if (!isNaN(userId)) {
    await userStore.fetchItem(userId);
  } else {
    userStore.error = 'Некорректный ID пользователя';
  }
});
</script>

<template>
  <div class="max-w-3xl mx-auto p-6 bg-white rounded shadow">
    <h2 class="text-xl font-semibold mb-4">Пользователь #{{ userId }}</h2>

    <p v-if="loading" class="text-gray-600">Загрузка...</p>
    <p v-else-if="error" class="text-red-600">{{ error }}</p>

    <BaseShow v-else :item="user" :exclude="['updatedAt']"/>
  </div>
</template>