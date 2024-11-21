<script setup lang="ts">
// Import necessary components and libraries
import FormInput from '@/components/FormInput.vue'
import type { Post } from '@/models/Post'
import router from '@/router'
import { useAppStore } from '@/stores/app'
import axios, { AxiosError } from 'axios'
import { computed, ref } from 'vue'

// Define reactive variables and computed properties
const showErrorAfterBadRequest = ref(false)
const errorMessage = ref('')
const title = ref('')
const repositoryLink = ref('')
const browserLink = ref('')
const description = ref('')
const isLoading = ref(false)
const thumbnailImage = ref<File>()
const canSendRequest = computed(() => {
  return (
    title.value !== '' &&
    repositoryLink.value !== '' &&
    browserLink.value !== '' &&
    description.value !== '' &&
    thumbnailImage.value !== undefined
  )
})

const url = useAppStore().apiUrl + '/posts'

// Function to get error message from Axios error
function getErrorMessage(e: AxiosError) {
  const data = (e.response?.data as { message: string } | { message: string[] }) || undefined
  if (e.status !== 400) return 'An error occurred, please try again later'

  if (!(data.message instanceof Array)) {
    if (data.message.includes('(png|jpeg|jpg|svg)'))
      return 'The file must be a PNG, JPEG, JPG, or SVG'
  }

  return data.message[0]
}

// Function to handle file input change
async function handleThumbnailImageUpload(e: Event) {
  const target = e.target as HTMLInputElement
  thumbnailImage.value = target.files?.item(0) || undefined
}

// Function to handle form submission
async function handleSubmit() {
  showErrorAfterBadRequest.value = false
  errorMessage.value = ''
  isLoading.value = true
  const formData = new FormData()
  formData.append('postName', title.value)
  formData.append('repositoryLink', repositoryLink.value)
  formData.append('browserLink', browserLink.value)
  formData.append('description', description.value)
  formData.append('thumbnailImage', thumbnailImage.value as File)
  try {
    await axios.post<Post>(url, formData)
    router.push({ name: 'Main page' }) // For some fucking stupid reason, this shit doesn't work with '/' fucking stupid shit
  } catch (e) {
    const error = e as AxiosError
    console.log(error)
    showErrorAfterBadRequest.value = true
    errorMessage.value = getErrorMessage(error)
    isLoading.value = false
  }
}
</script>

<template>
  <div v-if="showErrorAfterBadRequest" role="alert" class="toast z-50">
    <div class="alert alert-error text-white">
      <button @click="showErrorAfterBadRequest = false">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <span>{{ errorMessage }}</span>
    </div>
  </div>

  <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
    <!-- Title input -->
    <FormInput
      placeholder="Title"
      title-left="Post Title"
      icon="fa-solid fa-bars"
      v-model="title"
      :max-length="50"
    />
    <div class="flex flex-col md:flex-row gap-2">
      <FormInput
        v-model="repositoryLink"
        title-left="Repository"
        icon="fa-brands fa-git-alt"
        placeholder="Repository Link"
        :disabled="isLoading"
      />
      <FormInput
        v-model="browserLink"
        title-right="Web URL"
        icon="fa-solid fa-globe"
        placeholder="Browser Link"
        :disabled="isLoading"
      />
    </div>
    <FormInput
      v-model="description"
      type="textarea"
      title-left="Description"
      placeholder="Description of the portfolio"
      :max-length="255"
      :disabled="isLoading"
    />
    <!-- File input-->
    <label class="form-control w-full">
      <div class="label">
        <span class="label-text text-lg">Thumbnail Image</span>
      </div>
      <input
        type="file"
        class="file-input file-input-secondary w-full"
        @change="handleThumbnailImageUpload"
        :disabled="isLoading"
      />
    </label>

    <!-- Submit button -->
    <button
      type="submit"
      class="btn btn-primary text-white mt-5 disabled:bg-neutral-300"
      :disabled="!canSendRequest || isLoading"
    >
      <span class="loading loading-spinner loading-lg" v-if="isLoading"></span>
      <template v-else> <i class="fa-solid fa-paper-plane"></i>Submit </template>
    </button>
  </form>
</template>
