<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import { useContentStore } from '../../../store/admin/content/content.store';
import { useErrorHandler } from '../../../composables/useErrorHandler';

import BaseForm from '../../../components/ui/BaseForm.vue';
import BaseTextArea from '../../../components/ui/BaseTextArea.vue';
import BaseInput from '../../../components/ui/BaseInput.vue';
import BaseToggle from '../../../components/ui/BaseToggle.vue';
import FormErrors from '../../../components/ui/FormErrors.vue';
import api from '../../../api';

const route = useRoute();
const router = useRouter();
const contentId = Number(route.params.id);

const contentStore = useContentStore();
const { currentContent } = storeToRefs(contentStore);
const { error, setError } = useErrorHandler();

const loading = ref(false);

// реактивная модель формы
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
  og_type: '',
  og_url: '',
  canonical_url: '',
  robots: 'index, follow',
});

// при загрузке контента заполняем модель
watch(currentContent, (val) => {
  if (!val) return;
  Object.assign(formModel, {
    content: val.content,
    status: val.status ?? 1,
    title: val.title,
    meta_description: val.meta_description,
    meta_keywords: val.meta_keywords,
    og_title: val.og_title,
    og_description: val.og_description,
    og_keywords: val.og_keywords,
    og_image: val.og_image,
    og_type: val.og_type,
    og_url: val.og_url,
    canonical_url: val.canonical_url,
    robots: val.robots,
  });
});

// сохранение
const save = async () => {
  loading.value = true;
  error.value = null;

  try {
    await api.put(`/admin/content/${contentId}`, {
      ...formModel,
      menu_id: currentContent.value?.menu_id,
    });
    router.push('/admin/content');
  } catch (e: any) {
    setError(e);
  } finally {
    loading.value = false;
  }
};

// загрузка контента при монтировании
onMounted(() => contentStore.fetchItem(contentId));
</script>

<template>
  <BaseForm label="Редактировать контент" :loading="loading" :onSubmit="save">
    <FormErrors :error="error" />

    <!-- Меню -->
    <div class="mb-4">
      <label class="font-semibold">Меню:</label>
      <p>{{ currentContent?.menu_name }}</p>
    </div>

    <!-- Основной контент -->
    <BaseTextArea
        v-model="formModel.content"
        label="Контент"
        required
        class="mb-4"
    />

    <!-- Статус -->
    <BaseToggle
        v-model="formModel.status"
        label="Статус"
        :activeLabel="'Активный'"
        :inactiveLabel="'Неактивный'"
        class="mb-4"
    />

    <!-- SEO / Open Graph -->
    <BaseInput v-model="formModel.title" label="SEO title" class="mb-2"/>
    <BaseInput v-model="formModel.meta_description" label="Meta description" class="mb-2"/>
    <BaseInput v-model="formModel.meta_keywords" label="Meta keywords" class="mb-2"/>
    <BaseInput v-model="formModel.og_title" label="Og title" class="mb-2"/>
    <BaseInput v-model="formModel.og_description" label="Og description" class="mb-2"/>
    <BaseInput v-model="formModel.og_keywords" label="Og keywords" class="mb-2"/>
    <BaseInput v-model="formModel.og_image" label="Og image" class="mb-2"/>
    <BaseInput v-model="formModel.og_type" label="Og type" class="mb-2"/>
    <BaseInput v-model="formModel.og_url" label="Og url" class="mb-2"/>
    <BaseInput v-model="formModel.canonical_url" label="Canonical url" class="mb-2"/>
    <BaseInput v-model="formModel.robots" label="Robots" class="mb-2"/>
  </BaseForm>
</template>