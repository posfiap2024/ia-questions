<template>
  <div class="flex flex-col gap-12 max-w-3xl mx-auto py-16">
    <h1 class="text-3xl font-bold">
      Questionário com <span class="text-primary">IA</span>
    </h1>

    <Questionnaire />
  </div>
</template>

<script setup lang="ts">
  definePageMeta({ middleware: ['auth'] })
  useHead({ title: 'Questionário com IA' })
</script>
