<template>
  <div class="flex flex-col gap-6 bg-neutral-100 p-6 rounded-2xl shadow-md">
    <div class="text-xl font-bold animate-pulse">
      {{ title }}
    </div>

    <div class="flex flex-col gap-4 animate-pulse">
      <div class="w-full h-9 bg-gray-200 rounded-xs"></div>
      <div class="w-full h-9 bg-gray-200 rounded-xs"></div>
      <div class="w-full h-9 bg-gray-200 rounded-xs"></div>
      <div class="w-full h-9 bg-gray-200 rounded-xs"></div>
      <div class="w-full h-9 bg-gray-200 rounded-xs"></div>
      <div class="w-full h-9 bg-gray-200 rounded-xs"></div>
      <div class="w-full h-9 bg-gray-200 rounded-xs"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  interface Props {
    title?: string
  }

  withDefaults(defineProps<Props>(), {
    title: 'Carregando...'
  })
</script>
