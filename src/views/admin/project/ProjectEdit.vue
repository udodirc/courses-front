<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import { useProjectStore } from '../../../store/admin/project/project.store';
import { useErrorHandler } from '../../../composables/useErrorHandler';

import BaseForm from '../../../components/ui/BaseForm.vue';
import BaseTextArea from '../../../components/ui/BaseTextArea.vue';
import BaseInput from '../../../components/ui/BaseInput.vue';
import BaseToggle from '../../../components/ui/BaseToggle.vue';
import FormErrors from '../../../components/ui/FormErrors.vue';
import api from '../../../api';

const route = useRoute();
const router = useRouter();
const projectId = Number(route.params.id);

const projectStore = useProjectStore();
const { currentProject } = storeToRefs(projectStore);
const { error, setError } = useErrorHandler();

const loading = ref(false);

// реактивная модель формы
const formModel = reactive({
  name: '',
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
  images: [] as File[],           // новые загружаемые файлы
  imagesFolderUrl: '',            // путь к папке на сервере
  existingImages: [] as string[], // список файлов с сервера
});

// заполняем форму при загрузке данных
watch(currentProject, (val) => {
  if (!val) return;

  Object.assign(formModel, {
    name: val.name ?? '',
    content: val.content ?? '',
    status: val.status ?? 1,
    title: val.title ?? '',
    meta_description: val.meta_description ?? '',
    meta_keywords: val.meta_keywords ?? '',
    og_title: val.og_title ?? '',
    og_description: val.og_description ?? '',
    og_keywords: val.og_keywords ?? '',
    og_image: val.og_image ?? '',
    og_type: val.og_type ?? '',
    og_url: val.og_url ?? '',
    canonical_url: val.canonical_url ?? '',
    robots: val.robots ?? 'index, follow',
    imagesFolderUrl: val.image_url ?? '',
    existingImages: val.images ?? [], // реальные имена файлов с бэка
  });
});

// обработка выбора файлов
const onFilesChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files) return;
  formModel.images = Array.from(target.files);
};

// сохранение формы
const save = async () => {
  loading.value = true;
  error.value = null;

  try {
    const payload = new FormData();

    // добавляем обычные поля
    for (const key in formModel) {
      if (key === 'images' || key === 'existingImages' || key === 'imagesFolderUrl') continue;
      const value = formModel[key as keyof typeof formModel];
      if (value !== undefined && value !== null) payload.append(key, String(value));
    }

    // добавляем новые файлы
    formModel.images.forEach(file => {
      payload.append('images[]', file);
    });

    await api.post(`/admin/project/${projectId}`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    router.push('/admin/projects');
  } catch (e: any) {
    setError(e);
  } finally {
    loading.value = false;
  }
};

onMounted(() => projectStore.fetchItem(projectId));
</script>

<template>
  <BaseForm label="Редактировать проект" :loading="loading" :onSubmit="save">
    <FormErrors :error="error" />

    <BaseInput v-model="formModel.name" label="Имя" class="mb-2" />

    <!-- Основной контент -->
    <BaseTextArea v-model="formModel.content" label="Контент" required class="mb-4" />

    <!-- Статус -->
    <BaseToggle
        v-model="formModel.status"
        label="Статус"
        :activeLabel="'Активный'"
        :inactiveLabel="'Неактивный'"
        class="mb-4"
    />

    <!-- SEO / Open Graph -->
    <BaseInput v-model="formModel.title" label="SEO title" class="mb-2" />
    <BaseInput v-model="formModel.meta_description" label="Meta description" class="mb-2" />
    <BaseInput v-model="formModel.meta_keywords" label="Meta keywords" class="mb-2" />
    <BaseInput v-model="formModel.og_title" label="Og title" class="mb-2" />
    <BaseInput v-model="formModel.og_description" label="Og description" class="mb-2" />
    <BaseInput v-model="formModel.og_keywords" label="Og keywords" class="mb-2" />
    <BaseInput v-model="formModel.og_image" label="Og image" class="mb-2" />
    <BaseInput v-model="formModel.og_type" label="Og type" class="mb-2" />
    <BaseInput v-model="formModel.og_url" label="Og url" class="mb-2" />
    <BaseInput v-model="formModel.canonical_url" label="Canonical url" class="mb-2" />
    <BaseInput v-model="formModel.robots" label="Robots" class="mb-2" />

    <!-- Загрузка новых картинок -->
    <div class="mb-4">
      <label class="block text-sm text-gray-600">Загрузить новые изображения</label>
      <input type="file" multiple @change="onFilesChange" class="mt-1" />
      <div v-if="formModel.images.length" class="mt-2 text-sm text-gray-700">
        <div v-for="file in formModel.images" :key="file.name">{{ file.name }}</div>
      </div>
    </div>

    <!-- Существующие изображения -->
    <div v-if="formModel.existingImages.length" class="mt-4">
      <h3 class="text-sm font-medium text-gray-700 mb-2">Существующие изображения</h3>
      <div class="flex flex-wrap gap-2">
        <div v-for="img in formModel.existingImages" :key="img">
          <img
              :src="`${formModel.imagesFolderUrl}/${img}`"
              alt="Project image"
              class="w-48 h-48 object-cover rounded border"
          />
        </div>
      </div>
    </div>
  </BaseForm>
</template>