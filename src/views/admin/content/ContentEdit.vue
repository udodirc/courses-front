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
import BaseFileUpload from '../../../components/ui/BaseFileUpload.vue';
import BaseImagePreview from '../../../components/ui/BaseImagePreview.vue';
import FormErrors from '../../../components/ui/FormErrors.vue';
import api from '../../../api';

const route = useRoute();
const router = useRouter();
const contentId = Number(route.params.id);

const contentStore = useContentStore();
const { currentContent } = storeToRefs(contentStore);
const { error, setError } = useErrorHandler();

const loading = ref(false);
const ogFileInputRef = ref<HTMLInputElement | null>(null);

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
  og_image: '' as File | string | null,
  og_type: '',
  og_url: '',
  canonical_url: '',
  robots: 'index, follow',
  imagesDir: '',
  image_og_dir: '',
});

// отдельный ref для превью нового файла
const ogPreview = ref<string>('');

// при загрузке контента заполняем модель
watch(currentContent, (val) => {
  if (!val) return;
  Object.assign(formModel, {
    content: val.content,
    status: val.status ?? 1,
    title: val.title ?? '',
    meta_description: val.meta_description ?? '',
    meta_keywords: val.meta_keywords ?? '',
    og_title: val.og_title ?? '',
    og_description: val.og_description ?? '',
    og_keywords: val.og_keywords ?? '',
    og_image: val.og_image ?? '',
    ogPreview: val.og_image ? `${val.image_og_url}/${val.og_image}` : '',
    og_type: val.og_type ?? '',
    og_url: val.og_url ?? '',
    canonical_url: val.canonical_url ?? '',
    robots: val.robots ?? 'index, follow',
    imagesDir: val.image_dir ?? '',
    image_og_dir: val.image_og_dir ?? '',
  });

  // заполняем превью из API, если есть сохранённая картинка
  if (val.og_image) {
    ogPreview.value = `${val.image_og_url}/${val.og_image}`;
  }
});

// обработка выбора нового файла
const handleOgFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    formModel.og_image = file;
    ogPreview.value = URL.createObjectURL(file);
  }
};

// удаление OG изображения
const removeOgImage = async () => {
  try {
    // если og_image уже сохранена на сервере
    if (typeof formModel.og_image === 'string' && formModel.og_image !== '') {
      await api.delete(`/admin/files/${formModel.imagesDir}/${contentId}`, {
        data: {
          dir: formModel.image_og_dir,
          filename: formModel.og_image
        }
      });
    }

    // освобождаем blob preview
    if (ogPreview.value.startsWith('blob:')) {
      URL.revokeObjectURL(ogPreview.value);
    }

    formModel.og_image = null;
    ogPreview.value = '';
    if (ogFileInputRef.value) ogFileInputRef.value.value = '';
  } catch (e) {
    console.error('Ошибка при удалении og_image', e);
  }
};

// сохранение
const save = async () => {
  loading.value = true;
  error.value = null;

  try {
    const payload = new FormData();

    for (const key in formModel) {
      if (['imagesDir'].includes(key)) continue;
      const value = formModel[key as keyof typeof formModel];

      if (key === 'og_image') {
        if (value instanceof File) {
          payload.append('og_image', value);
        } else if (typeof value === 'string' && value !== '') {
          payload.append('og_image', value);
        }
        continue;
      }

      if (value !== undefined && value !== null) payload.append(key, String(value));
    }

    await api.post(`/admin/content/${contentId}`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' }
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
    <BaseTextArea v-model="formModel.content" label="Контент" required class="mb-4"/>

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
    <BaseInput v-model="formModel.og_type" label="Og type" class="mb-2"/>
    <BaseInput v-model="formModel.og_url" label="Og url" class="mb-2"/>
    <BaseInput v-model="formModel.canonical_url" label="Canonical url" class="mb-2"/>
    <BaseInput v-model="formModel.robots" label="Robots" class="mb-2"/>

    <!-- OG IMAGE UPLOAD -->
    <div class="mb-4">
      <label class="block text-sm text-gray-600 mb-1">Загрузить OG изображение</label>

      <BaseFileUpload
          v-model="formModel.og_image"
          label="Выбрать OG Image"
          accept="image/*"
          @change="handleOgFileChange"
          ref="ogFileInputRef"
      />

      <BaseImagePreview
          :src="ogPreview"
          alt="og_image"
          @remove="removeOgImage"
      />
    </div>
  </BaseForm>
</template>