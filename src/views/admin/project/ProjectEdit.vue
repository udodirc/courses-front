<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import {useProjectStore, useProjectStoreWithGetters} from '../../../store/admin/project/project.store';
import { useErrorHandler } from '../../../composables/useErrorHandler';

import BaseForm from '../../../components/ui/BaseForm.vue';
import BaseTextArea from "../../../components/ui/BaseTextArea.vue";
import BaseTextAreaWithEditor from "../../../components/ui/BaseTextAreaWithEditor.vue";
import BaseInput from "../../../components/ui/BaseInput.vue";
import BaseToggle from '../../../components/ui/BaseToggle.vue';
import FormErrors from '../../../components/ui/FormErrors.vue';
import api from '../../../api';

const route = useRoute();
const router = useRouter();
const projectId = Number(route.params.id);

const projectStore = useProjectStore();
const { currentProject } = useProjectStoreWithGetters();
const { error, setError } = useErrorHandler();

const loading = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);
const ogFileInputRef = ref<HTMLInputElement | null>(null);

// форма
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
  og_image: null as File | string | null,
  og_preview: '', // blob preview для OG
  og_type: '',
  og_url: '',
  canonical_url: '',
  robots: 'index, follow',
  images: [] as File[],
  previews: [] as string[], // blob previews для новых изображений
  imagesFolderUrl: '',
  image_dir: '',
  image_all_dir: '',
  image_og_dir: '',
  existingImages: [] as string[],
  main_page: '',
});

// заполнение формы при загрузке
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
    og_preview: val.og_image ? `${val.image_og_url}/${val.og_image}` : '',
    og_type: val.og_type ?? '',
    og_url: val.og_url ?? '',
    canonical_url: val.canonical_url ?? '',
    robots: val.robots ?? 'index, follow',
    imagesFolderUrl: val.image_url ?? '',
    image_dir: val.image_dir ?? '',
    image_all_dir: val.image_all_dir ?? '',
    image_og_dir: val.image_og_dir ?? '',
    existingImages: val.images ?? [],
    main_page: val.main_page ?? '',
  });
});

// новые изображения
const onFilesChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files) return;

  const files = Array.from(target.files);
  formModel.images.push(...files);
  formModel.previews.push(...files.map(f => URL.createObjectURL(f)));

  if (!formModel.main_page && formModel.images.length > 0) {
    formModel.main_page = 'new-0';
  }
};

const removeNewImage = (index: number) => {
  formModel.images.splice(index, 1);
  URL.revokeObjectURL(formModel.previews[index]);
  formModel.previews.splice(index, 1);

  if (formModel.main_page === `new-${index}`) formModel.main_page = '';
  if (formModel.images.length > 0 && !formModel.main_page) formModel.main_page = 'new-0';
  if (formModel.images.length === 0 && fileInputRef.value) fileInputRef.value.value = '';
};

// OG
const handleOgFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files || !target.files[0]) return;

  if (formModel.og_preview.startsWith('blob:')) {
    URL.revokeObjectURL(formModel.og_preview);
  }

  const file = target.files[0];
  formModel.og_image = file;
  formModel.og_preview = URL.createObjectURL(file);
};

const removeOgImage = async () => {
  try {
    if (typeof formModel.og_image === 'string' && formModel.og_image !== '') {
      await api.delete(`/admin/files/${formModel.image_dir}/${projectId}`, {
        data: { dir: formModel.image_og_dir, filename: formModel.og_image }
      });
    }

    if (formModel.og_preview.startsWith('blob:')) URL.revokeObjectURL(formModel.og_preview);
    formModel.og_image = null;
    formModel.og_preview = '';

    if (ogFileInputRef.value) ogFileInputRef.value.value = '';
  } catch (e) {
    console.error('Ошибка при удалении OG изображения', e);
  }
};

// существующие изображения
const deleteImage = async (dir: string, filename: string) => {
  try {
    await api.delete(`/admin/files/${formModel.image_dir}/${projectId}`, {
      data: { dir, filename }
    });
    formModel.existingImages = formModel.existingImages.filter(img => img !== filename);
    if (formModel.main_page === filename) formModel.main_page = '';
  } catch (e) {
    console.error('Ошибка при удалении файла', e);
  }
};

