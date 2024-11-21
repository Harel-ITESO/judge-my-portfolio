<script setup lang="ts">
import { computed, ref } from 'vue'
import FormBox from './components/FormBox.vue'
import { useAppStore } from '@/stores/app'
import router from '@/router'
import axios, { AxiosError } from 'axios'
import FormInput from '@/components/FormInput.vue'

const email = ref('')
const password = ref('')
const doubleCheckPassword = ref('')
const username = ref('')
const showErrorAfterBadRequest = ref(false)
const errorMessage = ref('')
const url = useAppStore().apiUrl + '/authentication/register'
// computed

const passwordIsStrong = computed(() => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
  return regex.test(password.value)
})

const passwordsAreCorrect = computed(() => {
  return password.value === doubleCheckPassword.value
})

const valuesAreNotEmpty = computed(() => {
  return (
    email.value !== '' &&
    password.value !== '' &&
    doubleCheckPassword.value !== '' &&
    username.value !== ''
  )
})

const canSendRequest = computed(() => {
  return valuesAreNotEmpty.value && passwordIsStrong.value && passwordsAreCorrect.value
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
        <FormInput icon="fa-solid fa-user" v-model="username" placeholder="Username" />

        <!-- Email -->
        <FormInput icon="fa-solid fa-envelope" v-model="email" placeholder="Email" type="email" />
      </div>

      <!-- Password -->
      <FormInput
        icon="fa-solid fa-lock"
        v-model="password"
        placeholder="Password (At least 8 letters, one upper, one lower and a number)"
        :error-message="
          password && !passwordIsStrong
            ? 'Password is not strong enough (At least 8 letters, one lowercase letter and one uppercase)'
            : ''
        "
        type="password"
      />

      <!-- Double Check Password -->
      <FormInput
        icon="fa-solid fa-lock"
        v-model="doubleCheckPassword"
        placeholder="Repeat Password"
        type="password"
        :error-message="doubleCheckPassword && !passwordsAreCorrect ? 'Passwords do not match' : ''"
      />

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
