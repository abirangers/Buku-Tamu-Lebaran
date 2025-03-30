import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ]
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/ui',
  ],

  runtimeConfig: {
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
    public: {
      supabaseUrl: process.env.NUXT_SUPABASE_URL,
      supabaseKey: process.env.NUXT_SUPABASE_KEY,
      supabaseBucketName: process.env.NUXT_SUPABASE_BUCKET_NAME,
    }
  },

  fonts: {
    families: [
      { name: 'SUSE', provider: 'google' }
    ]
  },

  ui: {
    // global: true,
    // icons: ['heroicons']
  },
  
  experimental: {
    // Aktifkan prefetching untuk meningkatkan performa
    asyncContext: true,
    payloadExtraction: true,
    componentIslands: true
  },
  
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
    // Setelan cache control
    head: {
      htmlAttrs: {
        lang: 'id',
      },
      meta: [
        { 'http-equiv': 'x-dns-prefetch-control', content: 'on' }
      ]
    }
  },
  
  nitro: {
    compressPublicAssets: true,
    routeRules: {
      // Optimasi caching untuk halaman utama
      '/': { prerender: true, cache: { swr: true } }
    }
  },
  
  image: {
    quality: 80,
    format: ['webp', 'jpg', 'png']
  },

  icon: {
    mode: 'local'
  },

  build: {
    transpile: ['gsap']
  },
})