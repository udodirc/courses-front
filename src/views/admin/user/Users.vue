<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '../../../store/admin/user/user.store.js';
import ItemList from '../../../components/ItemList.vue';
import { useFetchList } from "../../../composables/useFetchList.ts";
import Filters from "../../../components/Filters.vue";

const userStore = useUserStore();

// роли (для селекта)
const { items: roles, fetchItems: fetchRoles } = useFetchList<{ id: number; name: string }>('/admin/roles');

// схема фильтров (ref!)
const schema = ref([
  { field: 'name', label: 'Имя', type: 'text', col: 'left' },
  { field: 'role', label: 'Роль', type: 'select', col: 'left', options: [] as { label: string, value: number }[] },
  { field: 'email', label: 'Email', type: 'email', col: 'middle' },
  { field: 'created_from', label: 'Создано с', type: 'date', col: 'middle' },
  { field: 'created_to', label: 'Создано по', type: 'date', col: 'middle' },
]);

// filters (ref!)
const filters = ref(schema.value.map(f => ({ field: f.field, value: '' })));

// превращаем массив {field,value}[] в объект { field: value }
function toFilterObject(arr: { field: string; value: string }[]) {
  return arr.reduce<Record<string, string>>((acc, f) => {
    if (f.value) acc[f.field] = f.value;
    return acc;
  }, {});
}

// применить фильтры
const applyFilters = () => {
  userStore.fetchList(toFilterObject(filters.value), 1);
};

const resetFilters = () => {
  filters.value = schema.value.map(f => ({ field: f.field, value: '' }));
  applyFilters();
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

// загрузка ролей + установка в schema
onMounted(async () => {
  await fetchRoles();

  const roleFilter = schema.value.find(s => s.field === 'role');
  if (roleFilter) {
    roleFilter.options = roles.value.map(r => ({ label: r.name, value: r.name }));
  }

  applyFilters();
});

// колонки таблицы
const columns = [
  { label: 'ID', field: 'id' },
  { label: 'Имя', field: 'name' },
  { label: 'Email', field: 'email' },
  { label: 'Роль', field: 'role.name' },
];
</script>

<template>
  <div class="w-full h-screen overflow-x-hidden border-t flex flex-col">
    <main class="w-full flex-grow p-6">
      <h1 class="text-3xl text-black pb-6">Пользователи</h1>
        <Filters
            v-model:filters="filters"
            :schema="schema"
            @apply="applyFilters"
            @reset="resetFilters"
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
      </main>
  </div>
</template>