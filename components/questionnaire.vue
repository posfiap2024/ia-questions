<template>
  <div class="flex flex-col bg-neutral-100 p-6 rounded-2xl shadow-md">
    <KeepAlive>
      <FadeTransition>
        <component
          :is="QuestionComponent"
          v-bind="question"
          :key="activeQuestion"
          :preview="preview"
        />
      </FadeTransition>
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
  </div>
</template>

<script setup lang="ts">
  import OpenQuestion from './open-question.vue'
  import ClosedQuestion from './closed-question.vue'

  interface Props {
    questions: Question[],
    preview?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    preview: false
  })

  const activeQuestion = ref(0)
  const question = computed(() => props.questions[activeQuestion.value])

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
