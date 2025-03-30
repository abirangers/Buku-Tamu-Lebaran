<!-- 
  SiteHeader.vue - Komponen header website
  Bertanggung jawab untuk navigasi, pergantian tema gelap/terang, dan responsive mobile menu
 -->
<template>
  <header 
    :class="[
      'fixed top-0 w-full transition-all duration-300 z-50',
      scrolled ? 'bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md shadow-sm border-b border-neutral-200/80 dark:border-neutral-700/80' : 'bg-transparent border-transparent'
    ]"
  >
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo dan brand -->
        <div class="flex-shrink-0 flex items-center">
          <NuxtLink 
            to="/" 
            :class="[
              'font-bold text-xl flex items-center transition-colors duration-300',
              scrolled ? 'text-primary-600 dark:text-primary-400' : 'text-white'
            ]"
          >
            <UIcon 
              name="i-heroicons-book-open" 
              class="h-6 w-6 mr-2" 
            />
            <span>Ucapin Lebaran</span>
          </NuxtLink>
        </div>

        <!-- Menu desktop - toggle dark mode dan logout -->
        <div class="hidden md:ml-6 md:flex md:items-center md:space-x-4">
          <!-- Tombol Logout (hanya tampil jika user login) -->
          <UButton
            v-if="isLoggedIn"
            color="error"
            variant="ghost"
            icon="i-heroicons-arrow-right-on-rectangle"
            aria-label="Logout"
            :class="[
              'transition-colors duration-200',
              scrolled ? 'hover:bg-red-100 dark:hover:bg-red-900/30' : 'text-white hover:bg-white/20'
            ]"
            @click="handleLogout"
          >
            Logout
          </UButton>
          
          <!-- Toggle Dark Mode -->
          <UButton
            v-if="!isDark"
            color="neutral"
            variant="ghost"
            icon="i-heroicons-moon"
            aria-label="Switch to dark mode"
            :class="[
              'transition-colors duration-200',
              scrolled ? 'hover:bg-gray-100 dark:hover:bg-neutral-700' : 'text-white hover:bg-white/20'
            ]"
            @click="toggleColorMode"
          />
          <UButton
            v-else
            color="warning"
            variant="ghost"
            icon="i-heroicons-sun"
            aria-label="Switch to light mode"
            :class="[
              'transition-colors duration-200',
              scrolled ? 'hover:bg-yellow-100 dark:hover:bg-yellow-900/30' : 'text-white hover:bg-white/20'
            ]"
            @click="toggleColorMode"
          />
        </div>

        <!-- Menu Mobile - toggle dark mode dan logout -->
        <div class="flex items-center md:hidden space-x-2">
          <!-- Tombol Logout Mobile (hanya tampil jika user login) -->
          <UButton
            v-if="isLoggedIn"
            color="error"
            variant="ghost"
            icon="i-heroicons-arrow-right-on-rectangle"
            aria-label="Logout"
            :class="[
              'transition-colors duration-200',
              scrolled ? 'hover:bg-red-100 dark:hover:bg-red-900/30' : 'text-white hover:bg-white/20'
            ]"
            @click="handleLogout"
          />
          
          <!-- Toggle Dark Mode Mobile -->
          <UButton
            v-if="!isDark"
            color="neutral"
            variant="ghost"
            icon="i-heroicons-moon"
            aria-label="Switch to dark mode"
            @click="toggleColorMode"
            :class="[
              'transition-colors duration-200',
              scrolled ? 'hover:bg-gray-100 dark:hover:bg-neutral-700' : 'text-white hover:bg-white/20'
            ]"
          />
          <UButton
            v-else
            color="warning"
            variant="ghost"
            icon="i-heroicons-sun"
            aria-label="Switch to light mode"
            :class="[
              'transition-colors duration-200',
              scrolled ? 'hover:bg-yellow-100 dark:hover:bg-yellow-900/30' : 'text-white hover:bg-white/20'
            ]"
            @click="toggleColorMode"
          />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

// State untuk scroll position
const scrolled = ref(false);
const scrollThreshold = 50; // Ambang batas scroll dalam pixel

// Function untuk mendeteksi scroll
const handleScroll = () => {
  scrolled.value = window.scrollY > scrollThreshold;
};

// Menambahkan event listener saat komponen di-mount
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  // Panggil sekali untuk menginisialisasi state
  handleScroll();
});

// Membersihkan event listener saat komponen di-unmount
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

// Auth state dengan composable useAuth
const { isLoggedIn, logout } = useAuth();

// Fungsi untuk logout yang memanggil composable
const handleLogout = async () => {
  await logout();
};

// Dark mode
const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === 'dark');

// Toggle dark/light mode
const toggleColorMode = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark';
};
</script>

<style scoped>
/* Transitions mobile menu */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style> 