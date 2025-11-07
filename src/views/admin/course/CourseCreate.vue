<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useEntitySave } from '../../../composables/useEntitySave';
import BaseForm from '../../../components/ui/BaseForm.vue';
import BaseTextArea from "../../../components/ui/BaseTextArea.vue";
import BaseTextAreaWithEditor from "../../../components/ui/BaseTextAreaWithEditor.vue";
import BaseInput from "../../../components/ui/BaseInput.vue";
import FormErrors from '../../../components/ui/FormErrors.vue';
import type {Partner} from "../../../types/Partner.ts";

const router = useRouter();
const ogFileInputRef = ref<HTMLInputElement | null>(null);
const mainFileInputRef = ref<HTMLInputElement | null>(null);
const user = ref<Partner | null>(null);
if (user.value?.id) localStorage.setItem('partner_id', user.value.id.toString());

// Тип формы
interface FormModel {
  partner_id: number;
  name: string;
  short_description: string;
  description: string;
  price: string;
  url: string;
  title: string;
  meta_description: string;
  meta_keywords: string;
  og_title: string;
  og_description: string;
  og_image: File | string | null;
  main_image: File | string | null;
  og_type: string;
  og_url: string;
  canonical_url: string;
  robots: string;
  images: (File | string)[];
  previews: string[];
}

// Инициализация формы
const formModel = ref<FormModel>({
  partner_id: 0,
  name: '',
  short_description: '',
  description: '',
  price: '0',
  url: '',
  title: '',
  meta_description: '',
  meta_keywords: '',
  og_title: '',
  og_description: '',
  og_image: null,
  main_image: null,
  og_type: 'og_type',
  og_url: '',
  canonical_url: '',
  robots: 'index, follow',
  images: [],
  previews: [],
});

// OG preview отдельно
const ogPreview = ref<string>('');
const mainPreview = ref<string>('');

const { saveEntity, loading, error } = useEntitySave<FormData>();

// Загрузка данных из бэкенда
onMounted(() => {
  const data = window.initialProjectData;
  if (data) {
    formModel.value = {
      partner_id: user.value?.id ?? 0,
      name: data.name,
      short_description: data.short_description,
      description: data.description,
      price: data.price,
      url: data.url,
      title: data.title,
      meta_description: data.meta_description,
      meta_keywords: data.meta_keywords,
      og_title: data.og_title,
      og_description: data.og_description,
      og_image: data.og_image || null,
      main_image: data.main_image || null,
      og_type: data.og_type,
      og_url: data.og_url,
      canonical_url: data.canonical_url,
      robots: data.robots,
      images: data.images || [],
      previews: (data.images || []).map((f: string) => `${data.image_url}/${f}`),
    };
    ogPreview.value = data.og_image ? `${data.image_og_url}/${data.og_image}` : '';
    mainPreview.value = data.main_image ? `${data.image_main_image_url}/${data.main_image}` : '';
  }
});

// Загрузка OG изображения
function handleOgFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    if (ogPreview.value.startsWith('blob:')) {
      URL.revokeObjectURL(ogPreview.value);
    }
    formModel.value.og_image = file;
    ogPreview.value = URL.createObjectURL(file);
  }
}

function removeOgImage() {
  if (ogPreview.value.startsWith('blob:')) {
    URL.revokeObjectURL(ogPreview.value);
  }
  formModel.value.og_image = null;
  ogPreview.value = '';
  if (ogFileInputRef.value) {
    ogFileInputRef.value.value = '';
  }
}

function handleMainFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    if (mainPreview.value.startsWith('blob:')) {
      URL.revokeObjectURL(mainPreview.value);
    }
    formModel.value.main_image = file;
    mainPreview.value = URL.createObjectURL(file);
  }
}

function removeMainImage() {
  if (mainPreview.value.startsWith('blob:')) {
    URL.revokeObjectURL(mainPreview.value);
  }
  formModel.value.main_image = null;
  mainPreview.value = '';
  if (mainFileInputRef.value) {
    mainFileInputRef.value.value = '';
  }
}

