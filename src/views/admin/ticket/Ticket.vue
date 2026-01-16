<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useTicketWithGetters } from '../../../store/admin/ticket/ticket.store.ts';
import Filters from '../../../components/Filters.vue';
import BasePagination from '../../../components/BasePagination.vue';
import { useFilterList } from '../../../composables/useFilterList';
import { usePagination } from '../../../composables/usePagination';
import type { FilterSchemaItem } from '../../../types/Filters.ts';
import api from '../../../api'; // Импорт вашего axios-инстанса

const ticketStore = useTicketWithGetters();

// 1. Схема фильтров
const schema = ref<FilterSchemaItem[]>([
  { field: 'text', label: 'Вопрос', type: 'text', col: 'left' },
  { field: 'status', label: 'Статус', type: 'select', col: 'middle', options: [
      { label: 'Есть ответ', value: 2 },
      { label: 'Нет ответа', value: 1 },
      { label: 'Архив', value: 0 },
    ] },
  { field: 'created_from', label: 'Создано с', type: 'date', col: 'left' },
  { field: 'created_to', label: 'Создано по', type: 'date', col: 'middle' },
]);

// 2. Composables для логики списка
const { filters, applyFilters, resetFilters, toFilterObject } = useFilterList(ticketStore, schema.value);
const { onNext, onPrev, goToPage } = usePagination(ticketStore, filters, toFilterObject);

// 3. Метод удаления напрямую через API
const handleDelete = async (id: number) => {
  if (!confirm('Вы уверены, что хотите удалить этот тикет и всю историю сообщений?')) return;

  try {
    // Отправляем запрос на удаление
    await api.delete(`/admin/tickets/${id}`);

    // После удаления обновляем список через applyFilters
    // Это автоматически подтянет новые данные с учетом пагинации
    applyFilters();
  } catch (error: any) {
    console.error('Ошибка удаления:', error);
    alert(error.response?.data?.message || 'Произошла ошибка при удалении');
  }
};

// 4. Форматирование даты
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Загрузка списка при монтировании
onMounted(() => {
  applyFilters();
});
</script>

<template>
  <div class="w-full h-screen overflow-x-hidden border-t flex flex-col bg-gray-50">
    <main class="w-full flex-grow p-6">
      <h1 class="text-3xl text-black pb-6 font-bold">Запросы в поддержку</h1>

      <!-- Фильтры -->
      <Filters
          v-model:filters="filters"
          :schema="schema"
          @apply="applyFilters"
          @reset="resetFilters"
          class="mb-6"
      />

      <!-- Список тикетов -->
      <div class="space-y-4 mb-6">
        <!-- Состояние загрузки (если есть в вашем store) -->
        <div v-if="ticketStore.loading?.value" class="text-center py-10 text-gray-500 italic">
          Загрузка тикетов...
        </div>

        <template v-else>
          <div
              v-for="ticket in ticketStore.ticketList.value"
              :key="ticket.id"
              class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all"
          >
            <div class="flex justify-between items-start mb-4">
              <div class="flex items-center space-x-3">
                <span class="text-sm font-bold text-gray-400">#{{ ticket.id }}</span>
                <span
                    :class="[
                      'px-3 py-1 text-xs font-semibold rounded-full',
                      ticket.status == 1 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                    ]"
                >
                  {{ ticket.status == 1 ? 'Ожидает ответа' : 'Отвечен' }}
                </span>
              </div>
              <span class="text-xs text-gray-400 font-mono">{{ formatDate(ticket.createdAt) }}</span>
            </div>

            <!-- Текст вопроса -->
            <h2 class="text-xl font-semibold text-gray-800 mb-3 leading-snug">
              {{ ticket.text || 'Без текста вопроса' }}
            </h2>

            <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
              <div class="text-sm text-gray-600">
                Автор: <span class="font-bold text-gray-800">{{ ticket.author }}</span>
              </div>

              <div class="flex items-center space-x-4">
                <router-link
                    :to="`/admin/ticket/${ticket.id}`"
                    class="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center"
                >
                  Открыть чат
                  <span class="ml-1">→</span>
                </router-link>

                <button
                    @click="handleDelete(ticket.id)"
                    class="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>

          <!-- Если список пуст -->
          <div v-if="!ticketStore.ticketList.value?.length" class="text-center py-20 bg-white rounded-xl border-2 border-dashed">
            <p class="text-gray-400 font-medium">Тикетов не найдено</p>
          </div>
        </template>
      </div>

      <!-- Пагинация -->
      <div class="flex justify-center mt-8">
        <BasePagination
            :current-page="ticketStore.currentPage.value"
            :total-pages="ticketStore.totalPages.value"
            @next="onNext"
            @prev="onPrev"
            @go="goToPage"
        />
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Дополнительные стили если нужны */
</style>