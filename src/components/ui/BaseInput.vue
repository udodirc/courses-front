<!-- components/ui/BaseInput.vue -->
<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  label: string;
  modelValue: string | null | undefined;
  type?: string;
  required?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const model = computed({
  get: () => props.modelValue ?? '',
  set: (value: string) => emit('update:modelValue', value),
});
</script>

<template>
  <div class="">
    <label class="block text-sm text-gray-600" for="name">{{ label }}</label>
    <input
        v-model="model"
        :type="type || 'text'"
        class="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded mb-2.5"
        :required="required"
    />
  </div>
</template>