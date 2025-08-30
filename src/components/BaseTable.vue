<template>
  <div class="bg-white overflow-auto">
    <table class="min-w-full bg-white">
      <thead class="bg-gray-800 text-white">
        <tr>
          <slot name="head" />
        </tr>
      </thead>
      <tbody class="text-gray-700">
        <slot name="body" />
      </tbody>
    </table>
  </div>
</template>

<style scoped>

</style>