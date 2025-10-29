<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { usePartnerStore } from '../../../store/client/partner.store';
import ItemFrontList from '../../../components/ItemFrontList.vue';
import { usePagination } from '../../../composables/usePagination';
import { useStaticContent } from '../../../composables/useStaticContent';

const { staticContent, loadingStatic, staticContentError, fetchStaticContent } = useStaticContent();

const partnerStore = usePartnerStore();
const { onNext, onPrev, goToPage } = usePagination(partnerStore);

const columns = [
  { label: 'ID', field: 'id' },
  { label: 'Логин', field: 'login' },
  { label: 'Email', field: 'email' },
  { label: 'Кол-во рефералов', field: 'referrals_count' },
  { label: 'Кол-во курсов', field: 'courses_count' },
  { label: 'Дата регистрации', field: 'createdAt' },
];

const partnerList = computed(() => partnerStore.items);

onMounted(async () => {
  const partnerId = localStorage.getItem('partner_id');
  if (partnerId) {
    await partnerStore.fetchList({}, 1, `/partner/personal-invited/${partnerId}`);
  }
  await fetchStaticContent(['invited-partners']);
});
</script>

<template>
  <div v-if="loadingStatic">Загрузка...</div>
  <div v-else-if="staticContentError">{{ staticContentError }}</div>
  <div v-else v-html="staticContent['invited-partners']" class="p-4 bg-white rounded shadow" style="margin-bottom: 50px;"></div>
  <ItemFrontList
      :items="partnerList"
      :columns="columns"
      :currentPage="partnerStore.currentPage"
      :totalPages="partnerStore.totalPages"
      @prev="onPrev"
      @next="onNext"
      @go="goToPage"
  />
</template>