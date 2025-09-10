<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useEntitySave } from '../../../composables/useEntitySave';
import BaseForm from '../../../components/ui/BaseForm.vue';
import BaseTextArea from '../../../components/ui/BaseTextArea.vue';
import BaseSelect from '../../../components/ui/BaseSelect.vue';
import FormErrors from '../../../components/ui/FormErrors.vue';
import BaseInput from "../../../components/ui/BaseInput.vue";

const router = useRouter();

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
});

// универсальное сохранение
const { saveEntity, loading, error } = useEntitySave<typeof formModel.value>();

// сохранение
async function save() {
  try {
    const payload = {
      content: formModel.value.content,
      name: formModel.value.name,
      title: formModel.value.title,
      meta_description: formModel.value.meta_description,
      meta_keywords: formModel.value.meta_keywords,
      og_title: formModel.value.og_title,
      og_description: formModel.value.og_description,
      og_keywords: formModel.value.og_keywords,
      og_image: formModel.value.og_image,
      og_type: formModel.value.og_type,
      og_url: formModel.value.og_url,
      canonical_url: formModel.value.canonical_url,
      robots: formModel.value.robots,
    };

    await saveEntity('/admin/project', payload);
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
    <BaseInput v-model="formModel.og_image" label="Og image"/>
    <BaseInput v-model="formModel.og_type" label="Og type" required/>
    <BaseInput v-model="formModel.canonical_url" label="Canonical url"/>
    <BaseInput v-model="formModel.robots" label="Robots" required/>
  </BaseForm>
</template>