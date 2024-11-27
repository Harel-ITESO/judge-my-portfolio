<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { PostDetail } from '@/models/PostDetail'
import PostDetailContentCommentSection from './PostDetailContentCommentSection.vue'
import PostDetailContentRating from './PostDetailContentRating.vue'
import { useAppStore } from '@/stores/app'
import { useRoute } from 'vue-router'
import type { RatingsWithComments } from '@/models/RatingsWithComments'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

defineProps<{
  postDetail: PostDetail
  postByUser: boolean
}>()

const route = useRoute()
const apiUrl = useAppStore().apiUrl + '/ratings/' + route.params.id + '/ratings-with-comments'

const isFetchingRatings = ref(false)
const ratingsWithComments = ref<RatingsWithComments[]>()
const canRate = ref(false) // tracks if the user can rate the post (he can't if he already did)

function handleRatingSubmitted(data: RatingsWithComments) {
  if (!data.comment) return
  // insert the new rating at the beginning of the array
  if (ratingsWithComments.value) {
    ratingsWithComments.value.unshift(data)
  } else {
    ratingsWithComments.value = [data]
  }
  canRate.value = false
}

onMounted(async () => {
  const response = await axios.get<RatingsWithComments[]>(apiUrl)
  ratingsWithComments.value = response.data
  if (ratingsWithComments.value.length === 0) {
    canRate.value = true
    return
  }
  const userAlreadyRated = ratingsWithComments.value.find(
    (rating) => useAuthStore().userInformation?.username === rating.ratedBy.username,
  )
  if (!userAlreadyRated) canRate.value = true
})
</script>
<template>
  <div
    class="flex flex-col xl:flex-row justify-between mt-10 bg-neutral-100 gap-8 mx-20 p-6 rounded-xl"
  >
    <div class="flex flex-col items-center w-full gap-3">
      <img
        :src="postDetail.createdBy.profilePicUrl"
        :alt="`${postDetail.createdBy.username} creator profile picture`"
        class="w-28 h-28 rounded-full border-4 border-black"
      />
      <h2 class="text-xl font-bold text-primary hover:underline">
        <RouterLink :to="`/user/${postDetail.createdBy.username}`">
          {{ postDetail.createdBy.username }}
        </RouterLink>
      </h2>
      <div class="flex justify-evenly w-full text-2xl text-white">
        <a
          :href="postDetail.browserLink"
          target="_blank"
          class="cursor-pointer bg-primary rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-all"
          ><i class="fa-solid fa-globe"></i>
        </a>
        <a
          :href="postDetail.repositoryLink"
          target="_blank"
          class="cursor-pointer bg-primary rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-all"
          ><i class="fa-brands fa-git-alt"></i>
        </a>
      </div>
      <div class="flex flex-col gap-2">
        <span><strong class="text-primary">Title: </strong>{{ postDetail.postName }}</span>
        <span
          ><strong class="text-primary">Rating: </strong> {{ postDetail.averageRatings }}
          <i class="fa-solid fa-star"></i>
        </span>

        <span
          ><strong class="text-primary">Views: </strong>{{ postDetail.viewCount }}
          <i class="fa-solid fa-eye"></i
        ></span>

        <p class="italic opacity-80 mt-5">&ldquo; {{ postDetail.description }} &rdquo;</p>

        <div class="mt-10 mx-auto">
          <PostDetailContentRating
            v-if="canRate && !postByUser"
            @rating-submitted="handleRatingSubmitted"
          />
          <span v-else-if="postByUser" class="text-primary opacity-45 italic"
            >You can't rate your own post... Dummie</span
          >
          <span v-else class="text-primary opacity-45 italic">You already gave a rating</span>
        </div>
      </div>
    </div>
    <img
      :src="postDetail.thumbnailImage"
      alt="Post image"
      class="max-w-4xl border-4 border-primary"
    />
  </div>
  <PostDetailContentCommentSection
    :is-fetching-ratings="isFetchingRatings"
    :ratings-with-comments="ratingsWithComments"
  />
</template>
