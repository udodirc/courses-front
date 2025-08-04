<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useRoles } from '../../../composables/useRoles.ts';
import { useUsers } from '../../../composables/useUsers';
import { useErrorHandler } from '../../../composables/useErrorHandler';
import api from '../../../api';

const router = useRouter();
const loading = ref(false);

const selectedUserId = ref<number | ''>('');
const selectedRoleId = ref<number | ''>('');

const { roles, fetchRoles } = useRoles();
const { users, fetchUsers } = useUsers();
const { error, setError } = useErrorHandler();

async function save() {
  loading.value = true;
  try {
    await api.post('/admin/roles/assign', {
      id: selectedUserId.value,
      role: selectedRoleId.value,
    });
    router.push('/admin/users');
  } catch (e) {
    setError(e);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchRoles();
  fetchUsers();
});
</script>

<template>
  <form @submit.prevent="save" class="space-y-4">
    <!-- Ошибки -->
    <div v-if="error && typeof error === 'object'" class="text-red-600 text-sm">
      <div v-for="(messages, field) in error" :key="field">
        {{ Array.isArray(messages) ? messages[0] : messages }}
      </div>
    </div>

    <!-- Пользователь -->
    <select v-model="selectedUserId" required>
      <option disabled value="">Выберите пользователя</option>
      <option v-for="user in users" :key="user.id" :value="user.id">
        {{ user.name }}
      </option>
    </select>

    <!-- Роль -->
    <select v-model="selectedRoleId" required>
      <option disabled value="">Выберите роль</option>
      <option v-for="role in roles" :key="role.id" :value="role.name">
        {{ role.name }}
      </option>
    </select>

    <button type="submit" :disabled="loading">
      {{ loading ? 'Сохраняю...' : 'Сохранить' }}
    </button>
  </form>
</template>