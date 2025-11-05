<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Recetas Médicas',
  meta: [
    { name: 'description', content: 'Sistema de gestión de recetas médicas' }
  ]
})
</script>
