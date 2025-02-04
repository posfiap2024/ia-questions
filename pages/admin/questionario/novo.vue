<template>
  <div class="flex flex-col flex-1 gap-8">
    <h1 class="text-3xl font-bold">
      Novo questionário
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
    </Transition>
  </div>
</template>

<script lang="ts" setup>
  definePageMeta({ middleware: ['protected'], layout: 'base' })
  useHead({ title: 'Novo questionário' })

  const formData = ref({
    subject: '',
    topic: '',
    questionCount: 5
  })

  const questions = ref<any[]>([])
  const state = ref<'ready' | 'loading' | 'fetching'>('ready')
  const hasGeneratedQuestions = computed(() => questions.value.length > 0)

  async function generateQuestionnaire() {
    const { subject, topic, questionCount } = formData.value

    state.value = 'loading'

    const response = await $fetch('/api/questions/generate', {
      method: 'POST',
      body: {
        subject: subject,
        topic: topic,
        count: questionCount
      }
    })

    state.value = 'ready'
    questions.value = response.questions
  }

  async function saveQuestionnaire() {
    const { subject, topic } = formData.value
    state.value = 'fetching'

    await $fetch('/api/questions', {
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

  watch(questions, () => {
    console.log(questions.value)
  })
</script>
