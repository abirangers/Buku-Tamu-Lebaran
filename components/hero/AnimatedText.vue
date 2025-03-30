<!-- 
  AnimatedText.vue - Komponen untuk menampilkan teks dengan animasi
  yang menarik ketika halaman dimuat pertama kali.
  Menggunakan komponen Transition dari Vue untuk efek yang lebih baik.
-->
<template>
  <div>
    <!-- Judul utama dengan sequence animation -->
    <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold mb-5 text-white">
      <TransitionGroup
        name="word"
        tag="div"
        appear
        class="inline"
      >
        <span 
          v-for="(word, index) in titleWords" 
          :key="word + index"
          class="inline-block mr-2"
          :style="{ transitionDelay: `${index * 0.1}s` }"
        >
          {{ word }}
        </span>
      </TransitionGroup>
    </h1>
    
    <!-- Subtitle dengan transition untuk fade-in -->
    <Transition name="fade-slide-up" appear>
      <p class="text-2xl md:text-3xl lg:text-4xl mb-8 font-light" v-if="true">
        Mohon Maaf Lahir dan Batin
      </p>
    </Transition>
    
    <!-- Deskripsi dengan transition berbeda -->
    <Transition name="fade" appear :duration="1500">
      <div class="max-w-2xl mx-auto mt-8" v-if="true">
        <p class="text-base md:text-lg opacity-90">
          Bagikan ucapan Lebaran, foto, dan kenangan Anda dengan keluarga dan teman.
          Mari perkuat silaturahmi meski kita terpisah jarak.
        </p>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';

// Split main title into words
const titleText = 'Selamat Hari Raya Idul Fitri';
const titleWords = computed(() => titleText.split(' '));

// Pastikan bahwa mounted sudah dijalankan
const isMounted = ref(false);
onMounted(() => {
  // Tunggu sedikit untuk memastikan rendering selesai
  setTimeout(() => {
    isMounted.value = true;
  }, 10);
});
</script>

<style scoped>
/* Animasi untuk judul (word-by-word) */
.word-enter-active,
.word-leave-active {
  transition: opacity 0.8s cubic-bezier(0.215, 0.61, 0.355, 1),
              transform 0.8s cubic-bezier(0.215, 0.61, 0.355, 1);
  transition-delay: var(--transition-delay, 0s);
}

.word-enter-from,
.word-leave-to {
  opacity: 0;
  transform: translateY(40%);
}

/* Animasi untuk subtitle */
.fade-slide-up-enter-active {
  transition: opacity 1s ease, transform 1s ease;
  transition-delay: 0.8s;
}

.fade-slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

/* Animasi untuk deskripsi */
.fade-enter-active {
  transition: opacity 1s ease;
  transition-delay: 1.5s;
}

.fade-enter-from {
  opacity: 0;
}

/* Tambahan untuk memastikan visibilitas konten */
p, div {
  backface-visibility: hidden;
  transform-style: preserve-3d;
}
</style> 