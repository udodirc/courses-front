<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useMenuStore } from '../../../store/admin/menu/menu.store';
import BaseShow from '../../../components/BaseShow.vue';

const route = useRoute();
const menuStore = useMenuStore();

const menuId = Number(route.params.id);
const menu = computed(() => menuStore.currentMenu);
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
  <BaseShow
      label="Меню"
      :item="menu"
      :itemId="menuId"
      :loading="loading"
      :error="error"
      :exclude="['updatedAt', 'parent_id']"
  />
</template>