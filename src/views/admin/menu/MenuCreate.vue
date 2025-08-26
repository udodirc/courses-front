<script setup lang="ts">
import {onMounted, ref} from 'vue';
import { useRouter } from 'vue-router';
import { useMenuStore } from '../../../store/admin/menu/menu.store';
import { useFetchList } from '../../../composables/useFetchList';
import { useErrorHandler } from '../../../composables/useErrorHandler';

import BaseForm from '../../../components/ui/BaseForm.vue';
import BaseInput from '../../../components/ui/BaseInput.vue';
import FormErrors from '../../../components/ui/FormErrors.vue';

const router = useRouter();
const menuStore = useMenuStore();
const { items: menus, fetchItems: fetchMenus } = useFetchList<{ id: number; name: string }>('/admin/menu');
const { error, setError } = useErrorHandler();

const name = ref('');
const selectedMenuId = ref<number | null>(null);
const loading = ref(false);

async function save() {
  error.value = '';
  loading.value = true;

  try {
    await menuStore.createItem({
      parent_id: selectedMenuId.value,
      name: name.value,
    });
    router.push('/admin/menus');
  } catch (e: any) {
    setError(e);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchMenus();
});
</script>

<template>
  <div>
    <h2 class="text-2xl mb-4">Создание меню</h2>

    <FormErrors :error="error" />

    <BaseForm :loading="loading" :onSubmit="save">
      <label class="block mb-4">
        <span class="block font-medium mb-1">Меню</span>
        <select v-model="selectedMenuId" class="w-full border rounded px-3 py-2">
          <option :value="null">— Выберите меню —</option>
          <option v-for="menu in menus" :key="menu.id" :value="menu.id">
            {{ menu.name }}
          </option>
        </select>
      </label>
      <BaseInput v-model="name" label="Имя" required />
    </BaseForm>
  </div>
</template>

<style scoped></style>