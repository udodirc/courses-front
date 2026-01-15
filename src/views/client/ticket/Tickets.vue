<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import api from '../../../api';
import BasePagination from '../../../components/BasePagination.vue';

interface Ticket {
  id: number;
  partner_id: number;
  author: string;
  author_type: string;
  text: string;
  status: boolean;
  createdAt: string;
}

const ticketList = ref<Ticket[]>([]);
const loading = ref(false);
const sending = ref(false);
const error = ref<string | null>(null);

// Поле ввода ответа
const replyText = ref('');

const currentPage = ref(1);
const totalPages = ref(1);

const fetchTickets = async (page = 1) => {
  loading.value = true;
  error.value = null;
  try {
    const response = await api.get(`/admin/ticket-text/1?page=${page}`);
    ticketList.value = response.data.data;
    currentPage.value = response.data.meta.current_page;
    totalPages.value = response.data.meta.last_page;
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Ошибка загрузки тикетов';
  } finally {
    loading.value = false;
  }
};

const submitReply = async () => {
  if (!replyText.value.trim()) return;

  sending.value = true;
  try {
    await api.post(`/admin/ticket-text/1`, {
      text: replyText.value
    });

    replyText.value = '';
    // Перезагружаем текущую страницу или первую
    await fetchTickets(currentPage.value);

    // Прокрутка вниз к новому сообщению (опционально)
    await nextTick();
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  } catch (err: any) {
    alert(err.response?.data?.message || 'Ошибка отправки');
  } finally {
    sending.value = false;
  }
};

onMounted(() => fetchTickets());

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) fetchTickets(page);
};

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('ru-RU', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto flex flex-col min-h-screen">
    <h1 class="text-2xl font-bold mb-6 border-b pb-4">Чат поддержки #1</h1>

    <!-- Состояние загрузки -->
    <div v-if="loading" class="text-center py-10 text-gray-500 italic">
      Загрузка сообщений...
    </div>

    <!-- Список сообщений (Плоский список) -->
    <div v-else class="flex-grow space-y-6 mb-8">
      <div
          v-for="ticket in ticketList"
          :key="ticket.id"
          class="p-4 rounded-xl shadow-sm border-2 transition-all"
          :class="[
            ticket.author_type === 'App\\Models\\User'
              ? 'border-blue-100 bg-blue-50/50 ml-8'
              : 'border-gray-100 bg-white mr-8'
          ]"
      >
        <div class="flex justify-between items-center mb-2">
          <div class="flex items-center space-x-2">
            <span
                class="px-2 py-0.5 text-[9px] uppercase font-bold rounded"
                :class="ticket.author_type === 'App\\Models\\User' ? 'bg-blue-500 text-white' : 'bg-gray-400 text-white'"
            >
              {{ ticket.author_type === 'App\\Models\\User' ? 'Админ' : 'Клиент' }}
            </span>
            <span class="font-semibold text-gray-700 text-sm">{{ ticket.author }}</span>
          </div>
          <span class="text-[10px] text-gray-400">{{ formatDate(ticket.createdAt) }}</span>
        </div>

        <div class="text-gray-800 leading-relaxed whitespace-pre-wrap text-base">
          {{ ticket.text }}
        </div>
      </div>

      <!-- Если пусто -->
      <div v-if="ticketList.length === 0" class="text-center py-10 text-gray-400">
        История сообщений пуста.
      </div>
    </div>

    <!-- Пагинация -->
    <div class="mb-6 flex justify-center">
      <BasePagination
          v-if="totalPages > 1"
          :current-page="currentPage"
          :total-pages="totalPages"
          @next="goToPage(currentPage + 1)"
          @prev="goToPage(currentPage - 1)"
          @go="goToPage"
      />
    </div>

    <!-- ФОРМА ОТВЕТА (СНИЗУ) -->
    <div class="sticky bottom-4 bg-white border-2 border-blue-100 p-4 rounded-2xl shadow-xl">
      <div class="relative">
        <textarea
            v-model="replyText"
            rows="3"
            class="w-full p-3 pr-20 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none text-sm text-gray-700"
            placeholder="Напишите сообщение..."
            @keydown.ctrl.enter="submitReply"
        ></textarea>

        <div class="absolute right-2 bottom-2">
          <button
              @click="submitReply"
              :disabled="sending || !replyText.trim()"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all disabled:bg-gray-300"
          >
            <span v-if="sending">...</span>
            <span v-else>Отправить</span>
          </button>
        </div>
      </div>
      <p class="text-[10px] text-gray-400 mt-2 px-1">Нажмите Ctrl+Enter для быстрой отправки</p>
    </div>
  </div>
</template>

<style scoped>
/* Чтобы форма не перекрывала последнее сообщение при прокрутке */
.sticky {
  z-index: 10;
}
</style>