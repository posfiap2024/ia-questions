<template>
  <component
    :is="as"
    class="flex items-center justify-center gap-2 px-4 h-10 rounded-md cursor-pointer disabled:bg-neutral-300 disabled:cursor-not-allowed disabled:border-0 disabled:text-neutral-400"
    :class="classes"
    :disabled="disabled"
  >
    <span class="text-sm font-bold">
      <slot />
    </span>
  </component>
</template>

<script setup lang="ts">
  interface Props {
    as?: any
    variant?: 'primary' | 'secondary'
    loading?: boolean,
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    as: 'button',
    variant: 'primary'
  })

  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-500 text-white',
    secondary: 'border border-indigo-600 hover:border-indigo-500 text-indigo-600 hover:text-indigo-500'
  }

  const classes = computed(() => [variants[props.variant], {
    'opacity-50 animation-pulse pointer-events-none': props.loading,
  }])
</script>
