<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRoles } from '../../../composables/useRoles';
import { useUser } from '../../../composables/useUser';
import { useErrorHandler } from '../../../composables/useErrorHandler';
import api from '../../../api';

const route = useRoute();
const router = useRouter();
const userId = Number(route.params.id);

const name = ref('');
const email = ref('');
const password = ref('');
const selectedRoleId = ref<number | null>(null);

const loading = ref(false);

const { roles, fetchRoles } = useRoles();
const { error, setError } = useErrorHandler();
const { user, fetchUser } = useUser();

const selectedRoleName = computed(() => {
  const role = roles.value.find(r => r.id === selectedRoleId.value);
  return role?.name || null;
});

// После получения user заполняем форму и устанавливаем роль
watch(user, (val) => {
  if (val) {
    name.value = val.name;
    email.value = val.email;
    selectedRoleId.value = val.role?.id ?? null; // <-- здесь ставим роль
  }
});

async function save() {
  loading.value = true;
  error.value = '';

  try {
    await api.put(`/admin/users/${userId}`, {
      name: name.value,
      email: email.value,
      password: password.value || undefined,
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
  fetchUser();
});
</script>

<template>
  <div>
    <h2>Редактировать пользователя</h2>

    <!-- Вывод ошибок -->
    <ul v-if="error && typeof error === 'object'" class="text-red-600 mb-4">
      <li v-for="(messages, field) in error" :key="field">
        {{ messages[0] }}
      </li>
    </ul>

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
        <input v-model="email" type="email" required />
      </label>

      <label>
        Пароль
        <input v-model="password" type="password" />
      </label>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Сохраняю...' : 'Сохранить' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
</style>