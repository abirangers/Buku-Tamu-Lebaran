<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
// Konfigurasi head/meta aplikasi
useHead({
  title: 'Ucapin Lebaran',
  meta: [
    { name: 'description', content: 'Platform digital untuk berbagi ucapan Hari Raya Idul Fitri bersama keluarga dan teman.' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'format-detection', content: 'telephone=no' },
    { name: 'theme-color', content: '#10b981' },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: 'Ucapin Lebaran' },
    { property: 'og:description', content: 'Platform digital untuk berbagi ucapan Hari Raya Idul Fitri bersama keluarga dan teman.' },
    { property: 'og:image', content: '/og-image.jpg' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/images/p-icon.svg' },
    { rel: 'preload', href: '/images/bg-heroo.jpg', as: 'image' }
  ]
})

// Gunakan composable SEO untuk meningkatkan SEO
useSeoMeta({
  title: 'Ucapin Lebaran',
  ogTitle: 'Ucapin Lebaran',
  description: 'Platform digital untuk berbagi ucapan Hari Raya Idul Fitri bersama keluarga dan teman.',
  ogDescription: 'Platform digital untuk berbagi ucapan Hari Raya Idul Fitri bersama keluarga dan teman.',
  ogImage: '/og-image.jpg',
  twitterCard: 'summary_large_image',
})
</script>