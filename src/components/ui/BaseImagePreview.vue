<script setup lang="ts">
const props = defineProps<{
  src?: string | null;
  alt?: string;
}>();

const emit = defineEmits<{
  (e: "remove"): void;
}>();
</script>

<template>
  <div
      v-if="props.src"
      class="relative group w-48 h-48 border rounded overflow-hidden mt-2"
  >
    <img
        :src="props.src"
        :alt="props.alt || 'Preview image'"
        class="w-full h-full object-cover"
    />
    <button
        type="button"
        class="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
        @click="emit('remove')"
    >
      ✕
    </button>
  </div>
</template>