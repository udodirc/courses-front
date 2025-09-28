<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useMenuStoreWithGetters } from '../../../store/admin/menu/menu.store';
import BaseShow from '../../../components/BaseShow.vue';

const route = useRoute();
const menuStore = useMenuStoreWithGetters();

const menuId = Number(route.params.id);
const menu = menuStore.currentMenu;
const loading = menuStore.loading;
const error = menuStore.error;

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
      :exclude="['updatedAt', 'parent_id', 'order']"
  />
</template>