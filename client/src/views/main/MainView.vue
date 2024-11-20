<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import MainContent from './MainContent.vue'
import { useAppStore } from '@/stores/app'
import axios from 'axios'
import type { PostSummary } from '@/models/PostSummary'
import Loader from '@/components/Loader.vue'

const url = useAppStore().apiUrl + '/posts'
const posts = ref<PostSummary[]>([])
const orderedBy = ref('Sort by')
const isLoading = ref(true)

async function performRequest(orderBy: string) {
  isLoading.value = true
  try {
    const response = await axios.get<PostSummary[]>(url + '/summary', {
      params: { orderBy: orderBy !== 'Sort by' ? orderBy : undefined },
    })
    posts.value = response.data
  } catch {}
  isLoading.value = false
}

watch(orderedBy, async (newOrder) => {
  await performRequest(newOrder)
})

onMounted(async () => await performRequest(orderedBy.value))
</script>

<template>
  <select v-model="orderedBy" class="select select-bordered w-full max-w-xs mx-10 mt-7">
    <option disabled selected>Sort by</option>
    <option value="mostRated">Most rated</option>
    <option value="mostViewed">Most viewed</option>
    <option value="recent">Recent</option>
  </select>
  <Loader v-if="isLoading" />
  <MainContent v-else :posts="posts" />
</template>
