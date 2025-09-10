<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useMenuStore } from '../../../store/admin/menu/menu.store';
import ItemList from '../../../components/ItemList.vue';
import Filters from '../../../components/Filters.vue';
import { useFetchList } from '../../../composables/useFetchList';
import { useFilterList, type SchemaItem } from '../../../composables/useFilterList';
import { usePagination } from '../../../composables/usePagination';

const menuStore = useMenuStore();

// загрузка всех меню для селекта родителя
const { items: menus, fetchItems: fetchMenus } = useFetchList<{ id: number; name: string }>('/admin/menu');

// схема фильтров
const schema = ref<SchemaItem[]>([
  { field: 'name', label: 'Имя', type: 'text', col: 'left' },
  { field: 'parent_id', label: 'Родительское меню', type: 'select', col: 'middle', options: [] },
  { field: 'created_from', label: 'Создано с', type: 'date', col: 'left' },
  { field: 'created_to', label: 'Создано по', type: 'date', col: 'middle' },
  { field: 'status', label: 'Статус', type: 'select', col: 'left', options: [
      { label: 'Активный', value: 1 },
      { label: 'Неактивный', value: 0 },
    ] },
]);

// composables
const { filters, applyFilters, resetFilters, toFilterObject } = useFilterList(menuStore, schema.value);
const { onNext, onPrev, goToPage } = usePagination(menuStore, filters, toFilterObject);

const moveUp = async (id: number) => {
  await menuStore.moveOrderUp(id);
  applyFilters(); // чтобы обновить фильтры и список
};

const moveDown = async (id: number) => {
  await menuStore.moveOrderDown(id);
  applyFilters();
};

// загрузка меню и добавление в schema
onMounted(async () => {
  await fetchMenus();
  const parentFilter = schema.value.find(f => f.field === 'parent_id');
  if (parentFilter) {
    parentFilter.options = menus.value.map(m => ({ label: m.name, value: m.id }));
  }
  applyFilters();
});

// колонки для таблицы
const columns = [
  { label: 'ID', field: 'id' },
  { label: 'Родительское меню', field: 'parent_name' },
  { label: 'Имя', field: 'name' },
  { label: 'URL', field: 'url' },
];
</script>

<template>
  <div class="w-full h-screen overflow-x-hidden border-t flex flex-col">
    <main class="w-full flex-grow p-6">
      <h1 class="text-3xl text-black pb-6">Меню</h1>

      <!-- Фильтры -->
      <Filters
          v-model:filters="filters"
          :schema="schema"
          @apply="applyFilters"
          @reset="resetFilters"
      />

      <router-link
          to="/admin/menu/create"
          class="inline-block mb-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
      >
        Создать
      </router-link>

      <ItemList
          :items="menuStore.getMenuList"
          :columns="columns"
          :basePath="'/admin/menu'"
          :deleteItem="menuStore.deleteItem"
          :currentPage="menuStore.currentPage"
          :totalPages="menuStore.totalPages"
          @next="onNext"
          @prev="onPrev"
          @go="goToPage"
          @order-up="moveUp"
          @order-down="moveDown"
          @refresh="applyFilters"
      />
    </main>
  </div>
</template>