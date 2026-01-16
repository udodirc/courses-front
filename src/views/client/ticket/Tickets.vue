<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
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

const route = useRoute();
const ticketId = route.params.id;
const ticketList = ref<Ticket[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const replyText = ref('');
const sending = ref(false);

// --- СОСТОЯНИЕ РЕДАКТИРОВАНИЯ ---
const editingId = ref<number | null>(null);
const editText = ref('');

const currentPage = ref(1);
const totalPages = ref(1);

const fetchTickets = async (page = 1) => {
  loading.value = true;
  error.value = null;
  try {
    // Подставляем динамический ID из роутера
    const response = await api.get(`/admin/ticket-text/${ticketId}?page=${page}`);
    ticketList.value = response.data.data;
    currentPage.value = response.data.meta.current_page;
    totalPages.value = response.data.meta.last_page;
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Ошибка загрузки тикетов';
  } finally {
    loading.value = false;
  }
};

// --- МЕТОДЫ РЕДАКТИРОВАНИЯ ---
const startEdit = (ticket: Ticket) => {
  editingId.value = ticket.id;
  editText.value = ticket.text;
};

const cancelEdit = () => {
  editingId.value = null;
  editText.value = '';
};

const saveEdit = async (id: number) => {
  if (!editText.value.trim()) return;
  try {
    await api.put(`/partner/ticket-text/${id}`, { text: editText.value });
    // Обновляем текст в списке локально
    const ticket = ticketList.value.find(t => t.id === id);
    if (ticket) ticket.text = editText.value;
    cancelEdit();
  } catch (err: any) {
    alert('Ошибка при сохранении');
  }
};

const submitReply = async () => {
  if (!replyText.value.trim()) return;
  sending.value = true;
  try {
    await api.post(`/partner/ticket-text`, {
      ticket_id: ticketId,
      text: replyText.value
    });
    replyText.value = '';
    await fetchTickets(currentPage.value);
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

const deleteTicket = async (id: number) => {
  if (confirm('Вы уверены, что хотите удалить этот тикет?')) {
    try {
      await api.delete(`/partner/ticket-text/${id}`);
      await fetchTickets(currentPage.value);
    } catch (err) {
      alert('Ошибка при удалении');
    }
  }
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
  <div class="p-6">
    <h1 class="text-3xl text-black pb-6 font-semibold">История переписки #{{ ticketId }}</h1>

    <div v-if="loading" class="text-center py-10 text-gray-500">
      <div class="animate-pulse">Загрузка данных...</div>
    </div>

    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
      {{ error }}
    </div>

    <div v-else class="space-y-4 mb-6">
      <div
          v-for="ticket in ticketList"
          :key="ticket.id"
          class="p-6 rounded-lg shadow-sm border-2 transition-all"
          :class="[
            ticket.author_type === 'App\\Models\\User'
              ? 'border-blue-200 bg-blue-50/40'
              : 'border-gray-200 bg-white'
          ]"
      >
        <div class="flex justify-between items-start mb-3">
          <div class="flex items-center space-x-3">
            <span
                class="px-2 py-0.5 text-[10px] uppercase font-black rounded"
                :class="ticket.author_type === 'App\\Models\\User' ? 'bg-blue-600 text-white' : 'bg-gray-500 text-white'"
            >
              {{ ticket.author_type === 'App\\Models\\User' ? 'Админ' : 'Партнер' }}
            </span>
            <span class="text-sm font-bold text-gray-500">#{{ ticket.id }}</span>
          </div>
          <span class="text-xs text-gray-400 font-mono">{{ formatDate(ticket.createdAt) }}</span>
        </div>

        <!-- ТЕКСТ ИЛИ ПОЛЕ РЕДАКТИРОВАНИЯ -->
        <div v-if="editingId === ticket.id" class="mb-2">
          <textarea
              v-model="editText"
              class="w-full p-3 border-2 border-blue-300 rounded-xl focus:outline-none"
              rows="3"
          ></textarea>
          <div class="flex space-x-2 mt-2">
            <button @click="saveEdit(ticket.id)" class="bg-green-600 text-white px-4 py-1 rounded-lg text-sm">Сохранить</button>
            <button @click="cancelEdit" class="bg-gray-400 text-white px-4 py-1 rounded-lg text-sm">Отмена</button>
          </div>
        </div>
        <div v-else class="text-gray-900 text-lg leading-relaxed whitespace-pre-wrap">
          {{ ticket.text || 'Текст сообщения отсутствует' }}
        </div>

        <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
          <div class="text-sm text-gray-600">
            Отправитель: <span class="font-semibold">{{ ticket.author }}</span>
          </div>

          <!-- ДЕЙСТВИЯ: Только для своих (Партнер) и если сейчас не редактируем -->
          <div v-if="ticket.author_type !== 'App\\Models\\User' && editingId !== ticket.id" class="flex space-x-4">
            <button @click="startEdit(ticket)" class="text-blue-600 hover:underline text-sm flex items-center">
              ✏️ Ред.
            </button>
            <button @click="deleteTicket(ticket.id)" class="text-red-600 hover:underline text-sm flex items-center">
              🗑 Удал.
            </button>
          </div>
        </div>
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

    <!-- Форма отправки -->
    <div class="sticky bottom-4 bg-white border-2 border-blue-100 p-4 rounded-2xl shadow-xl">
      <div class="relative">
        <textarea
            v-model="replyText"
            rows="3"
            class="w-full p-3 pr-20 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none text-sm text-gray-700"
            placeholder="Напишите сообщение..."
            @keydown.ctrl.enter="submitReply"
        ></textarea>
        <div class="absolute right-2 bottom-2">
          <button
              @click="submitReply"
              :disabled="sending || !replyText.trim()"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold disabled:bg-gray-300"
          >
            {{ sending ? '...' : 'Отправить' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>