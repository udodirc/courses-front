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
import BaseToggle from "../../../components/ui/BaseToggle.vue";

const route = useRoute();
const router = useRouter();
const menuId = Number(route.params.id);

const loading = ref(false);
const { error, setError } = useErrorHandler();

const menuStore = useMenuStore();
const { currentMenu } = storeToRefs(menuStore);

// единый formModel
const formModel = ref({
  name: '',
  status: 1,
});

watch(currentMenu, (val) => {
  if (val) {
    formModel.value.name = val.name;
    formModel.value.status = val.status ?? 1;
  }
});

async function save() {
  loading.value = true;
  error.value = null;

  try {
    await api.put(`/admin/menu/${menuId}`, {
      name: formModel.value.name,
      status: formModel.value.status,
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
  <BaseForm label="Редактировать меню" :loading="loading" :onSubmit="save">
    <FormErrors :error="error" />
    <BaseInput v-model="formModel.name" label="Имя" required />
    <BaseToggle
        v-model="formModel.status"
        label="Статус"
        :activeLabel="'Активный'"
        :inactiveLabel="'Неактивный'"
    />
  </BaseForm>
</template>