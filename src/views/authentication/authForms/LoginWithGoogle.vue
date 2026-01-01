<template>
  <v-list-item color="secondary" variant="tonal" href="#" rounded="md" class="" :disabled="isLoading" @click="handleGoogleLogin">
    <v-img :src="googleImg" alt="social icon" class="mr-2 d-inline-flex" style="vertical-align: middle" width="20" height="20" />
    {{ isLoading ? 'Signing in...' : 'Continue with Google' }}
  </v-list-item>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import googleImg from '@/assets/images/icons/google.svg';

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
