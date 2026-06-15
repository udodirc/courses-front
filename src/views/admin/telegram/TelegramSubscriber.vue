<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ItemList from '../../../components/ItemList.vue';
import Filters from '../../../components/Filters.vue';
import { useFilterList } from '../../../composables/useFilterList';
import { usePagination } from '../../../composables/usePagination';
import type { FilterSchemaItem } from '../../../types/Filters.ts';
import type { TelegramSubscribe } from '../../../types/TelegramSubscribe.ts';
import { useTelegramSubscribeStoreWithGetters } from '../../../store/admin/telegram_subscriber/telegram_subscribe.store.ts';
import api from '../../../api';

const telegramSubscribeStore = useTelegramSubscribeStoreWithGetters();

const schema = ref<FilterSchemaItem[]>([
  { field: 'chat_id', label: 'Chat id', type: 'text', col: 'left' },
  { field: 'username', label: 'Username', type: 'text', col: 'middle' },
  { field: 'created_from', label: 'Создано с', type: 'date', col: 'left' },
  { field: 'created_to', label: 'Создано по', type: 'date', col: 'middle' },
]);

const { filters, applyFilters, resetFilters, toFilterObject } =
    useFilterList(telegramSubscribeStore, schema.value);

const { onNext, onPrev, goToPage } =
    usePagination(telegramSubscribeStore, filters, toFilterObject);

onMounted(() => {
  applyFilters();
});

const columns: { label: string; field: keyof TelegramSubscribe | string }[] = [
  { label: 'ID', field: 'id' },
  { label: 'Chat id', field: 'chat_id' },
  { label: 'Username', field: 'username' },
];

const showSendMessageModal = ref(false);
const chatId = ref<number | null>(null);
const message = ref('');

const openSendMessageModal = (id: number) => {
  chatId.value = id;
  message.value = '';
  showSendMessageModal.value = true;
};

const closeSendMessageModal = () => {
  showSendMessageModal.value = false;
  chatId.value = null;
  message.value = '';
};

const sendMessage = async () => {
  if (!message.value.trim()) {
    alert('Введите сообщение');
    return;
  }

  try {
    await api.post('/admin/notifications/send', {
      chat_id: chatId.value,
      message: message.value,
    });

    alert('Сообщение отправлено!');
    closeSendMessageModal();
  } catch (error: any) {
    console.error(error);
    alert('Ошибка при отправке');
  }
};
</script>
<template>
  <div class="w-full h-screen overflow-x-hidden border-t flex flex-col">
    <main class="w-full flex-grow p-6">
      <h1 class="text-3xl text-black pb-6">
        Подписчики телеграм бота
      </h1>

      <Filters
          v-model:filters="filters"
          :schema="schema"
          @apply="applyFilters"
          @reset="resetFilters"
      />

      <ItemList
          :key="telegramSubscribeStore.currentPage.value"
          :items="telegramSubscribeStore.telegramSubscribeList.value"
          :columns="columns"
          :basePath="'/admin/telegram-subscribers'"
          :deleteItem="telegramSubscribeStore.deleteItem"
          :currentPage="telegramSubscribeStore.currentPage.value"
          :totalPages="telegramSubscribeStore.totalPages.value"
          :showActions="false"
          @next="onNext"
          @prev="onPrev"
          @go="goToPage"
          @refresh="applyFilters"
          @sendMessage="openSendMessageModal"
      />

      <!-- Модальное окно -->
      <div
          v-if="showSendMessageModal"
          class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          @click.self="closeSendMessageModal"
      >
        <div class="bg-white rounded-xl p-6 w-[500px] relative shadow-lg">
          <button
              class="absolute top-3 right-4 text-gray-500 hover:text-black text-2xl"
              @click="closeSendMessageModal"
          >
            ×
          </button>

          <h2 class="text-xl font-bold mb-4">
            Сообщение подписчику
          </h2>

          <textarea
              v-model="message"
              rows="6"
              placeholder="Введите сообщение..."
              class="w-full px-4 py-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div class="flex justify-end gap-2 mt-4">
            <button
                class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                @click="closeSendMessageModal"
            >
              Отмена
            </button>

            <button
                class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                @click="sendMessage"
            >
              Отправить
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>