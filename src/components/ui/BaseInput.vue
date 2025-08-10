<!-- components/ui/BaseInput.vue -->
<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  label: string;
  modelValue: string;
  type?: string;
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
  <label class="block mb-4">
    <span class="block mb-1 font-medium">{{ label }}</span>
    <input
        v-model="model"
        :type="type || 'text'"
        class="w-full px-3 py-2 border rounded"
        :required="required"
    />
  </label>
</template>