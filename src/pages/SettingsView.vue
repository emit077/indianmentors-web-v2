<template>
  <div class="fill-height">
    <v-row class="flex-grow-0">
      <v-col cols="12">
        <h1 class="text-h4 mb-6">Settings</h1>
      </v-col>
    </v-row>

    <v-row class="flex-grow-1">
      <v-col cols="12" md="6">
        <!-- Theme Settings -->
        <v-card class="mb-4">
          <v-card-title>
            <v-icon class="me-2">mdi-palette</v-icon>
            Appearance
          </v-card-title>
          <v-card-text>
            <v-switch
              v-model="isDarkMode"
              label="Dark Mode"
              color="primary"
              @change="toggleTheme"
            ></v-switch>
            
            <v-select
              v-model="selectedLanguage"
              :items="languages"
              label="Language"
              variant="outlined"
              prepend-icon="mdi-translate"
              class="mt-4"
            ></v-select>
          </v-card-text>
        </v-card>

        <!-- Notification Settings -->
        <v-card class="mb-4">
          <v-card-title>
            <v-icon class="me-2">mdi-bell</v-icon>
            Notifications
          </v-card-title>
          <v-card-text>
            <v-switch
              v-model="notificationSettings.push"
              label="Push Notifications"
              color="primary"
              @change="updateNotificationSettings"
            ></v-switch>
            
            <v-switch
              v-model="notificationSettings.email"
              label="Email Notifications"
              color="primary"
              @change="updateNotificationSettings"
            ></v-switch>
            
            <v-switch
              v-model="notificationSettings.sms"
              label="SMS Notifications"
              color="primary"
              @change="updateNotificationSettings"
            ></v-switch>

            <v-btn
              color="primary"
              variant="outlined"
              class="mt-4"
              @click="requestNotificationPermission"
            >
              <v-icon start>mdi-bell-plus</v-icon>
              Request Notification Permission
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <!-- Location Settings -->
        <v-card class="mb-4">
          <v-card-title>
            <v-icon class="me-2">mdi-map-marker</v-icon>
            Location
          </v-card-title>
          <v-card-text>
            <v-alert
              v-if="locationStore.error"
              type="error"
              class="mb-4"
            >
              {{ locationStore.error }}
            </v-alert>

            <v-alert
              v-if="locationStore.hasLocation"
              type="success"
              class="mb-4"
            >
              Location access granted
            </v-alert>

            <p class="text-body-2 mb-4">
              This app requires location access to provide location-based features.
            </p>

            <v-btn
              color="primary"
              variant="outlined"
              @click="requestLocationPermission"
              :loading="locationStore.isLoading"
            >
              <v-icon start>mdi-map-marker</v-icon>
              Request Location Permission
            </v-btn>

            <v-btn
              v-if="locationStore.hasLocation"
              color="success"
              variant="outlined"
              class="ms-2"
              @click="watchLocation"
            >
              <v-icon start>mdi-eye</v-icon>
              Watch Location
            </v-btn>
          </v-card-text>
        </v-card>

        <!-- Privacy Settings -->
        <v-card class="mb-4">
          <v-card-title>
            <v-icon class="me-2">mdi-shield-account</v-icon>
            Privacy
          </v-card-title>
          <v-card-text>
            <v-switch
              v-model="privacySettings.analytics"
              label="Allow Analytics"
              color="primary"
              @change="updatePrivacySettings"
            ></v-switch>
            
            <v-switch
              v-model="privacySettings.crashReports"
              label="Send Crash Reports"
              color="primary"
              @change="updatePrivacySettings"
            ></v-switch>
            
            <v-switch
              v-model="privacySettings.locationTracking"
              label="Location Tracking"
              color="primary"
              @change="updatePrivacySettings"
            ></v-switch>
          </v-card-text>
        </v-card>

        <!-- Data Management -->
        <v-card>
          <v-card-title>
            <v-icon class="me-2">mdi-database</v-icon>
            Data Management
          </v-card-title>
          <v-card-text>
            <v-btn
              color="info"
              variant="outlined"
              class="mb-2"
              block
            >
              <v-icon start>mdi-download</v-icon>
              Export Data
            </v-btn>
            
            <v-btn
              color="warning"
              variant="outlined"
              class="mb-2"
              block
            >
              <v-icon start>mdi-upload</v-icon>
              Import Data
            </v-btn>
            
            <v-btn
              color="error"
              variant="outlined"
              block
              @click="clearAllData"
            >
              <v-icon start>mdi-delete</v-icon>
              Clear All Data
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useLocationStore } from '@/stores/location'
import { useNotificationStore } from '@/stores/notifications'

const themeStore = useThemeStore()
const locationStore = useLocationStore()
const notificationStore = useNotificationStore()

const isDarkMode = ref(false)
const selectedLanguage = ref('en')

const languages = [
  { title: 'English', value: 'en' },
  { title: 'Spanish', value: 'es' },
  { title: 'French', value: 'fr' },
  { title: 'German', value: 'de' },
  { title: 'Hindi', value: 'hi' }
]

const notificationSettings = ref({
  push: true,
  email: true,
  sms: false
})

const privacySettings = ref({
  analytics: true,
  crashReports: true,
  locationTracking: true
})

const toggleTheme = () => {
  themeStore.setTheme(isDarkMode.value)
}

const updateNotificationSettings = () => {
  // Save to localStorage or send to API
  localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings.value))
}

const updatePrivacySettings = () => {
  // Save to localStorage or send to API
  localStorage.setItem('privacySettings', JSON.stringify(privacySettings.value))
}

const requestNotificationPermission = async () => {
  const granted = await notificationStore.requestPermission()
  if (granted) {
    notificationStore.addNotification({
      title: 'Notifications Enabled',
      body: 'You will now receive push notifications from this app.',
      icon: '/favicon.ico'
    })
  }
}

const requestLocationPermission = async () => {
  const granted = await locationStore.requestLocationPermission()
  if (granted) {
    notificationStore.addNotification({
      title: 'Location Access Granted',
      body: 'Your location is now being tracked for better app experience.',
      icon: '/favicon.ico'
    })
  }
}

const watchLocation = () => {
  const watchId = locationStore.watchLocation()
  if (watchId) {
    notificationStore.addNotification({
      title: 'Location Watching Started',
      body: 'Your location is now being continuously monitored.',
      icon: '/favicon.ico'
    })
  }
}

const clearAllData = () => {
  // Clear all app data
  localStorage.clear()
  locationStore.clearLocation()
  notificationStore.clearAllNotifications()
  
  notificationStore.addNotification({
    title: 'Data Cleared',
    body: 'All app data has been cleared successfully.',
    icon: '/favicon.ico'
  })
}

onMounted(() => {
  // Initialize settings from localStorage
  isDarkMode.value = themeStore.isDark
  
  const savedNotificationSettings = localStorage.getItem('notificationSettings')
  if (savedNotificationSettings) {
    notificationSettings.value = JSON.parse(savedNotificationSettings)
  }
  
  const savedPrivacySettings = localStorage.getItem('privacySettings')
  if (savedPrivacySettings) {
    privacySettings.value = JSON.parse(savedPrivacySettings)
  }
})
</script>
