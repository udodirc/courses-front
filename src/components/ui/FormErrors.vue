<template>
  <div v-if="error" class="text-red-600 mb-4">
    <p v-if="typeof error === 'string'">{{ error }}</p>
    <ul v-else>
      <li v-for="(messages, field) in error" :key="field">
        {{ messages[0] }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  error: string | Record<string, string[]> | null;
}>();
</script>