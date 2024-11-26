import { defineStore } from 'pinia'

export const useAppStore = defineStore('app-store', {
  state: () => {
    return {
      apiUrl: import.meta.env.VITE_API_URL as string,
    }
  },
  actions: {},
})
