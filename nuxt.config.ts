import tailwindcss from "@tailwindcss/vite";


// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  debug: false,
  css:['./app/assets/css/main.css'],

  runtimeConfig: {
	wsAllowedOrigins: process.env.WS_ALLOWED_ORIGINS 
    	? process.env.WS_ALLOWED_ORIGINS.split(',') 
    	: ['http://localhost:3000'],
    public:{
		baseUrl: "http://localhost:3000",
		
    }
  },

  vite: {
    plugins: [
      tailwindcss(),
    ]
  },

  nitro: {
	experimental: {
		websocket: true,
	}
  },

  modules: [
    '@nuxt/image', 
    '@nuxtjs/supabase', 
    'nuxt-auth-utils'
  ],

  plugins: [
    '~/plugins/user_supabase.client.ts'
  ],

  supabase: {
    redirect: false,
    cookieOptions: {
      maxAge: 60 * 60 * 24 * 3,
      sameSite: 'lax',
      secure: true
    },
    clientOptions: {
      auth: {
        flowType: 'pkce',
        autoRefreshToken: true,
        persistSession: true
      }
    }
  },
  ssr: false,

})