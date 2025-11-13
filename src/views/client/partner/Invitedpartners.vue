<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
import { usePartnerStore } from '../../../store/client/partner/partner.store.ts';
import ItemFrontList from '../../../components/ItemFrontList.vue';
import { usePagination } from '../../../composables/usePagination';
import { useStaticContent } from '../../../composables/useStaticContent';
import Filters from '../../../components/Filters.vue';
import { useFilterList } from '../../../composables/useFilterList';
import type { FilterSchemaItem } from '../../../types/Filters.ts';

const { staticContent, loadingStatic, staticContentError, fetchStaticContent } = useStaticContent();
const partnerStore = usePartnerStore();

const partnerId = localStorage.getItem('partner_id');
const baseUrl = partnerId ? `/partner/personal-invited/${partnerId}` : '';

const schema = ref<FilterSchemaItem[]>([
  { field: 'login', label: 'Логин', type: 'text', col: 'left' },
  { field: 'email', label: 'Email', type: 'email', col: 'middle' },
]);

const { filters, applyFilters, resetFilters, toFilterObject } = useFilterList(partnerStore, schema.value, baseUrl);
const { onNext, onPrev, goToPage } = usePagination(partnerStore, filters, toFilterObject);

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
  if (partnerId) {
    await applyFilters();
  }
  await fetchStaticContent(['invited-partners']);
});
</script>

<template>
  <div v-if="loadingStatic">Загрузка...</div>
  <div v-else-if="staticContentError">{{ staticContentError }}</div>
  <div v-else v-html="staticContent['invited-partners']" class="p-4 bg-white rounded shadow" style="margin-bottom: 50px;"></div>

  <Filters
      v-model:filters="filters"
      :schema="schema"
      @apply="applyFilters"
      @reset="resetFilters"
  />

  <ItemFrontList
      :items="partnerList"
      :columns="columns"
      :currentPage="partnerStore.currentPage"
      :totalPages="partnerStore.totalPages"
      @prev="onPrev"
      @next="onNext"
      @go="goToPage"
      @refresh="applyFilters" />
</template>