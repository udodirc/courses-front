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

      <h2 class="text-2xl font-semibold mb-6 text-center">{{ activeTabTitle }}</h2>

      <!-- Вкладки -->
      <div class="flex justify-around mb-6">
        <button @click="activeTab='login'" :class="tabClass('login')">Вход</button>
        <button @click="activeTab='register'" :class="tabClass('register')">Регистрация</button>
        <button @click="activeTab='forgot'" :class="tabClass('forgot')">Восстановление</button>
      </div>

      <!-- Вход -->
      <form v-if="activeTab==='login'" @submit.prevent="login">
        <FormErrors :error="errorMessage" />

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Логин или Email</label>
          <input
              type="text"
              v-model="form.login"
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
          <input
              type="password"
              v-model="form.password"
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <button
            type="submit"
            class="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200"
            :disabled="loading"
        >
          {{ loading ? "Вход..." : "Войти" }}
        </button>
      </form>

      <!-- Регистрация -->
      <form v-else-if="activeTab==='register'" @submit.prevent="register">
        <FormErrors :error="errorMessage" />

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Спонсор</label>
          <input
              type="text"
              v-model="form.registerSponsor"
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
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

      <!-- Восстановление пароля -->
      <form v-else @submit.prevent="forgotPassword">
        <FormErrors :error="errorMessage" />

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
              type="email"
              v-model="form.forgotEmail"
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <button
            type="submit"
            class="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200"
            :disabled="loading"
        >
          {{ loading ? "Отправка..." : "Восстановить пароль" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { usePartnerStore } from "../store/client/partner/partner.store.ts";
import { useRouter } from "vue-router";
import FormErrors from '../components/ui/FormErrors.vue';

const emit = defineEmits(["close"]);
const partnerStore = usePartnerStore();
const router = useRouter();

const activeTab = ref<'login'|'register'|'forgot'>('login');
const loading = ref(false);
const errorMessage = ref<string | Record<string,string[]> | null>("");

const form = ref({
  login: "",
  password: "",
  registerSponsor: "",
  registerLogin: "",
  registerEmail: "",
  registerPassword: "",
  forgotEmail: "",
});

const activeTabTitle = computed(() => {
  switch(activeTab.value) {
    case 'login': return 'Вход партнёра';
    case 'register': return 'Регистрация';
    case 'forgot': return 'Восстановление пароля';
  }
});

const tabClass = (tab: string) =>
    activeTab.value === tab ? 'font-semibold border-b-2 border-black' : 'text-gray-500';

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

// === AUTH ===
const login = async () => {
  loading.value = true;
  errorMessage.value = "";

  try {
    // 1. Пытаемся авторизоваться
    await partnerStore.login(form.value.login, form.value.password);

    // 2. Пытаемся получить данные пользователя
    try {
      await partnerStore.fetchUser();

      // ЕСЛИ ВСЕ ОК: переходим в профиль и закрываем окно
      router.push('/partner/profile');
      emit("close");

    } catch (fetchError: any) {
      // ЕСЛИ ОШИБКА (например, почта не подтверждена):
      // Мы ОСТАЕМСЯ в модальном окне и показываем текст
      const errorData = fetchError.response?.data;

      if (errorData?.error === "Email not verified") {
        errorMessage.value = "Почта не подтверждена. Проверьте свой почтовый ящик.";
      } else if (fetchError.response?.status === 403) {
        errorMessage.value = errorData?.message || "Доступ запрещен.";
      } else {
        handleError(fetchError);
      }

      // ВАЖНО: Если мы здесь, мы НЕ вызываем emit("close")
    }

  } catch (loginError: any) {
    // Ошибка самого входа (неверный пароль и т.д.)
    handleError(loginError);
  } finally {
    loading.value = false;
  }
};

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

const forgotPassword = async () => {
  loading.value = true;
  errorMessage.value = "";
  try {
    await partnerStore.resetPassword(form.value.forgotEmail);
    errorMessage.value = "Проверьте почту для восстановления пароля";
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