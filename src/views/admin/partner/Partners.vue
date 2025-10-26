<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePartnerStoreWithGetters } from '../../../store/admin/partner/partner.store';
import ItemList from '../../../components/ItemList.vue';
import Filters from '../../../components/Filters.vue';
import { useFilterList } from '../../../composables/useFilterList';
import { usePagination } from '../../../composables/usePagination';
import type { FilterSchemaItem } from '../../../types/Filters.ts';
import {useFetchList} from "../../../composables/useFetchList.ts";

const partnerStore = usePartnerStoreWithGetters();
const { items: courses, fetchItems: fetchCourses } = useFetchList<{ id: number; name: string }>('/admin/course');

// схема фильтров
const schema = ref<FilterSchemaItem[]>([
  { field: 'login', label: 'Логин', type: 'text', col: 'left' },
  { field: 'email', label: 'Email', type: 'email', col: 'middle' },
  { field: 'phone', label: 'Телефон', type: 'text', col: 'left' },
  { field: 'status', label: 'Статус', type: 'select', col: 'middle', options: [
      { label: 'Активный', value: 1 },
      { label: 'Неактивный', value: 0 },
    ] },
  { field: 'created_from', label: 'Создано с', type: 'date', col: 'left' },
  { field: 'created_to', label: 'Создано по', type: 'date', col: 'middle' },
]);

const { filters, applyFilters, resetFilters, toFilterObject } = useFilterList(partnerStore, schema.value);
const { onNext, onPrev, goToPage } = usePagination(partnerStore, filters, toFilterObject);

onMounted(async () => {
  await fetchCourses();
  applyFilters();
});

// колонки таблицы
const columns = [
  { label: 'ID', field: 'id' },
  { label: 'Логин', field: 'login' },
  { label: 'Email', field: 'email' },
  { label: 'Телефон', field: 'phone' },
];

const showPaymentModal = ref(false);
const paymentUserId = ref<number | null>(null);

const openPaymentModal = (id: number) => {
  paymentUserId.value = id;
  showPaymentModal.value = true;
};

const closePaymentModal = () => {
  showPaymentModal.value = false;
  paymentUserId.value = null;
};

const confirmPayment = async () => {
  alert(`Оплата пользователя #${paymentUserId.value} успешно выполнена`);
  closePaymentModal();
};
</script>

<template>
  <div class="w-full h-screen overflow-x-hidden border-t flex flex-col">
    <main class="w-full flex-grow p-6">
      <h1 class="text-3xl text-black pb-6">Пользователи</h1>

      <Filters
          v-model:filters="filters"
          :schema="schema"
          @apply="applyFilters"
          @reset="resetFilters"
      />

      <router-link
          to="/admin/partner/create"
          class="inline-block mb-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
      >
        Создать
      </router-link>

      <ItemList
          :key="partnerStore.currentPage.value"
          :items="partnerStore.partnerList.value"
          :columns="columns"
          :basePath="'/admin/partners'"
          :deleteItem="partnerStore.deleteItem"
          :currentPage="partnerStore.currentPage.value"
          :totalPages="partnerStore.totalPages.value"
          @next="onNext"
          @prev="onPrev"
          @go="goToPage"
          @refresh="applyFilters"
          @payment="openPaymentModal"
      />
      <!-- ✅ модалка -->
      <div
          v-if="showPaymentModal"
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-xl p-6 w-[400px] relative">
          <h2 class="text-xl font-bold mb-4">Оплата пользователя #{{ paymentUserId }}</h2>

          <!-- здесь форма или кнопки -->
          <p>Здесь можно добавить форму для оплаты или выбор метода.</p>

          <div class="flex justify-end mt-6">
            <button
                class="px-4 py-2 bg-gray-300 rounded mr-2"
                @click="closePaymentModal"
            >Отмена</button>
            <button
                class="px-4 py-2 bg-green-500 text-white rounded"
                @click="confirmPayment"
            >Оплатить</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>