<template>
  <div class="flex flex-col flex-1 gap-8">
    <h1 class="text-3xl font-bold">
      Novo questionário
    </h1>

    <FadeTransition>
      <Loading v-if="state === 'loading'" />

      <PreviewQuestionnaire
        v-else-if="hasGeneratedQuestions"
        :questions="questions"
        :loading="state === 'fetching'"
        @approve="saveQuestionnaire"
        @regenerate="generateQuestionnaire"
      />

      <QuestionnaireForm
        v-else
        v-model="formData"
        @submit="generateQuestionnaire"
      />
    </FadeTransition>
  </div>
</template>

<script lang="ts" setup>
  definePageMeta({ middleware: ['admin'], layout: 'base' })
  useHead({ title: 'Novo questionário' })

  const formData = ref({
    subject: '',
    topic: '',
    questionCount: 5
  })

  const questionnaire = ref<Questionnaire>()
  const questions = computed(() => questionnaire.value?.questions || [])
  const state = ref<'ready' | 'loading' | 'fetching'>('ready')
  const hasGeneratedQuestions = computed(() => questions.value.length > 0)

  async function generateQuestionnaire() {
    const { subject, topic, questionCount } = formData.value

    state.value = 'loading'

    const response = await $fetch<Questionnaire>('/api/admin/questionnaires/generate', {
      method: 'POST',
      body: {
        subject: subject,
        topic: topic,
        count: questionCount
      }
    })

    state.value = 'ready'
    questionnaire.value = response
  }

  async function saveQuestionnaire() {
    const { subject, topic } = formData.value
    state.value = 'fetching'

    await $fetch('/api/admin/questionnaires', {
      method: 'POST',
      body: {
        subject: subject,
        topic: topic,
        questions: questions.value
      }
    })

    state.value = 'ready'
    navigateTo('/admin')
  }
</script>
