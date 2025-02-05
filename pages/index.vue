<template>
  <div class="flex flex-col gap-10">
    <header class="flex justify-between items-center">
      <div class="flex flex-col gap-1">
        <h1 class="text-md font-medium text-neutral-700">Home</h1>
        <UserGreeting />
      </div>
    </header>

    <main class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <QuestionnaireCard
        v-for="questionnaire in questionnaires"
        :key="questionnaire.id"
        v-bind="{ questionnaire }"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({ middleware: ['student'], layout: 'base' })
  useHead({ title: 'Home' })

  const { data: questionnaires } = await useFetch('/api/questions')
</script>
