<template>
  <div class="fill-height d-flex align-center justify-center">
    <v-row align="center" justify="center" class="fill-width">
      <v-col cols="12" sm="8" md="6">
            <v-card class="elevation-12">
              <v-card-text class="text-center pa-8">
                <v-icon size="80" color="warning" class="mb-4">mdi-map-marker-off</v-icon>
                <h1 class="text-h4 mb-4">Location Permission Required</h1>
                <p class="text-h6 mb-6">
                  This application requires location access to provide you with the best experience.
                  Please grant location permission to continue.
                </p>
                
                <v-alert
                  v-if="error"
                  type="error"
                  class="mb-4"
                >
                  {{ error }}
                </v-alert>

                <v-alert
                  v-if="success"
                  type="success"
                  class="mb-4"
                >
                  Location permission granted! Redirecting...
                </v-alert>

                <div class="mb-6">
                  <v-btn
                    color="primary"
                    size="large"
                    :loading="isLoading"
                    @click="requestPermission"
                    class="me-4"
                  >
                    <v-icon start>mdi-map-marker</v-icon>
                    Grant Location Permission
                  </v-btn>
                  
                  <v-btn
                    color="error"
                    variant="outlined"
                    size="large"
                    @click="denyPermission"
                  >
                    <v-icon start>mdi-close</v-icon>
                    Deny Permission
                  </v-btn>
                </div>

                <v-divider class="my-6"></v-divider>

                <div class="text-left">
                  <h3 class="text-h6 mb-3">Why do we need location access?</h3>
                  <v-list>
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon color="primary">mdi-map-marker-radius</v-icon>
                      </template>
                      <v-list-item-title>Find nearby mentors and mentees</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon color="primary">mdi-calendar-clock</v-icon>
                      </template>
                      <v-list-item-title>Schedule location-based meetings</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon color="primary">mdi-account-group</v-icon>
                      </template>
                      <v-list-item-title>Connect with local communities</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon color="primary">mdi-bell</v-icon>
                      </template>
                      <v-list-item-title>Receive location-based notifications</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </div>

                <v-alert
                  type="info"
                  variant="tonal"
                  class="mt-6"
                >
                  <strong>Note:</strong> You can change this permission later in your browser settings or app settings.
                </v-alert>
              </v-card-text>
            </v-card>
          </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLocationStore } from '@/stores/location'
import { useNotificationStore } from '@/stores/notifications'

const router = useRouter()
const locationStore = useLocationStore()
const notificationStore = useNotificationStore()

const isLoading = ref(false)
const error = ref('')
const success = ref(false)

const requestPermission = async () => {
  isLoading.value = true
  error.value = ''
  success.value = false
  
  try {
    const granted = await locationStore.requestLocationPermission()
    
    if (granted) {
      success.value = true
      
      // Request notification permission as well
      await notificationStore.requestPermission()
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/')
      }, 2000)
    } else {
      error.value = 'Location permission was denied. Please enable it in your browser settings to use this app.'
    }
  } catch (err) {
    error.value = 'Failed to request location permission. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const denyPermission = () => {
  error.value = 'Location permission is required to use this application. Please refresh the page and grant permission to continue.'
}

onMounted(() => {
  // Check if location is already available
  if (locationStore.hasLocation) {
    router.push('/')
  }
})
</script>
