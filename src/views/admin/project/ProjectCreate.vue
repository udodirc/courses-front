<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useEntitySave } from '../../../composables/useEntitySave';
import BaseForm from '../../../components/ui/BaseForm.vue';
import BaseTextArea from '../../../components/ui/BaseTextArea.vue';
import BaseInput from "../../../components/ui/BaseInput.vue";
import FormErrors from '../../../components/ui/FormErrors.vue';

const router = useRouter();
const fileInputRef = ref<HTMLInputElement | null>(null);
const ogFileInputRef = ref<HTMLInputElement | null>(null);

// Тип формы
interface FormModel {
  name: string;
  content: string;
  url: string;
  title: string;
  meta_description: string;
  meta_keywords: string;
  og_title: string;
  og_description: string;
  og_keywords: string;
  og_image: File | string | null;
  og_type: string;
  og_url: string;
  canonical_url: string;
  robots: string;
  images: (File | string)[];
  previews: string[];
  main_page: number | null;
}

// Инициализация формы
const formModel = ref<FormModel>({
  name: '',
  content: '',
  url: '',
  title: '',
  meta_description: '',
  meta_keywords: '',
  og_title: '',
  og_description: '',
  og_keywords: '',
  og_image: null,
  og_type: 'og_type',
  og_url: '',
  canonical_url: '',
  robots: 'index, follow',
  images: [],
  previews: [],
  main_page: null,
});

// OG preview отдельно
const ogPreview = ref<string>('');

const { saveEntity, loading, error } = useEntitySave<FormData>();

// Загрузка данных из бэкенда
onMounted(() => {
  const data = window['initialProjectData'];
  if (data) {
    formModel.value = {
      name: data.name,
      content: data.content,
      url: data.url,
      title: data.title,
      meta_description: data.meta_description,
      meta_keywords: data.meta_keywords,
      og_title: data.og_title,
      og_description: data.og_description,
      og_keywords: data.og_keywords,
      og_image: data.og_image || null,
      og_type: data.og_type,
      og_url: data.og_url,
      canonical_url: data.canonical_url,
      robots: data.robots,
      images: data.images || [],
      previews: (data.images || []).map((f: string) => `${data.image_url}/${f}`),
      main_page: data.main_page,
    };
    ogPreview.value = data.og_image ? `${data.image_og_url}/${data.og_image}` : '';
  }
});

// Загрузка обычных изображений
function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    const files = Array.from(target.files);
    formModel.value.images.push(...files);
    formModel.value.previews.push(...files.map(f => URL.createObjectURL(f)));
    if (formModel.value.main_page === null) {
      formModel.value.main_page = 0;
    }
  }
}

function removeImage(index: number) {
  formModel.value.images.splice(index, 1);
  URL.revokeObjectURL(formModel.value.previews[index]);
  formModel.value.previews.splice(index, 1);

  if (formModel.value.main_page === index) {
    formModel.value.main_page = null;
  } else if (formModel.value.main_page !== null && formModel.value.main_page > index) {
    formModel.value.main_page--;
  }

  if (formModel.value.images.length === 0 && fileInputRef.value) {
    fileInputRef.value.value = '';
  }
}

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

// Сохранение формы
async function save() {
  try {
    const payload = new FormData();
    payload.append('name', formModel.value.name);
    payload.append('content', formModel.value.content);
    payload.append('title', formModel.value.title || '');
    payload.append('url', formModel.value.url);
    payload.append('meta_description', formModel.value.meta_description || '');
    payload.append('meta_keywords', formModel.value.meta_keywords || '');
    payload.append('og_title', formModel.value.og_title || '');
    payload.append('og_description', formModel.value.og_description || '');
    payload.append('og_keywords', formModel.value.og_keywords || '');

    // OG image — только файл
    if (formModel.value.og_image instanceof File) {
      payload.append('og_image', formModel.value.og_image);
    }

    payload.append('og_type', formModel.value.og_type);
    payload.append('og_url', formModel.value.og_url || '');
    payload.append('canonical_url', formModel.value.canonical_url || '');
    payload.append('robots', formModel.value.robots || '');

    // только новые файлы
    formModel.value.images.forEach(file => {
      if (file instanceof File) {
        payload.append('images[]', file);
      }
    });

    if (formModel.value.main_page !== null) {
      payload.append('main_page', String('new-' + formModel.value.main_page));
    }

    await saveEntity('/admin/project', payload, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    router.push('/admin/projects');
  } catch (e) {
    console.error('Ошибка при сохранении проектов:', e);
  }
}
</script>

<template>
  <BaseForm label="Создание контента" :loading="loading" :onSubmit="save">
    <FormErrors :error="error" />

    <BaseInput v-model="formModel.name" label="Имя"/>
    <BaseTextArea v-model="formModel.content" label="Контент" required />
    <BaseInput v-model="formModel.url" label="URL" required />
    <BaseInput v-model="formModel.title" label="Seo title"/>
    <BaseInput v-model="formModel.meta_description" label="Meta description"/>
    <BaseInput v-model="formModel.meta_keywords" label="Meta keywords"/>
    <BaseInput v-model="formModel.og_title" label="Og title"/>
    <BaseInput v-model="formModel.og_description" label="Og description"/>
    <BaseInput v-model="formModel.og_keywords" label="Og keywords"/>
    <BaseInput v-model="formModel.og_type" label="Og type" required/>
    <BaseInput v-model="formModel.canonical_url" label="Canonical url"/>
    <BaseInput v-model="formModel.robots" label="Robots" required/>

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

    <!-- IMAGES UPLOAD -->
    <div class="mt-4">
      <label class="block text-sm text-gray-600 mb-1">Изображения</label>
      <label
          class="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow cursor-pointer hover:bg-blue-700 transition"
      >
        <span>Выбрать файлы</span>
        <input
            ref="fileInputRef"
            type="file"
            multiple
            @change="handleFileChange"
            class="hidden"
        />
      </label>

      <div v-if="formModel.previews.length" class="flex flex-wrap gap-2 mt-2">
        <div
            v-for="(src, idx) in formModel.previews"
            :key="idx"
            class="relative group w-48 h-48 border rounded overflow-hidden"
        >
          <img :src="src" class="w-full h-full object-cover" alt=""/>
          <button
              type="button"
              class="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
              @click="removeImage(idx)"
          >
            ✕
          </button>

          <!-- Чекбокс/радио для выбора главного -->
          <label class="absolute bottom-1 left-1 bg-white px-2 py-1 rounded text-xs flex items-center gap-1 cursor-pointer">
            <input
                type="radio"
                name="mainPage"
                :value="idx"
                v-model="formModel.main_page"
            />
            Главное
          </label>
        </div>
      </div>
    </div>
  </BaseForm>
</template>