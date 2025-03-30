<template>
  <div class="relative">
    <!-- 
      Menggunakan ParallaxEffect sebagai wrapper untuk memberikan efek parallax
      pada latar belakang saat pengguna berinteraksi dengan mouse atau scroll 
    -->
    <div class="text-white animate-fade-in relative overflow-hidden min-h-screen">
      <!-- Parallax Effect -->
      <ParallaxEffect>
        <!-- Animated Content -->
        <div class="relative z-10 py-16 md:py-20 px-8 md:px-12 text-center flex flex-col justify-center items-center min-h-screen pt-16">
          <!-- Animated Text dengan efek fade-in dan slide-up sequence -->
          <AnimatedText />
          
          <!-- Tombol Call to Action -->
          <ScrollCta />
        </div>
      </ParallaxEffect>

      <!-- Particle Effect -->
      <ParticleBackground />
      
      <!-- Firework Effect -->
      <FireworkEffect />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * TheHero Component
 * 
 * Halaman pembuka dengan berbagai efek animasi dan interaktif
 * Menggunakan beberapa komponen animasi dan efek visual
 */

// Import komponen interaktif
import ParallaxEffect from '~/components/hero/ParallaxEffect.vue';
import ParticleBackground from '~/components/hero/ParticleBackground.vue';
import FireworkEffect from '~/components/hero/FireworkEffect.vue';
import AnimatedText from '~/components/hero/AnimatedText.vue';
import ScrollCta from '~/components/hero/ScrollCta.vue';

// Menggunakan variabel CSS untuk tinggi navbar, bisa digunakan di seluruh aplikasi
onMounted(() => {
  // Menghitung tinggi navbar yang sebenarnya
  const navbar = document.querySelector('header');
  if (navbar) {
    const navbarHeight = navbar.offsetHeight;
    document.documentElement.style.setProperty('--navbar-height', `${navbarHeight}px`);
  }
});

defineOptions({
  name: 'TheHero'
});
</script>

<style scoped>
/* Custom CSS untuk menyesuaikan tinggi hero section */
.min-h-screen {
  height: 100vh;
}
</style>