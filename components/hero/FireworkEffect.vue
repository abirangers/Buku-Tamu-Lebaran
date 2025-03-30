<!-- 
  FireworkEffect.vue - Komponen untuk menampilkan efek kembang api
  menggunakan library firework-js untuk performa optimal
-->
<template>
  <div class="firework-container" ref="fireworkContainer"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Fireworks } from 'fireworks-js';

// Referensi kontainer
const fireworkContainer = ref<HTMLElement | null>(null);
let fireworkInstance: Fireworks | null = null;

// Opsi fireworks yang dioptimasi untuk performa
const getFireworkOptions = () => {
  // Deteksi perangkat performa rendah
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const lowCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
  const isLowPerformanceDevice = isMobile || lowCores;

  return {
    // Pengaturan dasar
    autoresize: true,
    opacity: 0.5,
    acceleration: 1.05,
    friction: 0.97,
    gravity: 1.5,
    particles: isLowPerformanceDevice ? 50 : 100,
    traceLength: isLowPerformanceDevice ? 1 : 3,
    traceSpeed: 10,
    
    // Pengaturan warna (tema Lebaran)
    explosion: 5,
    intensity: isLowPerformanceDevice ? 10 : 20,
    flickering: 30,
    lineStyle: 'round',
    hue: {
      min: 15,  // Warna merah-oranye
      max: 85   // Hingga hijau-kuning
    },
    delay: {
      min: 30,   // Minimal delay antara firework
      max: isLowPerformanceDevice ? 60 : 40  // Maximal delay (ms)
    },
    rocketsPoint: {
      min: 0,
      max: 100
    },
    lineWidth: {
      explosion: {
        min: 1,
        max: 3
      },
      trace: {
        min: 1,
        max: 2
      }
    },
    brightness: {
      min: 50,
      max: 80
    },
    decay: {
      min: 0.01,
      max: 0.02
    },
    mouse: {
      click: false,   // Nonaktifkan klik untuk membuat firework
      move: false,    // Nonaktifkan mouse move
      max: 1
    }
  };
};

onMounted(() => {
  if (fireworkContainer.value) {
    // Inisialisasi fireworks dengan opsi
    fireworkInstance = new Fireworks(fireworkContainer.value, getFireworkOptions());
    
    // Mulai fireworks
    fireworkInstance.start();
  }
});

onUnmounted(() => {
  // Pastikan untuk membersihkan dan menghentikan fireworks
  if (fireworkInstance) {
    fireworkInstance.stop();
    fireworkInstance = null;
  }
});
</script>

<style scoped>
.firework-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}
</style> 