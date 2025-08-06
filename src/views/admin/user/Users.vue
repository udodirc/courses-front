<script setup lang="ts">
import { onMounted } from 'vue';
import { useUserStore } from '../../../store/admin/user/user.store';
import { usePagination } from '../../../composables/usePagination';
import { useCrudActions } from '../../../composables/useCrudActions';
import CrudList from '../../../components/CrudList.vue';
import { PAGINATION } from '../../../config/pagination';

const userStore = useUserStore();

const perPage = PAGINATION.userPerPage;
const { currentPage, paginatedData, totalPages, nextPage, prevPage } =
    usePagination(() => userStore.getUserList, perPage);

const columns = [
  { label: 'ID', field: 'id' },
  { label: 'Имя', field: 'name' },
  { label: 'Email', field: 'email' },
  { label: 'Роль', field: 'role.name' },
];

const { view, edit, delete: destroy } = useCrudActions('/admin/users', userStore.deleteItem);

onMounted(() => userStore.fetchList());
</script>

<template>
  <div class="max-w-5xl mx-auto p-6 bg-white rounded shadow">
    <h2 class="text-2xl font-semibold mb-4">Пользователи</h2>
    <router-link
        to="/admin/users/create"
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