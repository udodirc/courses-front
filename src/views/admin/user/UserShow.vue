<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import {useUserStoreWithGetters} from '../../../store/admin/user/user.store';
import BaseShow from '../../../components/BaseShow.vue';

const route = useRoute();
const userStore = useUserStoreWithGetters();

const userId = Number(route.params.id);

// вычисляемые свойства
const user = userStore.currentUser;
const loading = userStore.loading;
const error = userStore.error;

// загрузка пользователя
onMounted(async () => {
  if (userId && !isNaN(userId)) {
    await userStore.fetchItem(userId);
  } else {
    userStore.error = 'Некорректный ID пользователя';
  }
});
</script>

<template>
  <BaseShow
      label="Пользователь"
      :item="user"
      :itemId="userId"
      :loading="loading"
      :error="error"
      :exclude="['updatedAt']"
  />
</template>