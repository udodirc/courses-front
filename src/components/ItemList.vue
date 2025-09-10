<script setup lang="ts">
import CrudList from './CrudList.vue';
import { useCrudActions } from '../composables/useCrudActions';

const props = defineProps<{
  items: any[];
  columns: { label: string; field: string }[];
  basePath: string;
  deleteItem: (id: number) => Promise<void>;
  currentPage: number;
  totalPages: number;
}>();

const emit = defineEmits(['prev', 'next', 'go', 'refresh']);

const { view, edit, toggleStatus, changeOrder, delete: destroy } =
    useCrudActions(props.basePath, props.deleteItem);
</script>

<template>
  <CrudList
      :items="items"
      :columns="columns"
      :currentPage="currentPage"
      :totalPages="totalPages"
      @prev="$emit('prev')"
      @next="$emit('next')"
      @go="$emit('go', $event)"
      @view="view"
      @edit="edit"
      @toggleStatus="async (id) => { await toggleStatus(id); emit('refresh'); }"
      @changeOrderUp="async (id) => { await changeOrder(id, 'up'); emit('refresh'); }"
      @changeOrderDown="async (id) => { await changeOrder(id, 'down'); emit('refresh'); }"
      @delete="destroy"
  />
</template>