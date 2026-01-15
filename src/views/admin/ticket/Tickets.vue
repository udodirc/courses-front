<script setup lang="ts">
import { ref, onMounted } from 'vue';
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
const error = ref<string | null>(null);

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

onMounted(() => fetchTickets());

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) fetchTickets(page);
};

const deleteTicket = async (id: number) => {
  if (confirm('Вы уверены, что хотите удалить этот тикет?')) {
    try {
      await api.delete(`/admin/tickets/${id}`);
      await fetchTickets(currentPage.value);
    } catch (err) {
      alert('Ошибка при удалении');
    }
  }
};

// Функция форматирования даты (2026-01-15 21:13)
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>

<template>
  <div class="p-6">
    <h1 class="text-3xl text-black pb-6 font-semibold">История переписки</h1>

    <!-- Состояние загрузки -->
    <div v-if="loading" class="text-center py-10 text-gray-500">
      <div class="animate-pulse">Загрузка данных...</div>
    </div>

    <!-- Ошибка -->
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
      {{ error }}
    </div>

    <!-- Список сообщений -->
    <div v-else class="space-y-4 mb-6">
      <div
          v-for="ticket in ticketList"
          :key="ticket.id"
          class="p-6 rounded-lg shadow-sm border-2 transition-all hover:shadow-md"
          :class="[
            ticket.author_type === 'App\\Models\\User'
              ? 'border-blue-200 bg-blue-50/40' /* Стиль для Админа */
              : 'border-gray-200 bg-white'     /* Стиль для Партнера */
          ]"
      >
        <div class="flex justify-between items-start mb-3">
          <div class="flex items-center space-x-3">
            <!-- Индикатор типа автора -->
            <span
                class="px-2 py-0.5 text-[10px] uppercase font-black rounded"
                :class="ticket.author_type === 'App\\Models\\User' ? 'bg-blue-600 text-white' : 'bg-gray-500 text-white'"
            >
              {{ ticket.author_type === 'App\\Models\\User' ? 'Админ' : 'Партнер' }}
            </span>

            <span class="text-sm font-bold text-black-800">#{{ ticket.id }}</span>
          </div>
          <span class="text-xs text-black-800 font-mono">{{ formatDate(ticket.createdAt) }}</span>
        </div>

        <!-- Текст сообщения -->
        <div class="text-black-1000 text-lg leading-relaxed whitespace-pre-wrap">
          {{ ticket.text || 'Текст сообщения отсутствует' }}
        </div>

        <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
          <div class="text-sm text-black-1000">
            Отправитель:
            <span class="font-semibold not-italic" :class="{'text-blue-700': ticket.author_type === 'App\\Models\\User'}">
              {{ ticket.author }}
            </span>
          </div>

          <div class="flex space-x-3">
            <button
                @click="deleteTicket(ticket.id)"
                class="text-red-800 hover:text-red-700 text-sm transition-colors flex items-center"
            >
              <span class="mr-1">🗑</span> Удалить
            </button>
          </div>
        </div>
      </div>

      <!-- Заглушка при пустом списке -->
      <div v-if="ticketList.length === 0" class="text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
        <p class="text-gray-400">Сообщений в данном тикете пока нет.</p>
      </div>
    </div>

    <!-- Пагинация -->
    <div class="mt-8 flex justify-center">
      <BasePagination
          v-if="totalPages > 1"
          :current-page="currentPage"
          :total-pages="totalPages"
          @next="goToPage(currentPage + 1)"
          @prev="goToPage(currentPage - 1)"
          @go="goToPage"
      />
    </div>
  </div>
</template>