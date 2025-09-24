<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRoleStore, useRoleStoreWithGetters } from '../../../store/admin/role/role.store';
import { useEntitySave } from '../../../composables/useEntitySave';
import BaseInput from '../../../components/ui/BaseInput.vue';
import BaseForm from '../../../components/ui/BaseForm.vue';
import FormErrors from '../../../components/ui/FormErrors.vue';

const route = useRoute();
const router = useRouter();
const roleId = Number(route.params.id);

const roleStore = useRoleStore();
const { currentRole } = useRoleStoreWithGetters();

// форма
const formModel = ref({
  name: '',
});

// универсальное сохранение
const { saveEntity, loading, error } = useEntitySave<typeof formModel.value>();

// заполняем форму при загрузке роли
watch(currentRole, (val) => {
  if (val) {
    formModel.value.name = val.name;
  }
});

// сохранение
async function save() {
  await saveEntity('/admin/roles', formModel.value, roleId);
  router.push('/admin/roles');
}

onMounted(() => {
  roleStore.fetchItem(roleId);
});
</script>

<template>
  <BaseForm label="Редактировать роль" :loading="loading" :onSubmit="save">
    <FormErrors :error="error" />
    <BaseInput v-model="formModel.name" label="Имя" required />
  </BaseForm>
</template>