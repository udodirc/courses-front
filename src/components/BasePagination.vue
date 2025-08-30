<script setup lang="ts">
const props = defineProps<{
  currentPage: number;
  totalPages: number;
}>();
const emit = defineEmits(['prev', 'next', 'go']);
</script>

<template>
  <!-- Не показываем, если totalPages <= 1 -->
  <div v-if="totalPages > 1" class="flex items-center justify-center space-x-2 mt-4">
    <!-- Назад -->
    <button
        class="px-3 py-1 rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        @click="$emit('prev')"
        :disabled="currentPage === 1"
    >
      ←
    </button>

    <!-- Номера страниц -->
    <button
        v-for="page in totalPages"
        :key="page"
        @click="$emit('go', page)"
        :class="[
        'px-3 py-1 rounded-lg border',
        page === currentPage
          ? 'bg-gray-800 text-white'
          : 'bg-white hover:bg-gray-100'
      ]"
    >
      {{ page }}
    </button>

    <!-- Вперёд -->
    <button
        class="px-3 py-1 rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        @click="$emit('next')"
        :disabled="currentPage === totalPages"
    >
      →
    </button>
  </div>
</template>