// сохранение
const save = async () => {
  loading.value = true;
  error.value = null;

  try {
    const payload = new FormData();

    for (const key in formModel) {
      if (['images', 'previews', 'existingImages', 'imagesFolderUrl', 'image_dir', 'og_preview'].includes(key)) continue;

      const value = formModel[key as keyof typeof formModel];

      if (key === 'og_image') {
        if (value instanceof File) payload.append('og_image', value);
        else if (typeof value === 'string' && value) payload.append('og_image', value);
        continue;
      }

      if (value !== undefined && value !== null) payload.append(key, String(value));
    }

    formModel.images.forEach(file => payload.append('images[]', file));

    await api.post(`/admin/project/${projectId}`, payload, { headers: { 'Content-Type': 'multipart/form-data' } });
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

    <!-- базовые поля -->
    <BaseInput v-model="formModel.name" label="Имя" class="mb-2" />
    <BaseTextAreaWithEditor v-model="formModel.content" label="Контент" required class="mb-4" />
    <BaseInput v-model="formModel.url" label="URL" required />
    <BaseToggle v-model="formModel.status" label="Статус" :activeLabel="'Активный'" :inactiveLabel="'Неактивный'" class="mb-4"/>

    <!-- SEO / Open Graph -->
    <BaseTextArea v-model="formModel.title" label="SEO title"/>
    <BaseTextArea v-model="formModel.meta_description" label="Meta description"/>
    <BaseTextArea v-model="formModel.meta_keywords" label="Meta keywords"/>
    <BaseTextArea v-model="formModel.og_title" label="Og title"/>
    <BaseTextArea v-model="formModel.og_description" label="Og description"/>
    <BaseTextArea v-model="formModel.og_keywords" label="Og keywords"/>
    <BaseTextArea v-model="formModel.og_type" label="Og type"/>
    <BaseTextArea v-model="formModel.og_url" label="Og url"/>
    <BaseTextArea v-model="formModel.canonical_url" label="Canonical url"/>
    <BaseTextArea v-model="formModel.robots" label="Robots"/>

    <!-- OG IMAGE -->
    <div class="mb-4">
      <label class="block text-sm text-gray-600 mb-1">OG Image</label>
      <label class="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg shadow cursor-pointer hover:bg-green-700 transition">
        <span>Выбрать файл</span>
        <input ref="ogFileInputRef" type="file" accept="image/*" class="hidden" @change="handleOgFileChange"/>
      </label>
      <div v-if="formModel.og_preview" class="relative group w-48 h-48 border rounded overflow-hidden mt-2">
        <img :src="formModel.og_preview" class="w-full h-full object-cover" />
        <button type="button" class="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition" @click="removeOgImage">✕</button>
      </div>
    </div>

    <!-- новые изображения -->
    <div class="mb-4">
      <label class="block text-sm text-gray-600 mb-2">Загрузить новые изображения</label>
      <label class="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow cursor-pointer hover:bg-blue-700 transition">
        <span>Выбрать файлы</span>
        <input ref="fileInputRef" type="file" multiple class="hidden" @change="onFilesChange"/>
      </label>
      <div v-if="formModel.previews.length" class="flex flex-wrap gap-2 mt-2">
        <div v-for="(src, idx) in formModel.previews" :key="idx" class="relative group w-48 h-48 border rounded overflow-hidden">
          <img :src="src" class="w-full h-full object-cover" />
          <input type="radio" name="main_page" class="absolute bottom-1 left-1" :value="`new-${idx}`" v-model="formModel.main_page" />
          <button type="button" class="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition" @click="removeNewImage(idx)">✕</button>
        </div>
      </div>
    </div>

    <!-- существующие изображения -->
    <div v-if="formModel.existingImages.length" class="mt-4">
      <h3 class="text-sm font-medium text-gray-700 mb-2">Существующие изображения</h3>
      <div class="flex flex-wrap gap-4">
        <div v-for="img in formModel.existingImages" :key="img" class="relative group w-48 h-48">
          <img :src="`${formModel.imagesFolderUrl}/${img}`" alt="Project image" class="w-48 h-48 object-cover rounded border" />
          <input type="radio" name="main_page" class="absolute bottom-1 left-1" :value="img" v-model="formModel.main_page"/>
          <button type="button" class="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition" @click="deleteImage(formModel.image_all_dir, img)">✕</button>
        </div>
      </div>
    </div>
  </BaseForm>
</template>