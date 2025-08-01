<script setup lang="ts">
import {ref} from 'vue';
import { useRouter } from 'vue-router';
import { useRoleStore } from '../../../store/admin/role/role.store';
import { useErrorHandler } from '../../../composables/useErrorHandler';

const router = useRouter();
const roleStore = useRoleStore();
const { error, setError } = useErrorHandler();

const name = ref('');
const loading = ref(false);

async function submitForm() {
  error.value = '';
  loading.value = true;

  try {
    await roleStore.createItem({
      name: name.value
    });
    router.push('/admin/roles');
  } catch (e: any) {
    setError(e);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div>
    <h2>Создание роли</h2>

    <!-- Ошибки -->
    <ul v-if="error && typeof error === 'object'" class="text-red-600 mb-4">
      <li v-for="(messages, field) in error" :key="field">
        {{ messages[0] }}
      </li>
    </ul>

    <p v-else-if="error" class="text-red-600 mb-4">{{ error }}</p>

    <form @submit.prevent="submitForm">

      <div>
        <label>Имя:</label>
        <input v-model="name" required />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Создаю...' : 'Создать' }}
      </button>
    </form>
  </div>
</template>

<style scoped>

</style>