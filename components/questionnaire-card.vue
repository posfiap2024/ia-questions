<template>
  <article
    :key="id"
    class="flex flex-col gap-6 p-4 shadow-lg rounder-md bg-neutral-100 rounded-md"
  >
    <span class="flex-none w-min py-1 px-4 bg-emerald-200 text-emerald-700 text-xs font-bold rounded-2xl">
      Disponível
    </span>

    <div class="flex flex-col gap-1">
      <h2 class="text-sm font-medium">
        {{ questionnaire.subject }}
      </h2>

      <p class="text-xl font-bold">
        {{ questionnaire.topic }}
      </p>
    </div>

    <div class="flex gap-2">
      <UiButton
        :as="NuxtLink"
        :to="path"
        variant="primary"
        class="flex-1"
      >
        Acessar
      </UiButton>

      <UiButton
        v-if="props.admin"
        as="button"
        type="button"
        variant="danger"
        class="flex-1"
        @click="$emit('delete', id)"
      >
        Excluir
      </UiButton>
    </div>
  </article>
</template>

<script setup lang="ts">
  import { NuxtLink } from '#components';

  interface Props {
    questionnaire: Questionnaire,
    admin?: boolean
  }

  interface Emits {
    (event: 'delete', questionnaireId: number): void
  }

  const id = computed(() => props.questionnaire.id!)

  const props = withDefaults(defineProps<Props>(), {
    admin: false
  })

  defineEmits<Emits>()

  const path = props.admin ? `/admin/questionario/${id.value}` : `/questionario/${id.value}`
</script>
