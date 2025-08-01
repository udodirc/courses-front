<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../../store/admin/user/user.store';
import { useRoles } from '../../../composables/useRoles';
import { useErrorHandler } from '../../../composables/useErrorHandler';

const router = useRouter();
const userStore = useUserStore();
const { roles, fetchRoles } = useRoles();
const { error, setError } = useErrorHandler();

const name = ref('');
const email = ref('');
const password = ref('');
const selectedRoleId = ref<number | null>(null);
const loading = ref(false);

const selectedRoleName = computed(() => {
  const role = roles.value.find(r => r.id === selectedRoleId.value);
  return role?.name || null;
});

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
    setError(e);
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

    <!-- Ошибки -->
    <ul v-if="error && typeof error === 'object'" class="text-red-600 mb-4">
      <li v-for="(messages, field) in error" :key="field">
        {{ messages[0] }}
      </li>
    </ul>

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

      <label>
        Имя
        <input v-model="name" required />
      </label>

      <label>
        Email
        <input v-model="email" type="email" required />
      </label>

      <label>
        Пароль
        <input v-model="password" type="password" required />
      </label>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Создаю...' : 'Создать' }}
      </button>
    </form>
  </div>
</template>

<style scoped>

</style>