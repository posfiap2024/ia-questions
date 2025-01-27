<template>
  <button
    type="button"
    class="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-100"
    :class="{
      'hover:bg-gray-200': !answered,
      'bg-green-400': isCorrect,
      'bg-red-400': isIncorrect
    }"
    @click="handleAnswer"
  >
    <span class="text-sm font-bold">
      {{ text }}
    </span>
  </button>
</template>

<script setup lang="ts">
  interface Props {
    index: number,
    text: string,
    correct: boolean,
    answered: boolean,
    highlight: boolean
  }

  interface Emits {
    (e: 'answer', index: number): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  const isCorrect = computed(() => props.answered && props.correct)
  const isIncorrect = computed(() => props.highlight && !props.correct)

  function handleAnswer() {
    if (props.answered) return
    emit('answer', props.index)
  }
</script>
