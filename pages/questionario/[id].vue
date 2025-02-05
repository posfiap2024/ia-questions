<template>
  <div class="flex flex-col gap-12 max-w-3xl mx-auto py-16">
    <h1 class="text-3xl font-bold">
      Questionário com <span class="text-primary">IA</span>
    </h1>

    <Transition
      mode="out-in"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      enter-active-class="transition ease duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
      leave-active-class="transition ease duration-300"
    >
      <Questionnaire
        v-if="status === 'success'"
        :key="questionnaire?.id"
        v-bind="{ questions }"
      />

      <Loading v-else />
    </Transition>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({ middleware: ['auth'], layout: 'base' })
  useHead({ title: 'Questionário com IA' })

  const { id } = useRoute().params

  const { data: questionnaire, status } = await useLazyFetch<Questionnaire>(
    () => `/api/questions/${id}`,
    { server: false }
  )

  const questions = computed(() => questionnaire.value?.questions || [])
</script>
