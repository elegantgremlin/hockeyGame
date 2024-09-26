import Aura from '@primevue/themes/aura';


// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@primevue/nuxt-module', '@nuxtjs/tailwindcss', '@pinia/nuxt'],
  primevue: {
      options: {
          theme: {
              preset: Aura
          }
      }
  },
  tailwindcss: {
    cssPath: ['~/assets/css/tailwind.css', { injectPosition: "first" }],
    configPath: 'tailwind.config',
    exposeConfig: {
      level: 2
    },
    config: {},
    viewer: true,
  }
})