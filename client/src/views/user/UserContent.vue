<script setup lang="ts">
import type { UserSummary } from '@/models/UserSummary'
import Swal from 'sweetalert2'
import PostCard from '../main/components/PostCard.vue'
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import axios from 'axios'

const props = defineProps<{ summary: UserSummary; isSameUser: boolean }>()
const emit = defineEmits(['deletePost'])

const totalViewCount = computed(() => {
  if (!props.summary.posts.length) return 0
  return props.summary.posts.map((p) => p.viewCount).reduce((p, c) => p + c)
})

const averageOfRatings = computed(() => {
  if (!props.summary.posts.length) return 0
  return (
    props.summary.posts.map((p) => p.averageRating).reduce((p, c) => p + c) /
    props.summary.posts.length
  ).toFixed(1)
})

const apiUrlToDelete = useAppStore().apiUrl + '/posts/'

function handleDelete(postId: number) {
  return () => {
    Swal.fire({
      title: 'Delete post',
      text: 'Are you sure you want to delete this post?',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#000000',
      showCancelButton: true,
      icon: 'warning',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(apiUrlToDelete + postId)
          emit('deletePost', postId)
        } catch (e) {
          console.error(e)
        }
      }
    })
  }
}
</script>
<template>
  <div>
    <div class="flex flex-col items-center gap-3">
      <div class="avatar">
        <div class="w-36 rounded-full border-4 border-black">
          <img :src="summary.profilePicUrl!" alt="" />
        </div>
      </div>
      <h3 class="font-bold text-xl">{{ summary.username }}</h3>
      <div class="flex gap-4">
        <span><i class="font-bold fa-solid fa-upload"></i> {{ summary.posts.length }}</span>
        <span><i class="font-bold fa-solid fa-eye"></i> {{ totalViewCount }}</span>
        <span><i class="font-bold fa-solid fa-star"></i> {{ averageOfRatings }}</span>
      </div>
    </div>
    <div class="w-full bg-neutral-200 mt-5 rounded-xl p-10">
      <h3 class="text-lg">Created posts:</h3>
      <div class="grid lg:grid-cols-5 p-10 gap-8" v-if="summary.posts && summary.posts.length">
        <div v-for="(post, index) in summary.posts" :key="index" class="relative">
          <button
            v-if="isSameUser"
            class="btn btn-primary absolute text-xl z-50 right-[-12px] top-[-12px] text-white rounded-full"
            @click="handleDelete(post.postId)()"
          >
            <i class="fa-solid fa-trash-can"></i>
          </button>
          <PostCard :key="index" :post="post" />
        </div>
      </div>
      <div v-else class="mt-4 text-center">
        <span v-if="isSameUser"
          >You have no posts created yet...
          <RouterLink class="text-primary hover:underline" to="/posts/create"
            >Create one</RouterLink
          ></span
        >
        <span v-else>This user has no posts yet...</span>
      </div>
    </div>
  </div>
</template>
