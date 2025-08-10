<!-- components/ui/BaseSelect.vue -->
<template>
  <label class="block mb-4">
    <span class="block mb-1 font-medium">{{ label }}</span>
    <select
        v-model="model"
        class="w-full px-3 py-2 border rounded"
        :required="required"
    >
      <option disabled value="">Выберите</option>
      <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  label: string;
  modelValue: string | number | null;
  options: { value: string | number; label: string }[];
  required?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | null): void;
}>();

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});
</script>