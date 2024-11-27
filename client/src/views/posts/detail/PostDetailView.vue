<script setup lang="ts">
import Loader from '@/components/Loader.vue'
import PostDetailContent from './PostDetailContent.vue'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import axios, { AxiosError } from 'axios'
import type { PostDetail } from '@/models/PostDetail'
import router from '@/router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()

const apiUrl = useAppStore().apiUrl + '/posts/' + route.params.id
const postDetail = ref<PostDetail>()
const isFetching = ref(true)
const postByUser = ref(false)

onMounted(async () => {
  try {
    const response = await axios.get<PostDetail>(apiUrl + '/detail')
    await axios.put(apiUrl + '/add-view') // Increment view count
    postDetail.value = response.data
    isFetching.value = false
    const authStore = useAuthStore()
    if (authStore.userInformation?.username === postDetail.value.createdBy.username)
      postByUser.value = true
  } catch (e) {
    console.error(e)
    const error = e as AxiosError
    if (error.status === 404) {
      router.push({ path: '/not-found' })
    }
  }
})
</script>

<template>
  <Loader v-if="isFetching" />
  <PostDetailContent :post-detail="postDetail!" :post-by-user="postByUser" v-else />
</template>
