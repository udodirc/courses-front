<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
import { usePartnerStore } from '../../../store/client/partner.store';
import ItemFrontList from '../../../components/ItemFrontList.vue';
import { usePagination } from '../../../composables/usePagination';
import { useStaticContent } from '../../../composables/useStaticContent';
import api from "../../../api";

const { staticContent, loadingStatic, staticContentError, fetchStaticContent } = useStaticContent();

const partnerStore = usePartnerStore();
const { onNext, onPrev, goToPage } = usePagination(partnerStore, '/partner/structure');

const columns = [
  { label: 'ID', field: 'id' },
  { label: 'Логин спонсора', field: 'sponsor_name' },
  { label: 'Логин', field: 'login' },
  { label: 'Кол-во курсов', field: 'courses_count' },
  { label: 'Дата регистрации', field: 'createdAt' },
];

const partnerList = computed(() => partnerStore.items);

onMounted(async () => {
  await partnerStore.fetchList({}, 1, '/partner/structure');
  await fetchStaticContent(['partners']);
});
</script>

<template>
  <div v-if="loadingStatic">Загрузка...</div>
  <div v-else-if="staticContentError">{{ staticContentError }}</div>
  <div v-else v-html="staticContent.partners" class="p-4 bg-white rounded shadow" style="margin-bottom: 50px;"></div>

  <!-- Таблица партнёров -->
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