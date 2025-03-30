<template>
  <div 
    class="bg-white dark:bg-neutral-800 rounded-xl shadow-sm overflow-hidden" 
    :class="[borderClass, extraClasses]"
  >
    <!-- Header (opsional) -->
    <div 
      v-if="title || $slots.header" 
      class="flex items-center space-x-3 mb-4 px-3 py-3" 
      :class="headerClass"
    >
      <UIcon 
        v-if="icon" 
        :name="icon" 
        class="h-6 w-6" 
        :class="iconClass"
      />
      
      <slot name="header">
        <h3 class="text-lg font-semibold" :class="titleClass">{{ title }}</h3>
      </slot>
    </div>
    
    <!-- Konten utama -->
    <div class="px-4 py-3" :class="contentClass">
      <slot></slot>
    </div>
    
    <!-- Footer (opsional) -->
    <div v-if="$slots.footer" class="px-4 pt-2 pb-4" :class="footerClass">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * BaseCard Component
 * 
 * Komponen kartu dasar yang dapat digunakan kembali
 * Mendukung header, konten, dan footer dengan styling yang fleksibel
 */

defineProps({
  // Judul untuk header
  title: {
    type: String,
    default: '',
  },
  
  // Icon untuk header
  icon: {
    type: String,
    default: '',
  },
  
  // CSS classes
  borderClass: {
    type: String,
    default: 'border border-neutral-200 dark:border-neutral-700',
  },
  headerClass: {
    type: String,
    default: 'bg-neutral-50 dark:bg-neutral-800/50 -mx-4 -mt-4 rounded-t-xl',
  },
  iconClass: {
    type: String,
    default: 'text-primary-500 dark:text-primary-400',
  },
  titleClass: {
    type: String,
    default: 'text-neutral-800 dark:text-neutral-200',
  },
  contentClass: {
    type: String,
    default: '',
  },
  footerClass: {
    type: String,
    default: 'border-t border-neutral-100 dark:border-neutral-700',
  },
  extraClasses: {
    type: String,
    default: '',
  },
});
</script>