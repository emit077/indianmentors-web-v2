<template>
  <v-snackbar
    v-model="showUpdatePrompt"
    :timeout="-1"
    color="primary"
    location="top"
  >
    <div class="d-flex align-center">
      <v-icon class="me-2">mdi-download</v-icon>
      <span>New version available! Click to update.</span>
    </div>
    <template v-slot:actions>
      <v-btn
        color="white"
        variant="text"
        @click="skipUpdate"
      >
        Later
      </v-btn>
      <v-btn
        color="white"
        variant="text"
        @click="updateApp"
      >
        Update
      </v-btn>
    </template>
  </v-snackbar>

  <v-snackbar
    v-model="showOfflineReady"
    :timeout="5000"
    color="success"
    location="top"
  >
    <div class="d-flex align-center">
      <v-icon class="me-2">mdi-wifi-off</v-icon>
      <span>App ready to work offline!</span>
    </div>
    <template v-slot:actions>
      <v-btn
        color="white"
        variant="text"
        @click="dismissOfflineReady"
      >
        Dismiss
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { usePWAService } from '@/services/pwaService'

const { needRefresh, offlineReady, updateApp, skipUpdate, dismissOfflineReady } = usePWAService()

const showUpdatePrompt = computed({
  get: () => needRefresh.value,
  set: (value) => {
    if (!value) {
      skipUpdate()
    }
  },
})

const showOfflineReady = computed({
  get: () => offlineReady.value,
  set: (value) => {
    if (!value) {
      dismissOfflineReady()
    }
  },
})

onMounted(() => {
  // Check if the app is ready for offline use
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(() => {
      offlineReady.value = true
    })
  }
})
</script>
