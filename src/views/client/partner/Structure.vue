<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { usePartnerStore } from '../../../store/client/partner.store';
import ItemFrontList from '../../../components/ItemFrontList.vue';
import { usePagination } from '../../../composables/usePagination';

const partnerStore = usePartnerStore();
const { onNext, onPrev, goToPage } = usePagination(partnerStore);

const columns = [
  { label: 'ID', field: 'id' },
  { label: 'Логин спонсора', field: 'sponsor_name' },
  { label: 'Логин', field: 'login' },
  { label: 'Дата регистрации', field: 'createdAt' },
];

const partnerList = computed(() => partnerStore.items);

onMounted(async () => {
  await partnerStore.fetchList();
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