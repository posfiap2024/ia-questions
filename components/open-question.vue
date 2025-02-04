<template>
  <article class="flex flex-col gap-6 min-h-72">
    <h2 class="text-xl font-bold">
      {{ statement }}
    </h2>

    <textarea
      class="w-full h-24 rounded-md border border-gray-300 outline-indigo-600 py-3 px-4 text-sm resize-none"
      :class="{
        'border-red-400': correct === false,
        'border-green-400': correct === true
      }"
      placeholder="Escreva sua resposta aqui"
      v-model="studentAnswer"
    />

    <p class="text-sm text-gray-500">
      {{ feedback }}
    </p>

    <div class="flex-auto">
      <UiButton
        v-if="!hideButton"
        variant="primary"
        :disabled="answered"
        @click="handleAnswer"
      >
        Revisar
      </UiButton>
    </div>
  </article>
</template>

<script setup lang="ts">
  interface Props {
    statement: string,
    answer: string,
    preview?: boolean
  }

  interface Emits {
    (e: 'answer', answer: string): void
  }

  const props = withDefaults(defineProps<Props>(), {
    preview: false
  })

  const emit = defineEmits<Emits>()

  const studentAnswer = defineModel<string>({ default: '' })
  const answered = ref(false)
  const correct = ref()
  const feedback = ref(props.preview ? props.answer : '')
  const hideButton = computed(() => props.preview || answered.value)

  async function handleAnswer() {
    if (answered.value) return
    answered.value = true

    const response = await $fetch('/api/questions/review', {
      method: 'POST',
      body: {
        question: props.statement,
        answer: props.answer,
        student_answer: studentAnswer.value
      }
    })

    correct.value = response.correct
    feedback.value = response.feedback

    emit('answer', studentAnswer.value)
  }
</script>
