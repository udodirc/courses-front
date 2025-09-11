<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useEntitySave } from '../../../composables/useEntitySave';
import BaseForm from '../../../components/ui/BaseForm.vue';
import BaseTextArea from '../../../components/ui/BaseTextArea.vue';
import BaseInput from "../../../components/ui/BaseInput.vue";
import FormErrors from '../../../components/ui/FormErrors.vue';

const router = useRouter();

const fileInputRef = ref<HTMLInputElement | null>(null);

// модель формы
const formModel = ref({
  name: '',
  content: '',
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
  images: [] as File[],
  previews: [] as string[], // для локальных URL превью
});

// универсальное сохранение
const { saveEntity, loading, error } = useEntitySave<FormData>();

// обработка выбора файлов
function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    const files = Array.from(target.files);
    formModel.value.images = files;

    // создаем превью
    formModel.value.previews = files.map(file => URL.createObjectURL(file));
  }
}

// удаление картинки из массива и превью
function removeImage(index: number) {
  formModel.value.images.splice(index, 1);

  URL.revokeObjectURL(formModel.value.previews[index]);
  formModel.value.previews.splice(index, 1);

  // если удалили все картинки → сбрасываем input
  if (formModel.value.images.length === 0 && fileInputRef.value) {
    fileInputRef.value.value = '';
  }
}

async function save() {
  try {
    const payload = new FormData();
    payload.append('name', formModel.value.name);
    payload.append('content', formModel.value.content);
    payload.append('title', formModel.value.title);
    payload.append('meta_description', formModel.value.meta_description);
    payload.append('meta_keywords', formModel.value.meta_keywords);
    payload.append('og_title', formModel.value.og_title);
    payload.append('og_description', formModel.value.og_description);
    payload.append('og_keywords', formModel.value.og_keywords);
    payload.append('og_image', formModel.value.og_image);
    payload.append('og_type', formModel.value.og_type);
    payload.append('og_url', formModel.value.og_url);
    payload.append('canonical_url', formModel.value.canonical_url);
    payload.append('robots', formModel.value.robots);
    formModel.value.images.forEach(file => payload.append('images[]', file));

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
    <BaseInput v-model="formModel.title" label="Seo title"/>
    <BaseInput v-model="formModel.meta_description" label="Meta description"/>
    <BaseInput v-model="formModel.meta_keywords" label="Meta keywords"/>
    <BaseInput v-model="formModel.og_title" label="Og title"/>
    <BaseInput v-model="formModel.og_description" label="Og description"/>
    <BaseInput v-model="formModel.og_keywords" label="Og keywords"/>
    <BaseInput v-model="formModel.og_image" label="Og image"/>
    <BaseInput v-model="formModel.og_type" label="Og type" required/>
    <BaseInput v-model="formModel.canonical_url" label="Canonical url"/>
    <BaseInput v-model="formModel.robots" label="Robots" required/>

    <!-- Поле для загрузки файлов -->
    <!-- Поле для загрузки файлов -->
    <div class="mt-4">
      <label class="block text-sm text-gray-600 mb-1">Изображения</label>

      <!-- Красивая кнопка выбора -->
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

      <!-- Превью выбранных файлов -->
      <div v-if="formModel.previews.length" class="flex flex-wrap gap-2 mt-2">
        <div
            v-for="(src, idx) in formModel.previews"
            :key="idx"
            class="relative group w-48 h-48 border rounded overflow-hidden"
        >
          <img :src="src" class="w-full h-full object-cover"  alt=""/>
          <button
              type="button"
              class="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
              @click="removeImage(idx)"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  </BaseForm>
</template>