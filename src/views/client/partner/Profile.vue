<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { usePartnerStore } from '../../../store/client/partner/partner.store.ts';
import BaseShow from '../../../components/BaseShow.vue';

const partnerStore = usePartnerStore();

// реактивные свойства
const partner = computed(() => partnerStore.user);
const loading = computed(() => partnerStore.loading);
const error = computed(() => partnerStore.error);

onMounted(async () => {
  try {
    // загружаем пользователя, если он ещё не загружен
    if (!partnerStore.user && partnerStore.token) {
      await partnerStore.fetchUser();
    }
  } catch (e) {
    console.error('Ошибка загрузки пользователя:', e);
  }
});
</script>

<template>
  <div class="max-w-4xl mx-auto mt-12 p-6 bg-white rounded shadow">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold text-gray-800">Профиль партнёра</h2>

      <router-link
          :to="`/partner/${partner?.id}/edit`"
          class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition"
      >
        Редактировать
      </router-link>
    </div>

    <BaseShow
        label=""
        :item="partner"
        :loading="loading"
        :error="error"
        :exclude="[
        'id',
        'created_at',
        'updated_at',
        'level',
        'left_key',
        'right_key',
        'sponsor_id',
        'ip_address',
        'email_verified_at',
        'password_reset_expires_at',
        'password_reset_token',
        'status'
      ]"
    />
  </div>
</template>