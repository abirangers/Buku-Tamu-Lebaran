<template>
  <div>
    <TheHero />

    <div class="py-12 px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10 max-w-6xl mx-auto">
      <div class="col-span-1">
        <div class="sticky top-24">
          <h2 class="text-xl font-semibold mb-5 text-neutral-800 dark:text-neutral-200 border-b border-neutral-200 dark:border-neutral-800 pb-2">
            Kirim Ucapan
          </h2>
          <ClientOnly>
            <GreetingForm />
            <template #fallback>
              <div class="p-6 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 animate-pulse space-y-4">
                <div class="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4"></div>
                <div class="h-24 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                <div class="h-12 bg-neutral-200 dark:bg-neutral-700 rounded mt-4"></div>
              </div>
            </template>
          </ClientOnly>
        </div>
      </div>

      <div class="col-span-1 lg:col-span-2">
        <h2 class="text-xl font-semibold mb-5 text-neutral-800 dark:text-neutral-200 border-b border-neutral-200 dark:border-neutral-800 pb-2">
          Ucapan & Kenangan
        </h2>
        <GreetingFeed />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import TheHero from '~/components/common/TheHero.vue';

// Import GreetingForm normal (tidak lazy)
import GreetingForm from '~/components/greeting/GreetingForm.vue';

// Lazy load GreetingFeed dengan opsi tambahan
const GreetingFeed = defineAsyncComponent({
  loader: () => import('~/components/greeting/GreetingFeed.vue'),
  delay: 200, // menunggu 200ms sebelum menampilkan loading
  timeout: 5000, // timeout setelah 5 detik
  errorComponent: {
    template: `
      <div class="p-6 border border-red-200 dark:border-red-800 rounded-xl bg-red-50 dark:bg-red-900/20 text-center max-w-lg mx-auto shadow-sm">
        <UIcon name="i-heroicons-exclamation-triangle" class="h-8 w-8 text-red-500 mx-auto mb-2" />
        <p class="font-medium text-red-700 dark:text-red-400">Gagal memuat komponen</p>
        <UButton class="mt-4" icon="i-heroicons-arrow-path" color="error" variant="soft" @click="window.location.reload()">
          Muat Ulang
        </UButton>
      </div>
    `
  },
  suspensible: false // tidak menggunakan Suspense untuk lazy loading komponen ini
});

definePageMeta({
  title: 'Beranda'
})
</script>
