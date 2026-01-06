<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

onMounted(() => {
  const backendUrl = route.query.backend_url as string;
  window.location.href = decodeURIComponent(backendUrl);
});
</script>

<template>
  <p>Redirecting...</p>
</template>