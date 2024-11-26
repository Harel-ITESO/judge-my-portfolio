<script setup lang="ts">
import type { RatingsWithComments } from '@/models/RatingsWithComments'

defineProps<{
  ratingsWithComments?: RatingsWithComments[]
  isFetchingRatings: boolean
}>()
</script>

<template>
  <div class="flex justify-between mt-10 bg-neutral-100 gap-8 mx-20 p-6 rounded-xl mb-10">
    <div
      class="loading loading-bars loading-lg text-primary mx-auto"
      v-if="isFetchingRatings"
    ></div>
    <div class="mx-auto" v-else-if="!ratingsWithComments?.length">
      <span>No comments yet</span>
    </div>
    <div class="w-full" v-else>
      <div class="flex flex-col" v-for="(rating, index) in ratingsWithComments" :key="index">
        <div class="flex items-center">
          <div class="flex flex-col items-center gap-2">
            <div class="">
              <small>
                <i
                  v-for="index in 5"
                  :key="index"
                  :class="rating.stars / index >= 1 ? 'fa-solid fa-star' : 'fa-regular fa-star'"
                ></i>
              </small>
            </div>
            <div class="avatar w-10">
              <img :src="rating.ratedBy.profilePicUrl" class="rounded-full" />
            </div>
            <small>{{ rating.ratedBy.username }}</small>
          </div>
          <div class="ml-10">
            <p>{{ rating.comment }}</p>
          </div>
        </div>

        <div class="divider w-full"></div>
      </div>
    </div>
  </div>
</template>
