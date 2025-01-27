<template>
  <article class="flex flex-col gap-6 min-h-72">
    <h2 class="text-xl font-bold">
      {{ statement }}
    </h2>

    <div class="flex flex-col gap-4">
      <ClosedQuestionOption
        v-for="(option, index) in options"
        :key="index"
        :index="index"
        :text="option.text"
        :correct="option.correct"
        :answered="answered"
        :highlight="index === answer"
        @answer="handleAnswer"
      />
    </div>
  </article>
</template>

<script setup lang="ts">
  interface Props {
    statement: string,
    options: {
      text: string,
      correct: boolean
    }[]
  }

  defineProps<Props>()

  const answer = ref()
  const answered = computed(() => answer.value !== undefined)

  function handleAnswer(index: number) {
    answer.value = index
  }
</script>
