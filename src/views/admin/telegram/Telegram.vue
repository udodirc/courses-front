<script setup lang="ts">
import { ref } from 'vue';
import api from '../../../api';

// ... ваши существующие интерфейсы (Ticket) и переменные (ticketList, loading и т.д.) ...

/* --- НОВАЯ ЛОГИКА ДЛЯ УВЕДОМЛЕНИЙ --- */
const notificationMessage = ref('');
const sendingNotification = ref(false);
const loading = ref(false);

const sendNotification = async () => {
  if (!notificationMessage.value.trim()) return;

  sendingNotification.value = true;
  try {
    // Используем api вместо fetch, чтобы путь подставился автоматически
    await api.post('/admin/notifications/send', {
      message: notificationMessage.value
    });
    alert('Уведомление успешно отправлено!');
    notificationMessage.value = '';
  } catch (err: any) {
    alert(err.response?.data?.message || 'Ошибка при отправке');
  } finally {
    sendingNotification.value = false;
  }
};
/* ------------------------------------ */

// ... ваш существующий код (fetchTickets, submitReply, deleteTicket и т.д.) ...
</script>

<template>
  <div class="p-6">
    <!-- СЕКЦИЯ ОТПРАВКИ УВЕДОМЛЕНИЯ -->
    <div class="mb-10 p-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl">
      <h2 class="text-lg font-bold mb-3 text-gray-700">📢 Отправить уведомление</h2>

      <div class="flex flex-col gap-3"> <!-- flex-col ставит кнопку под текстовое поле -->
        <textarea
            v-model="notificationMessage"
            placeholder="Введите текст уведомления для отправки..."
            class="w-full p-4 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            rows="6"
        ></textarea>

        <div class="flex justify-end"> <!-- Этот блок прижимает кнопку к правому краю -->
          <button
              @click="sendNotification"
              :disabled="sendingNotification || !notificationMessage.trim()"
              class="bg-black text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-gray-800 disabled:bg-gray-400 transition-all shadow-sm"
          >
            {{ sendingNotification ? 'Отправка...' : 'Отправить уведомление' }}
          </button>
        </div>
      </div>
    </div>

    <!-- История переписки -->
    <div v-if="loading">...</div>
    <div v-else class="space-y-4 mb-6">
      <!-- Ваш цикл v-for="ticket in ticketList" -->
    </div>

    <!-- Существующая форма ответа внизу -->
    <div class="sticky bottom-4 ...">
      <!-- ... -->
    </div>
  </div>
</template>