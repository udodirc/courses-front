<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../../store/admin/user/user.store';
import api from '../../../api';

type ErrorType = string | Record<string, string[]>;

const name = ref('');
const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref<ErrorType>('');
const roles = ref<{ id: number; name: string }[]>([]);
const selectedRoleId = ref<number | null>(null);
const selectedRoleName = computed(() => {
  const role = roles.value.find((r) => r.id === selectedRoleId.value);
  return role?.name || null;
});

const userStore = useUserStore();
const router = useRouter();

async function fetchRoles() {
  try {
    const response = await api.get('/admin/roles');
    roles.value = response.data.data;
  } catch (e) {
    console.error('Ошибка загрузки ролей');
  }
}

async function submitForm() {
  error.value = '';
  loading.value = true;
  try {
    await userStore.createItem({
      name: name.value,
      email: email.value,
      password: password.value,
      role: selectedRoleName.value,
    });
    router.push('/admin/users');
  } catch (e: any) {
    error.value = userStore.error;
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchRoles();
});
</script>

<template>
  <div>
    <h2>Создание пользователя</h2>

    <!-- Объект ошибок от валидации -->
    <ul v-if="error && typeof error === 'object'" class="text-red-600 mb-4">
      <li v-for="(messages, field) in error" :key="field">
        {{ messages[0] }}
      </li>
    </ul>

    <!-- Строковая ошибка -->
    <p v-else-if="error" class="text-red-600 mb-4">{{ error }}</p>

    <form @submit.prevent="submitForm">
      <label>
        Роль
        <select v-model="selectedRoleId" required>
          <option disabled value="">Выберите роль</option>
          <option v-for="role in roles" :key="role.id" :value="role.id">
            {{ role.name }}
          </option>
        </select>
      </label>

      <div>
        <label>Имя:</label>
        <input v-model="name" required />
      </div>

      <div>
        <label>Email:</label>
        <input v-model="email" type="email" required />
      </div>

      <div>
        <label>Пароль:</label>
        <input v-model="password" type="password" required />
      </div>

      <button type="submit" :disabled="loading">Создать</button>
    </form>
  </div>
</template>

<style scoped>

</style>