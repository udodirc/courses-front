<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '../../../store/admin/user/user.store.js';
import ItemList from '../../../components/ItemList.vue';
import { useFetchList } from "../../../composables/useFetchList.ts";
import Filters from "../../../components/Filters.vue";

const userStore = useUserStore();

// роли (подтягиваем для селекта)
const { items: roles, fetchItems: fetchRoles } = useFetchList<{ id: number; name: string }>('/admin/roles');

// фильтры (массив { field, value })
const filters = ref([
  { field: 'name', value: '' },
  { field: 'role', value: '' },
  { field: 'email', value: '' },
  { field: 'created_from', value: '' },
  { field: 'created_to', value: '' },
]);

// схема фильтров для компонента Filters
const schema = [
  { field: 'name', label: 'Имя', type: 'text', col: 'left' },
  { field: 'role', label: 'Роль', type: 'select', col: 'left' },
  { field: 'email', label: 'Email', type: 'email', col: 'middle' },
  { field: 'created_from', label: 'Создано с', type: 'date', col: 'middle' },
  { field: 'created_to', label: 'Создано по', type: 'date', col: 'middle' },
];

// функция превращает массив {field, value}[] в объект { field: value }
function toFilterObject(arr: { field: string; value: string }[]) {
  return arr.reduce<Record<string, string>>((acc, f) => {
    acc[f.field] = f.value;
    return acc;
  }, {});
}

// применить фильтры
const applyFilters = () => {
  userStore.fetchList(toFilterObject(filters.value), 1);
};

// пагинация
const onNext = () => {
  if (userStore.currentPage < userStore.totalPages) {
    userStore.fetchList(toFilterObject(filters.value), userStore.currentPage + 1);
  }
};

const onPrev = () => {
  if (userStore.currentPage > 1) {
    userStore.fetchList(toFilterObject(filters.value), userStore.currentPage - 1);
  }
};

onMounted(() => {
  fetchRoles();
  applyFilters();
});

// колонки для таблицы
const columns = [
  { label: 'ID', field: 'id' },
  { label: 'Имя', field: 'name' },
  { label: 'Email', field: 'email' },
  { label: 'Роль', field: 'role.name' },
];
</script>

<template>
  <div class="max-w-5xl mx-auto p-6 bg-white rounded shadow">
    <h2 class="text-2xl font-semibold mb-4">Пользователи</h2>

    <!-- Фильтры -->
    <Filters
        v-model="filters"
        :schema="schema"
        @apply="applyFilters"
        @reset="applyFilters"
    />

    <router-link
        to="/admin/users/create"
        class="inline-block mb-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
    >
      Создать
    </router-link>

    <ItemList
        :itemsSource="() => userStore.getUserList"
        :columns="columns"
        :basePath="'/admin/users'"
        :deleteItem="userStore.deleteItem"
        :perPage="userStore.perPage"
        :currentPage="userStore.currentPage"
        :totalPages="userStore.totalPages"
        @next="onNext"
        @prev="onPrev"
    />
  </div>
</template>