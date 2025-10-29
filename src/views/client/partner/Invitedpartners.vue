<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { usePartnerStore } from '../../../store/client/partner.store';
import ItemFrontList from '../../../components/ItemFrontList.vue';
import { usePagination } from '../../../composables/usePagination';

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
});
</script>

<template>
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