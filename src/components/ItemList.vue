<!-- components/ItemList.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import CrudList from './CrudList.vue';
import { useCrudActions } from '../composables/useCrudActions';
import { usePagination } from '../composables/usePagination';

const props = defineProps<{
  itemsSource: () => any[];
  columns: { label: string; field: string }[];
  basePath: string;
  deleteItem: (id: number) => Promise<void>;
  perPage: number;
}>();

const items = computed(() => props.itemsSource() || []);

const { currentPage, paginatedData, totalPages, nextPage, prevPage } =
    usePagination(items, props.perPage);

const { view, edit, delete: destroy } = useCrudActions(props.basePath, props.deleteItem);
console.log(totalPages);
</script>

<template>
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
</template>