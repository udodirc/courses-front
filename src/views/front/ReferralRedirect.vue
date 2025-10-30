<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const login = route.params.login as string;

onMounted(async () => {
  await axios.get(`/api/ref/${login}`, { withCredentials: true });
  window.location.href = '/';
});
</script>

<template>
  <div>Переходим по реферальной ссылке…</div>
</template>