<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useMenuStore, useMenuStoreWithGetters } from '../../../store/admin/menu/menu.store';
import { useErrorHandler } from '../../../composables/useErrorHandler';
import api from '../../../api';

import BaseForm from '../../../components/ui/BaseForm.vue';
import BaseInput from '../../../components/ui/BaseInput.vue';
import BaseToggle from '../../../components/ui/BaseToggle.vue';
import FormErrors from '../../../components/ui/FormErrors.vue';

const route = useRoute();
const router = useRouter();
const menuId = Number(route.params.id);

// Используем store с геттерами
const { currentMenu } = useMenuStoreWithGetters();
const { error, setError } = useErrorHandler();
const loading = ref(false);

// реактивная модель формы
const formModel = reactive({
  name: '',
  url: '',
  status: 1,
  parent_id: null as number | null,
});

// при изменении currentMenu заполняем форму
watch(currentMenu, (val) => {
  if (!val) return;
  Object.assign(formModel, {
    name: val.name,
    url: val.url,
    status: val.status ?? 1,
    parent_id: val.parent_id ?? null,
  });
});

// сохранение формы
const save = async () => {
  loading.value = true;
  error.value = null;

  try {
    await api.put(`/admin/menu/${menuId}`, { ...formModel });
    router.push('/admin/menus');
  } catch (e: any) {
    setError(e);
  } finally {
    loading.value = false;
  }
};

// загрузка данных меню при монтировании
onMounted(() => {
  if (!isNaN(menuId)) {
    useMenuStore().fetchItem(menuId);
  } else {
    error.value = { general: ['Некорректный ID меню'] };
  }
});
</script>

<template>
  <BaseForm label="Редактировать меню" :loading="loading" :onSubmit="save">
    <FormErrors :error="error" />

    <BaseInput v-model="formModel.name" label="Имя" required class="mb-4" />
    <BaseInput v-model="formModel.url" label="URL" class="mb-4" />

    <BaseToggle
        v-model="formModel.status"
        label="Статус"
        :activeLabel="'Активный'"
        :inactiveLabel="'Неактивный'"
        class="mb-4"
    />
  </BaseForm>
</template>