<script setup lang="ts">
import CrudList from './CrudList.vue';
import { useCrudActions } from '../composables/useCrudActions';

interface Props {
  items: any[];
  columns: { label: string; field: string }[];
  basePath: string;
  deleteItem: (id: number) => Promise<void>;
  currentPage: number;
  totalPages: number;
  showActions?: boolean;
}

// ✅ Задаём дефолтное значение через withDefaults
const props = withDefaults(defineProps<Props>(), {
  showActions: true,
});

const emit = defineEmits(['prev', 'next', 'go', 'refresh', 'payment']);

const { view, edit, toggleStatus, toggleFreePay, changeOrder, delete: destroy, payment } =
    useCrudActions(props.basePath, props.deleteItem, emit);
</script>

<template>
  <CrudList
      :key="currentPage"
      :items="items"
      :columns="columns"
      :currentPage="currentPage"
      :totalPages="totalPages"
      :showActions="showActions"
      @prev="$emit('prev')"
      @next="$emit('next')"
      @go="$emit('go', $event)"
      @view="view"
      @edit="edit"
      @toggleStatus="async (id) => { await toggleStatus(id); emit('refresh'); }"
      @toggleFreePay="async (id) => { await toggleFreePay(id); emit('refresh'); }"
      @changeOrderUp="async (id) => { await changeOrder(id, 'up'); emit('refresh'); }"
      @changeOrderDown="async (id) => { await changeOrder(id, 'down'); emit('refresh'); }"
      @delete="destroy"
      @payment="payment"
  />
</template>