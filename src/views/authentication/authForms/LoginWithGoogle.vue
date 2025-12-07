<template>
  <div class="google-login-container">
    <!-- Google Login Button -->
    <v-btn
      :loading="isLoading"
      :disabled="isLoading"
      @click="handleGoogleLogin"
      variant="outlined"
      color="primary"
      size="large"
      block
      rounded="lg"
      class="google-login-btn"
    >
      <template v-slot:prepend>
        <svg class="google-icon" width="20" height="20" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      </template>
      {{ isLoading ? 'Signing in...' : 'Continue with Google' }}
    </v-btn>

    <!-- Error Message -->
    <v-alert v-if="errorMessage" type="error" variant="tonal" class="mt-4" closable @click:close="errorMessage = ''">
      {{ errorMessage }}
    </v-alert>

    <!-- Success Message -->
    <v-alert v-if="successMessage" type="success" variant="tonal" class="mt-4" closable @click:close="successMessage = ''">
      {{ successMessage }}
    </v-alert>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// Props
interface Props {
  redirectTo?: string;
  showSuccessMessage?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  redirectTo: '/dashboard/default',
  showSuccessMessage: true
});

// Emits
const emit = defineEmits<{
  success: [user: any];
  error: [error: string];
}>();

// Reactive data
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

// Stores and router
const authStore = useAuthStore();
const router = useRouter();

// Google OAuth configuration
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

// Initialize Google OAuth
const initializeGoogleAuth = () => {
  if (!GOOGLE_CLIENT_ID) {
    console.warn('Google Client ID not found. Please set VITE_GOOGLE_CLIENT_ID in your .env file');
    return;
  }

  // Load Google Identity Services script
  if (!window.google) {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setupGoogleAuth();
    };
    document.head.appendChild(script);
  } else {
    setupGoogleAuth();
  }
};

// Setup Google Authentication
const setupGoogleAuth = () => {
  if (!window.google) return;

  window.google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleGoogleResponse,
    auto_select: false,
    cancel_on_tap_outside: true
  });
};

// Handle Google OAuth response
const handleGoogleResponse = async (response: any) => {
  try {
    isLoading.value = true;
    errorMessage.value = '';

    // Decode the JWT token
    const payload = JSON.parse(atob(response.credential.split('.')[1]));

    // Create user object from Google response
    const googleUser = {
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
      email_verified: payload.email_verified,
      provider: 'google',
      access_token: response.credential
    };

    // Store user in auth store
    authStore.user = googleUser;
    localStorage.setItem('user', JSON.stringify(googleUser));

    // Show success message
    if (props.showSuccessMessage) {
      successMessage.value = `Welcome, ${googleUser.name}!`;
    }

    // Emit success event
    emit('success', googleUser);

    // Redirect to specified route
    setTimeout(() => {
      router.push(props.redirectTo);
    }, 1000);
  } catch (error) {
    console.error('Google login error:', error);
    errorMessage.value = 'Failed to sign in with Google. Please try again.';
    emit('error', errorMessage.value);
  } finally {
    isLoading.value = false;
  }
};

// Handle Google login button click
const handleGoogleLogin = () => {
  if (!window.google) {
    errorMessage.value = 'Google authentication is not available. Please refresh the page.';
    return;
  }

  try {
    window.google.accounts.id.prompt();
  } catch (error) {
    console.error('Google login prompt error:', error);
    errorMessage.value = 'Failed to open Google login. Please try again.';
  }
};

// Alternative method using Google OAuth 2.0
const handleGoogleLoginAlternative = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = '';

    // Create Google OAuth URL
    const googleAuthUrl =
      `https://accounts.google.com/oauth/authorize?` +
      `client_id=${GOOGLE_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(window.location.origin + '/auth/google/callback')}&` +
      `response_type=code&` +
      `scope=openid%20email%20profile&` +
      `access_type=offline&` +
      `prompt=consent`;

    // Redirect to Google OAuth
    window.location.href = googleAuthUrl;
  } catch (error) {
    console.error('Google OAuth error:', error);
    errorMessage.value = 'Failed to initiate Google login. Please try again.';
    isLoading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  initializeGoogleAuth();
});

// Expose methods for parent components
defineExpose({
  handleGoogleLogin,
  handleGoogleLoginAlternative,
  isLoading,
  errorMessage,
  successMessage
});
</script>

<style scoped lang="scss">
.google-login-container {
  width: 100%;
}

.google-login-btn {
  height: 48px;
  font-weight: 500;
  text-transform: none;
  letter-spacing: 0.5px;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

.google-icon {
  margin-right: 8px;
}

// Loading state
.v-btn--loading {
  .google-icon {
    opacity: 0.5;
  }
}

// Responsive design
@media (max-width: 600px) {
  .google-login-btn {
    height: 44px;
    font-size: 14px;
  }
}
</style>

