<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const status = computed(() => route.query.status);

const title = computed(() => {
  switch (status.value) {
    case 'verified':
      return 'Почта подтверждена';

    case 'already-verified':
      return 'Почта уже подтверждена';

    default:
      return 'Ошибка';
  }
});

const message = computed(() => {
  switch (status.value) {
    case 'verified':
      return 'Ваш email успешно подтвержден. Теперь вы можете войти в аккаунт.';

    case 'already-verified':
      return 'Этот email уже был подтвержден ранее.';

    default:
      return 'Ссылка подтверждения недействительна или срок её действия истек.';
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
        Продолжить
      </button>
    </div>
  </div>
</template>