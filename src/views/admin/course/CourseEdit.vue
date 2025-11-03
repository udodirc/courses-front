<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCourseStore, useCourseStoreWithGetters } from '../../../store/admin/course/course.store.ts';
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
const courseId = Number(route.params.id);

const projectStore = useCourseStore();
const { currentProject } = useCourseStoreWithGetters();
const { error, setError } = useErrorHandler();

const loading = ref(false);
const ogFileInputRef = ref<HTMLInputElement | null>(null);
const mainFileInputRef = ref<HTMLInputElement | null>(null);

const formModel = reactive({
  name: '',
  short_description: '',
  description: '',
  price: '0',
  status: 1,
  title: '',
  meta_description: '',
  meta_keywords: '',
  og_title: '',
  og_description: '',
  og_image: null as File | string | null,
  main_image: null as File | string | null,
  og_preview: '',
  main_preview: '',
  og_type: '',
  og_url: '',
  canonical_url: '',
  robots: 'index, follow',
  previews: [] as string[],
  imagesFolderUrl: '',
  image_dir: '',
  image_all_dir: '',
  image_og_dir: '',
  existingImages: [] as string[],
});

// Заполнение формы при загрузке
watch(currentProject, (val) => {
  if (!val) return;

  Object.assign(formModel, {
    name: val.name ?? '',
    short_description: val.short_description ?? '',
    description: val.description ?? '',
    price: val.price ?? '',
    status: val.status ?? 1,
    title: val.title ?? '',
    meta_description: val.meta_description ?? '',
    meta_keywords: val.meta_keywords ?? '',
    og_title: val.og_title ?? '',
    og_description: val.og_description ?? '',

    // ✅ исправленные поля OG
    og_image: val.image_og_image ?? '',
    og_preview: val.image_og_image
        ? `${val.image_og_url}/${val.image_og_image}`
        : '',

    // ✅ исправленные поля MAIN
    main_image: val.image_main_image ?? '',
    main_preview: val.image_main_image
        ? `${val.image_main_url}/${val.image_main_image}`
        : '',

    og_type: val.og_type ?? '',
    og_url: val.og_url ?? '',
    canonical_url: val.canonical_url ?? '',
    robots: val.robots ?? 'index, follow',
    imagesFolderUrl: val.image_url ?? '',
    image_dir: val.image_dir ?? '',
    image_all_dir: val.image_all_dir ?? '',
    image_og_dir: val.image_og_dir ?? '',
    existingImages: val.images ?? [],
  });
});

// --- OG IMAGE ---
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
      await api.delete(`/admin/files/${formModel.image_dir}/${courseId}`, {
        data: { dir: formModel.image_og_dir, filename: formModel.og_image }
      });
    }

    if (formModel.og_preview.startsWith('blob:'))
      URL.revokeObjectURL(formModel.og_preview);

    formModel.og_image = null;
    formModel.og_preview = '';

    if (ogFileInputRef.value) ogFileInputRef.value.value = '';
  } catch (e) {
    console.error('Ошибка при удалении OG изображения', e);
  }
};

// --- MAIN IMAGE ---
const handleMainFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files || !target.files[0]) return;

  if (formModel.main_preview.startsWith('blob:')) {
    URL.revokeObjectURL(formModel.main_preview);
  }

  const file = target.files[0];
  formModel.main_image = file;
  formModel.main_preview = URL.createObjectURL(file);
};

const removeMainImage = async () => {
  try {
    if (typeof formModel.main_image === 'string' && formModel.main_image !== '') {
      await api.delete(`/admin/files/${formModel.image_dir}/${courseId}`, {
        data: { dir: formModel.image_all_dir, filename: formModel.main_image }
      });
    }

    if (formModel.main_preview.startsWith('blob:'))
      URL.revokeObjectURL(formModel.main_preview);

    formModel.main_image = null;
    formModel.main_preview = '';

    if (mainFileInputRef.value) mainFileInputRef.value.value = '';
  } catch (e) {
    console.error('Ошибка при удалении главного изображения', e);
  }
};

