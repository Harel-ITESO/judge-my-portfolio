<!-- eslint-disable vue/multi-word-component-names -->
<script lang="ts" setup>
import Header from './Header.vue'
import Footer from './Footer.vue'
</script>

<template>
  <div class="flex flex-col h-screen">
    <Header />
    <main class="flex-grow">
      <slot />
    </main>
    <Footer />
  </div>
</template>
