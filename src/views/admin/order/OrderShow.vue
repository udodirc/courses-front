<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import BaseShow from '../../../components/BaseShow.vue';
import { useOrderStoreWithGetters } from '../../../store/admin/order/order.store.ts';

const route = useRoute();
const orderStore = useOrderStoreWithGetters();

const orderId = Number(route.params.id);
const order = orderStore.currentOrder;
const loading = orderStore.loading;
const error = orderStore.error;

onMounted(async () => {
  if (!isNaN(orderId)) {
    await orderStore.fetchItem(orderId);
  } else {
    orderStore.error = 'Некорректный ID заказа';
  }
});
</script>
<template>
  <BaseShow
      label="Заказа"
      :item="order"
      :itemId="orderId"
      :loading="loading"
      :error="error"
      :exclude="['updatedAt', 'course_id', 'partner_id', 'metadata']"
  />
</template>