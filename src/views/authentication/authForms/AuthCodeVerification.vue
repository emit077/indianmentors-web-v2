<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { api } from '@/utils/api/axios';
import URLS from '@/utils/urls';
import { router } from '@/router';
import { mdiArrowLeft, mdiCheck } from '@mdi/js';
import AuthSnackbar from '@/components/shared/AuthSnackbar.vue';
import { useAuthSnackbar } from '@/composables/useAuthSnackbar';
const authStore = useAuthStore();

// Props
interface Props {
  mobileNumber?: string;
  dialingCode?: string;
  otpToken?: string;
  backLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  mobileNumber: '',
  dialingCode: '',
  otpToken: '',
  backLabel: 'Back to Login'
});

const sentTo = computed(() => {
  const number = props.mobileNumber.trim();
  const code = props.dialingCode.trim();
  if (!number) return '';
  if (!code) return number;
  return `${code.startsWith('+') ? code : `+${code}`} ${number}`;
});

// Emit events
const $emit = defineEmits<{
  back: [];
}>();

const otp = ref('');
const loading = ref(false);
const verified = ref(false);
const { visible, message, type, showError, showSuccess } = useAuthSnackbar();
const resendLoading = ref(false);
const resendCooldown = ref(0);

// Countdown timer for resend
let countdownInterval: ReturnType<typeof setInterval> | null = null;
let redirectTimer: ReturnType<typeof setTimeout> | null = null;

onMounted(() => {
  // Start countdown if needed
  startResendCountdown();
});

/* Start countdown for resend OTP */
const startResendCountdown = () => {
  resendCooldown.value = 30;
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
  countdownInterval = setInterval(() => {
    if (resendCooldown.value > 0) {
      resendCooldown.value--;
    } else {
      if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
      }
    }
  }, 1000);
};
/** Verify OTP */
const handleVerifyOTP = async () => {
  // Validate OTP
  if (!otp.value || otp.value.length !== 6) {
    showError('Please enter a valid 6-digit OTP');
    return;
  }
  loading.value = true;
  try {
    const response = await api.post(
      URLS.USER_VERIFY_OTP,
      { otp: otp.value },
      {
        customHeaders: { 'OTP-TOKEN': props.otpToken },
        returnResponse: true // To access response headers
      }
    );
    //set local storage access token
    localStorage.setItem('access_token', response.headers['access_token']);
    authStore.setUser(response.data.result.user);
    verified.value = true;
    redirectTimer = setTimeout(goToDashboard, 1800);
  } catch (error: any) {
    showError(error.response?.data?.message || error.response?.data?.detail || 'Verification failed. Please try again.');
  } finally {
    loading.value = false;
  }
};
function goToDashboard() {
  if (redirectTimer) {
    clearTimeout(redirectTimer);
    redirectTimer = null;
  }
  router.push('/dashboard/');
}

/* Resend OTP */
const handleResendOTP = async () => {
  resendLoading.value = true;
  try {
    const response = await api.post(
      URLS.USER_RESEND_OTP,
      { otp: otp.value },
      {
        customHeaders: { 'OTP-TOKEN': props.otpToken },
        returnResponse: true // To access response headers
      }
    );
    showSuccess('OTP resent successfully!');
  } catch (error: any) {
    showError('Failed to resend OTP. Please try again.');
  } finally {
    resendLoading.value = false;
  }
};
/* Cleanup on unmount */
onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
  if (redirectTimer) {
    clearTimeout(redirectTimer);
  }
});
</script>

<template>
  <div v-if="verified" class="text-center justify-center align-center align-middle d-flex flex-column"
    style="height: calc(40vh);">
    <v-avatar color="success" size="100" class="mb-5">
      <v-icon :icon="mdiCheck" size="60" />
    </v-avatar>
    <h3 class="text-h3 mb-2">Successfully Verified</h3>
    <!-- <p class="text-body-1 text-medium-emphasis mb-6">
      Your number is confirmed. Opening your dashboard.
    </p> -->
  </div>
  <div v-else class="mt-4">
    <div
      class="text-primary text-decoration-none cursor-pointer mb-4 d-flex align-center align-middle font-weight-medium"
      @click="$emit('back')">
      <v-icon :icon="mdiArrowLeft" size="18" class="mr-1 " />
      {{ props.backLabel }}
    </div>
    <h3 class="text-h3  mb-0">Verification Code</h3>
  </div>
  <div v-if="!verified">
    <p class="text-h6 my-6">
      Verification code sent to <strong>{{ sentTo }}</strong>
    </p>

    <v-form class="mt-7 loginForm" @submit.prevent="handleVerifyOTP">
      <v-otp-input type="number" v-model="otp" length="6" class="mb-5" rounded="md" single-line height="46"
        :disabled="loading" @finish="handleVerifyOTP"></v-otp-input>

      <v-btn color="primary" block class="mt-8" variant="flat" rounded="md" size="large" type="submit"
        :loading="loading" :disabled="!otp || otp.length !== 6 || loading">
        {{ loading ? 'Verifying...' : 'Continue' }}
      </v-btn>
    </v-form>

    <AuthSnackbar v-model="visible" :message="message" :type="type" />

    <!-- Resend OTP -->
    <div class="d-flex align-center justify-space-between mt-6">
      <div class="text-subtitle-1 font-weight-regular">Not received Code?</div>
      <v-btn variant="text" color="primary" class="text-capitalize flex-shrink-0 mr-n2"
        :disabled="resendCooldown > 0 || resendLoading" :loading="resendLoading" @click="handleResendOTP">
        {{ resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code' }}
      </v-btn>
    </div>
  </div>
</template>

<style lang="scss">
.loginForm {
  .v-otp-input {
    padding: 0;

    .v-otp-input__content {
      max-width: 95%;
      padding: 0;
    }

    .v-otp-input__field {
      font-size: 13px;
      font-weight: bold;
    }
  }
}
</style>
