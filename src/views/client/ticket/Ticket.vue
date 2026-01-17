<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../../api';
import BasePagination from '../../../components/BasePagination.vue';

interface Ticket {
  id: number;
  partner_id: number;
  author: string;
  author_type: string;
  text: string;
  status: number | boolean; // Поддержка как ID из Enum, так и boolean
  createdAt: string;
}

interface StatusOption {
  value: number;
  label: string;
}

const router = useRouter();
const ticketList = ref<Ticket[]>([]);
const statuses = ref<StatusOption[]>([]); // Справочник статусов из Enum
const loading = ref(false);
const error = ref<string | null>(null);

// Состояния для нового тикета
const showCreateForm = ref(false);
const newTicketText = ref('');
const isSubmitting = ref(false);

const currentPage = ref(1);
const totalPages = ref(1);

// МЕТОД 1: Получение справочника статусов из бэкенда (Enum)
const fetchStatuses = async () => {
  try {
    const response = await api.get('/partner/tickets/statuses');
    statuses.value = response.data;
  } catch (err) {
    console.error('Не удалось загрузить статусы:', err);
  }
};

// МЕТОД 2: Получение списка тикетов
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

// МЕТОД 3: Создание нового тикета
const createTicket = async () => {
  if (!newTicketText.value.trim()) return;

  isSubmitting.value = true;
  try {
    const response = await api.post('/partner/tickets', {
      text: newTicketText.value
    });

    if (response.data?.id) {
      // Редирект в созданный чат
      router.push(`/partner/ticket/${response.data.id}`);
    } else {
      showCreateForm.value = false;
      newTicketText.value = '';
      fetchTickets(1);
    }
  } catch (err: any) {
    alert(err.response?.data?.message || 'Ошибка при создании запроса');
  } finally {
    isSubmitting.value = false;
  }
};

// Хелперы
const getStatusLabel = (val: number | boolean) => {
  const numericVal = typeof val === 'boolean' ? (val ? 1 : 2) : Number(val);
  return statuses.value.find(s => s.value === numericVal)?.label || '...';
};

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('ru-RU', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) fetchTickets(page);
};

onMounted(() => {
  fetchStatuses(); // Сначала грузим справочник
  fetchTickets();  // Затем данные
});
</script>

<template>
  <div class="w-full h-screen overflow-x-hidden border-t flex flex-col bg-gray-50">
    <main class="w-full flex-grow p-6 max-w-5xl mx-auto">
      <div class="flex justify-between items-center pb-6">
        <h1 class="text-3xl text-black font-bold">Мои запросы</h1>
        <button
            @click="showCreateForm = !showCreateForm"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm"
        >
          {{ showCreateForm ? 'Отмена' : 'Создать запрос' }}
        </button>
      </div>

      <!-- ФОРМА СОЗДАНИЯ -->
      <transition name="fade">
        <div v-if="showCreateForm" class="bg-white p-6 rounded-xl shadow-sm border border-blue-200 mb-8">
          <h2 class="text-lg font-semibold mb-4 text-blue-900">Опишите вашу проблему</h2>
          <textarea
              v-model="newTicketText"
              rows="4"
              class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-gray-700 mb-4 transition-all shadow-inner"
              placeholder="Введите ваше сообщение здесь..."
          ></textarea>
          <div class="flex justify-end">
            <button
                @click="createTicket"
                :disabled="isSubmitting || !newTicketText.trim()"
                class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold disabled:bg-gray-400 transition-all shadow-md"
            >
              {{ isSubmitting ? 'Отправка...' : 'Отправить запрос' }}
            </button>
          </div>
        </div>
      </transition>

      <!-- Состояние загрузки -->
      <div v-if="loading && !ticketList.length" class="text-center py-20 text-gray-400 animate-pulse">
        Загрузка списка запросов...
      </div>

      <!-- Список тикетов -->
      <div v-else class="space-y-4 mb-6">
        <div
            v-for="ticket in ticketList"
            :key="ticket.id"
            class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all group"
        >
          <div class="flex justify-between items-start mb-2">
            <div class="flex items-center space-x-3">
              <span class="text-sm font-bold text-gray-500">#{{ ticket.id }}</span>
              <span
                  :class="[
                    'px-2 py-1 text-xs rounded-full font-bold uppercase tracking-wider shadow-sm',
                    ticket.status == 1 ? 'bg-yellow-100 text-yellow-700' :
                    ticket.status == 2 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  ]"
              >
                {{ getStatusLabel(ticket.status) }}
              </span>
            </div>
            <span class="text-xs text-gray-400 font-mono">{{ formatDate(ticket.createdAt) }}</span>
          </div>

          <h2 class="text-xl font-semibold text-gray-800 mb-2 truncate group-hover:text-blue-700 transition-colors">
            {{ ticket.text || 'Без названия' }}
          </h2>

          <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
            <div class="text-sm text-gray-600 italic">
              Автор: <span class="font-bold text-gray-900 not-italic">{{ ticket.author }}</span>
            </div>

            <router-link
                :to="`/partner/ticket/${ticket.id}`"
                class="text-blue-600 hover:text-blue-800 text-sm font-black flex items-center"
            >
              Открыть запрос <span class="ml-1">→</span>
            </router-link>
          </div>
        </div>

        <div v-if="!loading && ticketList.length === 0" class="text-center py-20 bg-gray-50 border-2 border-dashed rounded-xl text-gray-400">
          У вас пока нет активных запросов.
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
    </main>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>