<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useContentStore } from '../../../store/admin/content/content.store';
import { useErrorHandler } from '../../../composables/useErrorHandler';
import { storeToRefs } from 'pinia';

import BaseForm from '../../../components/ui/BaseForm.vue';
import BaseTextArea from '../../../components/ui/BaseTextArea.vue';
import FormErrors from '../../../components/ui/FormErrors.vue';
import api from "../../../api";

const route = useRoute();
const router = useRouter();
const contentId = Number(route.params.id);

const contentStore = useContentStore();
const { currentContent } = storeToRefs(contentStore);
const { error, setError } = useErrorHandler();

const loading = ref(false);
const formModel = ref({
  content: '',
});

watch(currentContent, (val) => {
  if (val) {
    formModel.value.content = val.content;
  }
});

async function save() {
  loading.value = true;
  error.value = null;

  try {
    await api.put(`/admin/content/${contentId}`, {
      content: formModel.value.content,
      menu_id: currentContent.value?.menu_id, // оставляем menu_id как есть
    });
    router.push('/admin/content');
  } catch (e: any) {
    setError(e);
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await contentStore.fetchItem(contentId);
});
</script>

<template>
  <BaseForm label="Редактировать контент" :loading="loading" :onSubmit="save">
    <FormErrors :error="error" />

    <div class="mb-4">
      <label class="font-semibold">Меню:</label>
      <p>{{ currentContent?.menu_name }}</p>
    </div>

    <BaseTextArea
        v-model="formModel.content"
        label="Контент"
        required
    />
  </BaseForm>
</template>