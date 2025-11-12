<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useOrderStore } from '../../../store/client/order/order.store.ts';
import ItemFrontList from '../../../components/ItemFrontList.vue';
import { usePagination } from '../../../composables/usePagination';
import { useStaticContent } from '../../../composables/useStaticContent';

const { staticContent, loadingStatic, staticContentError, fetchStaticContent } = useStaticContent();

const orderStore = useOrderStore();
const { onNext, onPrev, goToPage } = usePagination(orderStore, undefined, undefined, '/orders');

const columns = [
  { label: 'ID', field: 'id' },
  { label: 'Номер заказа', field: 'order_number' },
  { label: 'Название курса', field: 'course_name' },
  { label: 'Сумма', field: 'amount' },
  { label: 'Валюта', field: 'currency' },
  { label: 'Статус', field: 'status' },
];

const orderList = computed(() => orderStore.items);

onMounted(async () => {
  await orderStore.fetchList({}, 1, '/partner/orders');
  await fetchStaticContent(['partners']);
});
</script>

<template>
  <div v-if="loadingStatic">Загрузка...</div>
  <div v-else-if="staticContentError">{{ staticContentError }}</div>

  <ItemFrontList
      :items="orderList"
      :columns="columns"
      :currentPage="orderStore.currentPage"
      :totalPages="orderStore.totalPages"
      @prev="onPrev"
      @next="onNext"
      @go="goToPage"
  />
</template>