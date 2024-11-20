<script setup lang="ts">
import { computed, ref } from 'vue'
import FormBox from './components/FormBox.vue'
import { useAppStore } from '@/stores/app'
import router from '@/router'
import axios, { AxiosError } from 'axios'

const email = ref('')
const password = ref('')
const doubleCheckPassword = ref('')
const username = ref('')
const showErrorAfterBadRequest = ref(false)
const errorMessage = ref('')
const url = useAppStore().apiUrl + '/authentication/register'
// computed

const canSendRequest = computed(() => {
  return (
    email.value !== '' &&
    password.value !== '' &&
    doubleCheckPassword.value !== '' &&
    username.value !== ''
  )
})

/**
 * Gets the error message from the server in a readable format
 * @param error Received error
 */
function getErrorMessage(error: AxiosError) {
  const data = error.response!.data as { message: string } | { message: string[] }
  if (data.message instanceof Array) return 'Password is not strong enough'

  if (!data.message.includes('prismaService')) return data.message

  const userNameFailed = data.message.includes(
    'Unique constraint failed on the fields: (`username`)',
  )
  const emailFailed = data.message.includes('Unique constraint failed on the fields: (`email`)')

  if (userNameFailed && emailFailed) return 'Username and email already in use'
  if (userNameFailed) return 'Username already in use'
  return 'Email already in use' // Only email is in use
}

/**
 * Action for registering a user
 */
async function registerUser() {
  showErrorAfterBadRequest.value = false
  errorMessage.value = ''
  const toSend = {
    email: email.value,
    password: password.value,
    username: username.value,
    doubleCheckPassword: doubleCheckPassword.value,
  }
  try {
    await axios.post(url, toSend)
    router.push('/authentication/login')
  } catch (e) {
    const error = e as AxiosError
    showErrorAfterBadRequest.value = true
    errorMessage.value = getErrorMessage(error)
  }
}
</script>

<template>
  <div v-if="showErrorAfterBadRequest" role="alert" class="toast">
    <div class="alert alert-error text-white">
      <button @click="showErrorAfterBadRequest = false">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <span class="capitalize">{{ errorMessage }}</span>
    </div>
  </div>
  <FormBox>
    <h2 class="text-center text-2xl">Register</h2>
    <form class="mt-3 flex flex-col gap-4" @submit.prevent="registerUser">
      <div class="flex gap-4">
        <!-- Username -->
        <label class="input flex items-center gap-2 bg-neutral-200 placeholder:text-black">
          <i class="fa-solid fa-user opacity-55"></i>
          <input type="text" placeholder="Username" v-model="username" />
        </label>

        <!-- Email -->
        <label class="input flex items-center gap-2 bg-neutral-200 placeholder:text-black">
          <i class="fa-solid fa-envelope opacity-55"></i>
          <input type="email" placeholder="Email" v-model="email" />
        </label>
      </div>

      <!-- Password -->
      <label
        class="form-control input w-full max-w-s flex flex-row items-center gap-2 bg-neutral-200 placeholder:text-black"
      >
        <i class="fa-solid fa-lock opacity-55"></i>
        <input
          type="password"
          placeholder="Password (At least 8 letters, one upper, one lower and a number)"
          v-model="password"
          class="w-full"
        />
      </label>

      <!-- Double Check Password -->
      <label class="input flex items-center gap-2 bg-neutral-200 placeholder:text-black">
        <i class="fa-solid fa-lock opacity-55"></i>
        <input type="password" placeholder="Repeat password" v-model="doubleCheckPassword" />
      </label>

      <button
        type="submit"
        class="btn btn-primary text-white text-lg font-medium disabled:bg-neutral-300"
        :disabled="!canSendRequest"
      >
        <i class="fa-solid fa-paper-plane"></i>Register
      </button>
    </form>

    <div class="mt-4 flex flex-col gap-2">
      <div>
        <div class="divider">
          <span>Or register with</span>
        </div>
      </div>

      <div class="flex justify-between gap-3 w-full">
        <a
          href="/"
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
        >Already have an account?
        <RouterLink to="/authentication/login" class="text-primary hover:underline"
          >Log in here!</RouterLink
        ></span
      >
    </div>
  </FormBox>
</template>
