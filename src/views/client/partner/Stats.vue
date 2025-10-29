<script setup lang="ts">
import { usePartnerStore } from '../../../store/client/partner.store';
import { onMounted } from 'vue';
import { useStaticContent } from '../../../composables/useStaticContent';

const { staticContent, loadingStatic, staticContentError, fetchStaticContent } = useStaticContent();

const partnerStore = usePartnerStore();

const loading = partnerStore.loading;
const error = partnerStore.error;
const stats = partnerStore.user;

onMounted(async () => {
  try {
    await partnerStore.fetchStats();
  } catch (e) {
    console.error(e);
  }
  await fetchStaticContent(['referrals_links', 'banner_advertisement']);
});
</script>

<template>
  <div v-if="loading">Загрузка статистики...</div>

  <div v-else-if="error">{{ error }}</div>

  <div v-else-if="stats" class="grid grid-cols-1 sm:grid-cols-3 gap-4" style="margin: 100px 200px;">
    <!-- Заработок -->
    <div class="p-4 bg-white shadow rounded text-center">
      <h4 class="text-gray-500">Заработок</h4>
      <p class="text-2xl font-bold">{{ stats.total_amount ?? 0 }}$</p>
    </div>

    <!-- Количество рефералов -->
    <div class="p-4 bg-white shadow rounded text-center">
      <h4 class="text-gray-500">Количество рефералов</h4>
      <p class="text-2xl font-bold">{{ stats.referrals_count ?? 0 }}</p>
    </div>

    <!-- Количество купленных курсов -->
    <div class="p-4 bg-white shadow rounded text-center">
      <h4 class="text-gray-500">Количество купленных курсов</h4>
      <p class="text-2xl font-bold">{{ stats.courses_count ?? 0 }}</p>
    </div>
  </div>

  <div v-else>
    Статистика не найдена
  </div>

  <div v-if="loadingStatic">Загрузка...</div>
  <div v-else-if="staticContentError">{{ staticContentError }}</div>
  <div v-else v-html="staticContent['referrals_links']" class="p-4 bg-white rounded shadow" style="margin-bottom: 50px;"></div>
</template>