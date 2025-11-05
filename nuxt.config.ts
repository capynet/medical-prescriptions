// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',

  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-primevue',
    '@sidebase/nuxt-auth',
    '@prisma/nuxt',
  ],

  css: [
    'primevue/resources/themes/aura-light-blue/theme.css',
    'primeicons/primeicons.css',
    '~/assets/scss/main.scss',
  ],

  primevue: {
    options: {
      ripple: true,
      inputStyle: 'filled',
    },
    components: {
      include: '*',
    },
    directives: {
      include: ['Tooltip', 'Ripple'],
    },
  },

  auth: {
    provider: {
      type: 'authjs',
    },
    globalAppMiddleware: {
      isEnabled: true,
    },
  },

  runtimeConfig: {
    // Private keys (server-side only)
    authSecret: process.env.AUTH_SECRET,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    databaseUrl: process.env.DATABASE_URL,
    allowedEmails: process.env.ALLOWED_EMAILS,

    // Public keys (exposed to client)
    public: {
      appUrl: process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3000',
    },
  },

  typescript: {
    strict: true,
    typeCheck: true,
  },

  app: {
    head: {
      title: 'Recetas Médicas',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Sistema de gestión de recetas médicas' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },
})
