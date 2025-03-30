<!-- 
  ScrollCta.vue - Komponen untuk tombol Call-to-Action di hero section
  yang akan scroll ke bagian form ucapan ketika diklik
  Menggunakan Transition dari Vue untuk animasi
-->
<template>
  <div class="cta-container">
    <Transition name="bounce" appear>
      <UButton
        class="cta-button"
        size="lg"
        color="primary"
        variant="solid"
        @click="scrollToForm"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
      >
        <div class="flex items-center gap-2">
          <span>Kirim Ucapan Anda</span>
          <UIcon name="i-heroicons-arrow-down" class="icon-bounce" />
        </div>
      </UButton>
    </Transition>
    
    <!-- Efek pulse sebagai elemen terpisah dengan Transition -->
    <Transition name="pulse">
      <div v-if="isPulsing" class="pulse-effect" />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const isPulsing = ref(false);

// Scroll ke bagian form ucapan
const scrollToForm = () => {
  // Temukan elemen form
  const formElement = document.querySelector('.greeting-form-container');
  if (formElement) {
    formElement.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }
};

// Pulse effect on hover
const handleMouseEnter = () => {
  isPulsing.value = true;
};

const handleMouseLeave = () => {
  isPulsing.value = false;
};

// Pulse effect setiap 5 detik
let pulseInterval: number | null = null;

onMounted(() => {
  pulseInterval = window.setInterval(() => {
    isPulsing.value = true;
    setTimeout(() => {
      isPulsing.value = false;
    }, 1000);
  }, 5000);
});

onUnmounted(() => {
  if (pulseInterval !== null) {
    clearInterval(pulseInterval);
  }
});
</script>

<style scoped>
.cta-container {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  position: relative;
}

.cta-button {
  position: relative;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background-color: rgba(255, 255, 255, 0.2) !important;
  backdrop-filter: blur(5px);
  color: white !important;
  font-weight: bold;
  transition: transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 2;
}

.cta-button:hover {
  background-color: rgba(255, 255, 255, 0.3) !important;
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.cta-button:active {
  transform: translateY(-1px);
}

/* Ripple effect */
.cta-button::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.5);
  opacity: 0;
  border-radius: 100%;
  transform: scale(1, 1) translate(-50%, -50%);
  transform-origin: 50% 50%;
}

.cta-button:focus:not(:active)::after {
  animation: ripple 1s ease-out;
}

@keyframes ripple {
  0% {
    transform: scale(0, 0);
    opacity: 0.5;
  }
  20% {
    transform: scale(25, 25);
    opacity: 0.3;
  }
  100% {
    transform: scale(50, 50);
    opacity: 0;
  }
}

/* Pulse effect dengan Vue Transition */
.pulse-effect {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 8px;
  z-index: 1;
  pointer-events: none;
}

.pulse-enter-active {
  animation: pulse-animation 1s cubic-bezier(0, 0, 0.2, 1);
}

@keyframes pulse-animation {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
    opacity: 1;
  }
  70% {
    box-shadow: 0 0 0 15px rgba(255, 255, 255, 0);
    opacity: 0.5;
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
    opacity: 0;
  }
}

/* Bouncing arrow animation */
.icon-bounce {
  animation: bounce 2s infinite;
}

/* Bounce enter animation untuk tombol */
.bounce-enter-active {
  animation: bounce-in 0.5s;
}

.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-8px);
  }
  60% {
    transform: translateY(-4px);
  }
}
</style> 