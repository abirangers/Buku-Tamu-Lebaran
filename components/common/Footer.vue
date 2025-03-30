<!-- 
  Footer.vue - Komponen footer website
  Menampilkan informasi copyright, kredit, dan link penting
 -->
<template>
  <footer class="mt-auto py-8 px-6 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
    <div class="max-w-5xl mx-auto">
      <div class="flex flex-col items-center justify-center space-y-4">
        <!-- Logo dan Title -->
        <div class="text-center">
          <h3 class="text-xl font-bold text-neutral-900 dark:text-white inline-flex items-center">
            <UIcon name="i-heroicons-book-open" class="mr-2 h-5 w-5 text-primary-500" />
            Ucapin Lebaran
          </h3>
        </div>
        
        <!-- Divider dengan ornamen -->
        <div class="w-full max-w-xs flex items-center my-3">
          <div class="flex-1 h-px bg-neutral-200 dark:bg-neutral-700"></div>
          <UIcon name="i-heroicons-star" class="h-4 w-4 mx-3 text-primary-500" />
          <div class="flex-1 h-px bg-neutral-200 dark:bg-neutral-700"></div>
        </div>
        
        <!-- Copyright & Credits -->
        <div class="text-center">
          <p class="text-neutral-500 dark:text-neutral-400 text-sm mb-2">
            &copy; {{ new Date().getFullYear() }} Ucapin Lebaran • 
            <span class="mx-1">Selamat Hari Raya Idul Fitri</span> •
            <span class="ml-1">Mohon Maaf Lahir dan Batin</span>
          </p>
          <p class="text-neutral-400 dark:text-neutral-500 text-xs">
            Dibuat dengan 
            <UIcon name="i-heroicons-heart" class="h-3 w-3 inline-block text-red-500 mx-0.5" />
            oleh <NuxtLink to="https://bingers.vercel.app" target="_blank" class="font-medium text-primary-600 dark:text-primary-400">Ahmad Aby Ayyasi</NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
defineOptions({
  name: 'SiteFooter'
});
</script>

<style scoped>
footer {
  position: relative;
}

footer::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, 
    rgba(var(--color-primary-500), 0) 0%, 
    rgba(var(--color-primary-500), 0.5) 50%, 
    rgba(var(--color-primary-500), 0) 100%);
}
</style> 