// Сохранение формы
async function save() {
  try {
    const payload = new FormData();
    payload.append('partner_id', 1);
    payload.append('name', formModel.value.name);
    payload.append('short_description', formModel.value.short_description);
    payload.append('description', formModel.value.description);
    payload.append('price', formModel.value.price);
    payload.append('url', formModel.value.url);
    payload.append('title', formModel.value.title || '');
    payload.append('meta_description', formModel.value.meta_description || '');
    payload.append('meta_keywords', formModel.value.meta_keywords || '');
    payload.append('og_title', formModel.value.og_title || '');
    payload.append('og_description', formModel.value.og_description || '');

    // OG image — только файл
    if (formModel.value.og_image instanceof File) {
      payload.append('og_image', formModel.value.og_image);
    }

    payload.append('og_type', formModel.value.og_type);
    payload.append('og_url', formModel.value.og_url || '');
    payload.append('canonical_url', formModel.value.canonical_url || '');
    payload.append('robots', formModel.value.robots || '');

    if (formModel.value.main_image instanceof File) {
      payload.append('main_image', formModel.value.main_image);
    }

    await saveEntity('/admin/course', payload, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    router.push('/admin/courses');
  } catch (e) {
    console.error('Ошибка при сохранении проектов:', e);
  }
}
</script>

<template>
  <BaseForm label="Создание контента" :loading="loading" :onSubmit="save">
    <FormErrors :error="error" />

    <BaseInput v-model="formModel.name" label="Имя"/>
    <BaseTextAreaWithEditor
        v-model="formModel.short_description"
        label="Краткое описание"
        required
        class="w-full mb-4"
    />
    <BaseTextAreaWithEditor
        v-model="formModel.description"
        label="Описание"
        required
        class="w-full mb-4"
    />
    <BaseInput v-model="formModel.price" label="Цена" required />
    <BaseInput v-model="formModel.url" label="URL" required />

    <!-- SEO / Open Graph -->
    <BaseTextArea v-model="formModel.title" label="SEO title"/>
    <BaseTextArea v-model="formModel.meta_description" label="Meta description"/>
    <BaseTextArea v-model="formModel.meta_keywords" label="Meta keywords"/>
    <BaseTextArea v-model="formModel.og_title" label="Og title"/>
    <BaseTextArea v-model="formModel.og_description" label="Og description"/>
    <BaseTextArea v-model="formModel.og_type" label="Og type"/>
    <BaseTextArea v-model="formModel.og_url" label="Og url"/>
    <BaseTextArea v-model="formModel.canonical_url" label="Canonical url"/>
    <BaseTextArea v-model="formModel.robots" label="Robots"/>

    <!-- OG IMAGE UPLOAD -->
    <div class="mt-4">
      <label class="block text-sm text-gray-600 mb-1">OG Image</label>
      <label
          class="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg shadow cursor-pointer hover:bg-green-700 transition"
      >
        <span>Выбрать файл</span>
        <input
            ref="ogFileInputRef"
            type="file"
            accept="image/*"
            @change="handleOgFileChange"
            class="hidden"
        />
      </label>

      <div v-if="ogPreview" class="relative group w-48 h-48 border rounded overflow-hidden mt-2">
        <img :src="ogPreview" class="w-full h-full object-cover" alt="og_image"/>
        <button
            type="button"
            class="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
            @click="removeOgImage"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- MAIN IMAGE UPLOAD -->
    <div class="mt-4">
      <label class="block text-sm text-gray-600 mb-1">Main Image</label>
      <label
          class="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg shadow cursor-pointer hover:bg-green-700 transition"
      >
        <span>Выбрать файл</span>
        <input
            ref="mainFileInputRef"
            type="file"
            accept="image/*"
            @change="handleMainFileChange"
            class="hidden"
        />
      </label>

      <div v-if="mainPreview" class="relative group w-85 h-48 border rounded overflow-hidden mt-2">
        <img :src="mainPreview" class="w-full h-full object-cover" alt="main_image"/>
        <button
            type="button"
            class="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
            @click="removeMainImage"
        >
          ✕
        </button>
      </div>
    </div>
  </BaseForm>
</template>