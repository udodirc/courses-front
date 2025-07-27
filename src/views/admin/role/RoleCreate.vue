<script setup lang="ts">
import {ref} from 'vue';
import { useRouter } from 'vue-router';
import { useRoleStore } from '../../../store/admin/role/role.store';

const name = ref('');
const loading = ref(false);
const error = ref('');

const roleStore = useRoleStore();
const router = useRouter();

async function submitForm() {
  error.value = '';
  loading.value = true;
  try {
    await roleStore.createRole({
      name: name.value,
    });
    router.push('/admin/roles');
  } catch (e: any) {
    error.value = roleStore.error;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div>
    <h2>Создание роли</h2>

    <p v-if="error" class="text-sm text-red-600 bg-red-50 border border-red-200 p-2 rounded mb-4">
      {{ error }}
    </p>

    <form @submit.prevent="submitForm">

      <div>
        <label>Имя:</label>
        <input v-model="name" required />
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