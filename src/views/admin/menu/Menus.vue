<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useMenuStore } from '../../../store/admin/menu/menu.store';
import ItemList from '../../../components/ItemList.vue';
import Filters from '../../../components/Filters.vue';
import { useFetchList } from '../../../composables/useFetchList';

const menuStore = useMenuStore();

// загрузка всех меню для селекта родителя
const { items: menus, fetchItems: fetchMenus } = useFetchList<{ id: number; name: string }>('/admin/menu');

// схема фильтров (ref!)
const schema = ref([
  { field: 'name', label: 'Имя', type: 'text', col: 'left' },
  { field: 'parent_id', label: 'Родительское меню', type: 'select', col: 'left', options: [] as { label: string, value: number | string }[] },
  { field: 'created_from', label: 'Создано с', type: 'date', col: 'middle' },
  { field: 'created_to', label: 'Создано по', type: 'date', col: 'middle' },
]);

// filters (ref!)
const filters = ref(schema.value.map(f => ({ field: f.field, value: '' })));

// превращаем массив фильтров в объект
function toFilterObject(arr: { field: string; value: string }[]) {
  return arr.reduce<Record<string, string>>((acc, f) => {
    if (f.value) acc[f.field] = f.value;
    return acc;
  }, {});
}

// применить фильтры
const applyFilters = () => {
  menuStore.fetchList(toFilterObject(filters.value), 1);
};

// сбросить фильтры
const resetFilters = () => {
  filters.value = schema.value.map(f => ({ field: f.field, value: '' }));
  applyFilters();
};

// пагинация
const onNext = () => {
  if (menuStore.currentPage < menuStore.totalPages) {
    menuStore.fetchList(toFilterObject(filters.value), menuStore.currentPage + 1);
  }
};

const onPrev = () => {
  if (menuStore.currentPage > 1) {
    menuStore.fetchList(toFilterObject(filters.value), menuStore.currentPage - 1);
  }
};

// загружаем меню и добавляем в schema
onMounted(async () => {
  await fetchMenus();
  const parentFilter = schema.value.find(s => s.field === 'parent_id');
  if (parentFilter) {
    parentFilter.options = [
      { label: '— Нет родителя —', value: '' },
      ...menus.value.map(m => ({ label: m.name, value: m.id })),
    ];
  }
  applyFilters();
});

// колонки для таблицы
const columns = [
  { label: 'ID', field: 'id' },
  { label: 'Родительское меню', field: 'parent_name' },
  { label: 'Имя', field: 'name' },
];
</script>

<template>
  <div class="max-w-5xl mx-auto p-6 bg-white rounded shadow">
    <h2 class="text-2xl font-semibold mb-4">Меню</h2>

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
        :itemsSource="() => menuStore.getMenuList"
        :columns="columns"
        :basePath="'/admin/menu'"
        :deleteItem="menuStore.deleteItem"
        :perPage="menuStore.perPage"
        :currentPage="menuStore.currentPage"
        :totalPages="menuStore.totalPages"
        @next="onNext"
        @prev="onPrev"
    />
  </div>
</template>