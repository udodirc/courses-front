<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../../../api';
import { computed } from 'vue';

const route = useRoute();
const router = useRouter();
const userId = Number(route.params.id);

const name = ref('');
const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');
const roles = ref<{ id: number; name: string }[]>([]);
const selectedRoleId = ref<number | null>(null);
const roleName = ref<string | null>(null);

const selectedRoleName = computed(() => {
  const role = roles.value.find(r => r.id === selectedRoleId.value);
  return role?.name || null;
});

async function fetchRoles() {
  try {
    const response = await api.get('/admin/roles');
    roles.value = response.data.data;
  } catch (e) {
    console.error('Ошибка загрузки ролей');
  }
}

async function fetchUser() {
  try {
    const response = await api.get(`/admin/users/${userId}`);
    name.value = response.data.data.name;
    email.value = response.data.data.email;
    selectedRoleId.value = response.data.data.role.id ?? null;
    roleName.value = response.data.data.role.name ?? null;
  } catch (e) {
    error.value = 'Не удалось загрузить пользователя';
  }
}

async function save() {
  loading.value = true;
  error.value = '';
  console.log(selectedRoleName.value);
  try {
    await api.put(`/admin/users/${userId}`, {
      name: name.value,
      email: email.value,
      password: password.value,
      role: selectedRoleName.value
    });
    router.push('/admin/users');
  } catch (e) {
    error.value = 'Ошибка при сохранении';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchRoles();
  fetchUser();
});
</script>

<template>
  <div>
    <h2>Редактировать пользователя</h2>

    <form @submit.prevent="save">

      <label>
        Роль
        <select v-model="selectedRoleId" required>
          <option disabled value="">Выберите роль</option>
          <option v-for="role in roles" :key="role.id" :value="role.id">
            {{ role.name }}
          </option>
        </select>
      </label>

      <label>
        Имя
        <input v-model="name" required />
      </label>

      <label>
        Email
        <input v-model="email" required />
      </label>

      <label>
        Password
        <input v-model="password" type="password" />
      </label>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Сохраняю...' : 'Сохранить' }}
      </button>

      <p v-if="error" class="error">{{ error }}</p>
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