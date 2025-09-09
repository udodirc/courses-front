<script setup lang="ts">
import { computed } from 'vue';
// import Editor from '@tinymce/tinymce-vue';

const props = defineProps<{
  label: string;
  modelValue: string;
  required?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const model = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value),
});
</script>

<template>
  <div>
    <label class="block text-sm text-gray-600 mb-1">{{ label }}</label>
    <Editor
        v-model="model"
        api-key="no-api-key"
        :init="{
        plugins: 'advlist autolink lists link image charmap print preview anchor searchreplace visualblocks code fullscreen insertdatetime media table paste code help wordcount',
        toolbar:
          'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
      }"
    />
  </div>
</template>