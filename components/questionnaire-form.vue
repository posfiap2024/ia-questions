<template>
  <form
    class="flex flex-col gap-4 bg-neutral-100 p-6 rounded-2xl shadow-md"
    @submit.prevent="handleSubmit"
  >
    <label class="flex flex-col gap-2">
      <span class="text-md font-bold">Disciplina</span>

      <input
        type="text"
        class="w-full h-10 px-4 border border-neutral-300 rounded-md"
        placeholder="Ex: História"
        v-model="state.subject"
        required
      />
    </label>

    <label class="flex flex-col gap-2">
      <span class="text-md font-bold">Tema</span>

      <input
        type="text"
        class="w-full h-10 px-4 border border-neutral-300 rounded-md"
        placeholder="Ex: Revolução Francesa"
        v-model="state.topic"
        required
      />
    </label>

    <label class="flex flex-col gap-2">
      <span class="text-md font-bold">Quantidade de perguntas</span>

      <input
        type="number"
        min="5"
        max="20"
        class="w-full h-10 px-4 border border-neutral-300 rounded-md"
        v-model="state.questionCount"
        required
      />
    </label>

    <UiButton
      type="submit"
      variant="primary"
      class="mt-6"
    >
      Gerar questionário
    </UiButton>
  </form>
</template>

<script lang="ts" setup>
  const state = defineModel({
    default: {
      subject: '',
      topic: '',
      questionCount: 5
    }
  })

  interface Emits {
    (event: 'submit'): void
  }

  const emit = defineEmits<Emits>()

  function handleSubmit() {
    emit('submit')
  }
</script>
