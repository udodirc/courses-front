<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const props = defineProps<{
  modelValue: boolean | number; // можно передавать 0/1 или true/false
  label?: string;
  activeLabel?: string;
  inactiveLabel?: string;
}>();

const emit = defineEmits(["update:modelValue"]);

function toggle() {
  const newValue =
      props.modelValue === true || props.modelValue === 1 ? 0 : 1;
  emit("update:modelValue", newValue);
}
</script>

<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
    </label>

    <button
        type="button"
        @click="toggle"
        :class="[
        'relative inline-flex h-6 w-11 items-center rounded-full transition',
        modelValue === true || modelValue === 1 ? 'bg-green-500' : 'bg-gray-300'
      ]"
    >
      <span
          :class="[
          'inline-block h-4 w-4 transform rounded-full bg-white transition',
          modelValue === true || modelValue === 1 ? 'translate-x-6' : 'translate-x-1'
        ]"
      />
    </button>

    <span class="ml-3 text-sm text-gray-600">
      {{ modelValue === true || modelValue === 1
        ? activeLabel ?? "Активный"
        : inactiveLabel ?? "Неактивный" }}
    </span>
  </div>
</template>