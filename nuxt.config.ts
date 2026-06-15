import tailwindcss from "@tailwindcss/vite";


// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  debug: true,
  css:['./app/assets/css/main.css'],

  runtimeConfig: {
    public:{
      baseUrl: "http://localhost:3000"
    }
  },

  vite: {
    plugins: [
      tailwindcss(),
    ]
  },

  modules: [
    '@nuxt/image', 
    '@nuxtjs/supabase', 
    'nuxt-auth-utils'
  ],

  supabase: {
    redirect: false
  },

})