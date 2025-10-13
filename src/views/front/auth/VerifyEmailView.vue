<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const route = useRoute();
const router = useRouter();

onMounted(() => {
  const backendUrl = route.query.backend_url as string;
  if (backendUrl) {
    window.location.href = decodeURIComponent(backendUrl);
  } else {
    router.replace('/');
  }
});
</script>

<template>
  <p>Redirecting...</p>
</template>