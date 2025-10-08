<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { usePartnerStoreWithGetters } from '../../../store/admin/partner/partner.store';
import BaseShow from '../../../components/BaseShow.vue';

const route = useRoute();
const partnerStore = usePartnerStoreWithGetters();

const userId = Number(route.params.id);

// вычисляемые свойства
const partner = partnerStore.currentPartner;
const loading = partnerStore.loading;
const error = partnerStore.error;

// загрузка партнера
onMounted(async () => {
  if (userId && !isNaN(userId)) {
    await partnerStore.fetchInfo(userId);
  } else {
    partnerStore.error = 'Некорректный ID партнера';
  }
});
</script>

<template>
  <BaseShow
      label="Партнер"
      :item="partner"
      :itemId="userId"
      :loading="loading"
      :error="error"
      :exclude="['updatedAt', 'sponsor_id']"
  />
</template>