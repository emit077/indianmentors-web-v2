<template>
  <div class="fill-height d-flex align-center justify-center">
    <v-row align="center" justify="center" class="fill-width">
      <v-col cols="12" class="text-center">
            <v-icon size="120" color="primary" class="mb-4">mdi-alert-circle</v-icon>
            <h1 class="text-h2 mb-4">404</h1>
            <h2 class="text-h4 mb-4">Page Not Found</h2>
            <p class="text-h6 mb-6">The page you are looking for does not exist.</p>
            <v-btn
              color="primary"
              size="large"
              @click="goHome"
            >
              <v-icon start>mdi-home</v-icon>
              Go Home
            </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>
