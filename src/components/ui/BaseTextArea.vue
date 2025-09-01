<!-- components/ui/BaseTextArea.vue -->
<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  label: string;
  modelValue: string;
  required?: boolean;
  rows?: number;
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
    <textarea
        v-model="model"
        :rows="rows || 4"
        class="w-full px-4 py-2 text-gray-700 bg-gray-200 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
        :required="required"
    />
  </div>
</template>