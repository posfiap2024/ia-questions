<template>
  <article
    :key="question.id"
    class="flex flex-col gap-4 p-4 shadow-lg rounder-md bg-neutral-100 rounded-md"
  >
    <span class="flex-none w-min py-1 px-4 bg-emerald-200 text-emerald-700 text-sm font-bold rounded-2xl">Disponível</span>

    <h2 class="text-xl font-bold">Disciplina: {{ question.subject }}</h2>

    <p class="font-md">Tema: {{ question.topic }}</p>

    <UiButton
      :as="NuxtLink"
      :to="path"
      variant="primary"
    >
      Acessar
    </UiButton>
  </article>
</template>

<script setup lang="ts">
  import { NuxtLink } from '#components';

  interface Props {
    question: any,
    admin?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    admin: false
  })

  const path = props.admin ? `/admin/questionario/${props.question.id}` : `/questionario/${props.question.id}`
</script>