// --- СОХРАНЕНИЕ ---
const save = async () => {
  loading.value = true;
  error.value = null;

  try {
    const payload = new FormData();

    for (const key in formModel) {
      if (
          ['previews', 'existingImages', 'imagesFolderUrl', 'image_dir', 'og_preview', 'main_preview'].includes(key)
      ) continue;

      const value = formModel[key as keyof typeof formModel];

      if (key === 'og_image') {
        if (value instanceof File) payload.append('og_image', value);
        else if (typeof value === 'string' && value) payload.append('og_image', value);
        continue;
      }

      if (key === 'main_image') {
        if (value instanceof File) payload.append('main_image', value);
        else if (typeof value === 'string' && value) payload.append('main_image', value);
        continue;
      }

      if (value !== undefined && value !== null)
        payload.append(key, String(value));
    }

    await api.post(`/admin/course/${courseId}`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    router.push('/admin/courses');
  } catch (e: any) {
    setError(e);
  } finally {
    loading.value = false;
  }
};

onMounted(() => projectStore.fetchItem(courseId));
</script>

<template>
  <BaseForm label="Редактировать курс" :loading="loading" :onSubmit="save">
    <FormErrors :error="error" />

    <!-- Основные поля -->
    <BaseInput v-model="formModel.name" label="Имя" />
    <BaseTextAreaWithEditor v-model="formModel.short_description" label="Краткое описание" required class="w-full mb-4" />
    <BaseTextAreaWithEditor v-model="formModel.description" label="Описание" required class="w-full mb-4" />
    <BaseInput v-model="formModel.price" label="Цена" required />
    <BaseToggle v-model="formModel.status" label="Статус" :activeLabel="'Активный'" :inactiveLabel="'Неактивный'" class="mb-4" />

    <!-- SEO / Open Graph -->
    <BaseTextArea v-model="formModel.title" label="SEO title" />
    <BaseTextArea v-model="formModel.meta_description" label="Meta description" />
    <BaseTextArea v-model="formModel.meta_keywords" label="Meta keywords" />
    <BaseTextArea v-model="formModel.og_title" label="Og title" />
    <BaseTextArea v-model="formModel.og_description" label="Og description" />
    <BaseTextArea v-model="formModel.og_type" label="Og type" />
    <BaseTextArea v-model="formModel.og_url" label="Og url" />
    <BaseTextArea v-model="formModel.canonical_url" label="Canonical url" />
    <BaseTextArea v-model="formModel.robots" label="Robots" />

    <!-- OG IMAGE -->
    <div class="mb-4">
      <label class="block text-sm text-gray-600 mb-1">OG картинка</label>
      <label class="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg shadow cursor-pointer hover:bg-green-700 transition">
        <span>Выбрать файл</span>
        <input ref="ogFileInputRef" type="file" accept="image/*" class="hidden" @change="handleOgFileChange" />
      </label>

      <div v-if="formModel.og_preview" class="relative group w-48 h-48 border rounded overflow-hidden mt-2">
        <img :src="formModel.og_preview" class="w-full h-full object-cover" />
        <button type="button" class="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition" @click="removeOgImage">
          ✕
        </button>
      </div>
    </div>

    <!-- MAIN IMAGE -->
    <div class="mb-4">
      <label class="block text-sm text-gray-600 mb-1">Главная картинка</label>
      <label class="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg shadow cursor-pointer hover:bg-green-700 transition">
        <span>Выбрать файл</span>
        <input ref="mainFileInputRef" type="file" accept="image/*" class="hidden" @change="handleMainFileChange" />
      </label>

      <div v-if="formModel.main_preview" class="relative group w-85 h-48 border rounded overflow-hidden mt-2">
        <img :src="formModel.main_preview" class="w-full h-full object-cover" />
        <button type="button" class="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition" @click="removeMainImage">
          ✕
        </button>
      </div>
    </div>
  </BaseForm>
</template>