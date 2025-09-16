<template>
  <div class="fill-height">
    <v-row class="flex-grow-0">
      <v-col cols="12">
        <h1 class="text-h4 mb-6">Profile</h1>
      </v-col>
    </v-row>

    <v-row class="flex-grow-1">
      <v-col cols="12" md="4">
        <v-card>
          <v-card-text class="text-center">
            <v-avatar size="120" class="mb-4">
              <v-img src="https://randomuser.me/api/portraits/men/85.jpg"></v-img>
            </v-avatar>
            <h3 class="text-h6">{{ userStore.user?.name || 'John Doe' }}</h3>
            <p class="text-grey">{{ userStore.user?.email || 'john.doe@example.com' }}</p>
            <v-btn color="primary" variant="outlined" class="mt-2">
              <v-icon start>mdi-camera</v-icon>
              Change Photo
            </v-btn>
          </v-card-text>
        </v-card>

        <!-- Location Info -->
        <v-card class="mt-4" v-if="locationStore.hasLocation">
          <v-card-title>
            <v-icon class="me-2">mdi-map-marker</v-icon>
            Current Location
          </v-card-title>
          <v-card-text>
            <p><strong>Latitude:</strong> {{ locationStore.currentLocation?.latitude.toFixed(6) }}</p>
            <p><strong>Longitude:</strong> {{ locationStore.currentLocation?.longitude.toFixed(6) }}</p>
            <p><strong>Accuracy:</strong> {{ locationStore.currentLocation?.accuracy?.toFixed(2) }}m</p>
            <p><strong>Last Updated:</strong> {{ formatTime(locationStore.currentLocation?.timestamp) }}</p>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>
            <v-icon class="me-2">mdi-account-edit</v-icon>
            Edit Profile
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="updateProfile">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.name"
                    label="Full Name"
                    prepend-icon="mdi-account"
                    variant="outlined"
                    :rules="[v => !!v || 'Name is required']"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.email"
                    label="Email"
                    prepend-icon="mdi-email"
                    variant="outlined"
                    type="email"
                    :rules="[v => !!v || 'Email is required', v => /.+@.+\..+/.test(v) || 'Email must be valid']"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.phone"
                    label="Phone Number"
                    prepend-icon="mdi-phone"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.company"
                    label="Company"
                    prepend-icon="mdi-domain"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-textarea
                v-model="form.bio"
                label="Bio"
                prepend-icon="mdi-text"
                variant="outlined"
                rows="3"
                placeholder="Tell us about yourself..."
              ></v-textarea>

              <v-btn
                type="submit"
                color="primary"
                :loading="isLoading"
                class="mt-4"
              >
                <v-icon start>mdi-content-save</v-icon>
                Update Profile
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>

        <!-- Account Settings -->
        <v-card class="mt-4">
          <v-card-title>
            <v-icon class="me-2">mdi-shield-account</v-icon>
            Account Settings
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon>mdi-key</v-icon>
                </template>
                <v-list-item-title>Change Password</v-list-item-title>
                <v-list-item-subtitle>Update your account password</v-list-item-subtitle>
                <template v-slot:append>
                  <v-btn variant="outlined" size="small">Change</v-btn>
                </template>
              </v-list-item>

              <v-list-item>
                <template v-slot:prepend>
                  <v-icon>mdi-bell</v-icon>
                </template>
                <v-list-item-title>Notification Preferences</v-list-item-title>
                <v-list-item-subtitle>Manage your notification settings</v-list-item-subtitle>
                <template v-slot:append>
                  <v-btn variant="outlined" size="small">Settings</v-btn>
                </template>
              </v-list-item>

              <v-list-item>
                <template v-slot:prepend>
                  <v-icon>mdi-privacy-tip</v-icon>
                </template>
                <v-list-item-title>Privacy Settings</v-list-item-title>
                <v-list-item-subtitle>Control your privacy and data</v-list-item-subtitle>
                <template v-slot:append>
                  <v-btn variant="outlined" size="small">Manage</v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useLocationStore } from '@/stores/location'
import { useNotificationStore } from '@/stores/notifications'

const userStore = useUserStore()
const locationStore = useLocationStore()
const notificationStore = useNotificationStore()

const isLoading = ref(false)

const form = ref({
  name: '',
  email: '',
  phone: '',
  company: '',
  bio: ''
})

const updateProfile = async () => {
  isLoading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Update user store
    if (userStore.user) {
      userStore.setUser({
        ...userStore.user,
        name: form.value.name,
        email: form.value.email
      })
    }
    
    notificationStore.addNotification({
      title: 'Profile Updated',
      body: 'Your profile has been successfully updated!',
      icon: '/favicon.ico'
    })
  } catch (error) {
    console.error('Failed to update profile:', error)
  } finally {
    isLoading.value = false
  }
}

const formatTime = (date?: Date) => {
  if (!date) return 'Never'
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}

onMounted(() => {
  // Initialize form with current user data
  if (userStore.user) {
    form.value.name = userStore.user.name
    form.value.email = userStore.user.email
  }
})
</script>
