<template>
  <button
    type="button"
    class="flex items-center justify-center gap-2 px-4 h-10 rounded-md"
    :class="classes"
  >
    <span class="text-sm font-bold">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
  interface Props {
    variant: 'primary' | 'secondary'
  }

  const props = defineProps<Props>()

  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-500 text-white',
    secondary: 'border border-indigo-600 hover:border-indigo-500 text-indigo-600 hover:text-indigo-500'
  }

  const classes = computed(() => variants[props.variant])
</script>
