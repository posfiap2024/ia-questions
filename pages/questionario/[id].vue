<template>
  <div class="flex flex-col gap-12 max-w-3xl mx-auto py-16">
    <h1 class="text-3xl font-bold">
      Questionário com <span class="text-primary">IA</span>
    </h1>

    <Questionnaire
      v-if="status === 'success'"
      v-bind="{ questions }"
    />

    <Loading v-else />
  </div>
</template>

<script setup lang="ts">
  definePageMeta({ middleware: ['auth'] })
  useHead({ title: 'Questionário com IA' })

  const { id } = useRoute().params

  const { data, status } = await useLazyFetch(() => `/api/questions/${id}`, { server: false })

  const questions = computed(() => data.value?.questions || [])
</script>
