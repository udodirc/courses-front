<!-- components/ui/BaseForm.vue -->
<template>
  <form @submit.prevent="onSubmit" class="max-w-lg mx-auto p-4 bg-white rounded shadow">
    <slot />
    <button type="submit" :disabled="loading" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
      {{ loading ? 'Сохраняю...' : 'Сохранить' }}
    </button>
  </form>
</template>

<script setup lang="ts">
defineProps<{
  loading: boolean;
  onSubmit: () => void;
}>();
</script>