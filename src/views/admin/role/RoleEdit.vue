<script setup lang="ts">
import {ref, onMounted, watch} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRoleStore } from '../../../store/admin/role/role.store.ts';
import { useErrorHandler } from '../../../composables/useErrorHandler';
import api from '../../../api';
import {storeToRefs} from "pinia";

const route = useRoute();
const router = useRouter();
const roleId = Number(route.params.id);

const name = ref('');
const loading = ref(false);
const { error, setError } = useErrorHandler();

const roleStore = useRoleStore();
const { currentRole } = storeToRefs(roleStore);

watch(currentRole, (val) => {
  if (val) {
    name.value = val.name;
  }
});

async function save() {
  loading.value = true;
  error.value = '';

  try {
    await api.put(`/admin/roles/${roleId}`, {
      name: name.value,
    });
    router.push('/admin/roles');
  } catch (e: any) {
    setError(e);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  roleStore.fetchItem(roleId);
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
        Имя
        <input v-model="name" required />
      </label>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Сохраняю...' : 'Сохранить' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
</style>