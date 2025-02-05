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

    <main
      v-if="hasQuestionnaires"
      class="grid grid-cols-1 md:grid-cols-3 gap-4"
    >
      <QuestionnaireCard
        v-for="questionnaire in questionnaires"
        :key="questionnaire.id"
        v-bind="{ questionnaire }"
        admin
        @delete="() => deleteQuestionnaire(questionnaire.id)"
      />
    </main>

    <EmptyState
      v-else
      admin
    />
  </div>
</template>

<script setup lang="ts">
  import { NuxtLink } from '#components';

  definePageMeta({ middleware: ['admin'], layout: 'base' })
  useHead({ title: 'Admin' })

  const { data, refresh } = await useFetch('/api/admin/questionnaires')
  const questionnaires = computed(() => data.value || [])
  const hasQuestionnaires = computed(() => questionnaires.value.length > 0)

  async function deleteQuestionnaire(questionnaireId: number) {
    await $fetch(`/api/admin/questionnaires/${questionnaireId}`, { method: 'DELETE' })
    refresh()
  }
</script>
