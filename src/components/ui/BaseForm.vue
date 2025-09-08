<template>
  <div>
    <h1 class="w-full text-3xl text-black pb-6">{{ label }}</h1>
    <div class="flex flex-wrap">
      <div class="w-full my-6 pr-0 max-w-4xl mx-auto">
        <div class="leading-loose">
          <form @submit.prevent="onSubmit" class="p-10 bg-white rounded shadow-xl">
            <slot />
            <div class="mt-6">
              <button :disabled="loading" class="px-4 py-1 text-white font-light tracking-wider bg-gray-900 rounded" type="submit">
                {{ loading ? 'Сохраняю...' : 'Сохранить' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  loading: boolean;
  onSubmit: () => void;
}>();
</script>