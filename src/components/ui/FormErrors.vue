<!-- components/ui/FormErrors.vue -->
<template>
  <ul v-if="error && typeof error === 'object'" class="text-red-600 mb-4">
    <li v-for="(messages, field) in error" :key="field">{{ messages[0] }}</li>
  </ul>
</template>

<script setup lang="ts">
defineProps<{
  error: string | Record<string, string[]> | null;
}>();
</script>