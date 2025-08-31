<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useContentStore } from '../../../store/admin/content/content.store';
import { useFetchList } from '../../../composables/useFetchList';
import { useErrorHandler } from '../../../composables/useErrorHandler';
import { storeToRefs } from 'pinia';

import BaseForm from '../../../components/ui/BaseForm.vue';
import BaseTextArea from '../../../components/ui/BaseTextArea.vue';
import BaseSelect from '../../../components/ui/BaseSelect.vue';
import FormErrors from '../../../components/ui/FormErrors.vue';
import api from "@/api";

const route = useRoute();
const router = useRouter();
const contentId = Number(route.params.id);

const contentStore = useContentStore();
const { currentContent } = storeToRefs(contentStore);
const { error, setError } = useErrorHandler();

const loading = ref(false);
const formModel = ref({
  content: '',
  menuId: null as number | null,
  submenuId: null as number | null,
});

// загрузка всех меню и подменю
const { items: menus, fetchItems: fetchMenus } = useFetchList<{ id: number; name: string }>('/admin/menu');
const { items: submenus, fetchItems: fetchSubmenus } = useFetchList<{ id: number; name: string }>('/admin/menu/submenu/0');

// Когда контент загружен, подставляем значения в форму
watch(currentContent, (val) => {
  if (val) {
    formModel.value.content = val.content;
    formModel.value.menuId = val.menu_id;
    // подменю пока не подставляем — загрузим ниже
  }
});

// при выборе меню загружаем подменю
watch(() => formModel.value.menuId, async (menuId) => {
  if (menuId) {
    await fetchSubmenus(`/admin/menu/submenu/${menuId}`);
    formModel.value.submenuId = null;
  } else {
    submenus.value = [];
    formModel.value.submenuId = null;
  }
});

// функция сохранения
async function save() {
  loading.value = true;
  error.value = null;

  try {
    await api.put(`/admin/content/${contentId}`, {
      content: formModel.value.content,
      menu_id: formModel.value.submenuId || formModel.value.menuId,
    });
    router.push('/admin/content');
  } catch (e: any) {
    setError(e);
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await fetchMenus();
  await contentStore.fetchItem(contentId);

  // если у контента есть menu_id, подгружаем подменю
  if (currentContent.value?.menu_id) {
    await fetchSubmenus(`/admin/menu/submenu/${currentContent.value.menu_id}`);
    // если было submenu_id, устанавливаем
    if (currentContent.value.submenu_id) {
      formModel.value.submenuId = currentContent.value.submenu_id;
    }
  }
});
</script>

<template>
  <BaseForm label="Редактировать контент" :loading="loading" :onSubmit="save">
    <FormErrors :error="error" />

    <BaseSelect
        v-model="formModel.menuId"
        label="Меню"
        :options="menus.map(menu => ({ value: menu.id, label: menu.name }))"
        required
    />

    <BaseSelect
        v-if="submenus.length"
        v-model="formModel.submenuId"
        label="Подменю"
        :options="submenus.map(sm => ({ value: sm.id, label: sm.name }))"
    />

    <BaseTextArea
        v-model="formModel.content"
        label="Контент"
        required
    />
  </BaseForm>
</template>