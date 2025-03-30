<template>
  <div class="space-y-4 sm:space-y-6 mx-auto" ref="feedContainer">
    <!-- Loading state -->
    <Transition name="fade" mode="out-in">
      <div v-if="isLoading && greetings.length === 0" class="text-center py-12 px-4">
        <div class="inline-block p-6 bg-white dark:bg-neutral-800 rounded-xl shadow-sm">
          <UIcon name="i-heroicons-arrow-path" class="h-10 w-10 animate-spin text-primary-500 mx-auto" />
          <p class="mt-4 text-neutral-600 dark:text-neutral-300 font-medium">Memuat ucapan...</p>
        </div>
      </div>
      
      <!-- Error state -->
      <div v-else-if="error" class="p-6 border border-red-200 dark:border-red-800 rounded-xl bg-red-50 dark:bg-red-900/20 text-center max-w-lg mx-auto shadow-sm">
        <UIcon name="i-heroicons-exclamation-triangle" class="h-8 w-8 text-red-500 mx-auto mb-2" />
        <p class="font-medium text-red-700 dark:text-red-400">{{ error }}</p>
        <UButton 
          class="mt-4" 
          icon="i-heroicons-arrow-path" 
          color="error" 
          variant="soft"
          @click="fetchGreetings"
        >
          Coba Lagi
        </UButton>
      </div>
      
      <!-- Empty state -->
      <div v-else-if="!greetings || greetings.length === 0" class="p-8 sm:p-10 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-center max-w-lg mx-auto shadow-sm">
        <UIcon name="i-heroicons-chat-bubble-left-ellipsis" class="h-14 w-14 text-neutral-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-neutral-700 dark:text-neutral-300 mb-2">Belum ada ucapan</h3>
        <p class="text-neutral-500 dark:text-neutral-400 mb-6">Jadilah yang pertama berbagi ucapan Lebaran dengan keluarga dan teman!</p>
        <UButton color="primary" @click="scrollToForm">Tulis Ucapan</UButton>
      </div>
      
      <!-- Greeting list with animation and virtual scrolling -->
      <div v-else>
        <TransitionGroup 
          name="list"
          tag="div"
          class="space-y-4 sm:space-y-6"
        >
          <GreetingCard 
            v-for="greeting in visibleGreetings" 
            :key="greeting.id" 
            :greeting="greeting" 
            @delete="handleDeleteGreeting"
            class="greeting-card-item"
          />
        </TransitionGroup>
        
        <!-- "Load More" button with loading state -->
        <div v-if="hasMoreToLoad" class="mt-6 sm:mt-8 text-center pb-4">
          <UButton
            color="primary"
            variant="soft"
            icon="i-heroicons-arrow-down"
            class="cursor-pointer"
            :loading="isLoadingMore"
            @click="loadMore"
          >
            <template #default>
              <span v-if="!isLoadingMore">Muat Lebih Banyak</span>
              <span v-else>Memuat ucapan...</span>
            </template>
          </UButton>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { Greeting } from '~/types'
import GreetingCard from '~/components/greeting/GreetingCard.vue'

/**
 * GreetingFeed Component
 * 
 * Komponen untuk menampilkan daftar ucapan Lebaran
 * Menangani loading, error, dan state kosong
 * Menggunakan lazy loading dengan Intersection Observer
 * Mengimplementasikan virtual scrolling dengan pagination untuk performa
 */

// Ambil fungsi dari Supabase composable
const { getGreetings, deleteGreeting } = useSupabase()
const toast = useToast()

// Konfigurasi pagination
const PAGE_SIZE = 5
const currentPage = ref(1)

// State
const greetings = ref<Greeting[]>([])
const isLoading = ref(true)
const isLoadingMore = ref(false)
const error = ref<string | null>(null)
const feedContainer = ref<HTMLElement | null>(null)
const isVisible = ref(false)
const dataLoaded = ref(false)

// Computed properties
const visibleGreetings = computed(() => {
  return greetings.value.slice(0, currentPage.value * PAGE_SIZE)
})

