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
      class="border-2 p-4 sm:p-0 border-primary rounded-xl sm:border-dashed transition-all sm:hover:bg-black sm:hover:bg-opacity-25 hover:bg-red-600 sm:bg-white bg-primary"
      :class="posts.length === 0 ? 'col-span-5 sm:h-[15rem]' : 'col-span-1'"
    >
      <span class="sm:text-primary text-white">Create a post</span>
    </button>
    <PostCard v-for="(post, index) in posts" :key="index" :post="post" />
  </div>
</template>
