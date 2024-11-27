<script setup lang="ts">
import type { UserSummary } from '@/models/UserSummary'
import { useAppStore } from '@/stores/app'
import axios, { AxiosError } from 'axios'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import UserContentView from './UserContent.vue'
import router from '@/router'
import Loader from '@/components/Loader.vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const userApiUrl = useAppStore().apiUrl + '/users/' + route.params.username + '/detail'
const authStore = useAuthStore()
const userDetail = ref<UserSummary>()
const isSameUser = computed(() => authStore.userInformation?.username === route.params.username)

const isFetching = ref(true)

function deletedPost(postId: number) {
  if (!userDetail.value) return
  userDetail.value.posts = userDetail.value.posts.filter((p) => p.postId !== postId)
}

onMounted(async () => {
  try {
    const response = await axios.get<UserSummary>(userApiUrl)
    userDetail.value = response.data
  } catch (e) {
    const error = e as AxiosError
    if (error.status === 404) return router.push({ path: '/not-found' })
  }
  isFetching.value = false
})
</script>
<template>
  <div class="p-10">
    <Loader v-if="isFetching" />
    <UserContentView
      :is-same-user="isSameUser"
      :summary="userDetail!"
      @delete-post="deletedPost"
      v-else
    />
  </div>
</template>
