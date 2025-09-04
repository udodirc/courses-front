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

const { view, edit, toggleStatus, delete: destroy } = useCrudActions(props.basePath, props.deleteItem);

const onPrev = () => emit('prev');
const onNext = () => emit('next');
const onGo = (page: number) => emit('go', page);
</script>

<template>
  <CrudList
      :items="items"
      :columns="columns"
      :currentPage="currentPage"
      :totalPages="totalPages"
      @prev="onPrev"
      @next="onNext"
      @go="onGo"
      @view="view"
      @edit="edit"
      @toggleStatus="async (id) => { await toggleStatus(id); emit('refresh'); }"
      @delete="destroy"
  />
</template>