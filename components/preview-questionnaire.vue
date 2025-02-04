<template>
  <div class="flex flex-col gap-4">
    <Questionnaire
      :questions="questions"
      :preview="true"
    />

    <div class="flex w-full justify-end gap-4">
      <UiButton
        variant="secondary"
        type="button"
        :disabled="loading"
        @click="$emit('regenerate')"
      >
        Regerar questionário
      </UiButton>

      <UiButton
        type="button"
        :loading="loading"
        @click="$emit('approve')"
      >
        Aprovar questionário
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    questions: any[]
    loading?: boolean
  }

  interface Emits {
    (event: 'regenerate'): void
    (event: 'approve'): void
  }

  defineProps<Props>()
  defineEmits<Emits>()
</script>
