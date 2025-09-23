<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useFetchList } from '../../../composables/useFetchList';
import { useEntitySave } from '../../../composables/useEntitySave';
import BaseForm from '../../../components/ui/BaseForm.vue';
import BaseInput from '../../../components/ui/BaseInput.vue';
import BaseSelect from '../../../components/ui/BaseSelect.vue';
import FormErrors from '../../../components/ui/FormErrors.vue';

const router = useRouter();

// загрузка меню для селекта родителя
const { items: menus, fetchItems: fetchMenus } = useFetchList<{ id: number; name: string }>('/admin/menu');

// модель формы
const formModel = ref({
  name: '',
  parent_id: null as number | null,
  url: ''
});

// универсальное сохранение
const { saveEntity, loading, error } = useEntitySave<typeof formModel.value>();

// сохранение
async function save() {
  await saveEntity('/admin/menu', {
    name: formModel.value.name,
    parent_id: formModel.value.parent_id,
    url: formModel.value.url,
  });
  router.push('/admin/menus');
}

// загрузка меню
onMounted(() => {
  fetchMenus();
});
</script>

<template>
  <BaseForm label="Создание меню" :loading="loading" :onSubmit="save">
    <FormErrors :error="error" />
    <BaseSelect
        v-model="formModel.parent_id"
        label="Родительское меню"
        :options="menus.map(menu => ({ value: menu.id, label: menu.name }))"
    />
    <BaseInput v-model="formModel.name" label="Имя" required />
    <BaseInput v-model="formModel.url" label="URL"/>
  </BaseForm>
</template>