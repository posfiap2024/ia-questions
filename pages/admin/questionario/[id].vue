<template>
  <div class="flex flex-col gap-12 max-w-3xl mx-auto">
    <div class="flex flex-col gap-1">
      <h1 class="text-md font-medium text-neutral-700">
        {{  questionnaire?.subject  }}
      </h1>

      <p class="text-3xl font-bold">
        {{ questionnaire?.topic }}
      </p>
    </div>

    <FadeTransition>
      <Loading
        v-if="status === 'pending'"
        title="Carregando questionário..."
      />

      <Questionnaire
        v-else-if="status === 'success'"
        :key="questionnaire?.id"
        :preview="true"
        v-bind="{ questions }"
      />
    </FadeTransition>
  </div>
</template>

<script setup lang="ts">
import Questionnaire from '~/components/questionnaire.vue';

  definePageMeta({ middleware: ['admin'], layout: 'base' })
  useHead({ title: 'Questionário com IA' })

  const { id } = useRoute().params
  const { data: questionnaire, status } = await useLazyFetch<Questionnaire>(
    () => `/api/admin/questionnaires/${id}`,
    { server: false }
  )

  const questions = computed(() => questionnaire.value?.questions || [])
</script>
