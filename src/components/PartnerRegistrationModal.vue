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

      <h2 class="text-2xl font-semibold mb-6 text-center">Регистрация</h2>

      <!-- Регистрация -->
      <form @submit.prevent="register">
        <FormErrors :error="errorMessage" />

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Спонсор</label>
          <span>{{form.registerSponsor}}</span>
          <input type="hidden" v-model="form.registerSponsor" />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Логин</label>
          <input
              type="text"
              v-model="form.registerLogin"
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
              type="email"
              v-model="form.registerEmail"
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
          <input
              type="password"
              v-model="form.registerPassword"
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <button
            type="submit"
            class="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200"
            :disabled="loading"
        >
          {{ loading ? "Регистрация..." : "Зарегистрироваться" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { usePartnerStore } from "../store/client/partner/partner.store.ts";
import { useRouter } from "vue-router";
import FormErrors from '../components/ui/FormErrors.vue';

const emit = defineEmits(["close"]);
const partnerStore = usePartnerStore();
const router = useRouter();
const loading = ref(false);
const errorMessage = ref<string | Record<string,string[]> | null>("");

const form = ref({
  registerSponsor: "",
  registerLogin: "",
  registerEmail: "",
  registerPassword: ""
});

// Универсальная обработка ошибок
const handleError = (e: any) => {
  const data = e.response?.data;
  if (data?.errors) {
    errorMessage.value = data.errors;
  } else if (data?.error) { // Добавили проверку поля error
    errorMessage.value = data.error;
  } else if (data?.message) {
    errorMessage.value = data.message;
  } else {
    errorMessage.value = e.message || "Произошла ошибка";
  }
};

const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(';').shift();
  }

  return null;
};

onMounted(() => {
  const referral = getCookie('referral');

  if (referral) {
    form.value.registerSponsor = referral;
  } else {
    form.value.registerSponsor = "admin";
  }
});

const register = async () => {
  loading.value = true;
  errorMessage.value = "";
  try {
    await partnerStore.register(
        form.value.registerSponsor,
        form.value.registerLogin,
        form.value.registerEmail,
        form.value.registerPassword
    );
    emit("close");
    router.push('/partner/profile');
  } catch (e) {
    handleError(e);
  } finally {
    loading.value = false;
  }
};

</script>

<style scoped>
button {
  transition: all 0.2s;
}
button:hover {
  opacity: 0.85;
}
</style>