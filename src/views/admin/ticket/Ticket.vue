<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useTicketWithGetters } from '../../../store/admin/ticket/ticket.store.ts';
import Filters from '../../../components/Filters.vue';
import { useFilterList } from '../../../composables/useFilterList';
import { usePagination } from '../../../composables/usePagination';
import type { FilterSchemaItem } from '../../../types/Filters.ts';

const ticketStore = useTicketWithGetters();

// схема фильтров
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

// composables
const { filters, applyFilters, resetFilters, toFilterObject } = useFilterList(ticketStore, schema.value);
const { onNext, onPrev, goToPage } = usePagination(ticketStore, filters, toFilterObject);

// загрузка списка
onMounted(() => {
  applyFilters();
});
</script>

<template>
  <div class="w-full h-screen overflow-x-hidden border-t flex flex-col">
    <main class="w-full flex-grow p-6">
      <h1 class="text-3xl text-black pb-6">Запросы</h1>

      <!-- Фильтры -->
      <Filters
          v-model:filters="filters"
          :schema="schema"
          @apply="applyFilters"
          @reset="resetFilters"
      />

      <!-- Список тикетов в стиле новостей -->
      <div class="space-y-4 mb-6">
        <div
            v-for="ticket in ticketStore.ticketList.value"
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
                  :to="`/admin/ticket/${ticket.id}`"
                  class="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Открыть чат →
              </router-link>
              <button
                  @click="ticketStore.deleteItem(ticket.id)"
                  class="text-red-500 hover:text-red-700 text-sm"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Пагинация (вынесена отдельно, так как ItemList больше нет) -->
      <BasePagination
          :current-page="ticketStore.currentPage.value"
          :total-pages="ticketStore.totalPages.value"
          @next="onNext"
          @prev="onPrev"
          @go="goToPage"
      />
    </main>
  </div>
</template>