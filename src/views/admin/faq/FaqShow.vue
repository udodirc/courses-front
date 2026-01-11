<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useFaqStoreWithGetters } from '../../../store/admin/faq/faq.store.ts';
import BaseShow from '../../../components/BaseShow.vue';

const route = useRoute();
const faqStore = useFaqStoreWithGetters();

const faqId = Number(route.params.id);
const faq = faqStore.currentFaq;
const loading = faqStore.loading;
const error = faqStore.error;

onMounted(async () => {
  if (!isNaN(faqId)) {
    await faqStore.fetchItem(faqId);
  } else {
    faqStore.error = 'Некорректный ID F.A.Q';
  }
});
</script>

<template>
  <BaseShow
      label="F.A.Q"
      :item="faq"
      :itemId="faqId"
      :loading="loading"
      :error="error"
      :exclude="['updatedAt']"
  />
</template>