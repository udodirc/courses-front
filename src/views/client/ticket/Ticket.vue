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
    const response = await api.get(`/partner/tickets?page=${page}`);
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
  <div class="w-full h-screen overflow-x-hidden border-t flex flex-col">
    <main class="w-full flex-grow p-6">
      <h1 class="text-3xl text-black pb-6">Запросы</h1>
      <!-- Список тикетов в стиле новостей -->
      <div class="space-y-4 mb-6">
        <div
            v-for="ticket in ticketList"
            :key="ticket.id"
            class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div class="flex justify-between items-start mb-2">
            <div class="flex items-center space-x-3">
              <span class="text-sm font-bold text-gray-500">#{{ ticket.id }}</span>
              <span
                  :class="[
            'px-2 py-1 text-xs rounded-full',
            ticket.status == true ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
          ]"
              >
          {{ ticket.status == true ? 'Ожидает ответа' : 'Отвечен' }}
        </span>
            </div>
            <span class="text-xs text-gray-400">{{ ticket.createdAt }}</span>
          </div>

          <!-- Текст вопроса (тот самый первый текст из БД) -->
          <h2 class="text-xl font-semibold text-gray-800 mb-2">
            {{ ticket.text || 'Без названия' }}
          </h2>

          <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
            <div class="text-sm text-gray-600">
              Автор: <span class="font-medium">{{ ticket.author }}</span>
            </div>

            <div class="flex space-x-2">
              <router-link
                  :to="`/partner/ticket/${ticket.id}`"
                  class="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Открыть запрос →
              </router-link>
            </div>
          </div>
        </div>
      </div>

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
    </main>
  </div>
</template>