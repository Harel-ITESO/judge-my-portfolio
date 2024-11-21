<script setup lang="ts">
import { ref } from 'vue'
import { useAppStore } from '@/stores/app'
import FormBox from './components/FormBox.vue'
import router from '@/router'
import axios, { AxiosError } from 'axios'
import FormInput from '@/components/FormInput.vue'

type EmailOrUsername = { email: string; password: string } | { username: string; password: string }

// Email regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const emailOrUsername = ref('')
const password = ref('')
const { apiUrl } = useAppStore()
const url = apiUrl + '/authentication/login'
const googleAuthUrl = apiUrl + '/authentication/google'

const showErrorAfterBadRequest = ref(false)
const errorMessage = ref('')
const isMakingRequest = ref(false)

/**
 * Makes a request to the server to log in the user
 * @param toSend data to send to the server
 */
async function makeRequest(
  toSend: { email: string; password: string } | { username: string; password: string },
) {
  showErrorAfterBadRequest.value = false
  errorMessage.value = ''
  isMakingRequest.value = true
  try {
    await axios.post<{ message: string }>(url, toSend, { withCredentials: true })
    router.push({ path: '/' })
  } catch (e) {
    showErrorAfterBadRequest.value = true
    if (e instanceof AxiosError) {
      if (e.status === 400 || e.status === 404) {
        errorMessage.value = 'Invalid email/username or password'
      } else {
        errorMessage.value = 'An error occurred, please try again later'
      }
    }
  }
  isMakingRequest.value = false
}

/**
 * Handles login, it also evaluates if the user is using an email or a username
 */
async function sendLogin() {
  let toSend: EmailOrUsername | undefined
  if (emailRegex.test(emailOrUsername.value)) {
    toSend = { email: emailOrUsername.value, password: password.value }
  } else {
    toSend = { username: emailOrUsername.value, password: password.value }
  }

  await makeRequest(toSend)
}
</script>

<template>
  <!-- Alert on error -->
  <div v-if="showErrorAfterBadRequest" role="alert" class="toast">
    <div class="alert alert-error text-white">
      <button @click="showErrorAfterBadRequest = false">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <span>{{ errorMessage }}</span>
    </div>
  </div>
  <FormBox>
    <h2 class="text-center text-2xl">Login</h2>
    <form class="mt-3 flex flex-col gap-4" @submit.prevent="sendLogin">
      <FormInput
        icon="fa-solid fa-user"
        v-model="emailOrUsername"
        type="text"
        placeholder="Email or Username"
        :disabled="isMakingRequest"
      />

      <FormInput
        v-model="password"
        type="password"
        placeholder="Password"
        :disabled="isMakingRequest"
        icon="fa-solid fa-lock"
      />

      <button
        :disabled="emailOrUsername === '' || password === '' || isMakingRequest"
        type="submit"
        class="btn btn-primary text-white text-lg font-medium disabled:bg-neutral-300"
      >
        <i class="fa-solid fa-paper-plane"></i>Log In
      </button>
    </form>

    <div class="mt-4 flex flex-col gap-2">
      <div>
        <div class="divider">
          <span>Or log in with</span>
        </div>
      </div>

      <div class="flex justify-between gap-3 w-full">
        <a
          :href="googleAuthUrl"
          class="btn flex-grow bg-white rounded-full bordered border-primary border-opacity-40 text-primary hover:btn-primary hover:text-white"
          ><i class="fa-brands fa-google"></i>Google</a
        >
        <a
          href="/"
          class="btn flex-grow bg-white rounded-full bordered border-primary border-opacity-40 text-primary hover:btn-primary hover:text-white"
          ><i class="fa-brands fa-github"></i>Github</a
        >
      </div>

      <span class="text-sm self-center mt-5"
        >You don't have an account?
        <RouterLink to="/authentication/register" class="text-primary hover:underline"
          >Sign up here!</RouterLink
        ></span
      >
    </div>
  </FormBox>
</template>
