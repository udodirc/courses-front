<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ItemList from '../../../components/ItemList.vue';
import Filters from '../../../components/Filters.vue';
import { useFilterList } from '../../../composables/useFilterList';
import { usePagination } from '../../../composables/usePagination';
import type { FilterSchemaItem } from '../../../types/Filters.ts';
import type { TelegramSubscribe } from '../../../types/TelegramSubscribe.ts';
import { useTelegramSubscribeStoreWithGetters } from "../../../store/admin/telegram_subscriber/telegram_subscribe.store.ts";

const telegramSubscribeStore = useTelegramSubscribeStoreWithGetters();

// схема фильтров
const schema = ref<FilterSchemaItem[]>([
  { field: 'chat_id', label: 'Chat id', type: 'text', col: 'left' },
  { field: 'username', label: 'Username', type: 'text', col: 'middle' },
  { field: 'created_from', label: 'Создано с', type: 'date', col: 'left' },
  { field: 'created_to', label: 'Создано по', type: 'date', col: 'middle' },
]);

// composables
const { filters, applyFilters, resetFilters, toFilterObject } = useFilterList(telegramSubscribeStore, schema.value);
const { onNext, onPrev, goToPage } = usePagination(telegramSubscribeStore, filters, toFilterObject);

// загрузка списка
onMounted(() => {
  applyFilters();
});

// колонки для таблицы
const columns: { label: string; field: keyof TelegramSubscribe | string }[] = [
  { label: 'ID', field: 'id' },
  { label: 'Chat id', field: 'chat_id' },
  { label: 'Username', field: 'username' },
];
</script>

<template>
  <div class="w-full h-screen overflow-x-hidden border-t flex flex-col">
    <main class="w-full flex-grow p-6">
      <h1 class="text-3xl text-black pb-6">Подписчики телеграм бота</h1>

      <!-- Фильтры -->
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
      />
    </main>
  </div>
</template>