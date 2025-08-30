<!-- components/ui/BaseForm.vue -->
<template>
  <div class="w-full h-screen overflow-x-hidden border-t flex flex-col">
    <main class="w-full flex-grow p-6">
      <h1 class="w-full text-3xl text-black pb-6">{{ label }}</h1>
      <div class="flex flex-wrap">
        <div class="w-full lg:w-1/2 my-6 pr-0 lg:pr-2">
          <div class="leading-loose">
              <form @submit.prevent="onSubmit" class="p-10 bg-white rounded shadow-xl">
                <slot />
                <div class="mt-6">
                  <button :disabled="loading"  class="px-4 py-1 text-white font-light tracking-wider bg-gray-900 rounded" type="submit">
                    {{ loading ? 'Сохраняю...' : 'Сохранить' }}
                  </button>
                </div>
              </form>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  loading: boolean;
  onSubmit: () => void;
}>();
</script>