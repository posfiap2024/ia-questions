<template>
  <ProjectTitle />

  <p v-if="isLoading">Loading...</p>
  <pre v-else>{{ data }}</pre>

  <button @click="() => alertMessage('clicked')">Alert</button>
</template>

<script setup lang="ts">
  const { data, status } = await useFetch('/api/questions?count=5&subject=filosofia&topic=kant', { lazy: true })

  const isLoading = computed(() => status.value === 'pending')

  useHead({
    title: 'IA Questions'
  })

  watch(status, () => {
    console.log('status changed', status.value)
  })

  function alertMessage(msg: string) {
    alert(msg)
  }
</script>

