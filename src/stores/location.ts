import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface LocationData {
  latitude: number
  longitude: number
  accuracy?: number
  timestamp: Date
}

export const useLocationStore = defineStore('location', () => {
  const currentLocation = ref<LocationData | null>(null)
  const permission = ref<PermissionState>('prompt')
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const hasLocation = computed(() => !!currentLocation.value)

  const requestLocationPermission = async (): Promise<boolean> => {
    if (!navigator.geolocation) {
      error.value = 'Geolocation is not supported by this browser'
      return false
    }

    isLoading.value = true
    error.value = null

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        })
      })

      currentLocation.value = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: new Date(),
      }

      permission.value = 'granted'
      return true
    } catch (err) {
      const errorMessage =
        err instanceof GeolocationPositionError
          ? getGeolocationErrorMessage(err.code)
          : 'Failed to get location'

      error.value = errorMessage
      permission.value = 'denied'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const getGeolocationErrorMessage = (code: number): string => {
    switch (code) {
      case GeolocationPositionError.PERMISSION_DENIED:
        return 'Location access denied by user'
      case GeolocationPositionError.POSITION_UNAVAILABLE:
        return 'Location information is unavailable'
      case GeolocationPositionError.TIMEOUT:
        return 'Location request timed out'
      default:
        return 'An unknown error occurred while retrieving location'
    }
  }

  const watchLocation = () => {
    if (!navigator.geolocation) {
      error.value = 'Geolocation is not supported by this browser'
      return null
    }

    return navigator.geolocation.watchPosition(
      (position) => {
        currentLocation.value = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date(),
        }
        error.value = null
      },
      (err) => {
        error.value = getGeolocationErrorMessage(err.code)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    )
  }

  const clearLocation = () => {
    currentLocation.value = null
    error.value = null
  }

  return {
    currentLocation: computed(() => currentLocation.value),
    permission: computed(() => permission.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    hasLocation,
    requestLocationPermission,
    watchLocation,
    clearLocation,
  }
})
