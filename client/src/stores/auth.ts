import { defineStore } from 'pinia'
import type { UserInformation } from '@/models/UserInformation'
import { computed, ref } from 'vue'
import axios from 'axios'
import { useAppStore } from './app'

export const useAuthStore = defineStore('auth-store', () => {
  const url = useAppStore().apiUrl + '/authentication/validate'

  // State
  const userInformation = ref<UserInformation | null>(null)
  const isAuthenticated = computed(() => userInformation.value !== null)

  // Actions

  const validateSession = async () => {
    try {
      const response = await axios.get<{ valid: boolean; userInformation: UserInformation }>(url)
      if (userInformation.value !== null) {
        // check if any user information has changed
        // if so, replace the user information
        for (const key in response.data.userInformation) {
          if (
            response.data.userInformation[key as keyof UserInformation] !==
            userInformation.value[key as keyof UserInformation]
          ) {
            userInformation.value = { ...response.data.userInformation }
            return { valid: true }
          }
        }
      }
      userInformation.value = { ...response.data.userInformation }
      return { valid: true }
    } catch {
      userInformation.value = null
      return { valid: false }
    }
  }

  const logOut = async () => {
    userInformation.value = null
    await axios.get(useAppStore().apiUrl + '/authentication/logout')
  }

  // return value
  return { validateSession, logOut, isAuthenticated, userInformation }
})
