<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../../store/admin/user/user.store';
import api from '../../../api';

const name = ref('');
const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');
const roles = ref<{ id: number; name: string }[]>([]);
const selectedRoleId = ref<number | null>(null);
const selectedRoleName = computed(() => {
  const role = roles.value.find(r => r.id === selectedRoleId.value);
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
    await userStore.createUser({
      name: name.value,
      email: email.value,
      password: password.value,
      role: selectedRoleName.value
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

    <p v-if="error" class="error">{{ error }}</p>

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
form {
  max-width: 400px;
  margin-top: 20px;
}

label {
  display: block;
  margin-bottom: 10px;
}

input {
  width: 100%;
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  margin-top: 10px;
  padding: 10px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

select {
  width: 100%;
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 4px;
}

.error {
  color: red;
  margin-top: 12px;
}
</style>