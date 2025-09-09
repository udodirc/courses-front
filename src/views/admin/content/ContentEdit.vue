<script setup lang="ts">
import { ref, onMounted, watch, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useContentStore } from '../../../store/admin/content/content.store';
import { useErrorHandler } from '../../../composables/useErrorHandler';
import { storeToRefs } from 'pinia';

import BaseForm from '../../../components/ui/BaseForm.vue';
import BaseTextArea from '../../../components/ui/BaseTextArea.vue';
import FormErrors from '../../../components/ui/FormErrors.vue';
import api from "../../../api";
import BaseToggle from "../../../components/ui/BaseToggle.vue";
import BaseInput from "../../../components/ui/BaseInput.vue";

const route = useRoute();
const router = useRouter();
const contentId = Number(route.params.id);

const contentStore = useContentStore();
const { currentContent } = storeToRefs(contentStore);
const { error, setError } = useErrorHandler();

const loading = ref(false);
const formModel = reactive({
  content: '',
  status: 1,
  title: '',
  meta_description: '',
  meta_keywords: '',
  og_title: '',
  og_description: '',
  og_keywords: '',
  og_image: '',
  og_type: 'og_type',
  og_url: '',
  canonical_url: '',
  robots: 'index, follow',
});

watch(currentContent, (val) => {
  if (val) {
    formModel.content = val.content;
    formModel.status = val.status ?? 1;
    formModel.title = val.title;
    formModel.meta_description = val.meta_description;
    formModel.meta_keywords = val.meta_keywords;
    formModel.og_title = val.og_title;
    formModel.og_description = val.og_description;
    formModel.og_image = val.og_image;
    formModel.og_keywords = val.og_keywords;
    formModel.og_type = val.og_type;
    formModel.og_url = val.og_url;
    formModel.canonical_url = val.canonical_url;
    formModel.robots = val.robots;
  }
});

async function save() {
  loading.value = true;
  error.value = null;

  try {
    await api.put(`/admin/content/${contentId}`, {
      content: formModel.content,
      menu_id: currentContent.value?.menu_id,
      status: formModel.status,
      title: formModel.title,
      meta_description: formModel.meta_description,
      meta_keywords: formModel.meta_keywords,
      og_title: formModel.og_title,
      og_description: formModel.og_description,
      og_keywords: formModel.og_keywords,
      og_image: formModel.og_image,
      og_type: formModel.og_type,
      og_url: formModel.og_url,
      canonical_url: formModel.canonical_url,
      robots: formModel.robots,
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

    <BaseToggle
        v-model="formModel.status"
        label="Статус"
        :activeLabel="'Активный'"
        :inactiveLabel="'Неактивный'"
    />

    <BaseInput v-model="formModel.title" label="Seo title"/>
    <BaseInput v-model="formModel.meta_description" label="Meta description"/>
    <BaseInput v-model="formModel.meta_keywords" label="Meta keywords"/>
    <BaseInput v-model="formModel.og_title" label="Og title"/>
    <BaseInput v-model="formModel.og_description" label="Og description"/>
    <BaseInput v-model="formModel.og_image" label="Og image"/>
    <BaseInput v-model="formModel.og_type" label="Og type"/>
    <BaseInput v-model="formModel.canonical_url" label="Canonical url"/>
    <BaseInput v-model="formModel.robots" label="Robots"/>
  </BaseForm>
</template>