<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative">
      <!-- Кнопка закрытия -->
      <button
          @click="$emit('close')"
          class="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
      >
        ×
      </button>

      <h2 class="text-2xl font-semibold mb-6 text-center">Вход партнёра</h2>

      <form @submit.prevent="login">
        <div class="mb-4">
          <label for="login" class="block text-sm font-medium text-gray-700 mb-1">Логин или Email</label>
          <input
              id="login"
              v-model="form.login"
              type="text"
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
          <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <p v-if="errorMessage" class="text-red-500 text-sm mb-3">{{ errorMessage }}</p>

        <button
            type="submit"
            class="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200"
            :disabled="loading"
        >
          {{ loading ? "Вход..." : "Войти" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { usePartnerStore } from "../store/client/partner.store";
import { useRouter } from "vue-router";

const emit = defineEmits(["close"]);

const partnerStore = usePartnerStore();
const router = useRouter();
const form = ref({
  login: "",
  password: "",
});

const loading = ref(false);
const errorMessage = ref("");

const login = async () => {
  loading.value = true;
  errorMessage.value = "";

  try {
    // Вызываем метод из Pinia store
    await partnerStore.login(form.value.login, form.value.password);
    emit("close");
    router.push('/partner/profile');
  } catch (error: any) {
    errorMessage.value = error.response?.data?.error || "Ошибка входа";
  } finally {
    loading.value = false;
  }
};
</script>