<script setup lang="ts">
import {onMounted, ref} from 'vue';
import { useRouter } from 'vue-router';
import { useMenuStore } from '../../../store/admin/menu/menu.store';
import { useFetchList } from '../../../composables/useFetchList';
import { useErrorHandler } from '../../../composables/useErrorHandler';

import BaseForm from '../../../components/ui/BaseForm.vue';
import BaseInput from '../../../components/ui/BaseInput.vue';
import FormErrors from '../../../components/ui/FormErrors.vue';
import BaseSelect from "../../../components/ui/BaseSelect.vue";

const router = useRouter();
const menuStore = useMenuStore();
const { items: menus, fetchItems: fetchMenus } = useFetchList<{ id: number; name: string }>('/admin/menu');
const { error, setError } = useErrorHandler();

const name = ref('');
const selectedMenuId = ref<number | null>(null);
const loading = ref(false);

async function save() {
  error.value = null;
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
  <BaseForm label="Создание меню" :loading="loading" :onSubmit="save">
    <FormErrors :error="error" />
    <BaseSelect
        v-model="selectedMenuId"
        label="Меню"
        :options="menus.map(menu => ({ value: menu.id, label: menu.name }))"
        required
    />
    <BaseInput v-model="name" label="Имя" required />
  </BaseForm>
</template>