<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const starsValue = ref(0)
const commentDialog = ref(false)
const modalIsShown = computed(() => commentDialog.value)
const comment = ref('')

const apiUrl = useAppStore().apiUrl + '/ratings/' + route.params.id

const emit = defineEmits(['ratingSubmitted'])

// Open and close modal
function openModal() {
  commentDialog.value = true
}

function closeModal() {
  commentDialog.value = false
  comment.value = ''
  starsValue.value = 0
}

async function submitRating() {
  const data: { stars: number; comment?: string } = { stars: starsValue.value }
  if (comment.value) data.comment = comment.value
  const response = await axios.post(apiUrl + '/create', data)
  closeModal()
  emit('ratingSubmitted', response.data)
}

watch(starsValue, (newValue) => {
  if (starsValue.value === 0) return
  openModal()
  console.log(newValue)
})
</script>
<template>
  <div class="rating">
    <input
      type="radio"
      name="rating-1"
      class="rating-hidden"
      checked
      :value="0"
      v-model="starsValue"
    />
    <input
      type="radio"
      name="rating-1"
      class="mask mask-star bg-primary"
      :value="1"
      v-model="starsValue"
    />
    <input
      type="radio"
      name="rating-1"
      class="mask mask-star bg-primary"
      :value="2"
      v-model="starsValue"
    />
    <input
      type="radio"
      name="rating-1"
      class="mask mask-star bg-primary"
      :value="3"
      v-model="starsValue"
    />
    <input
      type="radio"
      name="rating-1"
      class="mask mask-star bg-primary"
      :value="4"
      v-model="starsValue"
    />
    <input
      type="radio"
      name="rating-1"
      class="mask mask-star bg-primary"
      :value="5"
      v-model="starsValue"
    />

    <div id="commentModal" class="modal" role="dialog" :class="{ 'modal-open': modalIsShown }">
      <div class="modal-box">
        <h3 class="font-bold text-primary">Add a comment! (Optional)</h3>
        <div class="mb-2">
          <i
            v-for="index in 5"
            :key="index"
            :class="starsValue / index >= 1 ? 'fa-solid fa-star' : 'fa-regular fa-star'"
          >
          </i>
        </div>
        <form @submit.prevent="submitRating">
          <label class="form-control">
            <div class="label">
              <span class="label-text-alt"></span>
              <span class="label-text-alt">{{ comment.length }} / 255</span>
            </div>
            <textarea
              v-model="comment"
              class="textarea textarea-bordered textarea-secondary w-full h-60 resize-none"
              placeholder="Write your comment here..."
            ></textarea>
          </label>
          <div class="flex w-full justify-between items-center mt-3">
            <button class="btn btn-secondary text-white" @click="closeModal">
              <i class="fa-solid fa-x"></i>Cancel
            </button>
            <button type="submit" class="btn btn-primary text-white">
              <i class="fa-solid fa-paper-plane"></i>Send
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
