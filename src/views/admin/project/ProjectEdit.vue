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
const fileInputRef = ref<HTMLInputElement | null>(null);

// реактивная модель формы
const formModel = reactive({
  name: '',
  content: '',
  status: 1,
  url: '',
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
  previews: [] as string[],       // превью новых файлов
  imagesFolderUrl: '',            // путь к папке на сервере
  imagesDir: '',                  // относительный путь (для API)
  existingImages: [] as string[], // список файлов с сервера
});

// заполняем форму при загрузке данных
watch(currentProject, (val) => {
  if (!val) return;

  Object.assign(formModel, {
    name: val.name ?? '',
    content: val.content ?? '',
    url: val.url ?? '',
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
    imagesDir: val.image_dir ?? '',
    existingImages: val.images ?? [],
  });
});

// обработка выбора файлов
const onFilesChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files) return;

  const files = Array.from(target.files);
  formModel.images = files;
  formModel.previews = files.map(file => URL.createObjectURL(file));
};

// удаление нового файла (до отправки)
const removeNewImage = (index: number) => {
  formModel.images.splice(index, 1);

  URL.revokeObjectURL(formModel.previews[index]);
  formModel.previews.splice(index, 1);

  if (formModel.images.length === 0 && fileInputRef.value) {
    fileInputRef.value.value = '';
  }
};

// удаление существующего файла (через API)
const deleteImage = async (filename: string) => {
  try {
    await api.delete(`/admin/files/${formModel.imagesDir}/${projectId}`, {
      data: { filename }
    });

    formModel.existingImages = formModel.existingImages.filter(img => img !== filename);
  } catch (e) {
    console.error('Ошибка при удалении файла', e);
  }
};

// сохранение формы
const save = async () => {
  loading.value = true;
  error.value = null;

  try {
    const payload = new FormData();

    for (const key in formModel) {
      if (['images', 'previews', 'existingImages', 'imagesFolderUrl', 'imagesDir'].includes(key)) continue;
      const value = formModel[key as keyof typeof formModel];
      if (value !== undefined && value !== null) payload.append(key, String(value));
    }

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
    <BaseTextArea v-model="formModel.content" label="Контент" required class="mb-4" />
    <BaseInput v-model="formModel.url" label="URL" required />

    <BaseToggle
        v-model="formModel.status"
        label="Статус"
        :activeLabel="'Активный'"
        :inactiveLabel="'Неактивный'"
        class="mb-4"
    />

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
      <label class="block text-sm text-gray-600 mb-2">Загрузить новые изображения</label>
      <label
          class="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow cursor-pointer hover:bg-blue-700 transition"
          style="margin-top:20px; margin-bottom:20px"
      >
        <span>Выбрать файлы</span>
        <input ref="fileInputRef" type="file" multiple class="hidden" @change="onFilesChange" />
      </label>

      <!-- Превью новых файлов -->
      <div v-if="formModel.previews.length" class="flex flex-wrap gap-2 mt-2">
        <div
            v-for="(src, idx) in formModel.previews"
            :key="idx"
            class="relative group w-48 h-48 border rounded overflow-hidden"
        >
          <img :src="src" class="w-full h-full object-cover" />
          <button
              type="button"
              class="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
              @click="removeNewImage(idx)"
          >
            ✕
          </button>
        </div>
      </div>
    </div>

    <!-- Существующие изображения -->
    <div v-if="formModel.existingImages.length" class="mt-4">
      <h3 class="text-sm font-medium text-gray-700 mb-2">Существующие изображения</h3>
      <div class="flex flex-wrap gap-4">
        <div
            v-for="img in formModel.existingImages"
            :key="img"
            class="relative group w-48 h-48"
        >
          <img
              :src="`${formModel.imagesFolderUrl}/${img}`"
              alt="Project image"
              class="w-48 h-48 object-cover rounded border"
          />
          <button
              type="button"
              class="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
              @click="deleteImage(img)"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  </BaseForm>
</template>