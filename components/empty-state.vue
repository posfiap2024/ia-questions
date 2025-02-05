<template>
  <div class="w-full flex flex-col items-center justify-center gap-4">
    <img
      src="/empty-list.png"
      alt=""
      class="block w-1/3 grayscale mix-blend-darken"
    />

    <div class="flex flex-col gap-2">
      <p class="text-xl font-bold text-neutral-900 text-center">
        Não encontramos nada
      </p>

      <p class="text-md text-neutral-500 text-center">
        <template v-if="admin">
          Crie um novo questionário para os alunos responderem.
        </template>

        <template v-else>
          Volte mais tarde para ver os questionários disponíveis.
        </template>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    admin?: boolean
  }

  withDefaults(defineProps<Props>(), {
    admin: false,
  })
</script>
