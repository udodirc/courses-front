<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../../../api';

const route = useRoute();
const router = useRouter();
const roleId = Number(route.params.id);

const name = ref('');
const loading = ref(false);
const error = ref('');

async function fetchUser() {
  try {
    const response = await api.get(`/admin/roles/${roleId}`);
    name.value = response.data.data.name;
  } catch (e) {
    error.value = 'Не удалось загрузить роль';
  }
}

async function save() {
  loading.value = true;
  error.value = '';
  try {
    await api.put(`/admin/roles/${roleId}`, {
      name: name.value,
    });
    router.push('/admin/roles');
  } catch (e) {
    error.value = 'Ошибка при сохранении';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchUser();
});
</script>

<template>
  <div>
    <h2>Редактировать пользователя</h2>

    <form @submit.prevent="save">

      <label>
        Имя
        <input v-model="name" required />
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