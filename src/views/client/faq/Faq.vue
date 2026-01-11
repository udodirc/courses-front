<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../../../api';
import BasePagination from '../../../components/BasePagination.vue';

interface Faq {
  id: number;
  question: string;
  answer: string;
  status: boolean;
  createdAt: string;
}

const faqList = ref<Faq[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

// Состояние аккордеона: храним ID открытого вопроса
const activeId = ref<number | null>(null);

const toggleFaq = (id: number) => {
  activeId.value = activeId.value === id ? null : id;
};

const currentPage = ref(1);
const totalPages = ref(1);

const fetchFaq = async (page = 1) => {
  loading.value = true;
  error.value = null;
  try {
    // Убедитесь, что путь совпадает с вашим API (добавьте /admin если нужно)
    const response = await api.get(`/partner/faq?page=${page}`);
    faqList.value = response.data.data;

    currentPage.value = response.data.meta.current_page;
    totalPages.value = response.data.meta.last_page;
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Ошибка загрузки FAQ';
  } finally {
    loading.value = false;
  }
};

onMounted(() => fetchFaq());

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) fetchFaq(page);
};
</script>

<template>
  <main class="max-w-4xl mx-auto py-12 px-6">
    <h1 class="text-3xl font-bold mb-8 text-center text-gray-800">Часто задаваемые вопросы</h1>

    <div v-if="loading" class="text-gray-500 text-center">Загрузка...</div>
    <div v-else-if="error" class="text-red-500 text-center">{{ error }}</div>

    <div v-else>
      <div v-if="faqList.length === 0" class="text-gray-500 text-center">Вопросы не найдены</div>

      <div class="space-y-4">
        <div
            v-for="faq in faqList"
            :key="faq.id"
            class="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm transition-all duration-300"
        >
          <!-- Заголовок аккордеона -->
          <button
              @click="toggleFaq(faq.id)"
              class="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
          >
            <span class="font-medium text-gray-800" :class="{ 'text-blue-600': activeId === faq.id }">
              {{ faq.question }}
            </span>
            <span class="ml-4 transform transition-transform duration-300" :class="{ 'rotate-180': activeId === faq.id }">
              <svg xmlns="www.w3.org" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </button>

          <!-- Контент аккордеона с анимацией -->
          <div
              v-show="activeId === faq.id"
              class="px-5 pb-5 text-gray-600 border-t border-gray-100 bg-gray-50/50"
          >
            <div class="pt-4 leading-relaxed">
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </div>

      <!-- Пагинация -->
      <div v-if="totalPages > 1" class="mt-10 flex justify-center">
        <BasePagination
            :current-page="currentPage"
            :total-pages="totalPages"
            @go="goToPage"
            @prev="() => goToPage(currentPage - 1)"
            @next="() => goToPage(currentPage + 1)"
        />
      </div>
    </div>
  </main>
</template>

<style scoped>
/* Плавное раскрытие (опционально через CSS Transition) */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>