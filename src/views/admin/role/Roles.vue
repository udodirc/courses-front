<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoleStoreWithGetters } from '../../../store/admin/role/role.store';
import ItemList from '../../../components/ItemList.vue';
import Filters from '../../../components/Filters.vue';
import { useFilterList } from '../../../composables/useFilterList';
import { usePagination } from '../../../composables/usePagination';
import type { FilterSchemaItem } from '../../../types/Filters.ts';

const roleStore = useRoleStoreWithGetters();

const schema = ref<FilterSchemaItem[]>([
  { field: 'name', label: 'Имя', type: 'text', col: 'left' },
  { field: 'created_from', label: 'Создано с', type: 'date', col: 'left' },
  { field: 'created_to', label: 'Создано по', type: 'date', col: 'left' },
]);

// composables
const { filters, applyFilters, resetFilters, toFilterObject } = useFilterList(roleStore, schema.value);
const { onNext, onPrev, goToPage } = usePagination(roleStore, filters, toFilterObject);

onMounted(() => applyFilters());

const columns = [
  { label: 'ID', field: 'id' },
  { label: 'Имя', field: 'name' },
];
</script>

<template>
  <div class="w-full h-screen overflow-x-hidden border-t flex flex-col">
    <main class="w-full flex-grow p-6">
      <h1 class="text-3xl text-black pb-6">Роли</h1>

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
          :key="roleStore.currentPage.value"
          :items="roleStore.roleList.value"
          :columns="columns"
          :basePath="'/admin/roles'"
          :deleteItem="roleStore.deleteItem"
          :currentPage="roleStore.currentPage.value"
          :totalPages="roleStore.totalPages.value"
          @next="onNext"
          @prev="onPrev"
          @go="goToPage"
          @refresh="applyFilters"
      />
    </main>
  </div>
</template>