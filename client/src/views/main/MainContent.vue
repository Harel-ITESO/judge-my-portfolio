<script setup lang="ts">
import Swal from 'sweetalert2'
import PostCard from './components/PostCard.vue'
import router from '@/router'
import { type PostSummary } from '@/models/PostSummary'

defineProps<{
  posts: PostSummary[]
}>()

function onAddPostClick() {
  Swal.fire({
    text: 'Do you want to post new a portfolio?',
    confirmButtonColor: '#ef4444',
    showCancelButton: true,
    cancelButtonColor: '#000000',
    icon: 'question',
  }).then((response) => {
    if (response.isConfirmed) router.push('/posts/create')
  })
}
</script>

<template>
  <div class="grid lg:grid-cols-5 p-10 gap-8">
    <button
      @click="onAddPostClick"
      class="border-2 border-primary rounded-xl border-dashed transition-all hover:bg-black hover:bg-opacity-25"
    >
      <i class="fa-solid fa-plus text-primary"></i>
    </button>
    <PostCard v-for="(post, index) in posts" :key="index" :post="post" />
  </div>
</template>
