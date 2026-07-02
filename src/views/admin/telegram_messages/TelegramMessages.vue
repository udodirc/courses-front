<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useTelegramMessagesStoreWithGetters } from '../../../store/admin/telegram_messages/telegram_messages.store.ts';
import ItemList from '../../../components/ItemList.vue';
import Filters from '../../../components/Filters.vue';
import { useFilterList } from '../../../composables/useFilterList';
import { usePagination } from '../../../composables/usePagination';
import type { FilterSchemaItem } from '../../../types/Filters.ts';

const telegramMessagesStore = useTelegramMessagesStoreWithGetters();

// схема фильтров
const schema = ref<FilterSchemaItem[]>([
  { field: 'created_from', label: 'Создано с', type: 'date', col: 'left' },
  { field: 'created_to', label: 'Создано по', type: 'date', col: 'middle' }
]);

// composables
const { filters, applyFilters, resetFilters, toFilterObject } = useFilterList(telegramMessagesStore, schema.value);
const { onNext, onPrev, goToPage } = usePagination(telegramMessagesStore, filters, toFilterObject);

onMounted(async () => {
  applyFilters();
});

// колонки для таблицы
const columns = [
  { label: 'ID', field: 'id' },
  { label: 'Название', field: 'name' },
  { label: 'Время', field: 'interval' }
];
</script>
<template>
  <div class="w-full h-screen overflow-x-hidden border-t flex flex-col">
    <main class="w-full flex-grow p-6">
      <h1 class="text-3xl text-black pb-6">Сообщения</h1>

      <Filters
          v-model:filters="filters"
          :schema="schema"
          @apply="applyFilters"
          @reset="resetFilters"
      />

      <router-link
          to="/admin/telegram-messages/create"
          class="inline-block mb-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
      >
        Создать
      </router-link>

      <ItemList
          :key="telegramMessagesStore.currentPage.value"
          :items="telegramMessagesStore.telegramMessagesList.value"
          :columns="columns"
          :basePath="'/admin/telegram-messages'"
          :deleteItem="telegramMessagesStore.deleteItem"
          :currentPage="telegramMessagesStore.currentPage.value"
          :totalPages="telegramMessagesStore.totalPages.value"
          @next="onNext"
          @prev="onPrev"
          @go="goToPage"
          @refresh="applyFilters"
      />
    </main>
  </div>
</template>