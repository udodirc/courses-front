<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoleStore } from '../../../store/admin/role/role.store';
import ItemList from '../../../components/ItemList.vue';
import { PAGINATION } from '../../../config/pagination';

const roleStore = useRoleStore();

const columns = [
  { label: 'ID', field: 'id' },
  { label: 'Имя', field: 'name' },
];

onMounted(() => roleStore.fetchList());
</script>

<template>
  <div class="max-w-5xl mx-auto p-6 bg-white rounded shadow">
    <h2 class="text-2xl font-semibold mb-4">Роли</h2>

    <router-link
        to="/admin/users/create"
        class="inline-block mb-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
    >
      Создать
    </router-link>

    <ItemList
        :itemsSource="() => roleStore.getRoleList"
        :columns="columns"
        :basePath="'/admin/roles'"
        :deleteItem="roleStore.deleteItem"
        :perPage="PAGINATION.userPerPage"
    />
  </div>
</template>