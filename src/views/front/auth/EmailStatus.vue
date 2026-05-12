<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const status = computed(() => route.query.status);

const title = computed(() => {
  switch (status.value) {
    case 'verified':
      return 'Email verified';
    case 'already-verified':
      return 'Already verified';
    default:
      return 'Verification failed';
  }
});

const message = computed(() => {
  switch (status.value) {
    case 'verified':
      return 'Your email has been successfully verified.';
    case 'already-verified':
      return 'Your email was already verified.';
    default:
      return 'The verification link is invalid or expired.';
  }
});

const closeModal = () => {
  router.push('/');
};
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-black/40">
    <div class="bg-white rounded-xl p-6 max-w-md w-full shadow-lg">
      <h1 class="text-2xl font-bold mb-4">
        {{ title }}
      </h1>

      <p class="mb-6">
        {{ message }}
      </p>

      <button
          class="px-4 py-2 bg-black text-white rounded-lg"
          @click="closeModal"
      >
        Continue
      </button>
    </div>
  </div>
</template>