<template>
  <div class="flex flex-col gap-10">
    <header class="flex justify-between items-center">
      <div class="flex flex-col gap-1">
        <h1 class="text-md font-medium text-neutral-700">Home</h1>
        <UserGreeting />
      </div>
    </header>

    <main
      v-if="hasQuestionnaires"
      class="grid grid-cols-1 md:grid-cols-3 gap-4"
    >
      <QuestionnaireCard
        v-for="questionnaire in questionnaires"
        :key="questionnaire.id"
        v-bind="{ questionnaire }"
      />
    </main>

    <EmptyState v-else />
  </div>
</template>

<script setup lang="ts">
  definePageMeta({ middleware: ['student'], layout: 'base' })
  useHead({ title: 'Home' })

  const { data } = await useFetch('/api/questionnaires')
  const questionnaires = computed(() => data.value || [])
  const hasQuestionnaires = computed(() => questionnaires.value.length > 0)
</script>
