<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMenuStore } from '../../../store/admin/menu/menu.store';
import { useErrorHandler } from '../../../composables/useErrorHandler';
import { storeToRefs } from 'pinia';
import api from '../../../api';

import BaseInput from '../../../components/ui/BaseInput.vue';
import BaseForm from '../../../components/ui/BaseForm.vue';
import FormErrors from '../../../components/ui/FormErrors.vue';

const route = useRoute();
const router = useRouter();
const menuId = Number(route.params.id);

const name = ref('');
const loading = ref(false);
const { error, setError } = useErrorHandler();

const menuStore = useMenuStore();
const { currentMenu } = storeToRefs(menuStore);

watch(currentMenu, (val) => {
  if (val) {
    name.value = val.name;
  }
});

async function save() {
  loading.value = true;
  error.value = '';

  try {
    await api.put(`/admin/menu/${menuId}`, {
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
  menuStore.fetchItem(menuId);
});
</script>

<template>
  <div>
    <h2 class="text-2xl mb-4">Редактировать меню</h2>
    <FormErrors :error="error" />
    <BaseForm :loading="loading" :onSubmit="save">
      <BaseInput v-model="name" label="Имя" required />
    </BaseForm>
  </div>
</template>