<template>
  <div class="google-callback-container">
    <v-container class="fill-height">
      <v-row justify="center" align="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card class="pa-6" elevation="2" rounded="lg">
            <div class="text-center">
              <!-- Loading State -->
              <div v-if="isLoading" class="mb-6">
                <v-progress-circular indeterminate color="primary" size="64" class="mb-4" />
                <h3 class="text-h6 mb-2">Processing Google Sign-In</h3>
                <p class="text-body-2 text-medium-emphasis">Please wait while we complete your authentication...</p>
              </div>

              <!-- Success State -->
              <div v-else-if="isSuccess" class="mb-6">
                <v-icon size="64" color="success" class="mb-4">mdi-check-circle</v-icon>
                <h3 class="text-h6 mb-2 text-success">Sign-In Successful!</h3>
                <p class="text-body-2 text-medium-emphasis">Welcome, {{ user?.name }}! Redirecting to dashboard...</p>
              </div>

              <!-- Error State -->
              <div v-else-if="isError" class="mb-6">
                <v-icon size="64" color="error" class="mb-4">mdi-alert-circle</v-icon>
                <h3 class="text-h6 mb-2 text-error">Sign-In Failed</h3>
                <p class="text-body-2 text-medium-emphasis mb-4">
                  {{ errorMessage }}
                </p>
                <v-btn color="primary" variant="outlined" @click="retryLogin" class="me-2"> Try Again </v-btn>
                <v-btn color="secondary" variant="text" @click="goToLogin"> Back to Login </v-btn>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// Reactive data
const isLoading = ref(true);
const isSuccess = ref(false);
const isError = ref(false);
const errorMessage = ref('');
const user = ref<any>(null);

// Stores and router
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

// Handle Google OAuth callback
const handleGoogleCallback = async () => {
  try {
    isLoading.value = true;

    // Get authorization code from URL parameters
    const code = route.query.code as string;
    const state = route.query.state as string;
    const error = route.query.error as string;

    if (error) {
      throw new Error(`Google OAuth error: ${error}`);
    }

    if (!code) {
      throw new Error('No authorization code received from Google');
    }

    // Exchange authorization code for access token
    const tokenResponse = await exchangeCodeForToken(code);

    // Get user information from Google
    const userInfo = await getUserInfoFromGoogle(tokenResponse.access_token);

    // Create user object
    const googleUser = {
      id: userInfo.id,
      name: userInfo.name,
      email: userInfo.email,
      picture: userInfo.picture,
      email_verified: userInfo.verified_email,
      provider: 'google',
      access_token: tokenResponse.access_token,
      refresh_token: tokenResponse.refresh_token
    };

    // Store user in auth store
    authStore.setUser(googleUser);

    user.value = googleUser;
    isSuccess.value = true;
    isLoading.value = false;

    // Redirect to dashboard after 2 seconds
    setTimeout(() => {
      router.push('/dashboard/default');
    }, 2000);
  } catch (error) {
    console.error('Google callback error:', error);
    errorMessage.value = error instanceof Error ? error.message : 'Authentication failed';
    isError.value = true;
    isLoading.value = false;
  }
};

// Exchange authorization code for access token
const exchangeCodeForToken = async (code: string) => {
  const response = await fetch('/api/auth/google/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      code,
      redirect_uri: `${window.location.origin}/auth/google/callback`
    })
  });

  if (!response.ok) {
    throw new Error('Failed to exchange code for token');
  }

  return await response.json();
};

// Get user information from Google
const getUserInfoFromGoogle = async (accessToken: string) => {
  const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to get user information from Google');
  }

  return await response.json();
};

// Retry login
const retryLogin = () => {
  router.push('/auth/login/');
};

// Go to login page
const goToLogin = () => {
  router.push('/auth/login/');
};

// Lifecycle
onMounted(() => {
  handleGoogleCallback();
});
</script>

<style scoped lang="scss">
.google-callback-container {
  min-height: 100vh;
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%);
}
</style>
