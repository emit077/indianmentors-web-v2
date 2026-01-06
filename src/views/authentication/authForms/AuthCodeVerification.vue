<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { api } from '@/utils/api/axios';
import URLS from '@/utils/urls';
import { router } from '@/router';

const authStore = useAuthStore();

// Props
interface Props {
  mobileNumber?: string;
  otpToken?: string;
}

const props = withDefaults(defineProps<Props>(), {
  mobileNumber: '',
  otpToken: ''
});

// Emit events
const $emit = defineEmits<{
  back: [];
}>();

const otp = ref('');
const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const resendLoading = ref(false);
const resendCooldown = ref(0);

// Countdown timer for resend
let countdownInterval: ReturnType<typeof setInterval> | null = null;

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
    errorMessage.value = 'Please enter a valid 6-digit OTP';
    return;
  }
  loading.value = true;
  errorMessage.value = '';
  successMessage.value = '';
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

    router.push('/dashboard/default');
  } catch (error) {
    console.error('Unexpected error:', error);
  } finally {
    loading.value = false;
  }
};
/* Resend OTP */
const handleResendOTP = async () => {
  resendLoading.value = true;
  errorMessage.value = '';
  successMessage.value = '';
  try {
    const response = await api.post(
      URLS.USER_RESEND_OTP,
      { otp: otp.value },
      {
        customHeaders: { 'OTP-TOKEN': props.otpToken },
        returnResponse: true // To access response headers
      }
    );
    successMessage.value = response.data.result.message || 'OTP resent successfully!';
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || error.message || 'Failed to resend OTP. Please try again.';
  } finally {
    resendLoading.value = false;
  }
};
/* Cleanup on unmount */
onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
});
</script>

<template>
  <div class="d-flex justify-space-between align-center mt-4">
    <h3 class="text-h3 text-center mb-0">Verification Code</h3>
    <span class="text-primary text-decoration-none cursor-pointer" @click="$emit('back')">Back to Login</span>
  </div>
  <div>
    <p class="text-h6 my-6">
      Verification code sent to <strong>{{ props.mobileNumber }}</strong>
    </p>

    <v-form class="mt-7 loginForm" @submit.prevent="handleVerifyOTP">
      <v-otp-input
        type="number"
        v-model="otp"
        length="6"
        class="mb-5"
        rounded="md"
        single-line
        height="46"
        :disabled="loading"
        @finish="handleVerifyOTP"
      ></v-otp-input>

      <v-btn
        color="primary"
        block
        class="mt-8"
        variant="flat"
        rounded="md"
        size="large"
        type="submit"
        :loading="loading"
        :disabled="!otp || otp.length !== 6 || loading"
      >
        {{ loading ? 'Verifying...' : 'Continue' }}
      </v-btn>
    </v-form>

    <!-- Error Message -->
    <v-alert v-if="errorMessage" type="error" class="mt-4" closable @click:close="errorMessage = ''">
      {{ errorMessage }}
    </v-alert>

    <!-- Success Message -->
    <v-alert v-if="successMessage" type="success" class="mt-4">
      {{ successMessage }}
    </v-alert>

    <!-- Resend OTP -->
    <div class="d-sm-flex align-start justify-space-between mt-6">
      <div class="text-subtitle-1 font-weight-regular">Not received Code?</div>
      <v-btn
        variant="text"
        color="primary"
        class="text-capitalize mr-n2 mt-2 mt-sm-0"
        :disabled="resendCooldown > 0 || resendLoading"
        :loading="resendLoading"
        @click="handleResendOTP"
      >
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
