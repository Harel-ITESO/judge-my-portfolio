<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

const { isAuthenticated } = useAuthStore()
const canShow = ref(false)

/**
 * If the user is authenticated, redirect to the home page
 */
onBeforeMount(() => {
  if (isAuthenticated) return router.push({ path: '/' })
  canShow.value = true
})
</script>

<template>
  <div class="bg-white text-black rounded-xl p-6" v-if="canShow">
    <h1 class="text-2xl mb-2 text-center">
      <i class="fa-solid fa-code -rotate-45 text-red-500"></i>
    </h1>
    <slot />
  </div>
</template>
