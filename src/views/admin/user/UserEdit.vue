<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useRoles } from '../../../composables/useRoles';
import { useUserStore } from '../../../store/admin/user/user.store.ts';
import { useErrorHandler } from '../../../composables/useErrorHandler';
import api from '../../../api';

const route = useRoute();
const router = useRouter();
const userId = Number(route.params.id);

const name = ref('');
const email = ref('');
const password = ref('');
const selectedRoleId = ref<number | null>(null);

const { roles, fetchRoles } = useRoles();
const { error, setError } = useErrorHandler();

const userStore = useUserStore();
const { currentUser } = storeToRefs(userStore);

const selectedRoleName = computed(() => {
  const role = roles.value.find(r => r.id === selectedRoleId.value);
  return role?.name || null;
});

watch(currentUser, (val) => {
  if (val) {
    name.value = val.name;
    email.value = val.email;
    selectedRoleId.value = val.role?.id ?? null;
  }
});

async function save() {
  userStore.loading = true;
  userStore.error = '';

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
    userStore.loading = false;
  }
}

onMounted(() => {
  fetchRoles();
  userStore.fetchItem(userId);
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