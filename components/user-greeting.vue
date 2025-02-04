<template>
  <component
    :is="as"
    class="text-3xl font-bold"
  >
    Olá, {{ username }}!
  </component>
</template>

<script setup lang="ts">
  interface Props {
    as?: string,
  }

  withDefaults(defineProps<Props>(), {
    as: 'p'
  })

  const auth = useAuth()
  const username = computed(() => auth.user?.username)
</script>
