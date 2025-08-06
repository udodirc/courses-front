<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoleStore } from '../../../store/admin/role/role.store';
import { usePagination } from '../../../composables/usePagination';
import { useCrudActions } from '../../../composables/useCrudActions';
import CrudList from '../../../components/CrudList.vue';
import { PAGINATION } from '../../../config/pagination';

const roleStore = useRoleStore();

const perPage = PAGINATION.userPerPage;
const { currentPage, paginatedData, totalPages, nextPage, prevPage } =
    usePagination(() => roleStore.getRoleList, perPage);

const columns = [
  { label: 'ID', field: 'id' },
  { label: 'Имя', field: 'name' },
  { label: 'Создан', field: 'createdAt', format: (value: string) => new Date(value).toLocaleString() },
];

const { view, edit, delete: destroy } = useCrudActions('/admin/roles', roleStore.deleteItem);

onMounted(() => roleStore.fetchList());
</script>

<template>
  <div class="max-w-5xl mx-auto p-6 bg-white rounded shadow">
    <h2 class="text-2xl font-semibold mb-4">Роли</h2>
    <router-link
        to="/admin/roles/create"
        class="inline-block mb-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
    >Создать</router-link>

    <CrudList
        :items="paginatedData"
        :columns="columns"
        :currentPage="currentPage"
        :totalPages="totalPages"
        @prev="prevPage"
        @next="nextPage"
        @view="view"
        @edit="edit"
        @delete="destroy"
    />
  </div>
</template>