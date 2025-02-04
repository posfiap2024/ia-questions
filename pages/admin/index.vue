<template>
  <div class="flex flex-col gap-10">
    <header class="flex justify-between items-center">
      <div class="flex flex-col gap-1">
        <h1 class="text-md font-medium text-neutral-700">Admin</h1>
        <UserGreeting />
      </div>

      <UiButton
        :as="NuxtLink"
        to="/admin/questionario/novo"
        variant="primary"
      >
        Criar questionário
      </UiButton>
    </header>

    <main class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <QuestionnaireCard
        v-for="question in questions"
        :key="question.id"
        :question="question"
        admin
      />
    </main>
  </div>
</template>

<script setup lang="ts">
  import { NuxtLink } from '#components';

  definePageMeta({ middleware: ['protected'], layout: 'base' })
  useHead({ title: 'Admin' })

  const { data: questions } = await useFetch('/api/admin/questions')
</script>