const hasMoreToLoad = computed(() => {
  return visibleGreetings.value.length < greetings.value.length
})

// Fungsi untuk memuat lebih banyak data
const loadMore = () => {
  isLoadingMore.value = true
  
  // Simulasi loading untuk UX yang lebih baik
  setTimeout(() => {
    currentPage.value++
    isLoadingMore.value = false
  }, 500)
}

// Scroll ke bagian form untuk membuat ucapan baru
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

// Fungsi untuk menangani penghapusan greeting
const handleDeleteGreeting = async (id: string) => {
  isLoading.value = true;
  const { success, error: deleteError } = await deleteGreeting(id);
  
  if (success) {
    // Hapus dari array lokal tanpa perlu fetch lagi
    greetings.value = greetings.value.filter(g => g.id !== id);
    
    toast.add({
      title: 'Berhasil',
      description: 'Ucapan telah dihapus',
      icon: 'i-heroicons-check-circle',
      color: 'success'
    });
  } else {
    error.value = deleteError;
    
    toast.add({
      title: 'Gagal menghapus',
      description: deleteError || 'Terjadi kesalahan saat menghapus ucapan',
      icon: 'i-heroicons-exclamation-circle',
      color: 'error'
    });
  }
  
  isLoading.value = false;
};

// Fungsi untuk mengambil data dari Supabase
async function fetchGreetings() {
  // Jika data sudah dimuat, tidak perlu memuat lagi
  if (dataLoaded.value) return;
  
  isLoading.value = true
  error.value = null
  
  try {
    const result = await getGreetings()
    
    if (result.error) {
      error.value = result.error
      toast.add({
        title: 'Gagal memuat data',
        description: result.error,
        icon: 'i-heroicons-exclamation-circle',
        color: 'error'
      })
      return
    }
    
    greetings.value = result.data
    dataLoaded.value = true
  } catch (err) {
    console.error('Error fetching greetings:', err)
    error.value = 'Terjadi kesalahan saat memuat ucapan.'
    toast.add({
      title: 'Terjadi kesalahan',
      description: 'Gagal memuat daftar ucapan',
      icon: 'i-heroicons-exclamation-circle',
      color: 'error'
    })
  } finally {
    isLoading.value = false
  }
}

// Listener untuk event ketika greeting baru ditambahkan atau dihapus
function refreshGreetings() {
  // Reset dataLoaded agar data dimuat ulang
  dataLoaded.value = false
  fetchGreetings()
}

onMounted(() => {
  // Hanya mulai meload data ketika komponen terlihat
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          isVisible.value = true
          
          // Hanya fetch data jika belum pernah diload sebelumnya
          if (!dataLoaded.value) {
            fetchGreetings()
          }
          
          // Setelah terlihat, tidak perlu observe lagi
          if (feedContainer.value) {
            observer.unobserve(feedContainer.value)
          }
        }
      })
    }, {
      threshold: 0.1 // 10% dari komponen terlihat
    })
    
    if (feedContainer.value) {
      observer.observe(feedContainer.value)
    }
    
    // Cleanup observer saat komponen dihapus
    onUnmounted(() => {
      if (feedContainer.value) {
        observer.unobserve(feedContainer.value)
      }
    })
  } else {
    // Fallback untuk browser yang tidak mendukung IntersectionObserver
    isVisible.value = true
    fetchGreetings()
  }
  
  // Tambahkan event listener untuk event
  window.addEventListener('greeting-added', refreshGreetings)
  window.addEventListener('greeting-deleted', refreshGreetings)
})

onUnmounted(() => {
  // Bersihkan event listener saat komponen dihapus
  window.removeEventListener('greeting-added', refreshGreetings)
  window.removeEventListener('greeting-deleted', refreshGreetings)
})
</script>

<style scoped>
/* Animation untuk list items */
.list-enter-active,
.list-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.list-move {
  transition: transform 0.5s ease;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.greeting-card-item {
  transition: all 0.3s ease;
}
</style> 