<!-- 
  ParallaxEffect.vue - Komponen untuk memberikan efek parallax pada latar belakang
  saat pengguna melakukan scroll atau menggerakkan mouse
  Menggunakan GSAP untuk animasi yang lebih halus
-->
<template>
  <div 
    ref="parallaxContainer"
    class="parallax-container" 
    @mousemove="handleMouseMove"
  >
    <div 
      ref="parallaxBg"
      class="parallax-background"
    />
    
    <div 
      ref="parallaxContent"
      class="parallax-content"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

// Impor GSAP dengan cara yang tidak akan error saat build
let gsap: any;
let ScrollTrigger: any;

// Inisialisasi GSAP dan plugin dalam try-catch untuk menangani error
onMounted(async () => {
  try {
    // Gunakan dynamic import untuk memastikan bekerja dengan baik di server-side dan client-side
    gsap = (await import('gsap')).default;
    ScrollTrigger = (await import('gsap/ScrollTrigger')).ScrollTrigger;
    
    // Register plugin hanya jika dalam client-side
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
    
    // Setup setelah GSAP siap
    setupBackground();
    setupScrollAnimation();
    
    // Animasi awal saat komponen di-mount
    gsap.from(parallaxBg.value, {
      scale: 1.1,
      opacity: 0,
      duration: 1.5,
      ease: "power2.out"
    });
    
    gsap.from(parallaxOverlay.value, {
      opacity: 0,
      duration: 1.5,
      ease: "power2.out"
    });
  } catch (error) {
    console.warn('GSAP atau ScrollTrigger tidak dapat dimuat', error);
  }
});

// Refs untuk elemen
const parallaxContainer = ref<HTMLElement | null>(null);
const parallaxBg = ref<HTMLElement | null>(null);
const parallaxOverlay = ref<HTMLElement | null>(null);
const parallaxContent = ref<HTMLElement | null>(null);

// Timeline untuk animasi
let scrollTl: any;

// Efek parallax untuk mouse movement
const handleMouseMove = (e: MouseEvent) => {
  if (!parallaxContainer.value || !gsap) return;
  
  const rect = parallaxContainer.value.getBoundingClientRect();
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  
  // Calculate distance from center (normalized to -1 to 1)
  const distanceX = (e.clientX - rect.left - centerX) / centerX;
  const distanceY = (e.clientY - rect.top - centerY) / centerY;
  
  // Animate dengan GSAP untuk gerakan yang lebih halus
  gsap.to(parallaxBg.value, {
    x: distanceX * -15,
    y: distanceY * -15,
    duration: 0.5,
    ease: "power2.out"
  });
  
  gsap.to(parallaxOverlay.value, {
    x: distanceX * -8,
    y: distanceY * -8,
    duration: 0.5,
    ease: "power2.out"
  });
  
  gsap.to(parallaxContent.value, {
    x: distanceX * 5,
    y: distanceY * 5,
    duration: 0.5,
    ease: "power2.out"
  });
};

// Setup animasi saat scroll
const setupScrollAnimation = () => {
  if (!gsap || !ScrollTrigger || !parallaxContainer.value || !parallaxBg.value || !parallaxContent.value) return;
  
  scrollTl = gsap.timeline({
    scrollTrigger: {
      trigger: parallaxContainer.value,
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });
  
  // Animasi background bergerak lebih cepat saat scroll
  scrollTl.to(parallaxBg.value, {
    y: 100,
    ease: "none"
  }, 0);
  
  // Animasi overlay menjadi sedikit lebih transparan saat scroll
  scrollTl.to(parallaxOverlay.value, {
    opacity: 0.5,
    ease: "none"
  }, 0);
  
  // Animasi konten bergerak lebih lambat (efek parallax)
  scrollTl.to(parallaxContent.value, {
    y: -50,
    ease: "none"
  }, 0);
};

// Setup background image
const setupBackground = () => {
  if (parallaxBg.value) {
    parallaxBg.value.style.backgroundImage = `url('/images/bg-heroo.jpg')`;
  }
};

// Lifecycle hooks
onUnmounted(() => {
  // Cleanup ScrollTrigger
  if (scrollTl) {
    scrollTl.kill();
  }
  
  if (ScrollTrigger && typeof ScrollTrigger.getAll === 'function') {
    ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill());
  }
});
</script>

<style scoped>
.parallax-container {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.parallax-background {
  position: absolute;
  top: -50px;
  left: -50px;
  right: -50px;
  bottom: -50px;
  background-size: cover;
  background-position: center;
  will-change: transform;
}

.parallax-content {
  position: relative;
  z-index: 10;
  will-change: transform;
}
</style> 