<script setup lang="ts">
defineProps<{
  currentPage: number;
  totalPages: number;
}>();
defineEmits(['prev', 'next']);
</script>

<template>
  <div class="pagination">
    <button @click="$emit('prev')" :disabled="currentPage === 1">← Назад</button>
    <span>Страница {{ currentPage }} из {{ totalPages }}</span>
    <button @click="$emit('next')" :disabled="currentPage === totalPages">Вперёд →</button>
  </div>
</template>

<style scoped>
</style>