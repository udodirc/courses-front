<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStaticContentStore, useStaticContentStoreWithGetters } from '../../../store/admin/static-content/static-content.store';
import { useErrorHandler } from '../../../composables/useErrorHandler';

import BaseForm from '../../../components/ui/BaseForm.vue';
import BaseTextArea from '../../../components/ui/BaseTextArea.vue';
import BaseInput from '../../../components/ui/BaseInput.vue';
import BaseToggle from '../../../components/ui/BaseToggle.vue';
import FormErrors from '../../../components/ui/FormErrors.vue';
import api from "../../../api";

const route = useRoute();
const router = useRouter();
const contentId = Number(route.params.id);

const staticContentStore = useStaticContentStore();
const { currentStaticContent } = useStaticContentStoreWithGetters();
const { error, setError } = useErrorHandler();

const loading = ref(false);
const formModel = ref({
  name: '',
  content: '',
  status: true,
});

watch(currentStaticContent, (val) => {
  if (val) {
    formModel.value.name = val.name;
    formModel.value.content = val.content;
    formModel.value.status = val.status ?? 1;
  }
});

async function save() {
  loading.value = true;
  error.value = null;

  try {
    await api.put(`/admin/static_content/${contentId}`, {
      name: formModel.value.name,
      content: formModel.value.content,
      status: formModel.value.status,
    });
    router.push('/admin/static-content');
  } catch (e: any) {
    setError(e);
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await staticContentStore.fetchItem(contentId);
});
</script>

<template>
  <BaseForm label="Редактировать контент" :loading="loading" :onSubmit="save">
    <FormErrors :error="error" />

    <BaseInput v-model="formModel.name" label="Имя" required />

    <BaseTextArea
        v-model="formModel.content"
        label="Контент"
        required
    />

    <BaseToggle
        v-model="formModel.status"
        label="Статус"
        :activeLabel="'Активный'"
        :inactiveLabel="'Неактивный'"
    />
  </BaseForm>
</template>