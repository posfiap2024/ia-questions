<template>
  <NuxtLayout>
    <Transition
      mode="out-in"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      enter-active-class="transition ease duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
      leave-active-class="transition ease duration-300"
    >
      <NuxtPage />
    </Transition>
  </NuxtLayout>
</template>
