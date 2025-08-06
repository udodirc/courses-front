<template>
  <table class="w-full border text-sm border-collapse border-gray-200">
    <thead class="bg-gray-100 text-left">
    <tr>
      <slot name="head" />
    </tr>
    </thead>
    <tbody>
    <slot name="body" />
    </tbody>
  </table>
</template>

<style scoped>

</style>