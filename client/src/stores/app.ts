import { defineStore } from 'pinia'

export const useAppStore = defineStore('app-store', {
  state: () => {
    return {
      apiUrl: 'http://localhost:5034/api/jmp',
    }
  },
  actions: {},
})
