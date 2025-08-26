<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoleStore } from '../../../store/admin/role/role.store';
import ItemList from '../../../components/ItemList.vue';
import Filters from "../../../components/Filters.vue";

// стор
const roleStore = useRoleStore();

const schema = ref([
  { field: 'name', label: 'Имя', type: 'text', col: 'left' },
  { field: 'created_from', label: 'Создано с', type: 'date', col: 'middle' },
  { field: 'created_to', label: 'Создано по', type: 'date', col: 'middle' },
]);

const filters = ref(schema.value.map(f => ({ field: f.field, value: '' })));

// превращаем [{field,value}] → { field: value }
function toFilterObject(arr: { field: string; value: string }[]) {
  return arr.reduce<Record<string, string>>((acc, f) => {
    if (f.value) acc[f.field] = f.value;
    return acc;
  }, {});
}

const applyFilters = () => {
  roleStore.fetchList(toFilterObject(filters.value), 1);
};

const resetFilters = () => {
  filters.value = schema.value.map(f => ({ field: f.field, value: '' }));
  applyFilters();
};

// пагинация
const onNext = () => {
  if (roleStore.currentPage < roleStore.totalPages) {
    roleStore.fetchList(toFilterObject(filters.value), roleStore.currentPage + 1);
  }
};

const onPrev = () => {
  if (roleStore.currentPage > 1) {
    roleStore.fetchList(toFilterObject(filters.value), roleStore.currentPage - 1);
  }
};

onMounted(() => {
  applyFilters();
});

// колонки для таблицы
const columns = [
  { label: 'ID', field: 'id' },
  { label: 'Имя', field: 'name' },
];
</script>

<template>
  <div class="max-w-5xl mx-auto p-6 bg-white rounded shadow">
    <h2 class="text-2xl font-semibold mb-4">Роли</h2>

    <!-- Фильтры -->
    <Filters
        v-model:filters="filters"
        :schema="schema"
        @apply="applyFilters"
        @reset="resetFilters"
    />

    <router-link
        to="/admin/roles/create"
        class="inline-block mb-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
    >
      Создать
    </router-link>

    <ItemList
        :itemsSource="() => roleStore.getRoleList"
        :columns="columns"
        :basePath="'/admin/roles'"
        :deleteItem="roleStore.deleteItem"
        :perPage="roleStore.perPage"
        :currentPage="roleStore.currentPage"
        :totalPages="roleStore.totalPages"
        @next="onNext"
        @prev="onPrev"
    />
  </div>
</template>