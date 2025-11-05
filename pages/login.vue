<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Recetas Médicas
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Sistema de gestión de prescripciones
        </p>
      </div>
      <div class="mt-8 space-y-6">
        <div>
          <Button
            label="Iniciar sesión con Google"
            icon="pi pi-google"
            class="w-full"
            size="large"
            @click="handleSignIn"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  auth: false,
  layout: false,
})

const { signIn } = useAuth()

const handleSignIn = async () => {
  await signIn('google', { callbackUrl: '/' })
}
</script>
