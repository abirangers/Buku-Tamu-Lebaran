<template>
  <UCard>
    <div class="flex items-start gap-4">
      <UAvatar 
        :text="getInitials(greeting.name)" 
        class="bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-200" 
        size="md"
      />
      
      <div class="flex-1 min-w-0">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="font-semibold text-base text-neutral-900 dark:text-neutral-100">{{ greeting.name }}</h3>
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
            class="opacity-50 hover:opacity-100 cursor-pointer"
            @click="$emit('delete', greeting.id)"
          />
        </div>
        
        <div class="mt-4 text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap leading-relaxed">
          {{ greeting.message }}
        </div>
        
        <div v-if="greeting.image" class="mt-4">
          <ClientOnly>
            <NuxtImg
              :src="greeting.image"
              alt="Greeting"
              class="rounded-md max-h-64 w-auto object-cover border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-shadow duration-200 cursor-pointer"
              loading="lazy"
              fetchpriority="low"
              decoding="async"
              @click="isImageModalOpen = true"
            />
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
              alt="Greeting"
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
defineProps<{
  greeting: Greeting
}>();

// State
const isImageModalOpen = ref(false);

// Gunakan composable auth untuk cek status login
const { isLoggedIn } = useAuth();

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