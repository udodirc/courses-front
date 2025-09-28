<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useRoleStoreWithGetters } from '../../../store/admin/role/role.store';
import BaseShow from '../../../components/BaseShow.vue';

const route = useRoute();
const roleStore = useRoleStoreWithGetters(); // теперь правильно вызывается как функция

const roleId = Number(route.params.id);
const role = roleStore.currentRole;
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
  <BaseShow
      label="Роль"
      :item="role"
      :itemId="roleId"
      :loading="loading"
      :error="error"
      :exclude="['updatedAt']"
  />
</template>