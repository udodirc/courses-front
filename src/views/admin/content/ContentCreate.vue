<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useFetchList } from '../../../composables/useFetchList';
import { useEntitySave } from '../../../composables/useEntitySave';

import BaseForm from '../../../components/ui/BaseForm.vue';
import BaseTextArea from '../../../components/ui/BaseTextArea.vue';
import BaseSelect from '../../../components/ui/BaseSelect.vue';
import BaseInput from '../../../components/ui/BaseInput.vue';
import BaseFileUpload from '../../../components/ui/BaseFileUpload.vue';
import BaseImagePreview from '../../../components/ui/BaseImagePreview.vue';
import FormErrors from '../../../components/ui/FormErrors.vue';

const router = useRouter();

// список меню
const { items: menus, fetchItems: fetchMenus } = useFetchList<{ id: number; name: string }>('/admin/menu/parent');

// список подменю (пустой изначально, URL будем менять динамически)
const { items: submenus, fetchItems: fetchSubmenus } = useFetchList<{ id: number; name: string }>();

// модель формы
const formModel = ref({
  content: '',
  menuId: null as number | null,
  submenuId: null as number | null,
  title: '',
  meta_description: '',
  meta_keywords: '',
  og_title: '',
  og_description: '',
  og_keywords: '',
  og_image: '' as File | string | null,
  og_type: 'og_type',
  og_url: '',
  canonical_url: '',
  robots: 'index, follow',
});

// OG Image preview
const ogPreview = ref<string>('');
const ogFileInputRef = ref<HTMLInputElement | null>(null);

// универсальное сохранение
const { saveEntity, loading, error } = useEntitySave<typeof formModel.value>();

// сохранение
async function save() {
  try {
    const payload = new FormData();

    for (const key in formModel.value) {
      const value = formModel.value[key as keyof typeof formModel.value];

      if (key === 'og_image') {
        if (value instanceof File) {
          payload.append('og_image', value);
        } else if (typeof value === 'string' && value !== '') {
          payload.append('og_image', value);
        }
      } else if (value !== undefined && value !== null) {
        payload.append(key, String(value));
      }
    }

    // menu_id берём из подменю, если выбрано
    payload.set('menu_id', String(formModel.value.submenuId || formModel.value.menuId));

    await saveEntity('/admin/content', payload);
    router.push('/admin/content');
  } catch (e) {
    console.error('Ошибка при сохранении контента:', e);
  }
}

// загрузка меню при старте
onMounted(() => {
  fetchMenus();
});

// когда выбран menuId → подгружаем подменю
watch(
    () => formModel.value.menuId,
    async (menuId) => {
      if (menuId) {
        await fetchSubmenus(`/admin/menu/submenu/${menuId}`);
        formModel.value.submenuId = null; // сбросить выбор подменю
      } else {
        formModel.value.submenuId = null;
      }
    }
);

// OG Image handlers
const handleOgFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    formModel.value.og_image = file;
    ogPreview.value = URL.createObjectURL(file);
  }
};

const removeOgImage = () => {
  formModel.value.og_image = '';
  if (ogPreview.value.startsWith('blob:')) URL.revokeObjectURL(ogPreview.value);
  ogPreview.value = '';
  if (ogFileInputRef.value) ogFileInputRef.value.value = '';
};
</script>

<template>
  <BaseForm label="Создание контента" :loading="loading" :onSubmit="save">
    <FormErrors :error="error" />

    <!-- выбор меню -->
    <BaseSelect
        v-model="formModel.menuId"
        label="Меню"
        :options="menus.map(menu => ({ value: menu.id, label: menu.name }))"
    />

    <!-- выбор подменю (появляется только если выбрано меню) -->
    <BaseSelect
        v-if="formModel.menuId"
        v-model="formModel.submenuId"
        label="Подменю"
        :options="submenus.map(sub => ({ value: sub.id, label: sub.name }))"
    />

    <!-- Основной контент -->
    <BaseTextArea v-model="formModel.content" label="Контент" required />
    <BaseInput v-model="formModel.title" label="Seo title"/>
    <BaseInput v-model="formModel.meta_description" label="Meta description"/>
    <BaseInput v-model="formModel.meta_keywords" label="Meta keywords"/>
    <BaseInput v-model="formModel.og_title" label="Og title"/>
    <BaseInput v-model="formModel.og_description" label="Og description"/>
    <BaseInput v-model="formModel.og_keywords" label="Og keywords"/>
    <BaseInput v-model="formModel.og_type" label="Og type" required/>
    <BaseInput v-model="formModel.og_url" label="Og url"/>
    <BaseInput v-model="formModel.canonical_url" label="Canonical url"/>
    <BaseInput v-model="formModel.robots" label="Robots" required/>

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