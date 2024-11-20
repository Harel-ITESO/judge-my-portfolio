<script setup lang="ts">
import type { PostSummary } from '@/models/PostSummary'

const props = defineProps<{
  post: PostSummary
}>()

const {
  postId,
  postName,
  thumbnailImage,
  repositoryLink,
  browserLink,
  createdBy,
  viewCount,
  totalRating,
} = props.post
</script>
<template>
  <div :id="postId.toString()" class="card card-compact bg-neutral-100 shadow-none max-h-96">
    <figure>
      <img
        :src="thumbnailImage"
        :alt="`${postName} thumbnail image`"
        class="overflow-hidden object-cover"
      />
    </figure>
    <div class="card-body">
      <div class="flex justify-between">
        <h2 class="card-title">{{ postName }}</h2>
        <div class="flex gap-3 text-xl">
          <a
            :href="repositoryLink"
            class="bg-primary text-white rounded-full flex w-6 h-6 items-center justify-center p-2 transition-all hover:bg-red-600 cursor-pointer"
            target="_blank"
            ><i class="fa-brands fa-git-alt"></i
          ></a>
          <a
            :href="browserLink"
            class="bg-primary text-white rounded-full flex w-6 h-6 items-center justify-center p-2 transition-all hover:bg-red-600 cursor-pointer"
            target="_blank"
            ><i class="fa-solid fa-globe"></i
          ></a>
        </div>
      </div>
      <div class="divider"></div>
      <div class="flex justify-between">
        <small class="text-sm flex flex-col"
          ><strong class="text-neutral-500">Created By: </strong> {{ createdBy.username }}</small
        >
        <div class="flex flex-col">
          <small class="text-sm text-neutral-500"
            ><i class="fa-solid fa-eye"></i> {{ viewCount }}</small
          >
          <small class="text-sm text-neutral-500"
            ><i class="fa-solid fa-star"></i> {{ totalRating || 4.5 }}</small
          >
        </div>
      </div>
      <div class="card-actions w-full mt-4">
        <RouterLink to="/" class="btn btn-primary w-full text-white">Go to post</RouterLink>
      </div>
    </div>
  </div>
</template>
