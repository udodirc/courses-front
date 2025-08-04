<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useRoles } from '../../../composables/useRoles';
import api from '../../../api';

const error = ref<Record<string, string[]> | string>('');
const loading = ref(false);
const router = useRouter();

const { roles, fetchRoles } = useRoles();
const permissions = ref<{ id: number; name: string }[]>([]);

const selectedRoleId = ref<number | ''>('');
const selectedPermissionNames = ref<string[]>([]); // Имя, а не id

const selectedRoleName = computed(() => {
  const role = roles.value.find(r => r.id === selectedRoleId.value);
  return role?.name || null;
});

async function fetchPermissions() {
  try {
    const response = await api.get('/admin/permissions');
    permissions.value = response.data.data;
  } catch (e) {
    console.error('Ошибка загрузки прав');
  }
}

async function save() {
  loading.value = true;
  error.value = '';

  try {
    await api.post('/admin/roles/permissions', {
      role: selectedRoleName.value,
      permissions: selectedPermissionNames.value.map(name => ({ name })),
    });

    router.push('/admin/roles');
  } catch (e: any) {
    const errors = e?.response?.data?.errors;
    if (errors && typeof errors === 'object') {
      error.value = errors;
    } else {
      error.value = { general: ['Ошибка при сохранении'] };
    }
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchRoles();
  fetchPermissions();
});
</script>

<template>
  <div class="max-w-xl mx-auto p-6 bg-white rounded shadow">
    <h2 class="text-2xl font-semibold mb-6">Назначение прав роли</h2>

    <!-- Ошибки -->
    <div v-if="error && typeof error === 'object'" class="mb-4 text-red-600 text-sm space-y-1">
      <div v-for="(messages, field) in error" :key="field">
        {{ Array.isArray(messages) ? messages[0] : messages }}
      </div>
    </div>

    <form @submit.prevent="save" class="space-y-4">
      <!-- Выбор роли -->
      <div>
        <label for="role" class="block font-semibold mb-1">Роль</label>
        <select
            id="role"
            v-model="selectedRoleId"
            required
            class="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option disabled value="">Выберите роль</option>
          <option v-for="role in roles" :key="role.id" :value="role.id">
            {{ role.name }}
          </option>
        </select>
      </div>

      <!-- Выбор прав (по имени) -->
      <div>
        <label for="permissions" class="block font-semibold mb-1">Права</label>
        <select
            id="permissions"
            multiple
            v-model="selectedPermissionNames"
            class="w-full border border-gray-300 rounded px-3 py-2 h-40"
        >
          <option
              v-for="permission in permissions"
              :key="permission.id"
              :value="permission.name"
          >
            {{ permission.name }}
          </option>
        </select>
        <p class="text-gray-500 text-sm mt-1">
          Удерживайте Ctrl (или Cmd на Mac), чтобы выбрать несколько прав.
        </p>
      </div>

      <!-- Кнопка -->
      <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50"
      >
        {{ loading ? 'Сохранение...' : 'Сохранить' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
/* Дополнительные стили, если нужно */
</style>