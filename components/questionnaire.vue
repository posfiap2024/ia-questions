<template>
  <template v-if="status === 'success'">
    <KeepAlive>
      <component
        :is="QuestionComponent"
        :key="activeQuestion"
        v-bind="question"
      />
    </KeepAlive>

    <div class="flex justify-between gap-4 mt-6">
      <UiButton
        variant="secondary"
        :disabled="activeQuestion === 0"
        @click="previousQuestion"
      >
        Anterior
      </UiButton>

      <UiButton
        variant="primary"
        :disabled="activeQuestion === questions.length - 1"
        @click="nextQuestion"
      >
        Próximo
      </UiButton>
    </div>
  </template>

  <Loading v-else />
</template>

<script setup lang="ts">
  import OpenQuestion from './open-question.vue'
  import ClosedQuestion from './closed-question.vue'

  const { data: questionnaire, status } = await useLazyFetch(
    '/api/questions',
    {
      method: 'POST',
      body: {
        count: 5,
        subject: 'história',
        topic: 'Brasil Império'
      },
      server: false
    }
  )

  const activeQuestion = ref(0)
  const questions = computed(() => questionnaire.value?.questions || [])
  const question = computed(() => questions.value[activeQuestion.value])

  const QuestionComponent = computed(() => {
    switch (question.value?.type) {
      case 'open':
        return OpenQuestion
      case 'closed':
        return ClosedQuestion
    }
  })

  function nextQuestion() {
    activeQuestion.value++
  }

  function previousQuestion() {
    activeQuestion.value--
  }
</script>
