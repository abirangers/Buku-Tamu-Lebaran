<template>
  <UCard 
    :class="[
      'greeting-card p-4 md:p-5 transition-all duration-300',
      isCreatorCard ? 'creator-special-card' : ''
    ]"
  >
    <!-- Badge spesial hanya untuk creator -->
    <div v-if="isCreatorCard" class="creator-badge">
      <span>Creator</span>
    </div>
    
    <div class="flex items-start gap-3 md:gap-4">
      <UAvatar 
        :text="getInitials(greeting.name)" 
        :class="[
          'text-neutral-600 dark:text-neutral-200 shrink-0',
          isCreatorCard ? 'bg-primary-500 text-white' : 'bg-neutral-200 dark:bg-neutral-700'
        ]"
        size="md"
      />
      
      <div class="flex-1 min-w-0">
        <div class="flex justify-between items-start">
          <div>
            <h3 
            :class="[
              'font-semibold text-base',
              isCreatorCard ? 'text-primary-600 dark:text-primary-400 flex items-center' : 'text-neutral-900 dark:text-neutral-100'
            ]">
              {{ greeting.name }}
              <UIcon v-if="isCreatorCard" name="i-heroicons-star" class="ml-1 h-4 w-4 text-yellow-500" />
            </h3>
            <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {{ formatDate(greeting.timestamp) }} • {{ formatTime(greeting.timestamp) }}
            </p>
          </div>
          
          <UButton
            v-if="isLoggedIn"
            icon="i-heroicons-trash"
            color="error"
            variant="ghost"
            size="xl"
            class="opacity-50 hover:opacity-100 cursor-pointer -mr-2"
            @click="$emit('delete', greeting.id)"
          />
        </div>
        
        <div :class="[
          'mt-4 whitespace-pre-wrap leading-relaxed',
          isCreatorCard ? 'text-neutral-800 dark:text-white' : 'text-neutral-700 dark:text-neutral-300'
        ]">
          {{ greeting.message }}
        </div>
        
        <div v-if="greeting.image" class="mt-4">
          <ClientOnly>
            <div class="relative">
              <!-- Placeholder/skeleton selama gambar dimuat -->
              <div v-if="!imageLoaded" class="w-full h-56 bg-neutral-100 dark:bg-neutral-800 animate-pulse rounded-md flex items-center justify-center">
                <UIcon name="i-heroicons-photo" class="h-10 w-10 text-neutral-300 dark:text-neutral-600" />
              </div>
              
              <NuxtImg
                :src="greeting.image"
                alt="Greeting"
                format="webp"
                quality="80"
                class="rounded-md object-cover border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                loading="lazy"
                fetchpriority="low"
                decoding="async"
                @click="isImageModalOpen = true"
                @load="imageLoaded = true"
                :class="{'opacity-0 absolute inset-0': !imageLoaded, 'opacity-100': imageLoaded}"
              />
            </div>
          </ClientOnly>
        </div>
      </div>
    </div>

    <!-- Modal untuk menampilkan gambar -->
    <UModal v-model:open="isImageModalOpen" :dismissible="true" class="w-fit">
      <template #content>
        <div class="p-4 flex flex-col items-center">
          <ClientOnly>
            <NuxtImg
              :src="greeting.image || ''"
              alt="Modal Greeting Image"
              class="max-h-[80vh] max-w-full object-contain rounded-md"
              loading="lazy"
              decoding="async"
            />
          </ClientOnly>
        </div>
      </template>
    </UModal>
  </UCard>
</template>

<script setup lang="ts">
import { NuxtImg } from '#components';
import type { Greeting } from '~/types';

/**
 * GreetingCard Component
 * 
 * Komponen untuk menampilkan satu kartu ucapan
 * Menampilkan nama, pesan, gambar, dan waktu posting
 * Mengoptimalkan loading gambar dengan atribut lazy loading dan decoding async
 */

// Definisikan emits
defineEmits<{
  delete: [id: string]
}>();

// Props
const props = defineProps<{
  greeting: Greeting
}>();

// State
const isImageModalOpen = ref(false);
const imageLoaded = ref(false);

// Gunakan composable auth untuk cek status login
const { isLoggedIn } = useAuth();

// Cek apakah ini kartu creator
const isCreatorCard = computed(() => {
  return props.greeting.name === 'Ahmad Aby Ayyasi' || 
         props.greeting.id === '6662bec2-fc92-4448-b16d-013bac23fada';
});

// Utilitas untuk mendapatkan inisial dari nama
const getInitials = (name: string): string => {
  if (!name) return '';
  const words = name.split(' ').filter(Boolean);
  if (words.length > 1) {
    return (words[0][0] + words[1][0]).toUpperCase();
  } else if (words.length === 1 && words[0].length > 1) {
    return words[0].substring(0, 2).toUpperCase();
  } else if (words.length === 1) {
     return words[0][0].toUpperCase();
  }
  return '?';
};

// Helper function untuk memastikan timestamp adalah Date
const ensureDate = (date: Date | string): Date => {
  if (date instanceof Date) return date;
  return new Date(date);
};

// Format tanggal ke format Indonesia
const formatDate = (date: Date | string): string => {
  const dateObj = ensureDate(date);
  return dateObj.toLocaleDateString('id-ID', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

// Format waktu dalam 24 jam
const formatTime = (date: Date | string): string => {
  const dateObj = ensureDate(date);
  return dateObj.toLocaleTimeString('id-ID', { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false 
  });
};
</script>

<style>
.greeting-card {
  transition: all 0.2s ease;
}
.greeting-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Style khusus untuk card creator */
.creator-special-card {
  position: relative;
  border: 2px solid;
  border-image: linear-gradient(135deg, #3b82f6, #10b981, #3b82f6) 1;
  background-image: radial-gradient(circle at top right, rgba(59, 130, 246, 0.05), transparent 70%);
  transform: translateY(-5px);
  box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.3), 0 8px 10px -6px rgba(59, 130, 246, 0.2);
}

.creator-special-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(59, 130, 246, 0.4), 0 10px 10px -5px rgba(59, 130, 246, 0.3);
}

.creator-badge {
  position: absolute;
  top: -10px;
  right: 20px;
  background: linear-gradient(135deg, #3b82f6, #10b981);
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 4px 12px;
  border-radius: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

/* Animasi pulse subtle untuk card creator */
@keyframes subtle-pulse {
  0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
  100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
}

.creator-special-card {
  animation: subtle-pulse 2s infinite;
}
</style> 