<script setup lang="ts">
const { accept, label } = defineProps<{
  modelValue?: string | File | null;
  accept?: string;
  label?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string | File | null): void;
}>();

const handleChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0] || null;
  emit("update:modelValue", file);
};
</script>

<template>
  <label
      class="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg shadow cursor-pointer hover:bg-green-700 transition"
  >
    <span>{{ label || "Выбрать файл" }}</span>
    <input
        type="file"
        :accept="accept || 'image/*'"
        class="hidden"
        @change="handleChange"
    />
  </label>
</template>