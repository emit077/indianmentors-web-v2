import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  location?: {
    latitude: number
    longitude: number
  }
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)

  const setUser = (userData: User) => {
    user.value = userData
    error.value = null
  }

  const setLocation = (latitude: number, longitude: number) => {
    if (user.value) {
      user.value.location = { latitude, longitude }
    }
  }

  const clearUser = () => {
    user.value = null
    error.value = null
  }

  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  const setError = (errorMessage: string) => {
    error.value = errorMessage
  }

  return {
    user: computed(() => user.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    isAuthenticated,
    setUser,
    setLocation,
    clearUser,
    setLoading,
    setError,
  }
})
