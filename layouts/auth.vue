<template>
  <!-- Layout Auth: Layout khusus untuk halaman autentikasi tanpa header dan footer -->
  <div class="flex min-h-screen flex-col bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
    <!-- Hanya tampilkan slot content -->
    <slot />
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'AuthLayout'
});
</script> 