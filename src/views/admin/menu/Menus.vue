<script setup lang="ts">
import { onMounted } from 'vue';
import { useMenuStore } from '../../../store/admin/menu/menu.store';
import ItemList from '../../../components/ItemList.vue';
import { PAGINATION } from '../../../config/pagination';

const menuStore = useMenuStore();

const columns = [
  { label: 'ID', field: 'id' },
  { label: 'Имя', field: 'name' }
];

onMounted(() => menuStore.fetchList());
</script>

<template>
  <div class="max-w-5xl mx-auto p-6 bg-white rounded shadow">
    <h2 class="text-2xl font-semibold mb-4">Меню</h2>

    <router-link
        to="/admin/menu/create"
        class="inline-block mb-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
    >
      Создать
    </router-link>

    <ItemList
        :itemsSource="() => menuStore.getMenuList"
        :columns="columns"
        :basePath="'/admin/menu'"
        :deleteItem="menuStore.deleteItem"
        :perPage="PAGINATION.menuPerPage"
    />
  </div>
</template>