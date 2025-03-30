<template>
  <div class="min-h-screen flex flex-col">
    <SiteHeader />
    <main>
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Footer from '~/components/common/Footer.vue';
import SiteHeader from '~/components/common/SiteHeader.vue';

defineOptions({
  name: 'DefaultLayout'
})
</script> 