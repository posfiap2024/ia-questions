<template>
  <div class="flex w-full min-h-svh">
    <div class="flex flex-col gap-12 w-full max-w-3xl mx-auto py-16">
      <UserGreeting />

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <article
          v-for="question in questions"
          :key="question.id"
          class="flex flex-col gap-4 p-4 shadow-lg rounder-md"
        >
          <span class="flex-none w-min py-1 px-4 bg-emerald-200 text-emerald-700 text-sm font-bold rounded-2xl">Disponível</span>

          <h2 class="text-xl font-bold">Disciplina: {{ question.subject }}</h2>

          <p class="font-md">Tema: {{ question.topic }}</p>

          <UiButton
            :as="NuxtLink"
            :to="`/questionario/${question.id}`"
            variant="primary"
          >
            Acessar
          </UiButton>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { NuxtLink } from '#components';

  definePageMeta({ middleware: ['auth'] })
  useHead({ title: 'Questionário com IA' })

  const { data } = await useFetch('/api/questions')
  const questions = computed(() => data.value)
</script>
