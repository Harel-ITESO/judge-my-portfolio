<script setup lang="ts">
import { default as MainLayout } from './layouts/main/Layout.vue'
import { default as AuthLayout } from './layouts/auth/Layout.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <MainLayout v-if="$route.meta.layout === 'main'">
    <RouterView />
  </MainLayout>

  <AuthLayout v-else-if="$route.meta.layout === 'auth'">
    <RouterView />
  </AuthLayout>
</template>
