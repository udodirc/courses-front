<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useTelegramMessagesStoreWithGetters } from '../../../store/admin/telegram_messages/telegram_messages.store.ts';
import BaseShow from '../../../components/BaseShow.vue';

const route = useRoute();
const telegramMessageStore = useTelegramMessagesStoreWithGetters();

const telegramMessageId = Number(route.params.id);
const content = telegramMessageStore.currentTelegramMessage; // просто используем computed как есть
const loading = telegramMessageStore.loading; // тоже computed
const error = telegramMessageStore.error;

onMounted(async () => {
  if (!isNaN(telegramMessageId)) {
    await telegramMessageStore.fetchItem(telegramMessageId);
  } else {
    telegramMessageStore.error = 'Некорректный ID сообщения';
  }
});
</script>

<template>
  <BaseShow
      label="Сообщение"
      :item="content"
      :itemId="telegramMessageId"
      :loading="loading"
      :error="error"
      :exclude="['updatedAt']"
  />
</template>