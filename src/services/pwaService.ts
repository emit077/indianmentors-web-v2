import { ref } from 'vue'

export interface PWAUpdateEvent {
  needRefresh: boolean
  offlineReady: boolean
}

export const usePWAService = () => {
  const needRefresh = ref(false)
  const offlineReady = ref(false)
  const updateServiceWorker = ref<((reloadPage?: boolean) => Promise<void>) | undefined>()

  // For the older version of vite-plugin-pwa, we'll use a simpler approach
  const updateApp = async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration()
      if (registration && registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' })
        window.location.reload()
      }
    }
  }

  const skipUpdate = () => {
    needRefresh.value = false
  }

  const dismissOfflineReady = () => {
    offlineReady.value = false
  }

  // Listen for service worker updates
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      needRefresh.value = true
    })

    navigator.serviceWorker.ready.then((registration) => {
      if (registration.waiting) {
        needRefresh.value = true
      }
    })
  }

  return {
    needRefresh,
    offlineReady,
    updateApp,
    skipUpdate,
    dismissOfflineReady,
  }
}
